import axios from "axios";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config(); // if you want to read from .env, otherwise hardcode below

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || "https://pursuitsoftware.atlassian.net";
const JIRA_EMAIL = process.env.JIRA_EMAIL || "YOUR_EMAIL";
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || "YOUR_API_TOKEN";

const client = axios.create({
  baseURL: `${JIRA_BASE_URL}/rest/api/3`,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization":
      `${JIRA_EMAIL}:${JIRA_API_TOKEN}`,
  },
  timeout: 15000,
  validateStatus: () => true // so we see info even for 4xx/5xx
});

async function main() {
  console.log("Calling:", `${JIRA_BASE_URL}/rest/api/3/project/search`);
  // const res = await client.get("/project/search");
  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/project`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
      ).toString('base64')}`,
      'Accept': 'application/json'
    }
  })
    .then(response => {
      console.log(
        `Response: ${response.status} ${response.statusText}`
      );
      return response.text();
    })
    .then(text => console.log(text))
    .catch(err => console.error(err));
    // console.log("Status:", res.status);
    // console.log("Data:", res.data);
  }

main().catch((e) => {
  console.error("Unexpected error:", e);
});
