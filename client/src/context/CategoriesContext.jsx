import {
  createContext,
  useCallback,
  useState,
} from "react";

import {
  fetchCategories,
  addCategory,
  removeCategory,
} from "../features/admin/categories/categories.service";

const CategoriesContext = createContext();

const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(async () => {
    const data = await fetchCategories();

    setCategories(data);

    return data;
  }, []);

  const handleAddCategory = async (categoryData) => {
    const newCategory = await addCategory(categoryData);

    setCategories((prevCategories) => [
      newCategory,
      ...prevCategories,
    ]);

    return newCategory;
  };

  const handleRemoveCategory = async (id) => {
    await removeCategory(id);

    setCategories((prevCategories) =>
      prevCategories.filter(
        (category) => category.id !== Number(id)
      )
    );
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loadCategories,
        handleAddCategory,
        handleRemoveCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export { CategoriesProvider };
export default CategoriesContext;