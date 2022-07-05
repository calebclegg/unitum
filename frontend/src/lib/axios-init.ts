import axios from "axios";

export const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_URL
      : "http://localhost:5000/api/"
});
