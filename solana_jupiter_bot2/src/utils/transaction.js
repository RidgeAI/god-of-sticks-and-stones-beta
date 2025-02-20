import "dotenv/config";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { setTimeout } from "timers/promises";
import cache from "../bot/cache.js";
import { loadConfigFile, toNumber, calculateProfit, toDecimal } from "../utils/index.js";

cache.config = loadConfigFile({ showSpinner: true });
// Adding a backup option for the transaction lookup
const rpc_main = cache.config.rpc[0];
const rpc_backup = "https://api.mainnet-beta.solana.com";
// Key variables
let transstatus = 0;
let transid = "";
let transresp = [];
const WAIT_ERROR_CODE = 1;
const WAIT_SUCCESS_CODE = 0;
const waitabit = async (ms) => {
	try {
		await setTimeout(ms);
		console.log("Waited for", ms, "milliseconds.");
		return WAIT_SUCCESS_CODE;
	} catch (error) {
		console.error("Error occurred while waiting:", error);
		return WAIT_ERROR_CODE;
	}
};
// Main RPC
const connection = new Connection(rpc_main, {
	disableRetryOnRateLimit: true,
	commitment: "confirmed",
});
// Backup RPC
const connection_backup = new Connection(rpc_backup, {
	disableRetryOnRateLimit: false,
const fetchTransaction = async (rpcConnection, transaction) => {
		return await rpcConnection.getParsedTransaction(transaction, {
			maxSupportedTransactionVersion: 0,
		});
		console.error("Error fetching transaction:", error);
		return null;
const checkTransactionStatus = async (transaction, wallet_address) => {
		const primaryTransaction = await fetchTransaction(connection, transaction);
		if (!primaryTransaction) {
			// If primary RPC fails, try backup RPC
			return await fetchTransaction(connection_backup, transaction);
		}
		return primaryTransaction;
		console.error("Error checking transaction status:", error);
const checktrans = async (txid, wallet_address) => {
		transresp = await checkTransactionStatus(txid, wallet_address);
		if (transresp) {
			let transaction_changes = {};
			if (transresp.meta?.status.Err) {
				// Failed Transaction
				return [transresp.meta.status.err, 2];
			} else {
				transstatus = 1;
			}
			if (!transresp.meta.postTokenBalances || transresp.meta.postTokenBalances.length === 0) {
				return [null, WAIT_ERROR_CODE];
			let tokenamt = 0;
			let tokendec = 0;
			// Outgoing SOL native management
			if (transresp.meta.innerInstructions) {
				for (let instructions of transresp.meta.innerInstructions) {
					if (instructions.instructions) {
						for (let parsed of instructions.instructions) {
							if (parsed.parsed) {
								if (parsed.parsed.type === "transferChecked") {
									if (
										parsed.parsed.info.authority === wallet_address &&
										parsed.parsed.info.mint === "So11111111111111111111111111111111111111112"
									) {
										tokenamt = Number(parsed.parsed.info.tokenAmount.amount);
										tokendec = parsed.parsed.info.tokenAmount.decimals;
									}
								}
							}
						}
					}
				}
			// SOL Transfer handling
			if (tokenamt > 0) {
				transaction_changes["So11111111111111111111111111111111111111112"] = {
					status: transstatus,
					start: tokenamt,
					decimals: tokendec,
					end: 0,
					change: -1 * tokenamt,
				};
			// Pre Token Balance Handling
			for (let token of transresp.meta.preTokenBalances) {
				if (token.owner === wallet_address) {
					transaction_changes[token.mint.toString()] = {
						status: transstatus,
						start: token.uiTokenAmount.amount,
						decimals: token.uiTokenAmount.decimals,
					};
			// Post Token Handling
			for (let token of transresp.meta.postTokenBalances) {
					let prevData = transaction_changes[token.mint] || {
						start: 0,
					let diff = Number(token.uiTokenAmount.amount) - Number(prevData.start);
					transaction_changes[token.mint] = {
						...prevData,
						end: token.uiTokenAmount.amount,
						change: diff,
			return [transaction_changes, WAIT_SUCCESS_CODE];
		} else {
			// Transaction not found or error occurred
			return [null, WAIT_ERROR_CODE];
		console.error("Error checking transaction:", error);
		return [null, WAIT_ERROR_CODE];
export { checktrans };
