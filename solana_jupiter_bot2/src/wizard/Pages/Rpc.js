import React from "react";
import { Box, Text, useInput, Newline } from "ink";
import WizardContext from "../WizardContext.js";
import { useContext, useState } from "react";
import { default: SelectInput } from "ink-select-input";
import chalk from "chalk";

const Indicator = ({ label: selectedLabel, value: selectedValue }) => {
	const {
		config: {
			rpc: {
				value,
				state: { items },
			},
		},
	} = useContext(WizardContext);
	const isSelected = items.find(
		(item) => item.value === selectedValue
	).isSelected;
	return (
		<Text>
			{chalk[
				value?.includes(selectedValue)
					? "greenBright"
					: isSelected
					? "white"
					: "gray"
			](`${isSelected ? "⦿" : "○"} ${selectedLabel}`)}
		</Text>
	);
};
function Rpc() {
			rpc: { state },
		configSetValue,
		configSwitchState,
	const items = state?.items || [];
	const handleSelect = () => {
		const valueToSet = items
			.filter((item) => item.isSelected)
			.map((item) => item.value);
		configSetValue("rpc", valueToSet);
	};
	const [highlightedItem, setHighlightedItem] = useState();
	useInput((input) => {
		if (input === " " && highlightedItem) {
			configSwitchState("rpc", highlightedItem.value);
		}
	});
	const handleHighlight = (item) => setHighlightedItem(item);
		<Box flexDirection="column">
			<Text>Please select at least one RPC.</Text>
			<Text>
				If You choose more, You can switch between them while the bot is
				running.
			</Text>
			<Newline />
			<SelectInput
				items={items}
				onHighlight={handleHighlight}
				onSelect={handleSelect}
				itemComponent={Indicator}
			/>
		</Box>
}
export default Rpc;
