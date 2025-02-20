
import cliui from "cliui";
import chalk from "chalk";
import moment from "moment";
import chart from "asciichart";
import JSBI from "jsbi";
import { toDecimal } from "../../utils/index.js";
import pkg from "../../../package.json" assert { type: "json" };
import cache from "../cache.js";
const ui = cliui({ width: 140 });
function printToConsole({
    date,
    i,
    performanceOfRouteComp,
    inputToken,
    outputToken,
    tokenA,
    tokenB,
    route,
    simulatedProfit,
}) {
    try {
        if (cache.ui.allowClear) {
            if (cache.ui.showProfitChart) {
                let spottedMaxTemp = cache.chart.spottedMax[cache.sideBuy ? "buy" : "sell"];
                spottedMaxTemp.shift();
                spottedMaxTemp.push(
                    simulatedProfit === Infinity ? 0 : parseFloat(simulatedProfit.toFixed(2))
                );
                cache.chart.spottedMax.buy = spottedMaxTemp;
            }
            if (cache.ui.showPerformanceOfRouteCompChart) {
                let performanceTemp = cache.chart.performanceOfRouteComp;
                performanceTemp.shift();
                performanceTemp.push(parseInt(performanceOfRouteComp.toFixed()));
                cache.chart.performanceOfRouteComp = performanceTemp;
            let statusMessage = " ";
            let statusPerformance;
            if (cache.swappingRightNow) {
                statusPerformance = performance.now() - cache.performanceOfTxStart;
                statusMessage = chalk.bold[
                    statusPerformance < 45000
                        ? "greenBright"
                        : statusPerformance < 60000
                        ? "yellowBright"
                        : "redBright"
                ](`SWAPPING ... ${(statusPerformance / 1000).toFixed(2)} s`);
            } else if (cache.fetchingResultsFromSolscan) {
                statusPerformance = performance.now() - cache.fetchingResultsFromSolscanStart;
                        : statusPerformance < 90000
                ](`FETCHING RESULT ... ${(statusPerformance / 1000).toFixed(2)} s`);
            console.clear();
            ui.resetOutput();
            ui.div(`ARB PROTOCOL ${pkg.version}`);
            ui.div(chalk.gray("-".repeat(140)));
            ui.div(
                {
                    text: `TIMESTAMP: ${chalk[cache.ui.defaultColor](date.toLocaleString())}`,
                },
                    text: `ITERATION: ${
                        i % 2 === 0 ? chalk[cache.ui.defaultColor].bold(i) : chalk[cache.ui.defaultColor](i)
                    } | ${chalk.bold[cache.ui.defaultColor](cache.iterationPerMinute.value)} i/min`,
                    text: `RPC: ${chalk[cache.ui.defaultColor](cache.config.rpc[0])}`,
                }
            );
            const performanceColor = performanceOfRouteComp < 1000 ? cache.ui.defaultColor : "redBright";
                    text: `STARTED: ${chalk[cache.ui.defaultColor](moment(cache.startTime).fromNow())}`,
                    text: `LOOKUP (ROUTE): ${chalk.bold[performanceColor](performanceOfRouteComp.toFixed())} ms`,
            ui.div(`BUY: ${chalk.bold.green(cache.tradeCounter.buy.success)}`);
            ui.div(`SELL: ${chalk.bold.green(cache.tradeCounter.sell.success)}`);
            ui.div(`FAILED BUY: ${chalk.bold.red(cache.tradeCounter.buy.fail)}`);
            ui.div(`FAILED SELL: ${chalk.bold.red(cache.tradeCounter.sell.fail)}`);
                `IN:  ${chalk.yellowBright(toDecimal(String(route.inAmount), inputToken.decimals))} ${
                    chalk[cache.ui.defaultColor](inputToken.symbol)
                }`
                `OUT: ${chalk[simulatedProfit > 0 ? "greenBright" : "red"](
                    toDecimal(String(route.outAmount), outputToken.decimals)
                )} ${chalk[cache.ui.defaultColor](outputToken.symbol)}`
                `PROFIT: ${chalk[simulatedProfit > 0 ? "greenBright" : "red"](
                    simulatedProfit.toFixed(2)
                )} % ${chalk.gray(`(${cache?.config?.minPercProfit})`)}`
            console.log(ui.toString());
        }
    } catch (error) {
        console.log(error);
    }
}
export default printToConsole;
