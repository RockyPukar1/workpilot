// Backend API Server for WorkPilot
// This is a placeholder - implement when ready to add cloud sync

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "WorkPilot API is running" });
});

// API routes will be added here
// - /api/auth
// - /api/clipboard
// - /api/notes
// - /api/templates
// - /api/screenshots

app.listen(PORT, () => {
  console.log(`WorkPilot API server running on port ${PORT}`);
});
