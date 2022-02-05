export const saveRefreshToken = (token?: string) => {
  if (token) localStorage.setItem("refresh", token);
};
export const getRefreshToken = () => localStorage.getItem("refresh");
export const clearRefreshToken = () => localStorage.removeItem("refresh");
