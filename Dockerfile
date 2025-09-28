# Dùng Node.js
FROM node:20-slim

# Cài yt-dlp (Python cần)
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir yt-dlp && \
    rm -rf /var/lib/apt/lists/*

# Tạo thư mục app
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Cài dependencies
RUN npm install --omit=dev

# Copy source
COPY . .

# Expose cổng
EXPOSE 8080

# Run app
CMD ["node", "index.js"]
