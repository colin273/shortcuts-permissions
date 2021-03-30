/*
index.js

Scan a shortcut.

Usage: `node <path to this directory> <shortcut URL or ID>`

The array of permissions is logged to the console.

TO DO: Completely rework this so that this is a module and the CLI is in a separate file.
*/

const scan = require('./scan-shortcut.js');

(async function() {
    try {
        const perms = await scan(process.argv[2]);
        console.log(perms);
    } catch(e) {
        console.error(e)
    }
})();