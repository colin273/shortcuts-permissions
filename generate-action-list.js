const bplist = require('bplist-parser');
const fs = require('fs')

(async () => {
    const obj = (await bplist.parseFile('/System/Library/PrivateFrameworks/WorkflowKit.framework/Versions/Current/Resources/WFActions.plist', () => {}))[0];
    const actions = fs.readFileSync('./actions.json');

    for (const actionID of Object.keys(obj)) {
        try {
            const resources  = obj[actionID].RequiredResources;
            for (const resource of resources) {
                
            }
        } catch {}
    }
})();