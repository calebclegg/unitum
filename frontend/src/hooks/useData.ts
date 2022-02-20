import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useAuth } from "../context/Auth";
import { fetcher } from "../utils";

export const useData = <Data>(
  key: string | null,
  config?: SWRConfiguration
) => {
  const { token } = useAuth();
  const [staleData, setStaleData] = useState<Data | null>(null);
  const { data, ...rest } = useSWR<Data, AxiosError>(
    token && key ? [key, token] : null,
    fetcher,
    config
  );

  useEffect(() => {
    if (data) setStaleData(data);
  }, [data]);

  return { data: staleData, ...rest };
};
