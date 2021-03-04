# shortcuts-permissions

Determine the permissions that a Siri shortcut requires to run. This is done by parsing the shortcut's action list and checking each action against WFActions.plist, which includes metadata such as permissions for every built-in action.

Note: WFActions.plist is only present on macOS and iOS, and its path is not exactly the same for the two platforms. At present, the scripts for dumping permissions and generating the action list from WFActions.plist only work on macOS.

Checklist:

- [x] Write [permission dumping script](dump-possible-permissions.js)
- [x] Dump possible permissions to [permissions.json](permissions.json)
- [x] Write [action list generator](generate-action-list.js)
- [ ] Fill in icon and description fields in permissions.json, or set value to `null` if a RequiredResources item is not a "real" permission that can be clearly defined
- [ ] Add action-by-action exceptions to the contents of WFActions.plist in [overrides.json](overrides.json)
- [ ] Generate [actions.json](actions.json)
- [ ] Write [shortcut scanner](scan-shortcut.js)
- [ ] Add whatever is needed to the various scripts to turn this into a tidy npm package
- [ ] Publish this on npm