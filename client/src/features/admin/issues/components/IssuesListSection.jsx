import { useContext, useState } from "react";
import { LuFilter, LuSearch } from "react-icons/lu";

import Input from "../../../../components/ui/Input.jsx";
import Select from "../../../../components/ui/Select.jsx";
import EmptyState from "../../../../components/common/EmptyState.jsx";
import IssuesTable from "./IssuesTable.jsx";
import useDebounce from "../../../../hooks/useDebounce.js";
import CategoriesContext from "../../../../context/CategoriesContext.jsx";
import IssuesContext from "../../../../context/IssuesContext.jsx";

const IssuesListSection = ({ issues }) => {
  const { categories } = useContext(CategoriesContext);

  const {status, setStatus, priority, setPriority, categoryId, setCategoryId, setPage} = useContext(IssuesContext);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((item) => ({
      value: String(item.id),
      label: item.name,
    })),
  ];

  const filteredIssues = issues.filter((issue) => {
  const searchValue = debouncedSearch.toLowerCase();

  return issue.title.toLowerCase().includes(searchValue);
});

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuFilter size={20} strokeWidth={1.9} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-text">
              Issue Filters
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Search and filter issues by their current details.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <LuSearch
              size={18}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <div className="[&_input]:pl-10">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search issue title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                options={statusOptions}
              />

            <Select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setPage(1);
              }}
              options={priorityOptions}
            />

            <Select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(1);
              }}
              options={categoryOptions}
            />
          </div>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <EmptyState message="No issues found." />
      ) : (
        <IssuesTable issues={filteredIssues} />
      )}
    </section>
  );
};

export default IssuesListSection;