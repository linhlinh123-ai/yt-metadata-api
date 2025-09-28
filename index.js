import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8080;

// Nếu có cookie trong ENV → ghi ra file tạm
const COOKIE_PATH = "/tmp/cookies.txt";
if (process.env.YOUTUBE_COOKIE) {
  fs.writeFileSync(COOKIE_PATH, process.env.YOUTUBE_COOKIE);
  console.log("Cookies written to", COOKIE_PATH);
}

app.get("/check", (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Gọi yt-dlp với cookie nếu có
  const cookieArg = process.env.YOUTUBE_COOKIE ? `--cookies ${COOKIE_PATH}` : "";
  const cmd = `yt-dlp -j ${cookieArg} ${url}`;

  exec(cmd, { maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
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
