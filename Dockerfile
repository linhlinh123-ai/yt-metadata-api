FROM node:18-slim

# Cài Python3 để chạy yt-dlp
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip \
  && pip3 install --no-cache-dir yt-dlp \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
