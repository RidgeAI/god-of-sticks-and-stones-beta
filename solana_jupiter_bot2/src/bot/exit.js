import fs from "fs";
import chalk from "chalk";
import cache from "./cache.js";

export const logExit = (code = 0, error) => {
	if (code === 0) {
		console.log(chalk.black.bgMagentaBright.bold(error.message));
	} else if (code === 1) {
		if (error?.message) {
			console.log(chalk.black.bgRedBright("ERROR: " + chalk.bold(error.message)));
		}
		if (error?.stack) {
			console.log(chalk.redBright(error.stack));
		if (cache?.isSetupDone) {
			console.log(
				chalk.black.bgYellowBright(
					"Closing connections... ",
					chalk.bold("WAIT! ")
				)
			);
			console.log(chalk.yellowBright.bgBlack("Press [Ctrl]+[C] to force exit"));
	}
};
export const handleExit = () => {
	try {
		console.log(
			chalk.black.bgMagentaBright(
				`\n Exit time:  ${chalk.bold(new Date().toLocaleString())} `
			)
		);
		const saveToFile = (filePath, data, successMsg, errorMsg) => {
			try {
				fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
				console.log(chalk.black.bgGreenBright(` > ${successMsg} ${chalk.bold(filePath)} `));
			} catch (error) {
				console.log(chalk.black.bgRedBright(` X ${errorMsg} ${chalk.bold(filePath)} `));
			}
		};
		saveToFile("./temp/cache.json", cache, "Cache saved to", "Error saving cache to");
		saveToFile("./temp/tradeHistory.json", cache.tradeHistory, "Trade history saved to", "Error saving trade history to");
		console.log(chalk.black.bgMagentaBright.bold(" Exit Done! \n"));
	} catch (error) {
		console.error(chalk.redBright("Unhandled error during exit:"), error);
