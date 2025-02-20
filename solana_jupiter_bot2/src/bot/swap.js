
import { calculateProfit, toDecimal, storeItInTempAsJSON } from "../utils.js";
import cache from "./cache.js";
import { setTimeout } from "timers/promises.js";
import { balanceCheck } from "./setup.js";
import { checktrans } from "../utils/transaction.js";
import promiseRetry from "promise-retry";
const waitabit = async (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject("Error in promise"), ms);
    });
};
export const swap = async (jupiter, route) => {
    try {
        const performanceOfTxStart = performance.now();
        cache.performanceOfTxStart = performanceOfTxStart;
        if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);
        const priority = typeof cache.config.priority === "number" ? cache.config.priority : 100;
        cache.priority = priority;
        const { execute } = await jupiter.exchange({
            routeInfo: route,
            computeUnitPriceMicroLamports: priority,
        });
        const result = await execute();
        if (process.env.DEBUG) storeItInTempAsJSON("result", result);
        cache.tradeCounter.failedbalancecheck = 0;
        cache.tradeCounter.errorcount = 0;
        const performanceOfTx = performance.now() - performanceOfTxStart;
        return [result, performanceOfTx];
    } catch (error) {
        console.log("Swap error:", error);
    }
export const failedSwapHandler = async (tradeEntry, inputToken, tradeAmount) => {
    cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].fail++;
    if (cache.config.storeFailedTxInHistory) {
        cache.tradeHistory.push(tradeEntry);
    const realbalanceToken = await balanceCheck(inputToken);
    if (Number(realbalanceToken) < Number(tradeAmount)) {
        cache.tradeCounter.failedbalancecheck++;
        if (cache.tradeCounter.failedbalancecheck > 5) {
            console.log(`Balance Lookup is too low for token: ${realbalanceToken} < ${tradeAmount}`);
            process.exit();
        }
    cache.tradeCounter.errorcount += 1;
    if (cache.tradeCounter.errorcount > 100) {
        console.log(`Error Count too high for swaps: ${cache.tradeCounter.errorcount}`);
        process.exit();
export const successSwapHandler = async (tx, tradeEntry, tokenA, tokenB) => {
    if (process.env.DEBUG) storeItInTempAsJSON(`txResultFromSDK_${tx?.txid}`, tx);
    cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++;
    if (cache.config.tradingStrategy === "pingpong") {
        if (cache.sideBuy) {
            cache.lastBalance.tokenA = cache.currentBalance.tokenA;
            cache.currentBalance.tokenA = 0;
            cache.currentBalance.tokenB = tx.outputAmount;
        } else {
            cache.lastBalance.tokenB = cache.currentBalance.tokenB;
            cache.currentBalance.tokenB = 0;
            cache.currentBalance.tokenA = tx.outputAmount;
        
            cache.currentProfit.tokenA = 0;
            cache.currentProfit.tokenB = calculateProfit(
                String(cache.initialBalance.tokenB),
                String(cache.currentBalance.tokenB)
            );
            cache.currentProfit.tokenB = 0;
            cache.currentProfit.tokenA = calculateProfit(
                String(cache.initialBalance.tokenA),
                String(cache.currentBalance.tokenA)
        tradeEntry.inAmount = toDecimal(tx.inputAmount, cache.sideBuy ? tokenA.decimals : tokenB.decimals);
        tradeEntry.outAmount = toDecimal(tx.outputAmount, cache.sideBuy ? tokenB.decimals : tokenA.decimals);
        tradeEntry.profit = calculateProfit(
            String(cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"]),
            String(tx.outputAmount)
        );
    if (cache.config.tradingStrategy === "arbitrage") {
        try {
            var txresult = [];
            var err2 = -1;
            var rcount = 0;
            var retries = 30;
            const fetcher = async (retry) => {
                console.log("Looking for ARB trade result via RPC.");
                rcount++;
                if (rcount >= retries) {
                    console.log("Max attempts reached. Assuming transaction did not complete.");
                    return -1;
                }
                [txresult, err2] = await checktrans(tx?.txid, cache.walletpubkeyfull);
                if (err2 == 0 && txresult) {
                    if (txresult?.[tokenA.address]?.change > 0) {
                        cache.lastBalance.tokenA = cache.currentBalance.tokenA;
                        cache.currentBalance.tokenA += txresult?.[tokenA.address]?.change;
                        cache.currentProfit.tokenA = calculateProfit(
                            String(cache.initialBalance.tokenA),
                            String(cache.currentBalance.tokenA)
                        );
                        tradeEntry.inAmount = toDecimal(cache.lastBalance.tokenA, tokenA.decimals);
                        tradeEntry.outAmount = toDecimal(cache.currentBalance.tokenA, tokenA.decimals);
                        tradeEntry.profit = calculateProfit(
                            String(cache.lastBalance.tokenA),
                        cache.tradeHistory.push(tradeEntry);
                        return txresult;
                    } else {
                        retry(new Error("Transaction not posted yet... Retrying..."));
                    }
                } else if (err2 == 2) {
                } else {
                    retry(new Error("Transaction not posted yet. Retrying..."));
            };
            const lookresult = await promiseRetry(fetcher, {
                retries: retries,
                minTimeout: 1000,
                maxTimeout: 4000,
                randomize: true,
            });
            if (lookresult == -1) {
                console.log("Lookup Shows Failed Transaction.");
            }
        } catch (error) {
            console.log("Fetch Result Error:", error);
