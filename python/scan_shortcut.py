# scan_shortcut.py
#
# Exports scan_shortcut, a function that returns an array of permissions
# for a shortcut. The function accepts a .shortcut file as a bytes object.

import json
import plistlib

ACTIONS_PATH = "../actions.json"

with open(ACTIONS_PATH) as file:
    action_list = json.load(file)

def scan_shortcut(plist):
    '''Accepts a bytes object containing a shortcut, and returns a list of the shortcut's required permissions.'''
    
    actions = plistlib.loads(plist)["WFWorkflowActions"]

    perms = []

    for action in actions:
        action_id = action["WFWorkflowActionIdentifier"]
        if action_id in action_list:
            for perm in action_list[action_id]:
                if not perm in perms:
                    perms.append(perm)
    
    perms.sort()
    return perms