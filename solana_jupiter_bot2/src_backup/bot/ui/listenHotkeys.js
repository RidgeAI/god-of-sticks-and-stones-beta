import keypress from "keypress";
import { logExit } from "../exit.js";
import cache from "../cache.js";

const listenHotkeys = () => {
    keypress(process.stdin);
    process.stdin.on("keypress", function (ch, key) {
        if (key && key.ctrl && key.name === "c") {
            cache.ui.allowClear = false;
            if (global.botInterval) clearInterval(global.botInterval);
            logExit(0, { message: "[CTRL]+[C] exiting by user" });
            process.exitCode = 0;
            process.stdin.setRawMode(false);
            process.exit(0);
        }
        if (key) {
            const keyMappings = {
                e: () => (cache.hotkeys.e = true),
                r: () => (cache.hotkeys.r = true),
                p: () => (cache.ui.showProfitChart = !cache.ui.showProfitChart),
                l: () => (cache.ui.showPerformanceOfRouteCompChart = !cache.ui.showPerformanceOfRouteCompChart),
                t: () => (cache.ui.showTradeHistory = !cache.ui.showTradeHistory),
                i: () => (cache.ui.hideRpc = !cache.ui.hideRpc),
                h: () => (cache.ui.showHelp = !cache.ui.showHelp),
                s: () => (cache.tradingEnabled = !cache.tradingEnabled),
            };
            if (keyMappings[key.name]) {
                keyMappings[key.name]();
            }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
};
export default listenHotkeys;
