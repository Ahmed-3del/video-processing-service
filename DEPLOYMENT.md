# Deployment Guide

This guide covers various deployment options for the Video Processing Service, from local development to production environments.

## 🏠 Local Development

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- FFmpeg installed
- Cloudinary account

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `env.example` to `.env` and configure
4. Start MongoDB
5. Run: `npm run dev`

## 🐳 Docker Deployment

### Single Container Deployment

#### 1. Build the Image

```bash
docker build -t video-processing-service .
```

#### 2. Run the Container

```bash
docker run -d \
  --name video-service \
  -p 8080:8080 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/output_videos:/app/output_videos \
  video-processing-service
```

#### 3. Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/video-processing-service
      - JWT_SECRET=${JWT_SECRET}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    volumes:
      - ./uploads:/app/uploads
      - ./output_videos:/app/output_videos
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
```

#### 4. Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:8080;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        # File upload limits
        client_max_body_size 100M;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static file serving
        location /uploads/ {
            alias /app/uploads/;
            expires 1h;
            add_header Cache-Control "public, immutable";
        }

        location /output_videos/ {
            alias /app/output_videos/;
            expires 1h;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### 5. Deploy with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update and restart
docker-compose pull
docker-compose up -d --build
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Deployment

**Launch EC2 Instance:**

- AMI: Amazon Linux 2 or Ubuntu 20.04
- Instance Type: t3.medium or larger
- Storage: 20GB+ EBS volume

**Install Dependencies:**

```bash
# Update system
sudo yum update -y  # Amazon Linux
# or
sudo apt update && sudo apt upgrade -y  # Ubuntu

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
sudo apt install ffmpeg

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

**Deploy Application:**

```bash
# Clone repository
git clone <your-repo-url>
cd video-processing-service

# Install dependencies
npm install

# Build application
npm run build

# Configure environment
cp env.example .env
# Edit .env with your configuration

# Start with PM2
pm2 start dist/server.js --name "video-service"
pm2 startup
pm2 save
```

#### 2. AWS ECS Deployment

**Create ECS Task Definition:**

```json
{
  "family": "video-processing-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "video-service",
      "image": "your-account/video-processing-service:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "8080"
        }
      ],
      "secrets": [
        {
          "name": "MONGO_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:mongodb-uri"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/video-processing-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 3. AWS Lambda Deployment (Serverless)

**Create `serverless.yml`:**

```yaml
service: video-processing-service

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    NODE_ENV: production
    MONGO_URI: ${ssm:/video-service/mongo-uri}
    JWT_SECRET: ${ssm:/video-service/jwt-secret}
    CLOUDINARY_CLOUD_NAME: ${ssm:/video-service/cloudinary-name}
    CLOUDINARY_API_KEY: ${ssm:/video-service/cloudinary-key}
    CLOUDINARY_API_SECRET: ${ssm:/video-service/cloudinary-secret}

functions:
  api:
    handler: dist/server.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
    timeout: 30
    memorySize: 1024

plugins:
  - serverless-offline
  - serverless-dotenv-plugin
```

### Google Cloud Platform (GCP)

#### 1. App Engine Deployment

**Create `app.yaml`:**

```yaml
runtime: nodejs18
env: standard

instance_class: F2

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  NODE_ENV: production
  PORT: 8080

handlers:
  - url: /.*
    script: auto
    secure: always
```

**Deploy:**

```bash
gcloud app deploy
```

#### 2. Cloud Run Deployment

**Deploy:**

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/video-service

# Deploy to Cloud Run
gcloud run deploy video-service \
  --image gcr.io/PROJECT_ID/video-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300
```

### Azure Deployment

#### 1. Azure App Service

**Create `web.config`:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="dist/server.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^dist/server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="dist/server.js" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <requestLimits maxAllowedContentLength="104857600" />
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
```

## 🔒 Production Security

### Environment Variables

- Use strong, unique JWT secrets
- Store sensitive data in environment variables or secrets management
- Never commit `.env` files to version control

### SSL/TLS Configuration

- Always use HTTPS in production
- Configure proper SSL certificates (Let's Encrypt, AWS Certificate Manager)
- Set up HTTP to HTTPS redirects

### Security Headers

```javascript
// Add security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 uploads per windowMs
  message: 'Too many uploads from this IP, please try again later.'
});

app.use('/api/videos/upload', uploadLimiter);
```

## 📊 Monitoring & Logging

### Application Monitoring

```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Add metrics endpoint
app.get('/metrics', (req, res) => {
  res.status(200).json({
    requests: {
      total: requestCount,
      successful: successCount,
      failed: failedCount
    },
    videos: {
      total: videoCount,
      processing: processingCount,
      completed: completedCount
    }
  });
});
```

### Logging Configuration

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'video-processing-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🚀 CI/CD Pipeline

### GitHub Actions

**Create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Build Docker image
      run: docker build -t video-service .
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Push Docker image
      run: |
        docker tag video-service ${{ secrets.DOCKER_USERNAME }}/video-service:latest
        docker push ${{ secrets.DOCKER_USERNAME }}/video-service:latest
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          docker pull ${{ secrets.DOCKER_USERNAME }}/video-service:latest
          docker-compose down
          docker-compose up -d
```

## 🔧 Performance Optimization

### Database Optimization

- Add database indexes
- Implement connection pooling
- Use database caching (Redis)

### File Processing

- Implement video processing queues
- Use worker processes for heavy operations
- Implement file compression

### Caching Strategy

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache video metadata
const getVideoWithCache = async (videoId) => {
  const cached = await redis.get(`video:${videoId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const video = await Video.findById(videoId);
  if (video) {
    await redis.setex(`video:${videoId}`, 3600, JSON.stringify(video));
  }
  
  return video;
};
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check connection string
   - Verify network access
   - Check MongoDB logs

2. **FFmpeg Not Found**
   - Ensure FFmpeg is installed
   - Check PATH environment variable
   - Restart application after installation

3. **File Upload Failures**
   - Check file size limits
   - Verify file permissions
   - Check disk space

4. **Cloudinary Integration Issues**
   - Verify API credentials
   - Check cloud name configuration
   - Monitor API usage limits

### Debug Commands

```bash
# Check application logs
docker-compose logs -f app

# Check MongoDB logs
docker-compose logs -f mongo

# Check nginx logs
docker-compose logs -f nginx

# Monitor system resources
docker stats

# Access application shell
docker-compose exec app sh

# Check MongoDB connection
docker-compose exec app node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error(err));
"
```

## 📈 Scaling Considerations

### Horizontal Scaling

- Use load balancers
- Implement session management
- Use shared storage for uploads

### Vertical Scaling

- Increase container resources
- Optimize database queries
- Implement caching layers

### Microservices Architecture

- Split video processing into separate service
- Use message queues for communication
- Implement service discovery

---

For more information, refer to the main [README.md](README.md) and [API_USAGE.md](API_USAGE.md) files.
