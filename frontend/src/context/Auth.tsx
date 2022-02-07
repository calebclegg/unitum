import { AxiosError } from "axios";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../lib";
import { getRefreshToken, getUrl, saveRefreshToken } from "../utils";
import useSWR from "swr";

const fetcher = async (endpoint: string, token?: string) => {
  const { data } = await API.get(`${endpoint}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  return data;
};

interface IProviderProps {
  children: React.ReactNode;
}

interface IContextProps {
  token?: string;
  updateToken: () => void;
}

const AuthContext = createContext<IContextProps | null>(null);

const AuthProvider = ({ children }: IProviderProps) => {
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
      const refreshToken = getRefreshToken();
      return ["auth/token", refreshToken];
    },
    fetcher,
    {
      refreshInterval: 1000 * 60 * 60 * 9, // 9 minutes
      onSuccess: (data) => {
        if (isOnAuthPage) {
          navigate("/feed", { replace: true });
        }

        saveRefreshToken(data?.refreshToken);
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

  return (
    <AuthContext.Provider
      value={{ token: data?.accessToken, updateToken: mutate }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("`useAuth` was called without a Provider");
  }

  return context;
};

export default AuthProvider;
