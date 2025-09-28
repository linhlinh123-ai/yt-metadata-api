import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 8080;

// Endpoint: /check?url=...
app.get("/check", (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Escape input đơn giản để tránh lệnh độc hại
  const safeUrl = `"${url.replace(/"/g, '\\"')}"`;

  // Gọi yt-dlp -j để lấy metadata
  exec(`yt-dlp -j ${safeUrl}`, { maxBuffer: 15 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr || err.message);
      return res.status(500).json({ error: "Failed to fetch metadata" });
    }

    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      console.error("JSON parse error:", e.message);
      res.status(500).json({ error: "Invalid JSON output" });
    }
  });
});

// Root endpoint test
app.get("/", (req, res) => {
  res.send("yt-dlp metadata API is running 🚀");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
