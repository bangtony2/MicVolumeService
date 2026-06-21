@echo off
REM =========================================================
REM  MICFix Build Script — requires MSVC (cl.exe)
REM  Run from "Developer Command Prompt for VS" or
REM  "x64 Native Tools Command Prompt"
REM =========================================================

echo.
echo  === Building MICFix ===
echo.

REM --- Service DLL (loaded by svchost.exe) ---
echo [1/3] MICFixService.dll ...
cl /nologo /O2 /MT /W3 /EHsc /LD MICFixService.cpp /DEF:MICFixService.def /link ole32.lib advapi32.lib /OUT:MICFixService.dll
if %ERRORLEVEL% neq 0 (
    echo.
    echo  *** BUILD FAILED: MICFixService.dll ***
    exit /b 1
)

REM --- Installer EXE ---
echo [2/3] MICFixInstall.exe ...
cl /nologo /O2 /MT /W3 /EHsc MICFixInstall.cpp /Fe:MICFixInstall.exe /link advapi32.lib shell32.lib ole32.lib user32.lib
if %ERRORLEVEL% neq 0 (
    echo.
    echo  *** BUILD FAILED: MICFixInstall.exe ***
    exit /b 1
)

REM --- Uninstaller EXE ---
echo [3/3] MICFixUninstall.exe ...
cl /nologo /O2 /MT /W3 /EHsc MICFixUninstall.cpp /Fe:MICFixUninstall.exe /link advapi32.lib shell32.lib user32.lib
if %ERRORLEVEL% neq 0 (
    echo.
    echo  *** BUILD FAILED: MICFixUninstall.exe ***
    exit /b 1
)

echo.
echo  === Build complete! ===
echo.
echo    MICFixService.dll    Service DLL (loaded by svchost.exe)
echo    MICFixInstall.exe    Run ONCE as admin to install
echo    MICFixUninstall.exe  Run as admin to remove
echo.
echo  Usage:
echo    1. Place MICFixService.dll and MICFixInstall.exe together
echo    2. Right-click MICFixInstall.exe ^> Run as administrator
echo    3. Done! Volume is locked.
echo.
