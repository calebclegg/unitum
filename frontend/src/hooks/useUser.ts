import useSWR from "swr";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { clearToken, getToken, saveToken } from "../utils/store-token";
import { getUrl, fetcher } from "../utils";

interface IUser {
  _id: string;
  email: string;
  profile: {
    _id: string;
    fullName: string;
    schoolWork: string[];
    communities: string[];
    dob: string;
    unicoyn: string;
    education: {
      _id: string;
      startDate: string;
      fieldOfStudy: string;
      school: {
        _id: string;
        name: string;
      };
    }[];
  };
}

export const useUser = () => {
  const navigate = useNavigate();
  const isOnAuthPage = ["/register", "/login"].includes(
    window.location.pathname
  );
  const { data: tokens, mutate: updateToken } = useSWR<
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

  const { data: user, mutate: updateUser } = useSWR<IUser | null>(
    tokens ? ["users/me", tokens?.accessToken] : null,
    fetcher
  );

  const logout = async () => {
    await fetcher("auth/logout", tokens?.accessToken);
    updateToken(null);
    updateUser(null);
    clearToken();
    navigate("/login");
  };

  const { data: notifications } = useSWR(
    ["users/me/notifications", tokens?.accessToken],
    fetcher
  );

  return { user, token: tokens?.accessToken, notifications, logout };
};
