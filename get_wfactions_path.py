import os
import platform
import subprocess

# Determine where WFActions.plist is
# Supported platforms: macOS, iOS, iSH on iOS
WFACTIONS = "WFActions.plist"
WFKIT_PATH = "/System/Library/PrivateFrameworks/WorkflowKit.framework"
OS_NAME = platform.system()

def get_path():
    '''Return the path to WFActions.plist or exit the program depending on the platform.'''
    
    if OS_NAME == "Darwin":
        ios_wfactions_path = os.path.join(WFKIT_PATH, WFACTIONS)
        if os.path.exists(ios_wfactions_path):
            # Environment is iOS
            return ios_wfactions_path
        else:
            # Environment is macOS
            return os.path.join(WFKIT_PATH, "Resources", WFACTIONS)
    elif OS_NAME == "Linux":
        # Assume environment is iSH on iOS for now
        mount_directory = "/mnt"
        subprocess.run(["mount", "-t", "real", "/", mount_directory])
        wfactions_path = os.path.join(mount_directory, WFKIT_PATH, WFACTIONS)
        if os.path.exists(wfactions_path):
            return wfactions_path
        else:
            # Linux but not iSH, so do not proceed
            print("The only supported Linux environment for this script is iSH on iOS.")
            quit()
    else:
        # Unsupported OS
        print("This OS is not supported.")
        quit()