import fetchService from "../../services/fetchService.js";

export const loginUser = async (email, password) => {
  return await fetchService("/auth/login" ,{
    method: "POST",
    body: {
      email,
      password
    }
  });
};