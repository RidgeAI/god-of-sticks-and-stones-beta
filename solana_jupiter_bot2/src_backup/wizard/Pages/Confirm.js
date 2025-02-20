import React from "react";
import { Box, Text, useApp } from "ink";
import WizardContext from "../WizardContext.js";
import { useContext, useEffect, useState } from "react";
import { default: TextInput } from "ink-text-input";
import chalk from "chalk";
import { createConfigFile, verifyConfig } from "../../utils.js";

const Confirm = () => {
	const { exit } = useApp();
	const {
		config: {
			network: { value: network },
			rpc: { value: rpc },
			strategy: { value: strategy },
			tokens: { value: tokens },
			"trading size": { value: tradingSize },
			profit: { value: profit },
			slippage: { value: slippage },
			priority: { value: priority },
			advanced: { value: advanced },
		},
		config,
	} = useContext(WizardContext);
	const [isConfigOk, setIsConfigOk] = useState({
		result: false,
		badConfig: [],
	});
	useEffect(() => {
		setIsConfigOk(verifyConfig(config));
	}, []);
	return (
		<Box flexDirection="column">
			<Text>Confirm your settings:</Text>
			<Box margin={1} flexDirection="column">
				<Text>Network: {chalk.greenBright(network)}</Text>
				<Text>RPC: {chalk.greenBright(rpc)}</Text>
				<Text>Strategy: {chalk.bold.greenBright(strategy)}</Text>
				<Text>
					Tokens: {chalk.bold.blueBright(tokens.tokenA.symbol)} /{" "}
					{chalk.bold.blueBright(tokens.tokenB.symbol)}
				</Text>
					Trading size: {chalk.bold.greenBright(tradingSize.value)}{" "}
					{chalk.gray(tokens.tokenA.symbol)} |{" "}
					{chalk.greenBright(tradingSize.strategy)}
				<Text>Profit: {chalk.bold.greenBright(profit)}</Text>
				<Text>Slippage: {chalk.bold.greenBright(slippage)}</Text>
				<Text>Priority: {chalk.bold.greenBright(priority)}</Text>
				<Text color="gray"></Text>
					Min Interval: {chalk.bold.greenBright(advanced.minInterval)}
			</Box>
			{isConfigOk.result ? (
				<TextInput
					value={`${chalk.bold.greenBright("[ CONFIRM ]")}`}
					showCursor={false}
					onSubmit={async () => {
						createConfigFile(config);
						exit();
					}}
				/>
			) : (
					Error on step:{" "}
					{<Text color="red">{isConfigOk.badConfig.join(", ")}</Text>}
			)}
		</Box>
	);
};
export default Confirm;
