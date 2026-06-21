/*
 * MICFix Installer — Run once to install and start the service
 * =============================================================
 * 1. Creates Documents\MICFix\volume.json  (default 85 %)
 * 2. Copies MICFixService.dll to ProgramData\MICFix\
 * 3. Registers the DLL service via svchost.exe
 * 4. Starts the service
 *
 * Requires administrator privileges (auto-elevates via UAC).
 */

#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <shlobj.h>

#pragma comment(lib, "advapi32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "user32.lib")

#define SVCNAME   L"MICFix"
#define SVCDISP   L"MICFix - Mic Volume Lock"
#define SVCDESC   L"Locks default microphone volume to a level set in Documents\\MICFix\\volume.json"
#define SVCGROUP  L"MICFixGroup"

/* ========================================================================= */
/*  UAC elevation                                                            */
/* ========================================================================= */

static BOOL IsElevated() {
    BOOL elevated = FALSE;
    HANDLE hTok = NULL;
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hTok)) {
        TOKEN_ELEVATION te;
        DWORD sz;
        if (GetTokenInformation(hTok, TokenElevation, &te, sizeof(te), &sz))
            elevated = te.TokenIsElevated;
        CloseHandle(hTok);
    }
    return elevated;
}

static void Elevate() {
    WCHAR me[MAX_PATH];
    GetModuleFileNameW(NULL, me, MAX_PATH);
    ShellExecuteW(NULL, L"runas", me, NULL, NULL, SW_SHOWNORMAL);
}

/* ========================================================================= */
/*  Helpers                                                                  */
/* ========================================================================= */

static bool MkDir(const WCHAR* d) {
    DWORD a = GetFileAttributesW(d);
    if (a != INVALID_FILE_ATTRIBUTES && (a & FILE_ATTRIBUTE_DIRECTORY)) return true;
    return CreateDirectoryW(d, NULL) != 0;
}

static bool WriteDefaultJson(const WCHAR* dir) {
    WCHAR path[MAX_PATH];
    lstrcpyW(path, dir);
    lstrcatW(path, L"\\volume.json");
    if (GetFileAttributesW(path) != INVALID_FILE_ATTRIBUTES) return true; /* keep */

    HANDLE hf = CreateFileW(path, GENERIC_WRITE, 0, NULL, CREATE_NEW, 0, NULL);
    if (hf == INVALID_HANDLE_VALUE) return false;
    const char json[] = "{\n  \"volume\": 85\n}\n";
    DWORD w;
    WriteFile(hf, json, (DWORD)(sizeof(json) - 1), &w, NULL);
    CloseHandle(hf);
    return true;
}

/* ========================================================================= */
/*  Stop & remove any existing service                                       */
/* ========================================================================= */

static void RemoveOld() {
    SC_HANDLE scm = OpenSCManagerW(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!scm) return;
    SC_HANDLE svc = OpenServiceW(scm, SVCNAME, SERVICE_ALL_ACCESS);
    if (svc) {
        SERVICE_STATUS ss;
        ControlService(svc, SERVICE_CONTROL_STOP, &ss);
        for (int i = 0; i < 50; i++) {
            if (QueryServiceStatus(svc, &ss) && ss.dwCurrentState == SERVICE_STOPPED)
                break;
            Sleep(100);
        }
        DeleteService(svc);
        CloseServiceHandle(svc);
    }
    CloseServiceHandle(scm);
    Sleep(500);
}

/* ========================================================================= */
/*  Registry helpers                                                         */
/* ========================================================================= */

static bool RegWriteStr(HKEY root, const WCHAR* subkey, const WCHAR* name,
                        DWORD type, const BYTE* data, DWORD cb) {
    HKEY hk;
    if (RegCreateKeyExW(root, subkey, 0, NULL, 0, KEY_WRITE, NULL, &hk, NULL))
        return false;
    LONG r = RegSetValueExW(hk, name, 0, type, data, cb);
    RegCloseKey(hk);
    return r == ERROR_SUCCESS;
}

static bool SetupSvchostGroup() {
    /* HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost
       MICFixGroup = REG_MULTI_SZ { "MICFix" } */
    const WCHAR val[] = L"MICFix\0";   /* double-null via implicit C null */
    return RegWriteStr(HKEY_LOCAL_MACHINE,
        L"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Svchost",
        SVCGROUP, REG_MULTI_SZ, (const BYTE*)val, sizeof(val));
}

static bool SetServiceDll(const WCHAR* dllPath) {
    /* HKLM\SYSTEM\CurrentControlSet\Services\MICFix\Parameters
       ServiceDll = REG_EXPAND_SZ <dllPath> */
    DWORD cb = (DWORD)((lstrlenW(dllPath) + 1) * sizeof(WCHAR));
    return RegWriteStr(HKEY_LOCAL_MACHINE,
        L"SYSTEM\\CurrentControlSet\\Services\\MICFix\\Parameters",
        L"ServiceDll", REG_EXPAND_SZ, (const BYTE*)dllPath, cb);
}

static bool SetConfigDir(const WCHAR* cfgDir) {
    /* HKLM\SOFTWARE\MICFix  ConfigDir = <cfgDir> */
    DWORD cb = (DWORD)((lstrlenW(cfgDir) + 1) * sizeof(WCHAR));
    return RegWriteStr(HKEY_LOCAL_MACHINE, L"SOFTWARE\\MICFix",
                       L"ConfigDir", REG_SZ, (const BYTE*)cfgDir, cb);
}

