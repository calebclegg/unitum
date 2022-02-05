import axios from "axios";

export const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "<production-url>"
      : "http://localhost:5000/api/"
});
