FROM node:20-slim

# Cài các tool cơ bản
RUN apt-get update && apt-get install -y ca-certificates curl && rm -rf /var/lib/apt/lists/*

# Tải binary yt-dlp (phiên bản latest)
RUN curl -L -o /usr/local/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
 && chmod a+rx /usr/local/bin/yt-dlp

# Tạo thư mục app
WORKDIR /usr/src/app

# Copy package.json & cài node deps
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8080
CMD ["node", "index.js"]
