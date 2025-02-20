import React from "react";
import { Box, Text } from "ink";
import WizardContext from "../WizardContext.js";
import { useContext } from "react";
import { default: SelectInput } from "ink-select-input";
import chalk from "chalk";

const TRADING_STRATEGIES = [
	{ label: "Ping Pong", value: "pingpong" },
	{ label: "Arbitrage", value: "arbitrage" },
];
const Indicator = ({ label, value }) => {
	const {
		config: {
			strategy: { value: selectedValue },
		},
	} = useContext(WizardContext);
	const isSelected = value === selectedValue;
	return <Text>{chalk[isSelected ? "greenBright" : "white"](`${label}`)}</Text>;
};
function Strategy() {
	const { configSetValue } = useContext(WizardContext);
	const handleTradingStrategySelect = (strategy) => {
		configSetValue("strategy", strategy.value);
	};
	return (
		<Box flexDirection="column">
			<Text>Select Trading Strategy:</Text>
			<Box margin={1}>
				<SelectInput
					items={TRADING_STRATEGIES}
					itemComponent={Indicator}
					onSelect={handleTradingStrategySelect}
				/>
			</Box>
		</Box>
	);
}
export default Strategy;
