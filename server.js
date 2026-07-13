import "dotenv/config";
import express from "express";
import cors from "cors";
import contactRoute from "./routes/contact.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "10kb" }));

app.get("/", (_req, res) => {
  res.send("Pak Peaks API is running.");
});

app.use("/api/contact", contactRoute);

// Fallback error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Unexpected server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Pak Peaks API listening on port ${PORT}`);
});