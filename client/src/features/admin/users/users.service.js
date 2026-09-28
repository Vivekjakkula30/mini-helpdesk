import fetchService from "../../../services/fetchService";

// Fetching all users
export const fetchUsers = async (page = 1, limit = 10) => {
  return await fetchService(`/users?page=${page}&limit=${limit}`);
};

// Create a new user
export const addUser = async (userData) => {
  return await fetchService("/users", {
    method: "POST",
    body: userData
  });
};

// Fetching a single user by ID
export const fetchUserById = async (id) => {
  return await fetchService(`/users/${id}`);
};

// Updating the user details like email and role
export const updateUser = async (id, userData) => {
  return await fetchService(`/users/${id}`, {
    method: "PATCH",
    body: userData,
  });
};

// Fetching user summary
export const fetchUserSummary = async () => {
  return await fetchService("/users/summary");
};

// Deleting a user
export const removeUser = async (id) => {
  return await fetchService(`/users/${id}`,{
    method: "DELETE"
  });
};