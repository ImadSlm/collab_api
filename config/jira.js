const axios = require("axios");
require("dotenv").config();

const jiraApi = axios.create({
    baseURL: process.env.JIRA_BASE_URL,
    auth: {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_API_TOKEN,
    },
    headers: {
        "Content-Type": "application/json",
    },
});

module.exports = jiraApi;