import axios from "axios";

export const fetcher = async (endpoint: string) =>
  await (
    await axios.get(`https://jsonplaceholder.typicode.com/${endpoint}`)
  ).data;