/* ========================================================================= */
/*  Create & start the svchost-based service                                 */
/* ========================================================================= */

static bool CreateAndStart() {
    SC_HANDLE scm = OpenSCManagerW(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!scm) return false;

    SC_HANDLE svc = CreateServiceW(
        scm, SVCNAME, SVCDISP,
        SERVICE_ALL_ACCESS,
        SERVICE_WIN32_SHARE_PROCESS,         /* hosted by svchost.exe      */
        SERVICE_AUTO_START,                  /* start at every boot        */
        SERVICE_ERROR_NORMAL,
        L"%SystemRoot%\\System32\\svchost.exe -k MICFixGroup",
        NULL, NULL, NULL, NULL, NULL         /* LocalSystem, no deps       */
    );
    if (!svc) { CloseServiceHandle(scm); return false; }

    /* Description */
    SERVICE_DESCRIPTIONW desc = { (LPWSTR)SVCDESC };
    ChangeServiceConfig2W(svc, SERVICE_CONFIG_DESCRIPTION, &desc);

    /* Start */
    BOOL ok = StartServiceW(svc, 0, NULL);
    DWORD err = GetLastError();
    CloseServiceHandle(svc);
    CloseServiceHandle(scm);

    return ok || err == ERROR_SERVICE_ALREADY_RUNNING;
}

/* ========================================================================= */
/*  Main                                                                     */
/* ========================================================================= */

int main() {
    if (!IsElevated()) { Elevate(); return 0; }

    /* ---- 1.  Documents\MICFix\volume.json ---- */
    CoInitialize(NULL);
    WCHAR docs[MAX_PATH];
    if (SHGetFolderPathW(NULL, CSIDL_PERSONAL, NULL, 0, docs) != S_OK) {
        MessageBoxW(NULL, L"Cannot locate Documents folder.",
                    L"MICFix Install", MB_OK | MB_ICONERROR);
        CoUninitialize();
        return 1;
    }
    CoUninitialize();

    WCHAR cfgDir[MAX_PATH];
    lstrcpyW(cfgDir, docs);
    lstrcatW(cfgDir, L"\\MICFix");

    if (!MkDir(cfgDir)) {
        MessageBoxW(NULL, L"Cannot create MICFix config folder.",
                    L"MICFix Install", MB_OK | MB_ICONERROR);
        return 1;
    }
    WriteDefaultJson(cfgDir);

    /* ---- 2.  Copy DLL to ProgramData\MICFix ---- */
    WCHAR pd[MAX_PATH];
    if (SHGetFolderPathW(NULL, CSIDL_COMMON_APPDATA, NULL, 0, pd) != S_OK)
        lstrcpyW(pd, L"C:\\ProgramData");

    WCHAR installDir[MAX_PATH];
    lstrcpyW(installDir, pd);
    lstrcatW(installDir, L"\\MICFix");
    MkDir(installDir);

    /* Find DLL next to this installer */
    WCHAR srcDll[MAX_PATH];
    GetModuleFileNameW(NULL, srcDll, MAX_PATH);
    WCHAR* slash = wcsrchr(srcDll, L'\\');
    if (slash) lstrcpyW(slash + 1, L"MICFixService.dll");

    if (GetFileAttributesW(srcDll) == INVALID_FILE_ATTRIBUTES) {
        MessageBoxW(NULL,
            L"MICFixService.dll not found next to installer.\n\n"
            L"Place MICFixService.dll in the same folder as MICFixInstall.exe.",
            L"MICFix Install", MB_OK | MB_ICONERROR);
        return 1;
    }

    /* ---- 3.  Stop old service BEFORE overwriting DLL ---- */
    RemoveOld();

    WCHAR dstDll[MAX_PATH];
    lstrcpyW(dstDll, installDir);
    lstrcatW(dstDll, L"\\MICFixService.dll");
    CopyFileW(srcDll, dstDll, FALSE);

    /* ---- 4.  Registry: config dir ---- */
    if (!SetConfigDir(cfgDir)) {
        MessageBoxW(NULL, L"Cannot write registry config.",
                    L"MICFix Install", MB_OK | MB_ICONERROR);
        return 1;
    }

    /* ---- 5.  Registry: svchost group ---- */
    if (!SetupSvchostGroup()) {
        MessageBoxW(NULL, L"Cannot set up svchost group.",
                    L"MICFix Install", MB_OK | MB_ICONERROR);
        return 1;
    }

    /* ---- 6.  Create service + set ServiceDll ---- */
    if (!CreateAndStart()) {
        WCHAR msg[256];
        wsprintfW(msg, L"Cannot create/start service.  Error: %lu", GetLastError());
        MessageBoxW(NULL, msg, L"MICFix Install", MB_OK | MB_ICONERROR);
        return 1;
    }

    if (!SetServiceDll(dstDll)) {
        MessageBoxW(NULL, L"Cannot set ServiceDll in registry.",
                    L"MICFix Install", MB_OK | MB_ICONERROR);
        return 1;
    }

    MessageBoxW(NULL,
        L"MICFix installed and started!\n\n"
        L"\x2714  Microphone volume is now locked.\n"
        L"\x2714  Config:  Documents\\MICFix\\volume.json\n"
        L"\x2714  Service starts automatically at boot.\n\n"
        L"Edit volume.json to change the level (0-100).",
        L"MICFix Install", MB_OK | MB_ICONINFORMATION);
    return 0;
}
