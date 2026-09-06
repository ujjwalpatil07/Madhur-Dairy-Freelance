// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://madhur-dairy-daily-need-server-1eu6.onrender.com",
//   // baseURL: "http://localhost:9000"
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;