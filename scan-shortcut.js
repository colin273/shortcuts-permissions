/*
scan-shortcut.js

This exports a function that accepts an array of actions obtained by shortcuts.js.
It returns an alphabetized list of all the unique permissions in the shortcut.
Currently it ignores third-party apps' actions, though that may change in the future.
*/

const actionList = require('./actions.json');

module.exports = (actions) => {
    const perms = [];
    for (const action of actions) {
        if (actionList.hasOwnProperty(action.identifier)) {
            for (const perm of actionList[action.identifier]) {
                if (!perms.includes(perm)) perms.push(perm);
            }
        }
    }

    return perms.sort();
}