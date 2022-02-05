import { AlertColor } from "@mui/material";
import { TState } from "./get-url";

export const getAlertTypeFromCondition = (
  condition: NonNullable<TState>["condition"]
) => condition.split("-")[1] as AlertColor;
