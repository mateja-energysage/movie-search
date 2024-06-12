import { useState } from "react";

export default function useAuth() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("accessToken");
    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    sessionStorage.setItem("accessToken", userToken);
    setToken(userToken);
  };
  const removeToken = () => {
    sessionStorage.removeItem("accessToken");
    setToken(null);
  };

  return {
    setToken: saveToken,
    token: token,
    logout: removeToken,
  };
}
