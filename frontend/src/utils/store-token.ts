export const saveToken = (token?: string) =>
  token && localStorage.setItem("refresh", token);
export const getToken = () => localStorage.getItem("refresh");
