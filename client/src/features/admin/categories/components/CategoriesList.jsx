import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LuEye,
  LuPencil,
  LuTrash2,
  LuTags,
} from "react-icons/lu";

import { checkCategoryInUse } from "../categories.service.js";

const CategoriesList = ({ categories, onDelete }) => {
  const [categoryUsage, setCategoryUsage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsage = async () => {
      const usage = {};

      for (const category of categories) {
        const result = await checkCategoryInUse(category.id);

        usage[category.id] = result.isUsed;
      }

      setCategoryUsage(usage);
    };

    checkUsage();
  }, [categories]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                ID
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Category Name
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors duration-200 hover:bg-background/60"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-text-muted">
                  {category.id}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LuTags size={17} strokeWidth={1.9} />
                    </div>

                    <span className="font-medium text-text">
                      {category.name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/categories/${category.id}`)
                      }
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      title="View"
                      aria-label={`View ${category.name}`}
                    >
                      <LuEye size={18} strokeWidth={1.9} />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/categories/${category.id}/edit`
                        )
                      }
                      disabled={categoryUsage[category.id]}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      title={
                          categoryUsage[category.id]
                            ? "Category is currently in use and cannot be edited."
                            : "Edit category"
                        }
                      aria-label={`Edit ${category.name}`}
                    >
                      <LuPencil size={18} strokeWidth={1.9} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      disabled={categoryUsage[category.id]}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-danger transition-colors duration-200 hover:bg-danger/10 hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                      title={
                            categoryUsage[category.id]
                              ? "Category is currently in use and cannot be deleted."
                              : "Delete category"
                          }
                      aria-label={`Delete ${category.name}`}
                    >
                      <LuTrash2 size={18} strokeWidth={1.9} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesList;