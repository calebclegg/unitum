import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, saveToken } from "../utils/store-token";
import { getUrl } from "../utils";

interface IEducation {
  school: {
    name: string;
    url?: string;
  };
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
}

interface IProfile {
  dob?: string;
  education?: IEducation[];
  unicoyn: number;
}

interface IUser {
  fullName: string;
  authProvider: string;
  email: string;
  profile: IProfile;
  number?: number[];
}

const fetcher = async (endpoint: string, token?: string) => {
  const { data } = await axios.get(`http://localhost:5000/api/${endpoint}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  return data;
};

const useUser = () => {
  const navigate = useNavigate();
  const isOnAuthPage = ["/register", "/login"].includes(
    window.location.pathname
  );
  const { data: tokens } = useSWR<
    {
      accessToken: string;
      refreshToken: string;
    },
    AxiosError
  >(
    () => {
      const refreshToken = getToken();
      return ["auth/token", refreshToken];
    },
    fetcher,
    {
      onSuccess: ({ refreshToken }) => {
        if (isOnAuthPage) {
          window.history.back();
        }

        saveToken(refreshToken);
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

  const { data: user } = useSWR<IUser>(
    tokens ? ["users/me", tokens?.accessToken] : null,
    fetcher
  );

  return { user, token: tokens?.accessToken };
};

export default useUser;
