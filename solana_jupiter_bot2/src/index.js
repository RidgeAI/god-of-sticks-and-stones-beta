import chalk from "chalk";
import fs from "fs";
import ora from "ora-classic";
import { logExit } from "./bot/exit.js";
import dotenv from "dotenv";
import { checkForEnvFile, checkWallet } from "./utils.js";

dotenv.config();
const createTempDir = () => {
    if (!fs.existsSync("./temp")) {
        fs.mkdirSync("./temp");
    }
};
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        } else if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
const storeItInTempAsJSON = (filename, data) => {
    fs.writeFileSync(
        `./temp/${filename}.json`,
        JSON.stringify(data, getCircularReplacer(), 2)
    );
const createConfigFile = (config) => {
    const configSpinner = ora("Creating config...").start();
    const configValues = {
        network: config.network.value,
        rpc: config.rpc.value,
        tradingStrategy: config.strategy.value,
        tokenA: config.tokens.value.tokenA,
        tokenB: config.tokens.value.tokenB,
        slippage: config.slippage.value,
        adaptiveSlippage: config?.adaptiveslippage?.value ?? 0,
        priority: config.priority.value,
        minPercProfit: config.profit.value,
        minInterval: parseInt(config.advanced.value.minInterval),
        tradeSize: {
            value: parseFloat(config["trading size"].value.value),
            strategy: config["trading size"].value.strategy,
        },
        ui: { defaultColor: "cyan" },
        storeFailedTxInHistory: true,
    fs.writeFileSync("./config.json", JSON.stringify(configValues, null, 2));
    configSpinner.succeed("Config created!");
const loadConfigFile = () => {
    if (!fs.existsSync("./config.json")) {
        throw new Error("No config.json file found!");
    return JSON.parse(fs.readFileSync("./config.json"));
const calculateProfit = (oldVal, newVal) => ((newVal - oldVal) / oldVal) * 100;
const toDecimal = (number, decimals) =>
    parseFloat((number / 10 ** decimals).toFixed(decimals));
const toNumber = (number, decimals) =>
    Math.floor(number * 10 ** decimals);
const updateIterationsPerMin = (cache) => {
    const iterationTimer = (performance.now() - cache.iterationPerMinute.start) / 1000;
    if (iterationTimer >= 60) {
        cache.iterationPerMinute.value = cache.iterationPerMinute.counter;
        cache.iterationPerMinute.start = performance.now();
        cache.iterationPerMinute.counter = 0;
    } else {
        cache.iterationPerMinute.counter++;
const checkRoutesResponse = (routes) => {
    if (!routes?.routesInfos?.length) {
        console.log(routes);
        logExit(1, { message: "No routes found or something is wrong with RPC / Jupiter!" });
        process.exit(1);
export {
    createTempDir,
    storeItInTempAsJSON,
    createConfigFile,
    loadConfigFile,
    calculateProfit,
    toDecimal,
    toNumber,
    updateIterationsPerMin,
    checkRoutesResponse,
    checkForEnvFile,
    checkWallet,
