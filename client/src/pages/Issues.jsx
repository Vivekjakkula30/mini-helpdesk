import {
    useContext,
    useEffect,
    useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import IssuesHeader from "../features/admin/issues/components/IssuesHeader.jsx";
import IssuesListSection from "../features/admin/issues/components/IssuesListSection.jsx";

import IssuesContext from "../context/IssuesContext.jsx";
import CategoriesContext from "../context/CategoriesContext.jsx";

import {
    fetchReopenedIssues,
} from "../features/admin/dashboard/adminDashboard.service.js";


const Issues = () => {

    const {
        issues,
        loadIssues,
        page,
        status,
        priority,
        categoryId,
    } = useContext(IssuesContext);

    const {
        loadCategories,
    } = useContext(CategoriesContext);

    const [searchParams] = useSearchParams();

    const showReopenedOnly =
        searchParams.get("reopened") === "true";

    const [reopenedIssues, setReopenedIssues] =
        useState([]);


    // Load categories when Issues page needs category names
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


    // Load normal issues
    useEffect(() => {

        if (showReopenedOnly) {
            return;
        }

        const loadIssueList = async () => {
            try {

                await loadIssues(
                    page,
                    status,
                    priority,
                    categoryId
                );

            } catch (error) {

                console.error(
                    "Failed to load issues:",
                    error
                );

            }
        };

        loadIssueList();

    }, [
        showReopenedOnly,
        page,
        status,
        priority,
        categoryId,
        loadIssues,
    ]);


    // Load reopened issues
    useEffect(() => {

        if (!showReopenedOnly) {
            return;
        }

        const loadReopenedIssueList = async () => {

            try {

                const data =
                    await fetchReopenedIssues();

                setReopenedIssues(data);

            } catch (error) {

                console.error(
                    "Failed to load reopened issues:",
                    error
                );

                setReopenedIssues([]);

            }
        };

        loadReopenedIssueList();

    }, [showReopenedOnly]);


    const displayedIssues =
        showReopenedOnly
            ? reopenedIssues
            : issues;


    return (
        <main className="p-4 sm:p-6">

            <div className="space-y-8">

                <IssuesHeader />

                <IssuesListSection
                    issues={displayedIssues}
                />

            </div>

        </main>
    );
};


export default Issues;