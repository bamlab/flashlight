import { createContext, Dispatch } from "react";
import { Action } from "../reducers/percentageReducer";

export const PercentageContext = createContext(0);
export const PercentageDispatchContext = createContext<Dispatch<Action>>(
  () => null
);
