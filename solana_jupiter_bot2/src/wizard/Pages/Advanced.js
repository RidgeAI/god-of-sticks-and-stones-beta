import React from "react";
import { Box, Text } from "ink";
import { useContext, useState, useRef, useEffect } from "react";
import WizardContext from "../WizardContext.js";
import { default: TextInput } from "ink-text-input";

function Advanced() {
	let isMountedRef = useRef(false);
	const {
		config: {
			advanced: { value: advancedValue, isSet: advancedIsSet },
		},
		configSetValue,
	} = useContext(WizardContext);
	const [tempAdvancedValue, setTempAdvancedValue] = useState(advancedValue);
	const handleSubmit = (key, value) => {
		configSetValue("advanced", {
			value: {
				...advancedValue,
				[key]: value,
			},
			isSet: {
				...advancedIsSet,
				[key]: true,
		});
	};
	const handleMinIntervalChange = (value) => {
		if (!isMountedRef.current) return;
		setTempAdvancedValue({
			...tempAdvancedValue,
			minInterval: value,
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	}, []);
	return (
		<Box flexDirection="column">
			<Text color="gray">
				Advanced settings can be crucial for strategy efficiency.
			</Text>
				Please make sure you know what you are doing before changing these
				settings.
			<Box flexDirection="row" marginTop={1}>
				<Text>
					Min Interval:{" "}
					{!advancedIsSet.minInterval ? (
						<Text color="yellowBright">
							<TextInput
								value={
									tempAdvancedValue?.minInterval
										? tempAdvancedValue.minInterval.toString()
										: ""
								}
								onChange={handleMinIntervalChange}
								onSubmit={(value) => {
									handleSubmit("minInterval", value);
								}}
							/>
						</Text>
					) : (
						<Text color="greenBright">{tempAdvancedValue?.minInterval}</Text>
					)}
				</Text>
			</Box>
		</Box>
	);
}
export default Advanced;
