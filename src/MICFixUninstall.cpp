/*
 * MICFix Uninstaller — Stops service, removes registration, cleans up
 * ====================================================================
 * Preserves Documents\MICFix\volume.json (user config).
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
#pragma comment(lib, "user32.lib")

#define SVCNAME L"MICFix"

/* ========================================================================= */
/*  UAC elevation                                                            */
/* ========================================================================= */

static BOOL IsElevated() {
    BOOL e = FALSE;
    HANDLE hTok = NULL;
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hTok)) {
        TOKEN_ELEVATION te;
        DWORD sz;
        if (GetTokenInformation(hTok, TokenElevation, &te, sizeof(te), &sz))
            e = te.TokenIsElevated;
        CloseHandle(hTok);
    }
    return e;
}

static void Elevate() {
    WCHAR me[MAX_PATH];
    GetModuleFileNameW(NULL, me, MAX_PATH);
    ShellExecuteW(NULL, L"runas", me, NULL, NULL, SW_SHOWNORMAL);
}

/* ========================================================================= */
/*  Main                                                                     */
/* ========================================================================= */

int main() {
    if (!IsElevated()) { Elevate(); return 0; }

    /* ---- 1.  Stop & delete service ---- */
    SC_HANDLE scm = OpenSCManagerW(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!scm) {
        MessageBoxW(NULL, L"Cannot open Service Control Manager.\nAre you running as admin?",
                    L"MICFix Uninstall", MB_OK | MB_ICONERROR);
        return 1;
    }

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

    Sleep(500);   /* let svchost release the DLL */

    /* ---- 2.  Remove svchost group entry ---- */
    HKEY hk;
    if (RegOpenKeyExW(HKEY_LOCAL_MACHINE,
            L"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Svchost",
            0, KEY_SET_VALUE, &hk) == ERROR_SUCCESS) {
        RegDeleteValueW(hk, L"MICFixGroup");
        RegCloseKey(hk);
    }

    /* ---- 3.  Delete DLL from ProgramData ---- */
    WCHAR pd[MAX_PATH];
    if (SHGetFolderPathW(NULL, CSIDL_COMMON_APPDATA, NULL, 0, pd) != S_OK)
        lstrcpyW(pd, L"C:\\ProgramData");

    WCHAR dllPath[MAX_PATH], dirPath[MAX_PATH];
    lstrcpyW(dirPath, pd);
    lstrcatW(dirPath, L"\\MICFix");
    lstrcpyW(dllPath, dirPath);
    lstrcatW(dllPath, L"\\MICFixService.dll");

    DeleteFileW(dllPath);
    RemoveDirectoryW(dirPath);

    /* ---- 4.  Delete registry keys ---- */
    RegDeleteKeyW(HKEY_LOCAL_MACHINE, L"SOFTWARE\\MICFix");

    /* Delete Parameters subkey first, then service key if it still exists */
    RegDeleteKeyW(HKEY_LOCAL_MACHINE,
        L"SYSTEM\\CurrentControlSet\\Services\\MICFix\\Parameters");

    MessageBoxW(NULL,
        L"MICFix has been uninstalled.\n\n"
        L"Your config (Documents\\MICFix\\volume.json) has been preserved.\n"
        L"Delete it manually if you no longer need it.",
        L"MICFix Uninstall", MB_OK | MB_ICONINFORMATION);
    return 0;
}
