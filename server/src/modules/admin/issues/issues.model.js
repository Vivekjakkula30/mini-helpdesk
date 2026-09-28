export const createIssue = (
  id,
  title,
  description,
  reporterId,
  categoryId,
) => {

    const now = new Date().toISOString();
   
  return {
    id,
    title,
    description,
    reporterId,
    categoryId,
    status: "OPEN",
    priority: null,
    assignedId: null,
    assignedBy: null,
    discussion: [],
    createdAt: now,
    updatedAt: now
    
  };
};
