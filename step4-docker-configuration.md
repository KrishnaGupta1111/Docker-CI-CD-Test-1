# Step 4: Create Docker Configuration and Deploy Your Complete Application

## What We'll Do:

1. Create Dockerfile for your Node.js backend
2. Create Dockerfile for your React frontend
3. Create docker-compose.yml for complete application (Frontend + Backend + MongoDB)
4. Deploy your complete application to AWS EC2
5. Test that everything is running

## Prerequisites:

- ✅ EC2 instance running
- ✅ Docker installed and working
- ✅ Docker Compose installed
- ✅ SSH connection to your server

## Step-by-Step Process:

### 1. Create Application Directory

First, let's create a directory for your application on the server:

```bash
# Create app directory
mkdir ~/imagify-app
cd ~/imagify-app
```

### 2. Create Backend Dockerfile

Create a Dockerfile for your Node.js backend:

```bash
# Create backend Dockerfile
nano Dockerfile.backend
```

**Copy and paste this content into the nano editor:**

```dockerfile
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server/ .

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
```

**To save in nano:**

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### 3. Create Frontend Dockerfile

Create a Dockerfile for your React frontend:

```bash
# Create frontend Dockerfile
nano Dockerfile.frontend
```

**Copy and paste this content into the nano editor:**

```dockerfile
# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY client/ .

# Build the app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**To save in nano:**

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### 4. Create Nginx Configuration

```bash
# Create nginx configuration
nano nginx.conf
```

**Copy and paste this content:**

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:4000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

**Save the file (Ctrl + X, Y, Enter)**

### 5. Create Complete docker-compose.yml

```bash
# Create docker-compose.yml
nano docker-compose.yml
```

**Copy and paste this content:**

```yaml
version: "3.8"

services:
  # MongoDB Database
  mongodb:
    image: mongo:6.0
    container_name: imagify-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: imagify
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - imagify-network

  # Backend API
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: imagify-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=4000
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/imagify?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    ports:
      - "4000:4000"
    depends_on:
      - mongodb
    networks:
      - imagify-network

  # Frontend React App
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: imagify-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - imagify-network

volumes:
  mongodb_data:

networks:
  imagify-network:
    driver: bridge
```

**Save the file (Ctrl + X, Y, Enter)**

### 6. Create .env File

```bash
# Create .env file
nano .env
```

**Add your environment variables (replace with your actual values):**

```env
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Save the file (Ctrl + X, Y, Enter)**

### 7. Copy Your Complete Application Code

Now we need to copy your complete application (frontend + backend) to the server:

#### Option A: Copy from your local machine (Recommended)

```bash
# From your local machine, copy the entire project
scp -i "C:\aws-keys\imagify-key.pem" -r . ubuntu@13.62.100.132:~/imagify-app/
```

#### Option B: Copy individual folders

```bash
# Copy backend
scp -i "C:\aws-keys\imagify-key.pem" -r server/ ubuntu@13.62.100.132:~/imagify-app/

# Copy frontend
scp -i "C:\aws-keys\imagify-key.pem" -r client/ ubuntu@13.62.100.132:~/imagify-app/
```

#### Option C: Create test files (if you don't have the complete project)

If you don't have your complete project locally, we can create test files for now:

```bash
# Create test backend
mkdir -p server
nano server/server.js
```

**Add this test backend content:**

```javascript
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Imagify Backend API is running on AWS EC2!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
```

```bash
# Create test package.json for backend
nano server/package.json
```

**Add this content:**

```json
{
  "name": "imagify-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

```bash
# Create test frontend
mkdir -p client
nano client/index.html
```

**Add this test frontend content:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Imagify - Running on AWS EC2</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 50px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
      }
      .success {
        color: green;
      }
      .info {
        color: blue;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎉 Imagify Application</h1>
      <p class="success">Successfully deployed on AWS EC2 with Docker!</p>
      <p class="info">Frontend: React (Port 80)</p>
      <p class="info">Backend: Node.js (Port 4000)</p>
      <p class="info">Database: MongoDB (Port 27017)</p>
      <button onclick="testAPI()">Test Backend API</button>
      <div id="result"></div>
    </div>
    <script>
      async function testAPI() {
        try {
          const response = await fetch("/api/health");
          const data = await response.json();
          document.getElementById(
            "result"
          ).innerHTML = `<p>API Response: ${JSON.stringify(data)}</p>`;
        } catch (error) {
          document.getElementById(
            "result"
          ).innerHTML = `<p>Error: ${error.message}</p>`;
        }
      }
    </script>
  </body>
</html>
```

### 8. Build and Run Your Complete Application

```bash
# Build all Docker images
docker-compose build

# Start all services
docker-compose up -d

# Check if all services are running
docker-compose ps

# Check logs for all services
docker-compose logs

# Check logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### 9. Test Your Complete Application

```bash
# Test backend API locally on the server
curl http://localhost:4000

# Test frontend locally on the server
curl http://localhost:80

# Test from your local machine - Frontend
curl http://13.62.100.132:80

# Test from your local machine - Backend API
curl http://13.62.100.132:4000

# Test MongoDB connection (optional)
docker exec imagify-mongodb mongosh --eval "db.runCommand('ping')"
```

## What You've Accomplished:

- ✅ Created Docker configuration for complete application
- ✅ Set up multi-container architecture (Frontend + Backend + MongoDB)
- ✅ Configured Nginx reverse proxy
- ✅ Built and deployed complete application
- ✅ Full-stack application running on AWS EC2

## Next Steps:

Once your application is running, tell me:

1. "Complete application deployed successfully"
2. The output of `curl http://13.62.100.132:80` (frontend)
3. The output of `curl http://13.62.100.132:4000` (backend)
4. Any error messages if something went wrong

Then I'll create the final step for GitHub Actions CI/CD!

## 🎯 What You'll Have:

- **Frontend**: React app running on port 80 (http://13.62.100.132)
- **Backend**: Node.js API running on port 4000 (http://13.62.100.132:4000)
- **Database**: MongoDB running on port 27017
- **Nginx**: Reverse proxy handling frontend/backend routing
- **Docker**: All services containerized and orchestrated

## Troubleshooting:

**If build fails:**

- Check that all files are created correctly
- Verify package.json has correct dependencies

**If container won't start:**

- Check logs: `docker-compose logs`
- Verify .env file has correct values

**If can't access from outside:**

- Check security group has port 4000 open
- Verify container is running: `docker-compose ps`

---

**Ready to create your complete Docker configuration? Start with creating the app directory!**

## 🎉 Resume Benefits:

- ✅ **Full-stack containerization**: Frontend, Backend, Database
- ✅ **Multi-container orchestration**: Docker Compose
- ✅ **Production deployment**: Nginx reverse proxy
- ✅ **Database containerization**: MongoDB in Docker
- ✅ **Complete AWS deployment**: All services on EC2
