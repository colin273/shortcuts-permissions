import json
import plistlib

PERMISSIONS_JSON_PATH = "./permissions.json"
WFACTIONS_PLIST_PATH = '/System/Library/PrivateFrameworks/WorkflowKit.framework/Resources/WFActions.plist'

EXTRA_PERMS = ["Apple TV Remote", "FaceTime", "Phone", "Run JavaScript", "Settings"]

perms = []

def push_or_not(perm):
    """Accepts a string, determines whether to add it to the permissions list."""
    if not perm in perms:
        perms.append(perm)

with open(WFACTIONS_PLIST_PATH, "rb") as file:
    actions_dict = plistlib.load(file)

for action_id in actions_dict:
    action = actions_dict[action_id]
    if "RequiredResources" in action:
        resources = action["RequiredResources"]
        if resources:
            for resource in resources:
                if type(resource) is str:
                    push_or_not(resource)
                else:
                    if "WFAccountClass" in resource:
                        push_or_not(resource["WFAccountClass"])
                    else:
                        push_or_not(resource["WFResourceClass"])

for perm in EXTRA_PERMS:
    perms.append(perm)

perms.sort()

with open(PERMISSIONS_JSON_PATH, "r") as file:
    perms_json = json.load(file)

for perm in perms:
    if not perm in perms_json:
        perms_json[perm] = { "icon": "", "description": "" }
        print("Permission '" + perm + "' has no description")
    
with open(PERMISSIONS_JSON_PATH, "w") as file:
    json.dump(dict(perms_json), file, indent = 2)