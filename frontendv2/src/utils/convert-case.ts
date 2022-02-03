import { capitalize } from "@mui/material";

export const camelToCapitalized = (fieldName: string) =>
  capitalize(
    fieldName
      .split("")
      .map((char) => (char !== char.toLowerCase() ? ` ${char}` : char))
      .join("")
  );

export const kebabToRegular = (fieldName: string) =>
  fieldName.replaceAll("-", " ");

export const kebabToCapitalized = (fieldName: string) =>
  fieldName
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
