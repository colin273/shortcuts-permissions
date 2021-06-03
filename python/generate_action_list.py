# generate_action_list.py
# 
# Generates actions.json, containing all the actions and permissions in WFActions.plist.
# Supports macOS, iOS (direct filesystem access), and iSH on iOS.
# 
# Permissions with a value of `null` in permissions.json are ignored.
# Action listings in overrides.json take precedence over WFActions.plist.

import json
import plistlib

from get_wfactions_path import get_path

ACTIONS_JSON_PATH = "../actions.json"
OVERRIDES_PATH = "../overrides.json"
PERMISSIONS_JSON_PATH = "../permissions.json"
WFACTIONS_PLIST_PATH = get_path()

def push_or_not(arr, item):
    """Accepts a list and a string.
    Determines whether to append the string to the list."""

    if (not permissions[item] == None) & (not item in arr):
        arr.append(item)

with open(ACTIONS_JSON_PATH) as file:
    actions = json.load(file)

with open(OVERRIDES_PATH) as file:
    overrides = json.load(file)

with open(PERMISSIONS_JSON_PATH) as file:
    permissions = json.load(file)

with open(WFACTIONS_PLIST_PATH, "rb") as file:
    actions_dict = plistlib.load(file)

for action_id in actions_dict:
    perms = []
    if action_id in overrides:
        perms = overrides[action_id]
    else:
        action = actions_dict[action_id]
        if ("RequiredResources" in action):
            resources = action["RequiredResources"]
            if resources:
                for resource in resources:
                    if type(resource) is str:
                        push_or_not(perms, resource)
                    else:
                        if "WFAccountClass" in resource:
                            push_or_not(perms, resource["WFAccountClass"])
                        else:
                            push_or_not(perms, resource["WFResourceClass"])

        if "AppIdentifier" in action:
            if action["AppIdentifier"] == "com.apple.Preferences":
                push_or_not(perms, "Settings")
            elif action["AppIdentifier"] == "com.apple.TVRemoteUIService":
                push_or_not(perms, "Apple TV Remote")
        
    perms.sort()

    actions[action_id] = perms
    
with open(ACTIONS_JSON_PATH, "w") as file:
    json.dump(actions, file, indent = 4)