import sys
import os
import json
import win32serviceutil
import win32service
import win32event
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from pycaw.callbacks import AudioEndpointVolumeCallback

CONFIG_DIR = os.path.join(os.path.expanduser("~"), "Documents", "micfix")
CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")
DEFAULT_VOLUME = 85
TOLERANCE = 1

def load_config():
    """Загрузка конфигурации из файла"""
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                config = json.load(f)
                return config.get('target_volume', DEFAULT_VOLUME)
    except:
        pass
    return DEFAULT_VOLUME

class VolumeChangeHandler(AudioEndpointVolumeCallback):
    def __init__(self, volume_interface):
        super().__init__()
        self.volume = volume_interface
        self.target_volume = load_config()
        self._set_initial_volume()
    
    def _set_initial_volume(self):
        try:
            current = int(self.volume.GetMasterVolumeLevelScalar() * 100)
            if abs(current - self.target_volume) > TOLERANCE:
                self.volume.SetMasterVolumeLevelScalar(self.target_volume / 100.0, None)
        except:
            pass
    
    def OnNotify(self, pNotify):
        try:
            current = int(self.volume.GetMasterVolumeLevelScalar() * 100)
            if abs(current - self.target_volume) > TOLERANCE:
                self.volume.SetMasterVolumeLevelScalar(self.target_volume / 100.0, None)
        except:
            pass

class MicrophoneService(win32serviceutil.ServiceFramework):
    _svc_name_ = "MicrophoneVolumeService"
    _svc_display_name_ = "Microphone Volume Control Service"
    _svc_description_ = "Maintains constant microphone volume level"
    
    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)
        self.volume = None
        self.callback = None
    
    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)
    
    def SvcDoRun(self):
        import pythoncom
        
        pythoncom.CoInitialize()
        try:
            devices = AudioUtilities.GetMicrophone()
            if not devices:
                return
            
            interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            self.volume = cast(interface, POINTER(IAudioEndpointVolume))
            self.callback = VolumeChangeHandler(self.volume)
            self.volume.RegisterControlChangeNotify(self.callback)

            while win32event.WaitForSingleObject(self.stop_event, 5000) != win32event.WAIT_OBJECT_0:
                pythoncom.PumpWaitingMessages()
            
            if self.volume and self.callback:
                self.volume.UnregisterControlChangeNotify(self.callback)
        finally:
            pythoncom.CoUninitialize()

if __name__ == '__main__':
    if len(sys.argv) == 1:
        win32serviceutil.HandleCommandLine(MicrophoneService)
    else:
        win32serviceutil.HandleCommandLine(MicrophoneService)
