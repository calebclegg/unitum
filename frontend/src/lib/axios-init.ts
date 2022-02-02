import axios from "axios";

export const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://unitum.herokuapp.com/api/"
      : "http://localhost:5000/api/"
});
