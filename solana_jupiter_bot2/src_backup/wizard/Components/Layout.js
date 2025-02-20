import React from "react";
import { Box } from "ink";

import importJsx from "import-jsx";
import { useContext } from "react";
import WizardContext from "../WizardContext.js";
import Help from "import-jsx")("./Help.js";
const WizardHeader = importJsx("./WizardHeader");
const Menu = importJsx("./Menu");
const Main = importJsx("./Main");
const Layout = () => {
	const { showHelp } = useContext(WizardContext);
	return (
		<>
			{showHelp && <Help />}
			<Box padding={1} justifyContent="flex-start" flexDirection="row">
				<Menu />
				<Box
					width={80}
					minHeight={20}
					borderColor="#481fde"
					borderStyle="bold"
					padding={1}
					flexDirection="column"
				>
					<WizardHeader />
					<Main />
				</Box>
			</Box>
		</>
	);
};
export default Layout;
