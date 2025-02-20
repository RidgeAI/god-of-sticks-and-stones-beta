import { createContext } from "react";
import { initialState } from "./reducer.js";

const WizardContext = createContext(initialState);
export default WizardContext;
