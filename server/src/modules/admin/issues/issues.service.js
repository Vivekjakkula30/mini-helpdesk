import {
  getIssuesData,
  createIssueData,
  getIssueByIdData,
  updateIssueData,
  assignIssueToAgentData,
  deleteIssueData,
  setIssuePriorityData,
  reopenIssueData,
  getReopenedIssuesData
} from "./issues.repository.js";
import { createIssue as createIssueModel } from "./issues.model.js";
import { getUserById } from "../users/users.repository.js";
import ThrowError from "../../../errors/ThrowError.js";

export const getIssues = async (
  page,
  limit,
  status,
  priority,
  categoryId
) => {
  try {
    const result = await getIssuesData(
      page,
      limit,
      status,
      priority,
      categoryId
    );

    const totalPages = Math.ceil(result.totalItems/limit);

    return {
      issues: result.issues,  // current page ke issues
      pagination: {
        page,
        limit,
        totalItems: result.totalItems, // filter ke baad total issues
        totalPages
      },
    };
  } catch (error){
    throw error
  }
};

// For creation of issue
export const createIssue = async (issueData) => {
  try {
    const issue = await createIssueData(issueData);

    return issue;
  } catch (error) {
    throw error;
  }
};

// For view issue by id
export const getIssueById = async (issueId) => {
  try {
    const issue = await getIssueByIdData(issueId);

    if (!issue) {
      throw new ThrowError(
        404,
        "ISSUE_NOT_FOUND",
        "Issue not found"
      );
    }

    return issue;

  } catch (error) {
    throw error;
  }
};

// For update an issue
export const updateIssue = async (
  issueId, 
  agentId, 
  adminId, 
  issueData) => {

    try {
      const issue = await getIssueByIdData(issueId);

    if (!issue) {
      throw new ThrowError(404, "ISSUE_NOT_FOUND", "Issue not found");
    }

// For checking agent is matching with assignedAgent
    if (agentId && issue.assignedId !== agentId) {
      throw new ThrowError(
        403,
        "UNAUTHORIZED",
        "Agent can only update assigned issues"
      );
    }
// For checking admin is matching with assigned

    if (adminId && issueData.status && issue.assignedId !== adminId) {
        throw new ThrowError(
            403,
            "UNAUTHORIZED",
            "Admin can only update assigned issues"
        );
    }

    // Only status can be updated by Agent/Admin
    // Ye code ensure karta hai ki Agent/Admin Update Issue API 
    // mein status ke alawa koi field update na kar sake.
    if (agentId || adminId) {
        const fields = Object.keys(issueData);

        const allowedFields = ["status", "discussion"];

        const invalidFields = fields.filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            throw new ThrowError(
                400,
                "INVALID_FIELD",
                "Only status and discussion can be updated"
            );
        }
    }

    // Ye discussions ke liye hai agent aur admin ke liye
    if (issueData.discussion !== undefined) { // Request mai discussion aaayi h ky
      if (agentId) { // agar request agent ki hai jo simple message aaya usko ek proper discussion object bana do.
        issueData.discussion = {
          agentId: agentId,
          message: issueData.discussion,
          createdAt: new Date().toISOString()
        };
      }

      if (adminId) {
        issueData.discussion = {
          adminId: adminId,
          message: issueData.discussion,
          createdAt: new Date().toISOString()
        };
      }
    }
  
    // For status transition by admin and agent

    if (issueData.status && issueData.status !== issue.status) {
      const allowedTransitions = {
        OPEN: "IN_PROGRESS",
        IN_PROGRESS: "RESOLVED",
        RESOLVED: "CLOSED"
      };

      if (allowedTransitions[issue.status] !== issueData.status) {
        throw new ThrowError(
          400,
          "INVALID_STATUS_TRANSITION",
          `Issue cannot move from ${issue.status} to ${issueData.status}`
        );
      }
    }

    return await updateIssueData(issueId, issueData);

  } catch (error) {
    throw error;
  }
};

// For assigning an agent
export const assignIssueToAgent = async (
    issueId, 
    assignedId, 
    assignedBy) => {
    try {
       const issue = await getIssueByIdData(issueId);
      // ider issue check ho rahe h
    if (!issue) {
      throw new ThrowError
      (404, 
      "ISSUE_NOT_FOUND", 
      "Issue not found");
    }

    // Ider agent check ho rahe h
    const agent = await getUserById(assignedId);
    // Ider admin dusre admin ko assign nhi kar sakta hai
    if (assignedId === assignedBy) {
    if (agent.role !== "ADMIN") {
        throw new ThrowError(
            403,
            "INVALID_ROLE",
            "Admin can only assign the issue to themselves"
          );
      }
  } else {
      if (agent.role !== "AGENT") {
          throw new ThrowError(
              403,
              "INVALID_ROLE",
              "Issue can only be assigned to an Agent"
          );
      }
}

    // Ider admin check ho rahe h
    const admin = await getUserById(assignedBy);

    if(!admin){
      throw new ThrowError(
        404,
        "ADMIN_NOT_FOUND",
        "Admin not found"
      );
    }

    if (admin.role !== "ADMIN") {
      throw new ThrowError(
        403,
        "INVALID_ROLE",
        "User is not an admin"
      );
    }

    return await assignIssueToAgentData(
      issueId,
      assignedId,
      assignedBy
    );
  } catch (error) {
    throw error;
  }
};

// For deleting an issue
export const deleteIssue = async (issueId) => {
    try {

    // const issue = isIssueDataExists // boolean return instead of returning whole thing it should return boolean then the server may also not get crashed.
         const issue = await deleteIssueData(issueId);

    if (!issue) {
      throw new ThrowError(
        404, 
        "ISSUE_NOT_FOUND", 
        "Issue not found");
    }

    return issue;
  } catch (error) {
    throw error;
  }
};

// For settinng priority by admin
export const setIssuePriority = async (
    issueId,
    adminId,
    priority
) => {
    try {

        const issue = await getIssueByIdData(issueId);

        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        const admin = await getUserById(adminId);

        if (!admin) {
            throw new ThrowError(
                404,
                "ADMIN_NOT_FOUND",
                "Admin not found"
            );
        }

        if (admin.role !== "ADMIN") {
            throw new ThrowError(
                403,
                "INVALID_ROLE",
                "User is not an admin"
            );
        }

        return await setIssuePriorityData(
            issueId,
            priority
        );

    } catch (error) {
        throw error;
    }
};


// for reopening the issue
export const reopenIssue = async (
    issueId,
    reporterId,
    reopenReason
) => {
    try {

        const issue = await getIssueByIdData(issueId);

        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        if (issue.reporterId !== reporterId) {
            throw new ThrowError(
                403,
                "UNAUTHORIZED",
                "Reporter can only reopen their own issue"
            );
        }

        if (
            issue.status !== "RESOLVED" &&
            issue.status !== "CLOSED"
          ) {
            throw new ThrowError(
              400,
              "INVALID_STATUS",
              "Only resolved or closed issues can be reopened"
            );
          }

        return await reopenIssueData(issueId, reporterId, reopenReason);

    } catch (error) {
        throw error;
    }
};

export const getReopenedIssues = async () => {
  try {
    return await getReopenedIssuesData();
  } catch (error) {
    throw error;
  }
};

