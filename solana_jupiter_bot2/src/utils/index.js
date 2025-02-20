import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
export function checkForEnvFile() {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) {
        console.error(chalk.red("Missing .env file. Please create one."));
        process.exit(1);
    }
}
export function checkWallet() {
    if (!process.env.WALLET_PRIVATE_KEY) {
        console.error(chalk.red("WALLET_PRIVATE_KEY is missing in the .env file."));
export async function checkArbReady() {
    return new Promise((resolve, reject) => {
        if (process.env.ARB_ENABLED !== "true") {
            reject(new Error("Arbitrage is not enabled. Set ARB_ENABLED=true in .env"));
        } else {
            resolve(true);
        }
    });
export function logExit(code, error) {
    if (error) {
        console.error(chalk.black.bgRedBright(`\n${error.message}\n`));
    process.exit(code);
