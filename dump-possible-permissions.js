const bplist = require('bplist-parser');
const fs = require('fs')

let perms = [];
let accountTypes = [];
function pushOrNot(perm) {
    if (!perms.includes(perm)) {
        perms.push(perm)
    }
}

(async () => {
    const obj = (await bplist.parseFile('/System/Library/PrivateFrameworks/WorkflowKit.framework/Versions/Current/Resources/WFActions.plist', () => {}))[0];

    for (const actionID of Object.keys(obj)) {
        try {
            const resources  = obj[actionID].RequiredResources;
            for (const resource of resources) {
                
                if (typeof resource == "string") {
                    pushOrNot(resource);
                } else {
                    pushOrNot(resource.WFResourceClass);
                    if (resource.WFAccountClass) {
                        if (!accountTypes.includes(resource.WFAccountClass)) {
                            accountTypes.push(resource.WFAccountClass);
                        }
                    }
                }
            }
        } catch {}
    }
    console.log(perms.sort().join('\n'))
    console.log('\n')
    console.log(accountTypes.sort().join('\n'))
})();