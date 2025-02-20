"use strict";
import React from "react";
import { Box, Text } from "ink";
import WizardContext from "../WizardContext.js";
import { useContext, useState, useEffect, useRef } from "react";
import { default: SelectInput } from "ink-select-input";
import chalk from "chalk";
import { default: axios } from "axios";
import { TOKEN_LIST_URL } from "@jup-ag/core.js";
import { default: TextInput } from "ink-text-input";
import fs from "fs";

function Tokens() {
	let isMountedRef = useRef(false);
	const {
		config: {
			strategy: { value: strategy },
			network: { value: network },
			tokens: { value: tokensValue, isSet: tokensIsSet },
		},
		configSetValue,
	} = useContext(WizardContext);
	const [tokens, setTokens] = useState([]);
	const [autocompleteTokens, setAutocompleteTokens] = useState([]);
	const [tempTokensValue, setTempTokensValue] = useState(tokensValue);
	const handleSubmit = (tokenId, selectedToken) => {
		// go to the next step only if all tokens are set
		let goToNextStep = true;
		tokensIsSet[tokenId] = true;
		tokensValue[tokenId] = {
			symbol: selectedToken.label,
			address: selectedToken.value,
		};
		if (strategy === "arbitrage") {
			tokensIsSet.tokenB = true;
		}
		if (strategy === "pingpong" && tokenId === "tokenA") {
			goToNextStep = false;
		configSetValue(
			"tokens",
			{
				value: tokensValue,
				isSet: tokensIsSet,
			},
			goToNextStep
		);
	};
	const handleTokenChange = (tokenId, value) => {
		if (!isMountedRef.current) return;
		const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
		const filteredTokens = tokens
			.map((t) => ({
				label: t.symbol,
				value: t.address,
			}))
			.filter((t) =>
				t.label.toLowerCase().includes(sanitizedValue.toLowerCase())
			);
		if (isMountedRef.current) {
			setAutocompleteTokens(filteredTokens);
			setTempTokensValue({
				...tempTokensValue,
				[tokenId]: {
					symbol: sanitizedValue,
				},
			});
	if (network === "") {
		return (
			<Box>
				<Text>
					Plese select <Text color="magenta">network</Text> first!
				</Text>
			</Box>
	}
	useEffect(() => {
		// check if tokens.json exist
		if (fs.existsSync("./tokens.json")) {
			const tokensFromFile = JSON.parse(fs.readFileSync("./config.json"));
			tokens.tokensFromFile?.length > 0 && setTokens(tokensFromFile);
		} else {
			axios.get(TOKEN_LIST_URL[network]).then((res) => {
				isMountedRef.current && setTokens(res.data);
				// save tokens to tokens.json file
				fs.writeFileSync(
					"./temp/tokens.json",
					JSON.stringify(res.data, null, 2)
				);
	}, []);
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	return (
		<Box flexDirection="column">
			<Text>
				Set tokens for Your strategy. There is{" "}
				{tokens
					? chalk.magenta(tokens.length)
					: chalk.yellowBright("loading...")}{" "}
				tokens available.
			</Text>
			<Text color="gray">Type token symbol and use arrows to select</Text>
			<Box margin={1} flexDirection="column">
					Token A:{" "}
					{!tokensIsSet.tokenA ? (
						<Text color="yellowBright">
							<TextInput
								value={tempTokensValue.tokenA.symbol.toString() || ""}
								onChange={(tokenSymbol) =>
									handleTokenChange("tokenA", tokenSymbol)
								}
								placeholder="USDC"
							/>
						</Text>
					) : (
						<Text color="greenBright" bold>
							{tokensValue.tokenA.symbol}
					)}
				<Box>
					{!tokensIsSet.tokenA &&
						tempTokensValue?.tokenA?.symbol?.length > 1 && (
							<SelectInput
								items={autocompleteTokens}
								limit={4}
								onSelect={(tokenSymbol) => handleSubmit("tokenA", tokenSymbol)}
						)}
				</Box>
				{strategy === "pingpong" && (
					<>
						<Text>
							Token B:{" "}
							{tokensIsSet.tokenA && !tokensIsSet.tokenB ? (
								<Text color="yellowBright">
									<TextInput
										value={tempTokensValue.tokenB.symbol.toString() || ""}
										onChange={(tokenSymbol) =>
											handleTokenChange("tokenB", tokenSymbol)
										}
										placeholder="ARB"
									/>
								</Text>
							) : (
								<Text color="greenBright" bold>
									{tokensValue.tokenB.symbol}
							)}
						<Box>
							{!tokensIsSet.tokenB &&
								tempTokensValue.tokenB?.symbol?.length > 1 && (
									<SelectInput
										items={autocompleteTokens.filter(
											(t) => t.label !== tokensValue.tokenA.symbol
										)}
										limit={4}
										onSelect={(tokenSymbol) =>
											handleSubmit("tokenB", tokenSymbol)
								)}
						</Box>
					</>
				)}
		</Box>
	);
}
export default Tokens;
