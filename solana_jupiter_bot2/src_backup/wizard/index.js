"use strict";

// check for .env file
import { checkForEnvFile } from "../utils.js";
checkForEnvFile();
import "dotenv".config();
import React from "react";
// create temp dir
import { createTempDir } from "../utils.js";
createTempDir();
// import components
import importJsx from "import-jsx";
const WizardProvider = importJsx("./WizardProvider");
const Layout = importJsx("./Components/Layout");
const App = () => {
	return (
		<WizardProvider>
			<Layout></Layout>
		</WizardProvider>
	);
};
export default App;
