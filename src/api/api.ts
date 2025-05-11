import axios from "axios";

const TOKEN = process.env.VITE_APP_API_TOKEN;
const BASE_URL = process.env.VITE_APP_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

api.interceptors.request.use((req) => {
  return req;
});
api.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.error(
      "Erro na resposta:",
      err.response?.status,
      err.response?.data
    );
    return Promise.reject(err);
  }
);
