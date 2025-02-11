const jiraApi = require("../config/jira");

async function createJiraTicket(summary, description) {
    try {
        const response = await jiraApi.post("/rest/api/3/issue", {
            fields: {
                project: {
                    key: "CLBAPI",
                },
                summary: summary,
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: description,
                                },
                            ],
                        },
                    ],
                },
                issuetype: {
                    name: "Task",
                },
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error creating Jira ticket:", error.response.data);
        } else {
            console.error("Error creating Jira ticket:", error.message);
        }
        throw error;
    }
}

async function updateJiraTicket(ticketId, fields) {
    const response = await jiraApi.put(`/rest/api/3/issue/${ticketId}`, {
        fields: fields,
    });
    return response.data;
}

async function getJiraTicket(ticketId) {
    const response = await jiraApi.get(`/rest/api/3/issue/${ticketId}`);
    return response.data;
}

module.exports = {
    createJiraTicket,
    updateJiraTicket,
    getJiraTicket,
};