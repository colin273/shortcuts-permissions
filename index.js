/*
index.js

Scan a shortcut.

Usage: `node <path to this directory> <shortcut URL or ID>`

The array of permissions is logged to the console.

TO DO: Completely rework this so that this is a module and the CLI is in a separate file.
*/

const shortcuts = require('shortcuts.js');

const scan = require('./scan-shortcut.js');

(async function() {
    const url = process.argv[2];
    const scDetails = await shortcuts.getShortcutDetails(shortcuts.idFromURL(url));
    const scMetadata = await scDetails.getMetadata();
    const actions = scMetadata.actions;
    const perms = scan(actions);
    console.log(perms);
})();