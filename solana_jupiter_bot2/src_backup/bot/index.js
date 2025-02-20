console.clear();

import dotenv from "dotenv";
dotenv.config();
import { clearInterval } from "timers";
import { setTimeout } from "timers/promises.js";
import { PublicKey } from "@solana/web3.js";
import JSBI from "jsbi";
import { calculateProfit, toDecimal, toNumber, updateIterationsPerMin, checkRoutesResponse } from "...js";
import { checkArbReady } from "../utils.js";
import { handleExit, logExit } from "./exit.js";
import cache from "./cache.js";
import { printToConsole } from "./ui.js";
import { swap, failedSwapHandler, successSwapHandler } from "./swap.js";
import { setup, getInitialotherAmountThreshold, checkTokenABalance } from "./setup.js";
const waitabit = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
function getRandomAmt(runtime) {
    const min = Math.ceil(runtime * 10000 * 0.99);
    const max = Math.floor(runtime * 10000 * 1.01);
    return (Math.floor(Math.random() * (max - min + 1)) + min) / 10000;
}
const pingpongStrategy = async (jupiter, tokenA, tokenB) => {
    cache.iteration++;
    const date = new Date();
    const i = cache.iteration;
    cache.queue[i] = -1;
    try {
        updateIterationsPerMin(cache);
        const amountToTrade =
            cache.config.tradeSize.strategy === "cumulative"
                ? cache.currentBalance[cache.sideBuy ? "tokenA" : "tokenB"]
                : cache.initialBalance[cache.sideBuy ? "tokenA" : "tokenB"];
        const baseAmount = cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"];
        const slippage =
            typeof cache.config.slippage === "number" ? cache.config.slippage : 1;
        const inputToken = cache.sideBuy ? tokenA : tokenB;
        const outputToken = cache.sideBuy ? tokenB : tokenA;
        const amountInJSBI = JSBI.BigInt(amountToTrade);
        const performanceOfRouteCompStart = performance.now();
        const routes = await jupiter.computeRoutes({
            inputMint: new PublicKey(inputToken.address),
            outputMint: new PublicKey(outputToken.address),
            amount: amountInJSBI,
            slippageBps: slippage,
            forceFetch: true,
            onlyDirectRoutes: false,
            filterTopNResult: 2,
        });
        checkRoutesResponse(routes);
        cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] = routes.routesInfos.length;
        cache.queue[i] = 0;
        const performanceOfRouteComp = performance.now() - performanceOfRouteCompStart;
        const route = await routes.routesInfos[0];
        const simulatedProfit = calculateProfit(String(baseAmount), await JSBI.toNumber(route.outAmount));
        if (
            simulatedProfit > cache.config.minPercProfit &&
            cache.config.adaptiveSlippage === 1
        ) {
            let slippagerevised = (100 * (simulatedProfit - cache.config.minPercProfit + slippage / 100)).toFixed(3);
            route.slippageBps = slippagerevised;
        }
        printToConsole({ date, i, performanceOfRouteComp, inputToken, outputToken, tokenA, tokenB, route, simulatedProfit });
    } catch (error) {
        cache.queue[i] = 1;
        console.log(error);
    } finally {
        delete cache.queue[i];
    }
export { pingpongStrategy };
