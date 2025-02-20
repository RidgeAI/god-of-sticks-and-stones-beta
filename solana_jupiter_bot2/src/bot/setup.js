import fs from "fs";
import chalk from "chalk";
import ora from "ora-classic";
import bs58 from "bs58";
import { Jupiter } from "@jup-ag/core";
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import JSBI from "jsbi";
import invariant from "tiny-invariant";
import _Decimal from "decimal.js";
import _Big from "big.js";
import toFormat from "toformat";
import anchor from "@project-serum/anchor";
import { logExit } from "./exit.js";
import { loadConfigFile, toDecimal } from "../utils.js";
import { intro, listenHotkeys } from "./ui.js";
import { setTimeout } from "timers/promises.js";
import cache from "./cache.js";
const wrapUnwrapSOL = cache.wrapUnwrapSOL;
// Account balance code
const balanceCheck = async (checkToken) => {
	let checkBalance = Number(0);
	let t = Number(0);
	const connection = new Connection(process.env.DEFAULT_RPC);
	wallet = Keypair.fromSecretKey(
		bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
	);
	if (
		wrapUnwrapSOL &&
		checkToken.address === "So11111111111111111111111111111111111111112"
	) {
		// This is where Native balance is needing to be checked and not the Wrapped SOL ATA
		try {
			const balance = await connection.getBalance(wallet.publicKey);
			checkBalance = Number(balance);
		} catch (error) {
			console.error("Error fetching native SOL balance:", error);
		}
	} else {
		// Normal token so look up the ATA balance(s)
			let totalTokenBalance = BigInt(0);
			const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
				wallet.publicKey,
				{
					mint: new PublicKey(checkToken.address),
				}
			);
			tokenAccounts.value.forEach((accountInfo) => {
				const parsedInfo = accountInfo.account.data.parsed.info;
				totalTokenBalance += BigInt(parsedInfo.tokenAmount.amount);
			});
			// Convert totalTokenBalance to a regular number
			checkBalance = Number(totalTokenBalance);
			console.error("Error fetching token balance:", error);
	}
	try {
		// Pass back the BN version to match
		let checkBalanceUi = toDecimal(checkBalance, checkToken.decimals);
		console.log(
			`Wallet balance for ${checkToken.symbol} is ${checkBalanceUi} (${checkBalance})`
		);
	} catch (error) {
		console.error("Silence is golden.. Or not...:", error);
	if (checkBalance > Number(0)) {
		return checkBalance;
		return Number(0);
};
// Handle Balance Errors Messaging
const checkTokenABalance = async (tokenA, initialTradingBalance) => {
		// Check the balance of TokenA to make sure there is enough to trade with
		var realbalanceTokenA = await balanceCheck(tokenA);
		bal1 = toDecimal(realbalanceTokenA, tokenA.decimals);
		bal2 = toDecimal(initialTradingBalance, tokenA.decimals);
		if (realbalanceTokenA < initialTradingBalance) {
			throw new Error(`\x1b[93mThere is insufficient balance in your wallet of ${tokenA.symbol}\x1b[0m
			\nYou currently only have \x1b[93m${bal1}\x1b[0m ${tokenA.symbol}.
			\nTo run the bot you need \x1b[93m${bal2}\x1b[0m ${tokenA.symbol}.
			\nEither add more ${tokenA.symbol} to your wallet or lower the amount below ${bal1}.\n`);
		return realbalanceTokenA;
		// Handle errors gracefully
		console.error(
			`\n====================\n\n${error.message}\n====================\n`
		// Return an appropriate error code or rethrow the error if necessary
		process.exit(1); // Exiting with a non-zero code to indicate failure
const setup = async () => {
	let spinner, tokens, tokenA, tokenB, wallet;
		// listen for hotkeys
		listenHotkeys();
		await intro();
		// load config file and store it in cache
		cache.config = loadConfigFile({ showSpinner: false });
		spinner = ora({
			text: "Loading tokens...",
			discardStdin: false,
			color: "magenta",
		}).start();
			tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
			tokenA = tokens.find((t) => t.address === cache.config.tokenA.address);
			if (cache.config.tradingStrategy !== "arbitrage")
				tokenB = tokens.find((t) => t.address === cache.config.tokenB.address);
			spinner.text = chalk.black.bgRedBright(
				`\n	Loading tokens failed!\n	Please run the Wizard to generate it using ${chalk.bold(
					"`yarn start`"
				)}\n`
			throw error;
			spinner.text = "Checking wallet...";
			if (
				!process.env.SOLANA_WALLET_PRIVATE_KEY ||
				(process.env.SOLANA_WALLET_PUBLIC_KEY &&
					process.env.SOLANA_WALLET_PUBLIC_KEY?.length !== 88)
			) {
				throw new Error("Wallet check failed!");
			} else {
				wallet = Keypair.fromSecretKey(
					bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
				);
			}
				`\n	Wallet check failed! \n	Please make sure that ${chalk.bold(
					"SOLANA_WALLET_PRIVATE_KEY "
				)}\n	inside ${chalk.bold(".env")} file is correct \n`
			logExit(1, error);
			process.exitCode = 1;
		// Set up the RPC connection
		const connection = new Connection(cache.config.rpc[0]);
		spinner.text = "Loading the Jupiter V4 SDK and getting ready to trade...";
		const jupiter = await Jupiter.load({
			connection,
			cluster: cache.config.network,
			user: wallet,
			restrictIntermediateTokens: false,
			shouldLoadSerumOpenOrders: false,
			wrapUnwrapSOL: cache.wrapUnwrapSOL,
			ammsToExclude: {
				Aldrin: false,
				Crema: false,
				Cropper: true,
				Cykura: true,
				DeltaFi: false,
				GooseFX: true,
				Invariant: false,
				Lifinity: false,
				"Lifinity V2": false,
				Marinade: false,
				Mercurial: false,
				Meteora: false,
				Raydium: false,
				"Raydium CLMM": false,
				Saber: false,
				Serum: true,
				Orca: false,
				Step: false,
				Penguin: false,
				Saros: false,
				Stepn: true,
				"Orca (Whirlpools)": false,
				Sencha: false,
				"Saber (Decimals)": false,
				Dradex: true,
				Balansol: true,
				Openbook: false,
				"Marco Polo": false,
				Oasis: false,
				BonkSwap: false,
				Phoenix: false,
				Symmetry: true,
				Unknown: true,
			},
		});
		cache.isSetupDone = true;
		spinner.succeed(
			"Checking to ensure you are ARB ready...\n====================\n"
		return { jupiter, tokenA, tokenB, wallet };
		if (spinner)
			spinner.fail(
				chalk.bold.redBright(`Setting up failed!\n 	${spinner.text}`)
		logExit(1, error);
		process.exitCode = 1;
const getInitialotherAmountThreshold = async (
	jupiter,
	inputToken,
	outputToken,
	amountToTrade
) => {
	let spinner;
		const tokenDecimals = cache.sideBuy
			? inputToken.decimals
			: outputToken.decimals;
		const spinnerText = `Computing routes for the token with amountToTrade ${amountToTrade} with decimals ${tokenDecimals}`;
			text: spinnerText,
		//JSBI AMT to TRADE
		const amountInJSBI = JSBI.BigInt(amountToTrade);
		// compute routes for the first time
		const routes = await jupiter.computeRoutes({
			inputMint: new PublicKey(inputToken.address),
			outputMint: new PublicKey(outputToken.address),
			amount: amountInJSBI,
			slippageBps: 0,
			forceFetch: true,
			onlyDirectRoutes: false,
			filterTopNResult: 1,
		if (routes?.routesInfos?.length > 0) spinner.succeed("Routes computed!");
		else
				"No routes found. Something is wrong! Check tokens:" +
					inputToken.address +
					" " +
					outputToken.address
		return routes.routesInfos[0].otherAmountThreshold;
			spinner.fail(chalk.bold.redBright("Computing routes failed!\n"));
export { setup, getInitialotherAmountThreshold, balanceCheck, checkTokenABalance };
