import useSWR from "swr";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, saveToken } from "../utils/store-token";
import { getUrl, fetcher } from "../utils";

export const useToken = () => {
  const navigate = useNavigate();
  const isOnAuthPage = ["/register", "/login"].includes(
    window.location.pathname
  );

  const { data, mutate } = useSWR<
    {
      accessToken: string;
      refreshToken: string;
    } | null,
    AxiosError
  >(
    () => {
      const refreshToken = getToken();
      return ["auth/token", refreshToken];
    },
    fetcher,
    {
      onSuccess: (data) => {
        if (isOnAuthPage) {
          navigate("/feed", { replace: true });
        }

        saveToken(data?.refreshToken);
      },
      onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
        if (error.response?.status === 400 || retryCount >= 10) return;

        setTimeout(() => revalidate({ retryCount }), 5000);
      },
      onError: () => {
        if (!isOnAuthPage) {
          navigate("/login", {
            replace: true,
            state: {
              condition: "auth-error",
              from: getUrl()
            }
          });
        }
      }
    }
  );

  return { token: data?.accessToken, updateToken: mutate };
};
