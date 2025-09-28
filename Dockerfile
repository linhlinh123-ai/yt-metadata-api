FROM node:20-slim

# Cài các tool cần thiết + python3
RUN apt-get update \
 && apt-get install -y ca-certificates curl python3 python3-distutils python3-venv \
 && rm -rf /var/lib/apt/lists/*

# Tải binary yt-dlp (script requiring python3 via /usr/bin/env)
RUN curl -L -o /usr/local/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
 && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 8080
CMD ["node", "index.js"]
