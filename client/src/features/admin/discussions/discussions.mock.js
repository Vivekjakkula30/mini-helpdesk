import { DISCUSSIONS } from "./discussions.data.js";

const STORAGE_KEY = "discussions";

const getStoredDiscussions = () => {
  const storedDiscussions = localStorage.getItem(STORAGE_KEY);

  if (storedDiscussions) {
    return JSON.parse(storedDiscussions);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(DISCUSSIONS)
  );

  return DISCUSSIONS;
};

const saveDiscussions = (discussions) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(discussions)
  );
};

export const getDiscussionsByIssueId = async (issueId) => {
  const discussions = getStoredDiscussions();

  return discussions
    .filter(
      (discussion) =>
        Number(discussion.issueId) === Number(issueId)
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
};

export const createDiscussion = async (
  issueId,
  discussionData
) => {
  const discussions = getStoredDiscussions();

  const newDiscussion = {
    id:
      discussions.length > 0
        ? Math.max(...discussions.map((discussion) => discussion.id)) + 1
        : 1,
    issueId: Number(issueId),
    senderId: Number(discussionData.senderId),
    senderName: discussionData.senderName,
    senderRole: discussionData.senderRole,
    message: discussionData.message.trim(),
    createdAt: new Date().toISOString(),
  };

  discussions.push(newDiscussion);
  saveDiscussions(discussions);

  return newDiscussion;
};