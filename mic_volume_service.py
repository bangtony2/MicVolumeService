import sys
import win32serviceutil
import win32service
import win32event

from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from pycaw.callbacks import AudioEndpointVolumeCallback

TARGET_VOLUME_PERCENT = 85

class VolumeChangeHandler(AudioEndpointVolumeCallback):
    def __init__(self, volume_interface):
        super().__init__()
        self.volume = volume_interface
        self.set_volume(TARGET_VOLUME_PERCENT)

    def set_volume(self, target_volume_percent):
        current_volume = self.volume.GetMasterVolumeLevelScalar() * 100
        if round(current_volume) != target_volume_percent:
            self.volume.SetMasterVolumeLevelScalar(target_volume_percent / 100, None)

    def OnNotify(self, pNotify):
        self.set_volume(TARGET_VOLUME_PERCENT)


class MicrophoneService(win32serviceutil.ServiceFramework):
    _svc_name_ = "MicrophoneVolumeService"
    _svc_display_name_ = "Microphone Volume Control Service"
    _svc_description_ = "Maintains constant microphone volume level"

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)

    def SvcDoRun(self):
        try:
            import pythoncom
            import time
            
            pythoncom.CoInitialize()

            devices = AudioUtilities.GetMicrophone()
            if not devices:
                return

            interface = devices.Activate(
                IAudioEndpointVolume._iid_, 
                CLSCTX_ALL, 
                None
            )
            volume = cast(interface, POINTER(IAudioEndpointVolume))

            callback = VolumeChangeHandler(volume)
            volume.RegisterControlChangeNotify(callback)

            while True:
                if win32event.WaitForSingleObject(self.stop_event, 1000) == win32event.WAIT_OBJECT_0:
                    volume.UnregisterControlChangeNotify(callback)
                    break
                
                pythoncom.PumpWaitingMessages()

        finally:
            pythoncom.CoUninitialize()


def main():
    if len(sys.argv) == 1:
        win32serviceutil.HandleCommandLine(MicrophoneService)
    else:
        win32serviceutil.HandleCommandLine(MicrophoneService)


if __name__ == '__main__':
    main()
