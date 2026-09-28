import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuFolderPen } from "react-icons/lu";
import { toast } from "react-toastify";

import {
  fetchCategoryById,
  fetchCategories,
  editCategory,
} from "../features/admin/categories/categories.service.js";

import Loading from "../components/common/Loading.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import FieldError from "../components/common/FieldError.jsx";
import Button from "../components/ui/Button.jsx";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const categoryData = await fetchCategoryById(id);
        const categoriesData = await fetchCategories();

        setName(categoryData.name);
        setOriginalName(categoryData.name);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFieldError("");
    setError("");

    const trimmedName = name.trim();

    // Required validation
    if (!trimmedName) {
      setFieldError("Category name is required.");
      return;
    }

    // No changes validation
    if (trimmedName === originalName.trim()) {
      setFieldError("No changes made.");
      return;
    }

    // Duplicate validation
    const duplicateCategory = categories.some(
      (category) =>
        category.id !== Number(id) &&
        category.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateCategory) {
      setFieldError("Category already exists.");
      return;
    }

    try {
      await editCategory(id, {
        name: trimmedName,
      });

      toast.success("Category updated successfully.");

      navigate("/admin/categories");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <main className="p-4 sm:p-6">
        <Loading />
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Back to Categories */}
        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <LuArrowLeft size={18} strokeWidth={1.9} />
          <span>Back to Categories</span>
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuFolderPen size={22} strokeWidth={1.9} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-text">
              Edit Category
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Update the category name.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          {error && (
            <div className="mb-5">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="categoryName"
                className="mb-2 block text-sm font-medium text-text"
              >
                Category Name
              </label>

              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setFieldError("");
                }}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <FieldError message={fieldError} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                className="cursor-pointer rounded-xl px-4 py-2.5 text-sm"
              >
                Update Category
              </Button>

              <Button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="cursor-pointer rounded-xl px-4 py-2.5 text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditCategory;