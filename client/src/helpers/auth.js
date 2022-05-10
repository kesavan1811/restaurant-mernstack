import { deleteCookies, getCookie, setCookie } from "./cookies";
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage
} from "./localStorage";

export const setAuthentication = (token, user) => {
  setCookie("token", token);
  setLocalStorage("user", user);
};

export const isAuthenticated = () => {
  if (getCookie("token") && getLocalStorage("user")) {
    return getLocalStorage("user");
  } else {
    return false;
  }
};

export const logout = next => {
  deleteCookies("token");
  deleteLocalStorage("user");
  next();
};
