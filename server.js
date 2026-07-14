import "dotenv/config";
import express from "express";
import cors from "cors";
import contactRoute from "./routes/contact.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/pak-peaks-client(-[a-z0-9]+)?(-haseebkhan)?\.vercel\.app$/.test(
          origin
        );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
  })
);

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