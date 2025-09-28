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

  // Gọi yt-dlp -j
  exec(`yt-dlp -j ${url}`, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).json({ error: "Failed to fetch metadata" });
    }

    try {
      const json = JSON.parse(stdout);
      res.json(json);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON output" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
