const { existsSync } = require("fs")
const { join }= require("path")
const { execFileSync } = require("child_process")

// Determine where WFActions.plist is
// Supported platforms: macOS, iOS, iSH on iOS
const wfActions = "WFActions.plist"
const wfKitPath = "/System/Library/PrivateFrameworks/WorkflowKit.framework"

switch (process.platform) {
    case "darwin":
        // Apple platform
        const iosWFActionsPath = join(wfKitPath, wfActions)
        // If WFActions.plist exists at iOS path, then environment is iOS
        // Otherwise, environment is macOS
        module.exports = existsSync(iosWFActionsPath) ? iosWFActionsPath : join(wfKitPath, "Resources", wfActions)
        break
    case "linux":
        // Assume environment is iSH on iOS for now
        const mountDirectory = "/mnt"
        execFileSync("mount", ["-t", "real", "/", mountDirectory])
        const wfActionsPath = join(mountDirectory, wfKitPath, wfActions)
        if (existsSync(wfActionsPath)) {
            // Yes, this is iSH on iOS
            module.exports = wfActionsPath
        } else {
            // Linux but not iSH, so do not proceed
            console.log("The only supported Linux environment for this script is iSH on iOS.")
            process.exit()
        }
        break
    default:
        // Unsupported OS
        console.log("This OS is not supported.")
        process.exit()
}