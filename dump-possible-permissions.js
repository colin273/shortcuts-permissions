/*
dump-possible-permissions.js

Get all the permissions mentioned in WFActions.plist and save them to permissions.json.
All preexisting values in permissions.json are preserved, so permissions.json can be filled in manually.

This only works on macOS.
*/

const bplist = require('bplist-parser');
const { writeFileSync } = require('fs')

let perms = [];

function pushOrNot(perm) {
    if (!perms.includes(perm)) {
        perms.push(perm)
    }
}

(async () => {
    const obj = (await bplist.parseFile('/System/Library/PrivateFrameworks/WorkflowKit.framework/Resources/WFActions.plist', () => {}))[0];

    for (const actionID in obj) {
        const resources  = obj[actionID].RequiredResources;
        if (resources) {
            for (const resource of resources) {
                if (typeof resource == "string") {
                    pushOrNot(resource);
                } else {
                    if (resource.WFAccountClass) {
                        pushOrNot(resource.WFAccountClass)
                    } else {
                        pushOrNot(resource.WFResourceClass);
                    }
                }
            }
        }
    }

    perms.push("Settings")
    perms.sort();
    
    const permsJSON = {};
    try {
        permsJSON = require("./permissions.json");
    } catch {}

    for (const p of perms) {
        if (!permsJSON[p]) {
            permsJSON[p] = {
                icon: "",
                description: ""
            };
            console.log(`Permission '${p}' has no description`)
        }
    }

    writeFileSync('./permissions.json', JSON.stringify(permsJSON, null, 4))
})();