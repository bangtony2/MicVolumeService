<div align="right">
  Language: 🇬🇧 <b>English</b> | <a href="README_UA.md">🇺🇦 Українська</a>
</div>

# 🎤 MICFix — Microphone Volume Lock Service

<div align="center">
  <a href="https://bangtony2.github.io/MicVolumeService/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Visit_Official_Website-18181b?style=for-the-badge&logo=googlechrome&logoColor=3b82f6" alt="Official Website"/>
  </a>
</div>

A lightweight Windows service (DLL) that **permanently locks your default microphone volume** to a specified level. No matter what — system changes, apps resetting volume, or manual adjustments — the volume snaps back **instantly**.

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔒 **Volume Lock** | Enforces mic volume even if the system or user changes it |
| ⚡ **Zero CPU Usage** | Fully event-driven architecture — no polling, no timers |
| 📦 **DLL Service** | Runs through `svchost.exe` — no separate `.exe` process |
| 🔄 **Live Config** | Edit `volume.json` → volume updates instantly |
| 🎯 **Auto-detect** | Automatically follows default microphone changes |
| 🚀 **One-Click Install** | Single `MICFixInstall.exe` — run once, done forever |
| 🧹 **Clean Uninstall** | `MICFixUninstall.exe` removes everything |

## 🏗️ Architecture

```
svchost.exe -k MICFixGroup
    └── MICFixService.dll
            ├── IAudioEndpointVolumeCallback  → volume changed? → set it back
            ├── IMMNotificationClient         → mic changed? → re-attach
            └── FindFirstChangeNotification   → config changed? → re-read
```

**How it achieves 0% CPU:**
The service sleeps in `WaitForMultipleObjects` and wakes up **only** when one of these OS-level events fires. No loops, no `Sleep()` polling, no CPU burn.

## 📥 Installation

### Pre-built (Recommended)
1. Download `MICFixService.dll` + `MICFixInstall.exe` from [Releases](https://github.com/bangtony2/MicVolumeService/releases)
2. Place both files in the same folder
3. Run `MICFixInstall.exe` as Administrator
4. ✅ Done! Microphone volume is now locked

### Build from Source
Requires **MSVC Build Tools 2022** (or Visual Studio with C++ workload).

```bash
# Open "Developer Command Prompt for VS 2022"
git clone https://github.com/bangtony2/MicVolumeService.git
cd MicVolumeService
build.bat
```

Output:
- `MICFixService.dll` — Service DLL (loaded by svchost.exe)
- `MICFixInstall.exe` — One-time installer
- `MICFixUninstall.exe` — Uninstaller

**CMake alternative:**
```bash
cmake -B build -G "Visual Studio 17 2022"
cmake --build build --config Release
```

## ⚙️ Configuration

After installation, a config file is created at:
```
Documents\MICFix\volume.json
```

```json
{
  "volume": 85
}
```

- Change the value (0–100) and **save** — the volume updates **instantly**
- No need to restart the service

## 🧹 Uninstall

1. Run `MICFixUninstall.exe` as Administrator
2. Service is stopped and removed
3. Your config (`volume.json`) is preserved

## 🔧 How It Works

| Component | Purpose |
|---|---|
| `MICFixService.dll` | Core service DLL loaded by `svchost.exe` |
| `IAudioEndpointVolumeCallback` | COM callback — fires when anyone changes mic volume |
| `IMMNotificationClient` | COM callback — fires when default mic device changes |
| `FindFirstChangeNotification` | Win32 API — fires when `volume.json` is modified |
| `WaitForMultipleObjects` | Sleeps thread until any event fires (0% CPU) |

### What the Installer Does
1. Creates `Documents\MICFix\volume.json` (default 85%)
2. Copies `MICFixService.dll` to `C:\ProgramData\MICFix\`
3. Registers a svchost group (`MICFixGroup`)
4. Creates the Windows service with `SERVICE_AUTO_START`
5. Starts the service immediately

## 📁 Project Structure

```
MicVolumeService/
├── MICFixService.cpp    # Service DLL — Core logic (audio, config, events)
├── MICFixService.def    # DLL export definition (ServiceMain)
├── MICFixInstall.cpp    # Installer (run once)
├── MICFixUninstall.cpp  # Uninstaller
├── build.bat            # MSVC build script
├── CMakeLists.txt       # CMake build configuration
└── README.md
```

## 📋 Requirements

- **OS:** Windows 10 / 11
- **Build:** MSVC Build Tools 2022+ (or Visual Studio with C++ Desktop workload)
- **Runtime:** None — statically linked (`/MT`), zero external dependencies

## 📜 License

MIT
