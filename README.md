# Microphone Volume Control Service

## Preview

![Microphone Volume Control Preview](preview.gif)

## Overview
This script is a Windows service that ensures your microphone volume stays at a constant level. It prevents external applications from modifying the microphone's volume, keeping it at the value set in the script. 

The script modifies the volume of the **default microphone** set in the system sound settings. If you change the default microphone, the service will automatically control the new default device.

If you need to change the microphone volume, you must stop and remove the service first before adjusting the volume manually.

## Features
- Automatically maintains the microphone volume at a fixed percentage.
- Prevents unauthorized applications from changing the microphone volume.
- Runs as a Windows service in the background.

## Installation & Usage

### 1. Install the service
To install the service, run:
```sh
python mic_volume_service.py install
sc start MicrophoneVolumeService
```
After starting the service, open **Services** (`services.msc`), find **Microphone Volume Control Service**, right-click it, select **Properties**, and set **Startup type** to **Automatic**. This ensures the service starts automatically when the system boots.

### 2. Stop and remove the service
If you need to change the microphone volume, you must first stop and remove the service:
```sh
sc stop MicrophoneVolumeService
sc delete MicrophoneVolumeService
```
After that, adjust your microphone volume manually and reinstall the service if necessary.

## Requirements
- `pycaw`
- `pywin32`
- `comtypes`

You can install dependencies using:
```sh
pip install pycaw pywin32 comtypes
```

## Notes
- Ensure you have the necessary permissions to install and manage Windows services.
- If the service does not start, check the event logs or ensure your microphone is properly detected by the system.