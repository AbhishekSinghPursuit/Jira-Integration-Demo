import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import projectsRouter from "./routes/projects.js";
import issuesRouter from "./routes/issues.js";
import miscRouter from "./routes/misc.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // adjust if your frontend runs elsewhere
  })
);
app.use(express.json());

// Simple request logging
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/projects", projectsRouter);
app.use("/api/issues", issuesRouter);
app.use("/api/misc", miscRouter);
app.use("/api/admin", adminRoutes); // ⚠ Admin-only Jira field management

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Error handler:", err.message);
  res.status(err.status || 500).json({
    error: err.message,
    details: err.details || null,
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
