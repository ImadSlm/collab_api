const axios = require("axios");
require("dotenv").config();

const jiraApi = axios.create({
    baseURL: secrets.JIRA_BASE_URL,
    auth: {
        username: secrets.JIRA_USERNAME,
        password: secrets.JIRA_API_TOKEN,
    },
    headers: {
        "Content-Type": "application/json",
    },
});

module.exports = jiraApi;