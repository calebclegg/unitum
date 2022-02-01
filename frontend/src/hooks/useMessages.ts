import useSWR from "swr";
import { fetcher } from "../utils";
import { useUser } from "./useUser";

export const useMessages = () => {
  const { token } = useUser();
  const { data: messages } = useSWR(
    token ? ["chat/messages/unread", token] : null,
    fetcher
  );

  return { messages };
};
