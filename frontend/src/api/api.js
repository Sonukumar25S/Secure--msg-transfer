import axios from "axios";

// Use the live backend URL from Render
export const api = axios.create({
  baseURL: "https://secure-msg-transfer.onrender.com/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
