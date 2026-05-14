import axios from "axios";

export const api = axios.create({
  baseURL: "https://finapple-8f21.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
