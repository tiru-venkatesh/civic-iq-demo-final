import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://civic--ai.vercel.app",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/api/copilot", chatRoutes);

app.listen(PORT, () => {
  console.log(`🚀 CivicIQ Copilot running on http://localhost:${PORT}`);
});