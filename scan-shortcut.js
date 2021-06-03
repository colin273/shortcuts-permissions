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
    if (typeof shortcut == "string") {
        let url = new URL(shortcut);
        const host = url.hostname;
        if (host === "icloud.com" || "www.icloud.com") {
            try {
                const apiURL = "https://www.icloud.com/shortcuts/api/records/" + url.href.match(/[0-9a-zA-Z]+$/)[0];
                url = (await axios.get(apiURL)).data.fields.shortcut.value.downloadURL;
            } catch(err) {
                console.error(err);
                return;
            }
            
        }

        try {
            shortcut = Buffer.from((await axios.get(url)).data)
        } catch(err) {
            throw err;
        }
    }

    console.log(shortcut)
    const parsedShortcut = bplist.parseBuffer(shortcut)[0];
    console.log(parsedShortcut);
    const actions = parsedShortcut.WFWorkflowActions;

    const perms = [];
    for (const action of actions) {
        if (actionList.hasOwnProperty(action.WFWorkflowActionIdentifier)) {
            for (const perm of actionList[action.WFWorkflowActionIdentifier]) {
                if (!perms.includes(perm)) perms.push(perm);
            }
        }
    }

    return perms.sort();
}