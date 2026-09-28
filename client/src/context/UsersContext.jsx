import { createContext, useState } from "react";
import {
  fetchUsers,
  removeUser,
} from "../features/admin/users/users.service.js";

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

  // Fetch all users
  const loadUsers = async (pageNumber = 1) => {
  try {
    setLoading(true);
    setError("");

    const data = await fetchUsers(pageNumber, 10);

    setUsers(data.users);
    setPagination(data.pagination);
    setPage(pageNumber);
  } catch (error) {
    console.error("Failed to fetch users:", error);

    setError(
      error?.message || "Failed to fetch users. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  // Delete a user
  const handleRemoveUser = async (id) => {
    try {
      setError("");

      await removeUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== Number(id))
      );
    } catch (error) {
      console.error("Failed to delete user:", error);

      setError(
        error?.message || "Failed to delete user. Please try again."
      );

      throw error;
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        error,
        page,
        pagination,
        loadUsers,
        handleRemoveUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export { UsersProvider };
export default UsersContext;