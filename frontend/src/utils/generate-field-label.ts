import { capitalize } from "@mui/material";

export const generateFieldLabel = (fieldName: string) =>
  capitalize(
    fieldName
      .split("")
      .map((char) => (char !== char.toLowerCase() ? ` ${char}` : char))
      .join("")
  );
