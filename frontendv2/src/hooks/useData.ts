import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useToken } from ".";
import { fetcher } from "../utils";

export const useData = <Data>(key: string, config?: SWRConfiguration) => {
  const { token } = useToken();
  const [staleData, setStaleData] = useState<Data | null>(null);
  const { data, ...rest } = useSWR<Data, AxiosError>(
    token ? [key, token] : null,
    fetcher,
    config
  );

  useEffect(() => {
    if (data) setStaleData(data);
  }, [data]);

  return { data: staleData, ...rest };
};
