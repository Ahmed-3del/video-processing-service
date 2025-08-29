# Video Processing Service

A robust and scalable video processing service built with Node.js, Express, and TypeScript. This service provides video upload, processing, and management capabilities with cloud storage integration using Cloudinary.

## 🚀 Features

- **User Authentication**: JWT-based authentication system with user registration and login
- **Video Upload**: Support for multiple video formats with automatic processing
- **Cloud Storage**: Integration with Cloudinary for video and image storage
- **Video Processing**: Automatic video processing and thumbnail generation
- **User Management**: User profiles, uploads tracking, and profile picture management
- **RESTful API**: Clean and well-documented REST API endpoints
- **TypeScript**: Built with TypeScript for better type safety and developer experience
- **MongoDB**: MongoDB database with Mongoose ODM
- **File Upload**: Multer middleware for handling multipart form data
- **Swagger Documentation**: Interactive API documentation

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Video Processing**: FFmpeg
- **Documentation**: Swagger/OpenAPI 3.0
- **Development**: tsx, nodemon

## 📋 Prerequisites

Before running this service, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **FFmpeg** (for video processing)

### Installing FFmpeg

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install ffmpeg
```

#### macOS

```bash
brew install ffmpeg
```

#### Windows

Download from [FFmpeg official website](https://ffmpeg.org/download.html) or use Chocolatey:

```bash
choco install ffmpeg
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd video-processing-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/video-processing-service
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/video-processing-service

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# File Upload Configuration
MAX_FILE_SIZE=100000000
UPLOAD_PATH=uploads/
OUTPUT_PATH=output_videos/
```

### 4. Start the Service

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm run serve
```

The service will be available at `http://localhost:8080`

### 5. Access API Documentation

Visit `http://localhost:8080/api-docs` to access the interactive Swagger documentation.

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://your-domain.com`

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### User Management

- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/uploads` - Get user uploads

#### Video Management

- `GET /api/videos` - List all videos
- `POST /api/videos/upload` - Upload and process video
- `GET /api/videos/:id` - Get video by ID
- `DELETE /api/videos/:id` - Delete video

#### Dashboard

- `GET /dashboard` - Test protected route

For detailed API documentation, visit `/api-docs` when the service is running.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 8080 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | 7d | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | Yes |
| `MAX_FILE_SIZE` | Maximum file size in bytes | 100000000 | No |
| `UPLOAD_PATH` | Upload directory path | uploads/ | No |
| `OUTPUT_PATH` | Output directory path | output_videos/ | No |

### File Upload Limits

- **Maximum file size**: 100MB (configurable)
- **Supported video formats**: MP4, AVI, MOV, MKV, WMV, FLV
- **Supported image formats**: JPG, PNG, GIF, WebP

## 🗄️ Database Schema

### User Model

```typescript
{
  username: string (unique, required),
  password: string (hashed, required),
  profilePicture: string (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Video Model

```typescript
{
  title: string (required),
  description: string,
  filename: string (required),
  cloudinaryUrl: string (Cloudinary URL),
  thumbnailUrl: string (Cloudinary URL),
  duration: number,
  size: number,
  owner: ObjectId (ref: User),
  status: string (processing|completed|failed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t video-processing-service .
```

2. Run the container:

```bash
docker run -p 8080:8080 --env-file .env video-processing-service
```

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Start the production server:

```bash
npm run serve
```

### Environment-Specific Configurations

#### Production

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB Atlas or production MongoDB
- Set up proper CORS policies
- Configure reverse proxy (nginx/Apache)

#### Staging

- Set `NODE_ENV=staging`
- Use staging database
- Configure staging Cloudinary account

## 🧪 Testing

Currently, the project doesn't have automated tests. To add testing:

```bash
npm install --save-dev jest @types/jest supertest @types/supertest
```

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 📁 Project Structure

```
video-processing-service/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/                # Configuration files
│   │   └── cloudinary.ts      # Cloudinary configuration
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts # Authentication logic
│   │   ├── user.controller.ts # User management logic
│   │   └── video.controller.ts # Video processing logic
│   ├── docs/                  # API documentation
│   │   └── swagger.yaml       # Swagger specification
│   ├── middleware/            # Custom middleware
│   │   └── auth.middleware.ts # JWT authentication
│   ├── models/                # Database models
│   │   ├── user.model.ts      # User schema
│   │   └── video.model.ts     # Video schema
│   ├── routes/                # API routes
│   │   ├── auth.routes.ts     # Authentication routes
│   │   ├── user.routes.ts     # User management routes
│   │   ├── video.routes.ts    # Video management routes
│   │   └── protected.routes.ts # Protected routes
│   └── services/              # Business logic
│       ├── cloudinary.service.ts # Cloudinary operations
│       ├── user.service.ts    # User operations
│       └── video.service.ts   # Video processing
├── uploads/                   # Temporary upload directory
├── output_videos/             # Processed video output
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── Dockerfile                 # Docker configuration
└── README.md                  # This file
```

## 🔒 Security Considerations

- **JWT Tokens**: Use strong, unique secrets
- **Password Hashing**: Passwords are hashed using bcrypt
- **File Validation**: Implement file type and size validation
- **Rate Limiting**: Consider implementing rate limiting for uploads
- **CORS**: Configure CORS policies for production
- **Environment Variables**: Never commit sensitive data to version control

## 🚨 Common Issues & Solutions

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string format
- Verify network access for MongoDB Atlas

### FFmpeg Not Found

- Install FFmpeg system-wide
- Add FFmpeg to system PATH
- Restart terminal after installation

### File Upload Failures

- Check file size limits
- Verify supported file formats
- Ensure upload directory has write permissions

### Cloudinary Integration Issues

- Verify API credentials
- Check cloud name configuration
- Ensure proper file format support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include error logs and environment details

## 🔮 Roadmap

- [ ] Add automated testing suite
- [ ] Implement video streaming capabilities
- [ ] Add video compression options
- [ ] Implement user roles and permissions
- [ ] Add video analytics and metrics
- [ ] Implement WebSocket for real-time updates
- [ ] Add video transcoding options
- [ ] Implement CDN integration
- [ ] Add admin dashboard
- [ ] Implement video search and filtering

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Cloud storage
- [FFmpeg](https://ffmpeg.org/) - Video processing
- [Swagger](https://swagger.io/) - API documentation

---

**Happy coding! 🎉**
