# Jira Cloud Integration Demo

A full-stack demonstration of Jira Cloud API integration with a modern `React` frontend and `Express.js` backend. This project showcases how to securely communicate with Jira Cloud, manage authentication, and perform common issue management operations.

## 🎯 Project Overview

This application provides a user-friendly interface for interacting with Jira Cloud through a secure backend API. It demonstrates best practices for API authentication, error handling, and real-time data fetching.

https://github.com/user-attachments/assets/a1e991cf-63c2-42b7-be5e-615c1b38ded8



### Key Features

- **Project Listing**: View all available Jira projects
- **Issue Search**: Query issues using JQL (Jira Query Language)
- **Issue Details**: Fetch detailed information about specific issues
- **Issue Creation**: Create new issues directly from the application
- **Advanced Requests**: Send custom API requests to Jira endpoints
- **User Authentication**: Display current Jira user information

---

## 🏗️ Architecture

The project follows a client-server architecture:

```
Frontend (React + TypeScript + Vite)
         ↓ (HTTP REST calls)
Backend (Express.js + Node.js)
         ↓ (Authenticated API calls)
Jira Cloud API (REST API v3)
```

### Technology Stack

**Frontend:**
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- Axios 1.13.2
- ESLint & TypeScript ESLint

**Backend:**
- Express.js 5.1.0
- Node.js (ES Modules)
- Axios 1.13.2
- CORS middleware
- dotenv for configuration

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn/pnpm**
- **Jira Cloud Account** with API token access
- **Git** (optional, for cloning the repository)

### Jira Cloud Setup

