import { LuFolderPlus, LuTags } from "react-icons/lu";

import Button from "../../../../components/ui/Button.jsx";

const CategoriesHeader = ({ onAddCategory }) => {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuTags size={22} strokeWidth={1.9} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-text">
            Categories
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Manage issue categories.
          </p>
        </div>
      </div>

      <Button
         onClick={onAddCategory}
        className="inline-flex cursor-pointer items-center justify-center gap-2"
      >
        <LuFolderPlus size={17} strokeWidth={1.9} />
        Add Category
      </Button>
    </div>
  );
};

export default CategoriesHeader;