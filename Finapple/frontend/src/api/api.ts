import axios from "axios";

export const api = axios.create({
  baseURL: "https://finapple-production.up.railway.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
