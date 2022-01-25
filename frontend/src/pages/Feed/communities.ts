import { uniqueId, kebabCase } from "lodash";

export const communities = [
  {
    id: uniqueId("comm-"),
    name: "Data Warehouse",
    get path() {
      return kebabCase(this.name.toLowerCase());
    }
  },
  {
    id: uniqueId("comm-"),
    name: "Business Enterprise",
    get path() {
      return kebabCase(this.name.toLowerCase());
    }
  },
  {
    id: uniqueId("comm-"),
    name: "Java Programming",
    get path() {
      return kebabCase(this.name.toLowerCase());
    }
  },
  {
    id: uniqueId("comm-"),
    name: "UI/UX",
    get path() {
      return kebabCase(this.name.toLowerCase());
    }
  }
];
