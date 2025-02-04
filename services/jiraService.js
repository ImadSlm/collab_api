const jiraApi = require("../config/jira");

async function createJiraTicket(summary, description) {
    const response = await jiraApi.post("/rest/api/3/issue", {
        fields: {
            project: {
                key: "YOUR_PROJECT_KEY",
            },
            summary: summary,
            description: description,
            issuetype: {
                name: "Task",
            },
        },
    });
    return response.data;
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