import {
  getDiscussionsByIssueId,
  createDiscussion as createDiscussionMock,
} from "./discussions.mock.js";

export const fetchDiscussionsByIssueId = async (issueId) => {
  return await getDiscussionsByIssueId(issueId);
};

export const addDiscussion = async (
  issueId,
  discussionData
) => {
  return await createDiscussionMock(
    issueId,
    discussionData
  );
};