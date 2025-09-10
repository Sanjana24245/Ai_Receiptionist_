import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend ka URL
});

// Agar token chahiye toh request mei add karo
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
