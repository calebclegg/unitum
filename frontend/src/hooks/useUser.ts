import { IProps as IPost } from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { clearRefreshToken } from "../utils";
import { fetcher } from "../utils";
import { useData } from ".";
import { useAuth } from "../context/Auth";

export interface ICommunity {
  _id: string;
  name: string;
  picture: string;
  description: string;
  numberOfMembers: number;
  postCount: number;
  createdAt: string;
  admin: {
    _id: string;
  };
  members: {
    info: IUser;
    role: string;
  }[];
}

export interface IUser {
  _id: string;
  email: string;
  profile: {
    _id: string;
    picture: string;
    fullName: string;
    schoolWork: string[];
    communities: ICommunity[];
    dob: string;
    unicoyn: string;
    education: {
      _id: string;
      startDate: string;
      fieldOfStudy: string;
      school: {
        _id: string;
        name: string;
        url: string;
      };
      endDate: string;
      degree: string;
      grade: string;
    };
  };
}

export interface INotification {
  _id: string;
  createdAt: string;
  post?: IPost;
  community?: ICommunity;
  type: "like" | "comment" | "post";
  user: IUser;
}

export const useUser = () => {
  const navigate = useNavigate();
  const { token, updateToken } = useAuth();

  const { data: user, mutate: updateUser } = useData<IUser | null>("users/me", {
    revalidateOnFocus: false
  });

  const logout = async () => {
    clearRefreshToken();
    await fetcher("auth/logout", token);
    updateToken();
    updateUser(null);
    navigate("/login");
  };

  const { data: notifications } = useData<INotification[]>(
    "users/me/notifications",
    {
      revalidateOnFocus: false
    }
  );

  return { user, updateUser, notifications, logout };
};
