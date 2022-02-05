import { useNavigate } from "react-router-dom";
import { clearRefreshToken } from "../utils";
import { fetcher } from "../utils";
import { useData } from ".";
import { useAuth } from "../context/Auth";

interface IUser {
  _id: string;
  email: string;
  profile: {
    _id: string;
    picture: string;
    fullName: string;
    schoolWork: string[];
    communities: Record<string, any>[];
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
  const { updateToken } = useAuth();

  const { data: user, mutate: updateUser } = useData<IUser | null>("users/me", {
    revalidateOnFocus: false
  });

  const logout = async () => {
    clearRefreshToken();
    await fetcher("auth/logout");
    updateToken();
    updateUser(null);
    navigate("/login");
  };

  const { data: notifications } = useData<any>("users/me/notifications", {
    revalidateOnFocus: false
  });

  return { user, notifications, logout };
};