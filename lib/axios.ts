import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.i-friend.cloud/api/v1/dashboard",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;