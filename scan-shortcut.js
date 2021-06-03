/*
scan-shortcut.js

This exports a function that accepts an array of actions obtained by shortcuts.js.
It returns an alphabetized list of all the unique permissions in the shortcut.
Currently it ignores third-party apps' actions, though that may change in the future.
*/

const axios = require('axios').default;
const bplist = require('./node_modules/bplist-parser/');

const actionList = require('./actions.json');

module.exports = async (shortcut) => {
    const actions = bplist.parseBuffer(shortcut)[0].WFWorkflowActions;

    const perms = [];
    
    for (const action of actions) {
        actionID = action.WFWorkflowActionIdentifier
        if (actionList.hasOwnProperty(actionID)) {
            for (const perm of actionList[actionID]) {
                if (!perms.includes(perm)) perms.push(perm);
            }
        }
    }

    return perms.sort();
}