import React from "react";
import { Box, Text } from "ink";

const EscNotification = () => {
	return (
		<Box paddingTop={1}>
			<Text dimColor color="yellow">
				Use <Text bold>ESC</Text> key if U wanna exit
			</Text>
		</Box>
	);
};
export default EscNotification;
