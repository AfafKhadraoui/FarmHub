// Auth helper functions
export const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
