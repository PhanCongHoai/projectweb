# Sử dụng Node.js base image
FROM node:18

# Set thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng backend
EXPOSE 5005

# Lệnh chạy server
CMD ["npm", "start"]
