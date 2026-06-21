/*
 * MICFix Service DLL — Locks default microphone volume
 * =====================================================
 * Loaded by svchost.exe  (zero CPU: fully event-driven)
 *
 * Exported entry point:  ServiceMain
 *
 * Events that wake the main loop:
 *   1. IAudioEndpointVolumeCallback  — someone changed mic volume
 *   2. IMMNotificationClient         — default capture device changed
 *   3. FindFirstChangeNotification   — volume.json edited
 *   4. Service stop event            — SCM says stop
 */

#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <mmdeviceapi.h>
#include <endpointvolume.h>
#include <stdlib.h>
#include <string.h>

#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "advapi32.lib")

/* ========================================================================= */
/*  Constants                                                                */
/* ========================================================================= */

#define SVCNAME  L"MICFix"
#define REGPATH  L"SOFTWARE\\MICFix"

/*  Unique GUID: lets us recognise our own volume changes and ignore them.   */
static const GUID MICFIX_CTX =
    { 0xa1b2c3d4, 0xe5f6, 0x7890,
      { 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90 } };

/* ========================================================================= */
/*  Global state                                                             */
/* ========================================================================= */

static SERVICE_STATUS        g_St     = {};
static SERVICE_STATUS_HANDLE g_StH    = NULL;

static HANDLE g_EvStop   = NULL;   /* manual-reset — stop requested        */
static HANDLE g_EvVol    = NULL;   /* auto-reset   — volume changed        */
static HANDLE g_EvDev    = NULL;   /* auto-reset   — device changed/added  */

static float g_Target = 0.85f;    /* default 85 %                         */

static IAudioEndpointVolume* g_pVol  = NULL;
static IMMDevice*            g_pDev  = NULL;
static IMMDeviceEnumerator*  g_pEnum = NULL;

class CVolCb;
class CDevCb;
static CVolCb* g_pVolCb = NULL;
static CDevCb* g_pDevCb = NULL;

/* ========================================================================= */
/*  CVolumeCallback — fires when someone changes mic volume                  */
/* ========================================================================= */

class CVolCb : public IAudioEndpointVolumeCallback {
    LONG m_r;
public:
    CVolCb() : m_r(1) {}

    STDMETHODIMP QueryInterface(REFIID riid, void** ppv) {
        if (!ppv) return E_POINTER;
        if (riid == IID_IUnknown ||
            riid == __uuidof(IAudioEndpointVolumeCallback)) {
            *ppv = static_cast<IAudioEndpointVolumeCallback*>(this);
            AddRef();
            return S_OK;
        }
        *ppv = NULL;
        return E_NOINTERFACE;
    }
    STDMETHODIMP_(ULONG) AddRef()  { return InterlockedIncrement(&m_r); }
    STDMETHODIMP_(ULONG) Release() {
        ULONG r = InterlockedDecrement(&m_r);
        if (!r) delete this;
        return r;
    }

    STDMETHODIMP OnNotify(PAUDIO_VOLUME_NOTIFICATION_DATA d) {
        if (!d) return E_INVALIDARG;
        /* Skip our own changes — prevents infinite callback loop */
        if (IsEqualGUID(d->guidEventContext, MICFIX_CTX)) return S_OK;
        if (g_EvVol) SetEvent(g_EvVol);
        return S_OK;
    }
};

/* ========================================================================= */
/*  CDeviceNotify — fires when default device / device state changes         */
/* ========================================================================= */

class CDevCb : public IMMNotificationClient {
    LONG m_r;
public:
    CDevCb() : m_r(1) {}

    STDMETHODIMP QueryInterface(REFIID riid, void** ppv) {
        if (!ppv) return E_POINTER;
        if (riid == IID_IUnknown ||
            riid == __uuidof(IMMNotificationClient)) {
            *ppv = static_cast<IMMNotificationClient*>(this);
            AddRef();
            return S_OK;
        }
        *ppv = NULL;
        return E_NOINTERFACE;
    }
    STDMETHODIMP_(ULONG) AddRef()  { return InterlockedIncrement(&m_r); }
    STDMETHODIMP_(ULONG) Release() {
        ULONG r = InterlockedDecrement(&m_r);
        if (!r) delete this;
        return r;
    }

    STDMETHODIMP OnDefaultDeviceChanged(EDataFlow flow, ERole, LPCWSTR) {
        if (flow == eCapture && g_EvDev) SetEvent(g_EvDev);
        return S_OK;
    }
    STDMETHODIMP OnDeviceAdded(LPCWSTR) {
        if (g_EvDev) SetEvent(g_EvDev);
        return S_OK;
    }
    STDMETHODIMP OnDeviceStateChanged(LPCWSTR, DWORD st) {
        if (st == DEVICE_STATE_ACTIVE && g_EvDev) SetEvent(g_EvDev);
        return S_OK;
    }
    STDMETHODIMP OnDeviceRemoved(LPCWSTR)                          { return S_OK; }
    STDMETHODIMP OnPropertyValueChanged(LPCWSTR, const PROPERTYKEY){ return S_OK; }
};

