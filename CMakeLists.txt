cmake_minimum_required(VERSION 3.15)
project(MICFix LANGUAGES CXX)

# Static CRT — no Visual C++ runtime dependency
set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

# Optimisation for Release builds
set(CMAKE_CXX_FLAGS_RELEASE "/O2 /DNDEBUG" CACHE STRING "" FORCE)

# ---- Service DLL (loaded by svchost.exe) ----
add_library(MICFixService SHARED
    src/MICFixService.cpp
    src/MICFixService.def
)
target_link_libraries(MICFixService PRIVATE ole32 advapi32)

# ---- Installer EXE ----
add_executable(MICFixInstall src/MICFixInstall.cpp)
target_link_libraries(MICFixInstall PRIVATE advapi32 shell32 ole32 user32)

# ---- Uninstaller EXE ----
add_executable(MICFixUninstall src/MICFixUninstall.cpp)
target_link_libraries(MICFixUninstall PRIVATE advapi32 shell32 user32)
