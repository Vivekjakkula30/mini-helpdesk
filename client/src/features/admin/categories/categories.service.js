import fetchService from "../../../services/fetchService.js";

export const fetchCategories = async () => {
  return await fetchService("/categories");
};

export const addCategory = async (categoryData) => {
  return await fetchService("/categories", {
    method: "POST",
    body: categoryData,
  });
};

export const fetchCategoryById = async (id) => {
  return await fetchService(`/categories/${id}`);
};

export const editCategory = async (id, categoryData) => {
  return await fetchService(`/categories/${id}`, {
    method: "PATCH",
    body: categoryData,
  });
};

export const removeCategory = async (id) => {
  return await fetchService(`/categories/${id}`, {
    method: "DELETE",
  });
};

export const checkCategoryInUse = async (id) => {
  return await fetchService(`/categories/usage/${id}`);
};