import axios from "axios";

// https://github.com/axios/axios#axioscreateconfig
const api = axios.create({
  baseURL: `${process.env.VUE_APP_ADMIN_API_BASE_URL}`,
  withCredentials: true
});

api.interceptors.response.use(
  response => response.data,
  error => {
    if (
      !error.response ||
      !error.response.status ||
      error.response.status == 401
    ) {
      window.location.href = `${process.env.VUE_APP_ADMIN_API_BASE_URL}/login`;
    }

    return Promise.reject(error);
  }
);

export default api;
