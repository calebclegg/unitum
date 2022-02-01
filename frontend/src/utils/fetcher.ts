import { API } from "../lib";

export const fetcher = async (endpoint: string, token?: string) => {
  const { data } = await API.get(`${endpoint}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  return data;
};
