/*
dump-possible-permissions.js

Get all the permissions mentioned in WFActions.plist and save them to permissions.json.
All preexisting values in permissions.json are preserved, so permissions.json can be filled in manually.

This only works on macOS.
*/

const bplist = require('bplist-parser');
const { writeFileSync } = require('fs');

const permissionsJSONPath = './permissions.json';

let perms = [];

function pushOrNot(perm) {
    if (!perms.includes(perm)) {
        perms.push(perm)
    }
}

(async () => {
    const obj = await bplist.parseFile(require('./get-wfactions-path.js'))[0];

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

    for (const perm of ["Apple TV Remote", "FaceTime", "Phone", "Run JavaScript", "Settings"]) {
        perms.push(perm)
    }

    perms.sort();

    const permsJSON = require(permissionsJSONPath);

    for (const p of perms) {
        if (permsJSON[p] === undefined) {
            permsJSON[p] = {
                icon: "",
                description: ""
            };
            console.log(`Permission '${p}' has no description`)
        }
    }

    writeFileSync(permissionsJSONPath, JSON.stringify(permsJSON, null, 4))
})();