import json
import plistlib

action_list = json.loads(open("./actions.json").read())

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