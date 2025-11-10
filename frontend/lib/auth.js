import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // backend URL

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  const { token } = res.data;

  // store token in localStorage
  localStorage.setItem("token", token);
  return jwtDecode(token);
};

export const signup = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/signup`, { username, email, password });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  return jwtDecode(token);
};
