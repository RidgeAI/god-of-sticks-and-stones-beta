import React from "react";
import { Box, Text } from "ink";
import WizardContext from "../WizardContext.js";
import { useContext } from "react";
import { default: SelectInput } from "ink-select-input";
import chalk from "chalk";

const NETWORKS = [{ label: "mainnet-beta", value: "mainnet-beta" }];
const Indicator = ({ label, value }) => {
	const {
		config: {
			network: { value: selectedValue },
		},
	} = useContext(WizardContext);
	const isSelected = value == selectedValue;
	return <Text>{chalk[isSelected ? "greenBright" : "white"](`${label}`)}</Text>;
};
function Network() {
	const { configSetValue } = useContext(WizardContext);
	return (
		<Box flexDirection="column">
			<Text>
				Select Solana <Text color="magenta">Network</Text>:
			</Text>
			<Box margin={1}>
				<SelectInput
					items={NETWORKS}
					onSelect={(item) => configSetValue("network", item.value)}
					itemComponent={Indicator}
				/>
			</Box>
		</Box>
	);
}
export default Network;
