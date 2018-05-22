import axios from "axios";

// https://github.com/axios/axios#axioscreateconfig
export const ADMIN_API = axios.create({
  baseURL: `${process.env.ADMIN_API_BASE_URL}`,
  withCredentials: true,
});

// TODO: need to setup global error-handling.  Looks like nuxt has something in place for unhandled errors already
ADMIN_API.interceptors.response.use(
  response => response,
  error => {
    // if there's no response, for now, we'll assume it means the user is NOT logged in.
    if (!error.response) {
      window.location.href = `${process.env.ADMIN_API_BASE_URL}/login`;
    }

    return Promise.reject(error);
  });