/* ========================================================================= */
/*  Config: read Documents\MICFix\volume.json                                */
/* ========================================================================= */

static bool ReadConfigDir(WCHAR* buf, DWORD maxCh) {
    HKEY hk;
    if (RegOpenKeyExW(HKEY_LOCAL_MACHINE, REGPATH, 0, KEY_READ, &hk))
        return false;
    DWORD t = 0, cb = maxCh * (DWORD)sizeof(WCHAR);
    LONG r = RegQueryValueExW(hk, L"ConfigDir", NULL, &t, (BYTE*)buf, &cb);
    RegCloseKey(hk);
    return r == ERROR_SUCCESS && t == REG_SZ;
}

static bool ReadVolume(const WCHAR* dir) {
    WCHAR path[MAX_PATH];
    lstrcpyW(path, dir);
    lstrcatW(path, L"\\volume.json");

    HANDLE hf = CreateFileW(path, GENERIC_READ,
        FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, 0, NULL);
    if (hf == INVALID_HANDLE_VALUE) return false;

    char buf[512];
    DWORD n = 0;
    BOOL ok = ReadFile(hf, buf, sizeof(buf) - 1, &n, NULL);
    CloseHandle(hf);
    if (!ok || n == 0) return false;
    buf[n] = '\0';

    /* Minimal parser for  {"volume": 85}  */
    const char* p = strstr(buf, "\"volume\"");
    if (!p) return false;
    p += 8;                                       /* skip "volume" */
    while (*p && *p != ':') p++;
    if (!*p) return false;
    p++;                                          /* skip ':'      */
    while (*p == ' ' || *p == '\t' || *p == '\n' || *p == '\r') p++;

    char* end = NULL;
    double v = strtod(p, &end);
    if (end == p) return false;                   /* no number      */
    if (v < 0.0) v = 0.0;
    if (v > 100.0) v = 100.0;
    g_Target = (float)(v / 100.0);
    return true;
}

/* ========================================================================= */
/*  Audio helpers                                                            */
/* ========================================================================= */

static void Detach() {
    if (g_pVol) {
        if (g_pVolCb) g_pVol->UnregisterControlChangeNotify(g_pVolCb);
        g_pVol->Release();
        g_pVol = NULL;
    }
    if (g_pDev) { g_pDev->Release(); g_pDev = NULL; }
}

static bool Attach() {
    Detach();
    if (!g_pEnum) return false;

    if (FAILED(g_pEnum->GetDefaultAudioEndpoint(eCapture, eMultimedia, &g_pDev)))
        return false;

    if (FAILED(g_pDev->Activate(__uuidof(IAudioEndpointVolume),
                                CLSCTX_INPROC_SERVER, NULL, (void**)&g_pVol))) {
        g_pDev->Release();
        g_pDev = NULL;
        return false;
    }

    if (g_pVolCb) g_pVol->RegisterControlChangeNotify(g_pVolCb);
    g_pVol->SetMasterVolumeLevelScalar(g_Target, &MICFIX_CTX);
    return true;
}

static inline void Enforce() {
    if (g_pVol) g_pVol->SetMasterVolumeLevelScalar(g_Target, &MICFIX_CTX);
}

/* ========================================================================= */
/*  Service worker — called from ServiceMain, returns exit code              */
/* ========================================================================= */

