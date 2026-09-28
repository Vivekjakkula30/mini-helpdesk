import ThrowError from "../../errors/ThrowError.js";
import {
    getReporterIssuesData,
    getReporterIssuesByIdData
} from "./reporter.repository.js";

export const getReporterIssues = async (
    reporterId,
    page,
    limit
) => {

    return await getReporterIssuesData(
        reporterId,
        page,
        limit
    );
};


export const getReporterIssuesById = async (
    issueId,
    reporterId
) => {

    const issue = await getReporterIssuesByIdData(
        issueId,
        reporterId
    );

    if (!issue) {
        throw new ThrowError(
            404,
            "NOT_FOUND",
            "Issue not found"
        );
    }

    return issue;
};
