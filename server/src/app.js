import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes

import projectRoutes from "./routes/project.route.js";
import columnRoutes from "./routes/column.route.js";
import taskRoutes from "./routes/task.route.js";
import errorHandler from "./middlewares/error.middleware.js";

// routes declaration

app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects/:projectId/columns", columnRoutes);
app.use("/api/v1/projects/:projectId/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

// global error handler
app.use(errorHandler);

export default app;