static DWORD RunService() {
    WCHAR cfgDir[MAX_PATH] = {};
    bool hasCfg = ReadConfigDir(cfgDir, MAX_PATH);
    if (hasCfg) ReadVolume(cfgDir);

    /* ---- COM ---- */
    if (FAILED(CoInitializeEx(NULL, COINIT_MULTITHREADED)))
        return ERROR_SERVICE_SPECIFIC_ERROR;

    if (FAILED(CoCreateInstance(__uuidof(MMDeviceEnumerator), NULL,
            CLSCTX_INPROC_SERVER, __uuidof(IMMDeviceEnumerator),
            (void**)&g_pEnum))) {
        CoUninitialize();
        return ERROR_SERVICE_SPECIFIC_ERROR;
    }

    /* ---- Callbacks ---- */
    g_pVolCb = new CVolCb();
    g_pDevCb = new CDevCb();
    g_pEnum->RegisterEndpointNotificationCallback(g_pDevCb);

    Attach();                      /* may fail if no mic yet — that's OK */

    /* ---- File watcher ---- */
    HANDLE hFC = INVALID_HANDLE_VALUE;
    if (hasCfg)
        hFC = FindFirstChangeNotificationW(cfgDir, FALSE,
                  FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_FILE_NAME);

    /* ---- Report running ---- */
    g_St.dwControlsAccepted = SERVICE_ACCEPT_STOP | SERVICE_ACCEPT_SHUTDOWN;
    g_St.dwCurrentState     = SERVICE_RUNNING;
    g_St.dwCheckPoint       = 0;
    g_St.dwWaitHint         = 0;
    SetServiceStatus(g_StH, &g_St);

    /* ---- Event loop (0 % CPU — pure wait) ---- */
    HANDLE ev[4] = { g_EvStop, g_EvVol, g_EvDev, hFC };
    DWORD  nEv   = (hFC != INVALID_HANDLE_VALUE) ? 4 : 3;

    for (;;) {
        DWORD w = WaitForMultipleObjects(nEv, ev, FALSE, INFINITE);

        if (w == WAIT_OBJECT_0)          break;           /* stop          */
        else if (w == WAIT_OBJECT_0 + 1) Enforce();       /* volume reset  */
        else if (w == WAIT_OBJECT_0 + 2) Attach();        /* new device    */
        else if (w == WAIT_OBJECT_0 + 3) {                /* config edit   */
            Sleep(50);                       /* let writer finish           */
            if (ReadVolume(cfgDir)) Enforce();
            FindNextChangeNotification(hFC);
        }
        else break;                                       /* error — exit  */
    }

    /* ---- Cleanup ---- */
    if (hFC != INVALID_HANDLE_VALUE) FindCloseChangeNotification(hFC);
    if (g_pDevCb && g_pEnum)
        g_pEnum->UnregisterEndpointNotificationCallback(g_pDevCb);
    Detach();
    if (g_pVolCb) { g_pVolCb->Release(); g_pVolCb = NULL; }
    if (g_pDevCb) { g_pDevCb->Release(); g_pDevCb = NULL; }
    if (g_pEnum)  { g_pEnum->Release();  g_pEnum  = NULL; }
    CoUninitialize();
    return 0;
}

/* ========================================================================= */
/*  Service control handler                                                  */
/* ========================================================================= */

static void WINAPI CtrlHandler(DWORD code) {
    switch (code) {
    case SERVICE_CONTROL_STOP:
    case SERVICE_CONTROL_SHUTDOWN:
        g_St.dwCurrentState = SERVICE_STOP_PENDING;
        g_St.dwCheckPoint   = 1;
        g_St.dwWaitHint     = 5000;
        SetServiceStatus(g_StH, &g_St);
        SetEvent(g_EvStop);
        break;
    case SERVICE_CONTROL_INTERROGATE:
        SetServiceStatus(g_StH, &g_St);
        break;
    default:
        break;
    }
}

/* ========================================================================= */
/*  ServiceMain — exported, called by svchost.exe                            */
/* ========================================================================= */

extern "C" __declspec(dllexport)
void WINAPI ServiceMain(DWORD dwArgc, LPWSTR* lpszArgv) {
    (void)dwArgc; (void)lpszArgv;

    g_StH = RegisterServiceCtrlHandlerW(SVCNAME, CtrlHandler);
    if (!g_StH) return;

    /* Report: starting */
    g_St.dwServiceType      = SERVICE_WIN32_SHARE_PROCESS;
    g_St.dwCurrentState     = SERVICE_START_PENDING;
    g_St.dwControlsAccepted = 0;
    g_St.dwCheckPoint       = 1;
    g_St.dwWaitHint         = 5000;
    SetServiceStatus(g_StH, &g_St);

    /* Create synchronisation events */
    g_EvStop = CreateEventW(NULL, TRUE,  FALSE, NULL);   /* manual-reset */
    g_EvVol  = CreateEventW(NULL, FALSE, FALSE, NULL);   /* auto-reset   */
    g_EvDev  = CreateEventW(NULL, FALSE, FALSE, NULL);   /* auto-reset   */

    DWORD exitCode = ERROR_SERVICE_SPECIFIC_ERROR;
    if (g_EvStop && g_EvVol && g_EvDev)
        exitCode = RunService();

    /* Clean up events */
    if (g_EvStop) { CloseHandle(g_EvStop); g_EvStop = NULL; }
    if (g_EvVol)  { CloseHandle(g_EvVol);  g_EvVol  = NULL; }
    if (g_EvDev)  { CloseHandle(g_EvDev);  g_EvDev  = NULL; }

    /* Report: stopped */
    g_St.dwCurrentState     = SERVICE_STOPPED;
    g_St.dwControlsAccepted = 0;
    g_St.dwCheckPoint       = 0;
    g_St.dwWaitHint         = 0;
    g_St.dwWin32ExitCode    = exitCode;
    SetServiceStatus(g_StH, &g_St);
}

/* ========================================================================= */
/*  DLL entry point                                                          */
/* ========================================================================= */

BOOL WINAPI DllMain(HINSTANCE, DWORD, LPVOID) { return TRUE; }
