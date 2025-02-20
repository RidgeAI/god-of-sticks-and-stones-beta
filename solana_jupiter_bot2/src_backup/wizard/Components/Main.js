import React from "react";
import { Box } from "ink";
import WizardContext from "../WizardContext.js";
import { useContext } from "react";
import importJsx from "import-jsx";
import Divider from "ink-divider";
const Router = importJsx("./Router");

function Main() {
	const { nav } = useContext(WizardContext);
	return (
		<Box flexDirection="column">
			<Divider title={nav.steps[nav.currentStep]} />
			<Box marginY={1}>
				<Router />
			</Box>
		</Box>
	);
}
export default Main;