1. Log in to your Jira Cloud account
2. Navigate to **Settings** → **Personal** → **API tokens**
3. Click **Create API token**
4. Copy the generated token (you'll use this in configuration)
5. Note your Jira instance URL (e.g., `https://your-domain.atlassian.net`)
6. Note your email address associated with the account

---

## 🚀 Installation

### 1. Clone or Download the Project

```bash
git clone https://github.com/AbhishekSinghPursuit/Jira-Integration-Demo.git
cd Jira-Integration-Demo
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Verify Installation

Check that all dependencies are installed:

```bash
# From backend directory
npm list

# From frontend directory
npm list
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the backend directory with your Jira Cloud credentials:

```bash
# backend/.env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-generated-api-token
PORT=4000
```

**Environment Variables Explained:**

| Variable | Description | Example |
|----------|-------------|---------|
| `JIRA_BASE_URL` | Your Jira Cloud instance URL | `https://your-domain.atlassian.net` |
| `JIRA_EMAIL` | Email associated with your Jira account | `user@company.com` |
| `JIRA_API_TOKEN` | API token generated in Jira Cloud | `a1b2c3d4e5f6g7h8` |
| `PORT` | Port for the backend server | `4000` (default) |

### Frontend Configuration

The frontend is pre-configured to communicate with the backend at `http://localhost:4000`. If you need to change this:

Edit apiClient.js:

```javascript
const api = axios.create({
  baseURL: "http://localhost:4000", // Change if your backend runs elsewhere
});
```

---

## ▶️ Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

Expected output:
```
Backend running on port 4000
```

### Start the Frontend Development Server

In a new terminal window:

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v7.2.4  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Backend API Reference

All endpoints are prefixed with `/api` and require the backend to be running.

#### Projects Endpoints

##### Get All Projects
```
GET /api/projects
```

**Frontend Usage:** `ProjectsView`

**Function:** `getProjects()`

**Response Example:**
```json
[
  {
    "id": "10000",
    "key": "ESA",
    "name": "Example Project A",
    "projectTypeKey": "software",
    "projectType": "Software"
  }
]
```

**Backend Implementation:** projects.js

---

#### Issues Endpoints

##### Search Issues (JQL)
```
GET /api/issues/search?jql=<jql-query>&maxResults=<number>&fields=<fields>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jql` | string | No | JQL query string (default: last 30 days) |
| `maxResults` | number | No | Maximum results to return (default: 50) |
| `fields` | string | No | Comma-separated field names to return |

**Frontend Usage:** `IssuesSearchView`

**Function:** `searchIssues()`

**Example Request:**
```javascript
searchIssues({
  jql: 'project = ESA AND created >= -30d ORDER BY created DESC',
  maxResults: 50,
  fields: 'summary,status,assignee,priority,created'
})
```

**Response Example:**
```json
{
  "issues": [
    {
      "id": "10001",
      "key": "ESA-1",
      "fields": {
        "summary": "Fix login bug",
        "status": { "name": "In Progress" },
        "assignee": { "displayName": "John Doe", "emailAddress": "john@example.com" },
        "priority": { "name": "High" },
        "created": "2024-01-15T10:30:00.000+0000"
      }
    }
  ],
  "isLast": true
}
```

**Backend Implementation:** issues.js - search endpoint

---

##### Get Issue by Key
```
GET /api/issues/:key
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | Issue key (e.g., `ESA-1`) |

**Frontend Usage:** `IssueDetailView`

**Function:** `getIssue()`

**Example Request:**
```javascript
getIssue('ESA-1')
```

**Response Example:**
```json
{
  "id": "10001",
  "key": "ESA-1",
  "fields": {
    "summary": "Fix login bug",
    "status": { "name": "In Progress" },
    "assignee": { "displayName": "John Doe" },
    "priority": { "name": "High" },
    "created": "2024-01-15T10:30:00.000+0000",
    "updated": "2024-01-20T14:22:00.000+0000",
    "description": "Users cannot login with SSO"
  }
}
```

**Backend Implementation:** issues.js - detail endpoint

---

##### Create Issue
```
POST /api/issues
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectKey` | string | Yes | Jira project key (e.g., `ESA`) |
| `summary` | string | Yes | Issue title/summary |
| `description` | string | No | Detailed description |
| `issueType` | string | No | Issue type (default: `Task`) |

**Frontend Usage:** `CreateIssueView`

**Function:** `createIssue()`

**Example Request:**
```javascript
createIssue({
  projectKey: 'ESA',
  summary: 'Fix navigation menu',
  description: 'The main navigation menu is not responsive',
  issueType: 'Bug'
})
```

**Response Example:**
```json
{
  "id": "10002",
  "key": "ESA-2"
}
```

**Backend Implementation:** issues.js - create endpoint

---

#### Miscellaneous Endpoints

##### Get Current User
```
GET /api/misc/me
```

**Frontend Usage:** `Header`

**Function:** `getCurrentUser()`

**Response Example:**
```json
{
  "self": "https://api.atlassian.com/site/abc123/users/user123",
  "accountId": "abc123def456",
  "emailAddress": "user@example.com",
  "displayName": "John Doe",
  "active": true,
  "timeZone": "America/Los_Angeles"
}
```

**Backend Implementation:** misc.js - me endpoint

---

##### Raw Jira Request
```
POST /api/misc/raw
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `method` | string | Yes | HTTP method (`GET`, `POST`, `PUT`, `DELETE`) |
| `path` | string | Yes | Jira API path (e.g., `/myself`, `/project`) |
| `params` | object | No | URL query parameters |
| `body` | object | No | Request body (for POST/PUT) |

**Frontend Usage:** `AdvancedRequestView`

**Function:** `rawJiraRequest()`

**Example Request:**
```javascript
rawJiraRequest({
  method: 'POST',
  path: '/search/jql',
  body: {
    jql: 'project = ESA',
    maxResults: 20,
    fields: ['summary', 'status']
  }
})
```

**Response:** Returns the raw Jira API response

**Backend Implementation:** misc.js - raw endpoint

---

## 🎨 Frontend Components

### Component Overview

#### Sidebar
Navigation component displaying available views and handling view selection.

**Props:**
- `selected` (string): Current selected view
- `onSelect` (function): Callback when view is selected

**Views:**
- Projects
- Search Issues
- Issue Detail
- Create Issue
- Advanced Request

#### Header
Displays application title and current Jira user information.

**Features:**
- Fetches current user on mount
- Shows user avatar and profile information
- Handles loading and error states

#### ProjectsView
Displays list of all Jira projects in a table format.

**Features:**
- Fetches projects on mount
- Shows loading state
- Displays error messages
- Table with Key, Name, Type columns

#### IssuesSearchView
Allows users to search issues using JQL queries.

**Features:**
- Pre-populated with default JQL query
- Textarea for custom JQL input
- Results displayed in table format
- Shows issue count and pagination info

#### IssueDetailView
Fetches and displays detailed information about a specific issue.

**Features:**
- Input field for issue key
- Displays issue summary, status, assignee, priority
- Shows creation and update dates
- Raw JSON viewer for debugging

#### CreateIssueView
Form for creating new issues in Jira.

**Features:**
- Input fields for project key, issue type, summary, description
- Validation for required fields
- Success message on creation
- Error handling

#### AdvancedRequestView
Advanced interface for sending custom Jira API requests.

**Features:**
- Preset templates for common API calls
- Method selector (GET, POST, PUT, DELETE)
- Path and body input fields
- JSON response viewer

---

## 💡 Usage Examples

### Example 1: View All Projects

1. Open the application at `http://localhost:5173`
2. Ensure you're on the **Projects** tab (default)
3. The page automatically loads and displays all accessible projects
4. View project key, name, and type in the table

**API Flow:**

<img width="896" height="240" alt="_- visual selection (9)" src="https://github.com/user-attachments/assets/c61bca20-3783-4cf8-94c6-3c93ea643353" />

---


### Example 2: Search Issues with JQL

1. Navigate to **Search Issues** tab
2. Modify the JQL query in the textarea (e.g., `project = ESA AND type = Bug`)
3. Click **Search**
4. View results in the table

**JQL Query Examples:**
```jql
# Issues created in the last 30 days
created >= -30d ORDER BY created DESC

# All bugs in a project
project = ESA AND type = Bug

# Issues assigned to you
assignee = currentUser()

# In-progress high priority issues
status = "In Progress" AND priority = High
```

**API Flow:**

<img width="600" height="516" alt="_- visual selection (8)" src="https://github.com/user-attachments/assets/5e383150-978a-46c4-ad9b-426ea84eec3e" />


---

### Example 3: Get Issue Details

1. Navigate to **Issue Detail** tab
2. Enter an issue key (e.g., `ESA-1`) in the input field
3. Click **Load**
4. View detailed information including status, assignee, priority

**API Flow:**

<img width="865" height="636" alt="_- visual selection (7)" src="https://github.com/user-attachments/assets/05556b3b-4386-41a1-b618-cac43716e2b8" />


---

### Example 4: Create a New Issue

1. Navigate to **Create Issue** tab
2. Enter required fields:
   - Project Key: `ESA`
   - Summary: `Implement user dashboard`
   - Issue Type: `Story` (optional)
   - Description: `Users need a personalized dashboard` (optional)
3. Click **Create**
4. Success message shows new issue key

**API Flow:**

<img width="625" height="523" alt="_- visual selection (6)" src="https://github.com/user-attachments/assets/94041a28-6cb2-4b69-aedc-bc5921344530" />


---

### Example 5: Advanced API Request

1. Navigate to **Advanced Request** tab
2. Select a preset (e.g., "Get current user")
3. Or customize:
   - Method: `POST`
   - Path: `/search/jql`
   - Body: Custom JSON
4. Click **Send**
5. View raw JSON response

---

## 🔐 Authentication & Security

### How Authentication Works

1. **Frontend** → Sends requests to Backend API (no Jira credentials exposed)
2. **Backend** → Converts frontend requests to Jira API calls
3. **Jira** → Authenticates using Basic Auth with email + API token

```javascript
// Backend authentication header construction
const authHeader = "Basic " + Buffer.from(
  `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
).toString("base64");
```

### Security Best Practices

- ✅ **API credentials stored in `.env`** (never commit to version control)
- ✅ **CORS configured** to only accept requests from frontend
- ✅ **Backend acts as proxy** - sensitive credentials never exposed to frontend
- ✅ **Error details sanitized** - sensitive info not leaked in responses

---

## 🐛 Troubleshooting

### Backend Issues

#### Backend won't start
```bash
# Check Node.js version
node --version  # Should be v16+

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "Missing Jira env vars" error
- Verify `.env` file exists in backend directory
- Check all required variables are set:
  - `JIRA_BASE_URL`
  - `JIRA_EMAIL`
  - `JIRA_API_TOKEN`
