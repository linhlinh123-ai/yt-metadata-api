import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8080;

const COOKIE_PATH = "/tmp/cookies.txt"; // file cookie mount từ Secret

app.get("/check", (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Nếu có file cookie thì dùng, không thì bỏ qua
  const cookieArg = fs.existsSync(COOKIE_PATH) ? `--cookies ${COOKIE_PATH}` : "";
  const cmd = `yt-dlp --dump-json --no-warnings --no-check-certificates ${cookieArg} ${url}`;

  exec(cmd, { maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).json({ error: "Failed to fetch metadata", details: stderr });
    }

    try {
      const json = JSON.parse(stdout);
      res.json(json);
    } catch (e) {
      console.error("parse error:", e, stdout);
      res.status(500).json({ error: "Invalid JSON output" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
