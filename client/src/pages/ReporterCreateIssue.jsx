import {
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { LuFilePlus } from "react-icons/lu";
import { toast } from "react-toastify";

import CategoriesContext from "../context/CategoriesContext";
import ReporterContext from "../context/ReporterContext.jsx";

import FieldError from "../components/common/FieldError";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";


const ReporterCreateIssue = () => {

  const {
    addIssue
  } = useContext(ReporterContext);

  const {
    categories,
    loadCategories,
  } = useContext(CategoriesContext);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });


  const [error, setError] = useState({
    title: "",
    description: "",
    categoryId: "",
  });


  const navigate = useNavigate();


  // Load categories when Create Issue page opens
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


  const handleSubmit = async (event) => {

    event.preventDefault();


    const newErrors = {
      title: "",
      description: "",
      categoryId: "",
    };


    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }


    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    }


    if (!formData.categoryId) {
      newErrors.categoryId =
        "Category is required.";
    }


    setError(newErrors);


    if (
      newErrors.title ||
      newErrors.description ||
      newErrors.categoryId
    ) {
      return;
    }


    const issueData = {
      ...formData,
      categoryId: Number(formData.categoryId),
    };


    await addIssue(issueData);


    toast.success(
      "Issue created successfully"
    );


    setFormData({
      title: "",
      description: "",
      categoryId: "",
    });


    setError({
      title: "",
      description: "",
      categoryId: "",
    });


    navigate("/reporter/dashboard");
  };


  const categoryOptions = [
    {
      value: "",
      label: "Select category",
    },

    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];


  return (
    <main className="p-4 sm:p-6">

      <div className="mx-auto max-w-xl space-y-6">

        {/* Page Header */}
        <section className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuFilePlus
              size={21}
              strokeWidth={1.9}
            />
          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-text">
              Create Issue
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Report a new issue.
            </p>

          </div>

        </section>


        {/* Create Issue Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >

          {/* Card Header */}
          <div className="border-b border-border pb-4">

            <h2 className="text-base font-semibold text-text">
              Issue Information
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Enter the details of the issue you want to report.
            </p>

          </div>


          {/* Form Fields */}
          <div className="space-y-4">

            {/* Title */}
            <div>

              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-text"
              >
                Title
              </label>

              <Input
                id="title"
                type="text"
                placeholder="Enter issue title"
                value={formData.title}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    title: event.target.value,
                  })
                }
              />

              <FieldError
                message={error.title}
              />

            </div>


            {/* Description */}
            <div>

              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-text"
              >
                Description
              </label>

              <textarea
                id="description"
                rows="5"
                placeholder="Describe the issue"
                value={formData.description}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    description:
                      event.target.value,
                  })
                }
                className="w-full resize-none rounded-input border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary"
              />

              <FieldError
                message={error.description}
              />

            </div>


            {/* Category */}
            <div>

              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-text"
              >
                Category
              </label>

              <Select
                id="category"
                value={formData.categoryId}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    categoryId:
                      event.target.value,
                  })
                }
                options={categoryOptions}
              />

              <FieldError
                message={error.categoryId}
              />

            </div>

          </div>


          {/* Submit */}
          <div className="flex justify-end border-t border-border pt-4">

            <Button
              type="submit"
              className="w-full sm:w-auto"
            >
              Create Issue
            </Button>

          </div>

        </form>

      </div>

    </main>
  );
};


export default ReporterCreateIssue;