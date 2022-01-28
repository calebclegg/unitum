import useSWR from "swr";
import { useState, useEffect } from "react";

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
  const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({ refreshToken: token })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

const useUser = () => {
  const { data: token } = useSWR<string>(
    ["auth/token", localStorage.getItem("token")],
    fetcher
  );

  const { data: user } = useSWR<IUser>(["users/me", token], fetcher);

  console.log({ token, user });

  return { user, token };
};

export default useUser;
