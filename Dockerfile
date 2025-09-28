FROM node:18-slim

# Cài Python3 + ffmpeg + yt-dlp (binary, không cần pip)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 ffmpeg wget ca-certificates \
 && wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
 && install -m 755 yt-dlp /usr/local/bin/yt-dlp \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cài dependency Node.js
COPY package*.json ./
RUN npm install --production

# Copy code vào container
COPY . .

CMD ["node", "index.js"]
