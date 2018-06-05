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

    // TODO: may need to try again when we get 504's back to deal with lambda's cold start
    // if (error.response && error.response.status == 504) {
    //   return axios.request(error.config);
    // }

    return Promise.reject(error);
  });
