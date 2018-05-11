import axios from "axios";

// https://github.com/axios/axios#axioscreateconfig
export const ADMIN_API = axios.create({
  baseURL: `${process.env.ADMIN_API_BASE_URL}`,
  headers: {
    "x-api-key": `${process.env.ADMIN_API_KEY}`,
    "x-user-id": `${process.env.USER_ID}` // TODO: this will probably need to be removed when the authn dance and/or proxy are in place.
  }
});
