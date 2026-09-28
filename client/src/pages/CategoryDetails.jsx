import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuTags } from "react-icons/lu";

import { fetchCategoryById } from "../features/admin/categories/categories.service.js";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      const data = await fetchCategoryById(id);
      setCategory(data);
    };

    loadCategory();
  }, [id]);

  if (!category) {
    return (
      <main className="p-4 sm:p-6">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-text-muted">Category not found.</p>
        </div>
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
            <LuTags size={22} strokeWidth={1.9} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-text">
              Category Details
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              View information about this category.
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="divide-y divide-border">
            <div className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-text-muted">ID</p>
              <p className="text-sm font-semibold text-text">
                {category.id}
              </p>
            </div>

            <div className="flex flex-col gap-1 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-text-muted">
                Category Name
              </p>
              <p className="text-sm font-semibold text-text">
                {category.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryDetails;