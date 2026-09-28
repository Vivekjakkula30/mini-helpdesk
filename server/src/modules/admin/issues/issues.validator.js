import ThrowError from "../../../errors/ThrowError.js";


// For pagination validation
export const validatorPagination = (page, limit) => {

    if (!Number.isInteger(page) || page < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Page must be a positive integer"
        );
    }

    if (!Number.isInteger(limit) || limit < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Limit must be a positive integer"
        );
    }
};


// For creating issue validation
const validateTitle = (title) => {
    if(!title) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Title is required"
        );
    }
};

const validateDescription = (description) => {
    if (!description){
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Title is required"
        );
    }
};

const validateCategoryId = (categoryId) => {
    if (!Number.isInteger(categoryId) || categoryId < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Category ID must be a positive integer"
        );
    }
};

// Allowed fields reporter issue create krte time
const validateAllowedFields = (data, allowedFields) => {
    const fields = Object.keys(data);

    const invalidFields = fields.filter(
        field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        throw new ThrowError(
            400,
            "INVALID_FIELD",
            `Fields not allowed: ${invalidFields.join(", ")}` // join array ko string mai convert karega
        );
    }
};



// Common function For creating an issue by reporter
export const validateCreateIssue = (issueData) => {

    const allowedFields = ["title", "description", "categoryId"];

    validateAllowedFields(issueData, allowedFields);
    
    const {title, description, categoryId} = issueData;

    validateTitle(title);
    validateDescription(description);
    validateCategoryId(categoryId);
};



// For viewing an issue
export const validateIssueId = (issueId) => {

    if (!Number.isInteger(issueId) || issueId < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Issue ID must be a positive integer"
        );
    }
};



// For updating an issue
export const validatePriority = (priority) => {
    if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Priority must be LOW, MEDIUM, or HIGH"
        );
    }
};

const validateStatus = (status) => {
    if (!["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
        throw new ThrowError(
            400,
            "INVALID_STATUS",
            "Status must be OPEN, IN_PROGRESS, RESOLVED, or CLOSED"
        );
    }
};

const validateDiscussion = (discussion) => {
    if (!discussion) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Discussion is required"
        );
    }
};

// Ye common function 
export const validateUpdateIssue = (issueData) => {

    const allowedFields = [
        "title",
        "description",
        "priority",
        "status",
        "discussion"
    ];

    validateAllowedFields(issueData, allowedFields);

    const {
        title,
        description,
        priority,
        status,
        discussion
    } = issueData;

    if (
        title === undefined &&
        description === undefined &&
        priority === undefined &&
        status === undefined &&
        discussion === undefined
    ) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "At least one field is required to update"
        );
    }

    if (title !== undefined) {
        validateTitle(title);
    }

    if (description !== undefined) {
        validateDescription(description);
    }

    if (priority !== undefined) {
        validatePriority(priority);
    }

    if (status !== undefined) {
        validateStatus(status);
    }

    if (discussion !== undefined) {
        validateDiscussion(discussion);
    }
};

// For validating the issueid agentid and adminid It is called generic validation

export const validateUserId = (userId) => {
    if (!Number.isInteger(userId) || userId < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "User ID must be a positive integer"
        );
    }
};
export const validateAgentId = (agentId) => {
    if (!Number.isInteger(agentId) || agentId < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Agent ID must be a positive integer"
        );
    }
};

export const validateAdminId = (adminId) => {
    if (!Number.isInteger(adminId) || adminId < 1) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Admin ID must be a positive integer"
        );
    }
};

// for setting prority

export const validateSetPriority = (priorityData) => {

    const allowedFields = ["priority"];

    validateAllowedFields(priorityData, allowedFields);

    if (priorityData.priority === undefined) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Priority is required"
        );
    }

    validatePriority(priorityData.priority);
};

// for agent setting priority
export const validateAgentPriority = (agentPriority) => {
    if (![1, 2, 3].includes(agentPriority)) {
        throw new ThrowError(
            400,
            "INVALID_AGENT_PRIORITY",
            "Agent priority must be 1, 2, or 3"
        );
    }
};


