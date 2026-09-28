import {
  useContext,
  useEffect,
  useState,
} from "react";

import CategoriesContext from "../context/CategoriesContext.jsx";
import CategoriesList from "../features/admin/categories/components/CategoriesList.jsx";
import CategoriesHeader from "../features/admin/categories/components/CategoriesHeader.jsx";
import DeleteConfirmDialog from "../components/common/DeleteConfirmDialog.jsx";
import FieldError from "../components/common/FieldError.jsx";
import { toast } from "react-toastify";
import Modal from "../components/ui/Modal.jsx";

const Categories = () => {
  const {
    categories,
    loadCategories,
    handleAddCategory,
    handleRemoveCategory,
  } = useContext(CategoriesContext);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        await loadCategories();
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    loadCategoryData();
  }, [loadCategories]);

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await handleRemoveCategory(selectedCategory.id);

      toast.success("Category deleted successfully.");

      handleDialogClose();
    } catch (error) {
      toast.error(
        error?.message || "Failed to delete category."
      );
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setCategoryName("");
    setCategoryError("");
  };

  const handleCreateCategory = async () => {
    setCategoryError("");

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required.");
      return;
    }

    const duplicateCategory = categories.some(
      (category) =>
        category.name.toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (duplicateCategory) {
      setCategoryError("Category already exists.");
      return;
    }

    try {
      await handleAddCategory({
        name: trimmedName,
      });

      toast.success("Category created successfully.");

      setCategoryName("");
      setCategoryError("");
      setIsAddModalOpen(false);
    } catch (error) {
      setCategoryError(
        error.message || "Failed to create category."
      );
    }
  };

  return (
    <main className="p-4 sm:p-6">
      <div className="space-y-6">
        <CategoriesHeader
          onAddCategory={() => {
            setCategoryName("");
            setCategoryError("");
            setIsAddModalOpen(true);
          }}
        />

        <CategoriesList
          categories={categories}
          onDelete={handleDelete}
        />

        {isDialogOpen && selectedCategory && (
          <DeleteConfirmDialog
            title="Delete Category"
            message={`Are you sure you want to delete ${selectedCategory.name}?`}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDialogClose}
          />
        )}

        <Modal
          isOpen={isAddModalOpen}
          onClose={handleAddModalClose}
          title="Add Category"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(event) =>
                setCategoryName(event.target.value)
              }
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <FieldError message={categoryError} />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleAddModalClose}
              className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-background"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateCategory}
              className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Create Category
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default Categories;