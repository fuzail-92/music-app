import axios from "axios";

// Backend ka base URL — local development ke liye
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // zaroori hai taake login cookie bheji/receive ho sake
});

export default api;