- Restart the backend after changing `.env`

#### Connection refused to Jira
```
Error: connect ECONNREFUSED
```
- Verify `JIRA_BASE_URL` is correct (e.g., `https://your-domain.atlassian.net`)
- Check API token is valid (regenerate if unsure)
- Verify internet connection

#### 401 Unauthorized from Jira
- Email or API token is incorrect
- API token may have expired - generate a new one
- Verify the account has API access enabled

### Frontend Issues

#### Frontend can't connect to backend
```
Error: Network Error
```
- Verify backend is running on port 4000
- Check `baseURL` in apiClient.js
- Browser console shows the actual error

#### CORS error
```
Access to XMLHttpRequest blocked by CORS policy
```
- Verify frontend URL matches CORS origin in index.js
- Ensure CORS middleware is enabled

#### TypeScript compilation errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

### Jira API Issues

#### "Invalid JQL" error
- Check JQL syntax at https://www.atlassian.com/software/jira/guides/jql
- Use JQL editor in Jira UI first to validate

#### Issue key not found
- Verify the issue key exists in your Jira instance
- Check project key is correct (case-sensitive)

#### Permission denied
- Verify account has access to the project
- Check issue type exists in project configuration

---

## 📚 Additional Resources

- [Jira Cloud REST API Documentation](https://developer.atlassian.com/cloud/jira/rest/)
- [JQL Tutorial](https://www.atlassian.com/software/jira/guides/jql/overview)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 📝 Project Structure

```
Jira-Integration-Demo/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express app setup
│   │   ├── jiraClient.js         # Jira API client
│   │   └── routes/
│   │       ├── projects.js       # Projects endpoints
│   │       ├── issues.js         # Issues endpoints
│   │       ├── misc.js           # User & raw request endpoints
│   │       └── debug.js          # Debug endpoints
│   ├── .env                      # Configuration (create this)
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Main App component
│   │   ├── apiClient.js          # Frontend API wrapper
│   │   ├── App.css               # Styles
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       ├── ProjectsView.jsx
│   │       ├── IssuesSearchView.jsx
│   │       ├── IssueDetailView.jsx
│   │       ├── CreateIssueView.jsx
│   │       └── AdvancedRequestView.jsx
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .gitignore
│   └── package.json
│
└── .gitignore
```

---

## Contributing
* Fork the repository.
* Create a new branch (`git checkout -b feature-branch`).
* Make your changes.
* Commit your changes (`git commit -m 'Add some feature`).
* Push to the branch (`git push origin feature-branch`).
* Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Me
For any inquiries or support, please reach out to:

* **Author:** [Abhishek Singh](https://github.com/SinghIsWriting/)
* **LinkedIn:** [My LinkedIn Profile](https://www.linkedin.com/in/abhishek-singh-bba2662a9)
* **Portfolio:** [Abhishek Singh Portfolio](https://portfolio-abhishek-singh-nine.vercel.app/)
