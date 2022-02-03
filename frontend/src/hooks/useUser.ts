import { useNavigate } from "react-router-dom";
import { clearToken } from "../utils/store-token";
import { fetcher } from "../utils";
import { useData, useToken } from ".";

interface IUser {
  _id: string;
  email: string;
  profile: {
    _id: string;
    picture: string;
    fullName: string;
    schoolWork: string[];
    communities: any[];
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
  const { token, updateToken } = useToken();

  const { data: user, mutate: updateUser } = useData<IUser | null>("users/me", {
    revalidateOnFocus: false
  });

  const logout = async () => {
    await fetcher("auth/logout", token);
    updateToken(null);
    updateUser(null);
    clearToken();
    navigate("/login");
  };

  const { data: notifications } = useData<any>("users/me/notifications", {
    revalidateOnFocus: false
  });

  return { user, notifications, logout };
};
