import axios from "axios";

const API_URL = "http://localhost:5001/api/auth/login";

export const loginApi = async (credentials) => {
  const response = await axios.post(API_URL, credentials);
  return response.data;
};
