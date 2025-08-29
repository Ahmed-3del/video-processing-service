# API Usage Guide

This guide provides detailed examples of how to use the Video Processing Service API endpoints.

## 🔐 Authentication

Most API endpoints require JWT authentication. You'll need to register a user and then login to get a JWT token.

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "profilePicture": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "profilePicture": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Save the token for subsequent requests:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 👤 User Management

### 3. Get User Profile

**Endpoint:** `GET /api/user/profile`

**Request:**
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "profilePicture": "https://res.cloudinary.com/example/image/upload/v123/profile.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update User Profile

**Endpoint:** `PATCH /api/user/profile`

**Request (Update username only):**
```bash
curl -X PATCH http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -F "username=new_username"
```

**Request (Update profile picture):**
```bash
curl -X PATCH http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -F "profilePicture=@/path/to/profile.jpg"
```

**Request (Update both):**
```bash
curl -X PATCH http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -F "username=new_username" \
  -F "profilePicture=@/path/to/profile.jpg"
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "new_username",
    "profilePicture": "https://res.cloudinary.com/example/image/upload/v123/profile.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Get User Uploads

**Endpoint:** `GET /api/user/uploads`

**Request:**
```bash
curl -X GET http://localhost:8080/api/user/uploads \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "uploads": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My First Video",
      "description": "A sample video",
      "filename": "video.mp4",
      "cloudinaryUrl": "https://res.cloudinary.com/example/video/upload/v123/video.mp4",
      "thumbnailUrl": "https://res.cloudinary.com/example/image/upload/v123/thumbnail.jpg",
      "duration": 120.5,
      "size": 10485760,
      "owner": "507f1f77bcf86cd799439011",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

## 🎥 Video Management

### 6. List All Videos

**Endpoint:** `GET /api/videos`

**Request (Basic):**
```bash
curl -X GET http://localhost:8080/api/videos
```

**Request (With pagination):**
```bash
curl -X GET "http://localhost:8080/api/videos?page=1&limit=5"
```

**Request (With search):**
```bash
curl -X GET "http://localhost:8080/api/videos?search=amazing"
```

**Response:**
```json
{
  "videos": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My Amazing Video",
      "description": "This is a description of my video",
      "filename": "video.mp4",
      "cloudinaryUrl": "https://res.cloudinary.com/example/video/upload/v123/video.mp4",
      "thumbnailUrl": "https://res.cloudinary.com/example/image/upload/v123/thumbnail.jpg",
      "duration": 120.5,
      "size": 10485760,
      "owner": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe"
      },
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 7. Upload Video

**Endpoint:** `POST /api/videos/upload`

**Request:**
```bash
curl -X POST http://localhost:8080/api/videos/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "title=My Amazing Video" \
  -F "description=This is a description of my video" \
  -F "duration=120.5"
```

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "video": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My Amazing Video",
    "description": "This is a description of my video",
    "filename": "video.mp4",
    "cloudinaryUrl": "https://res.cloudinary.com/example/video/upload/v123/video.mp4",
    "thumbnailUrl": "https://res.cloudinary.com/example/image/upload/v123/thumbnail.jpg",
    "duration": 120.5,
    "size": 10485760,
    "owner": "507f1f77bcf86cd799439011",
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** The `duration` field is optional and will be automatically detected if not provided.

### 8. Get Video by ID

**Endpoint:** `GET /api/videos/{id}`

**Request:**
```bash
curl -X GET http://localhost:8080/api/videos/507f1f77bcf86cd799439012
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "My Amazing Video",
  "description": "This is a description of my video",
  "filename": "video.mp4",
  "cloudinaryUrl": "https://res.cloudinary.com/example/video/upload/v123/video.mp4",
  "thumbnailUrl": "https://res.cloudinary.com/example/image/upload/v123/thumbnail.jpg",
  "duration": 120.5,
  "size": 10485760,
  "owner": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe"
  },
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 9. Delete Video

**Endpoint:** `DELETE /api/videos/{id}`

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/videos/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

## 🧪 Testing Protected Routes

### 10. Test Authentication

**Endpoint:** `GET /dashboard`

**Request:**
```bash
curl -X GET http://localhost:8080/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "message": "Protected route accessed"
}
```

## 📱 JavaScript/Node.js Examples

### Using Fetch API (Browser)

```javascript
// Login
const login = async (username, password) => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Upload video
const uploadVideo = async (videoFile, title, description) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('title', title);
  formData.append('description', description);
  
  const response = await fetch('http://localhost:8080/api/videos/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  
  return await response.json();
};

// Get videos
const getVideos = async () => {
  const response = await fetch('http://localhost:8080/api/videos');
  return await response.json();
};
```

### Using Axios (Node.js)

```javascript
const axios = require('axios');

// Configure base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = process.env.TOKEN || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

// Upload video
const uploadVideo = async (videoPath, title, description) => {
  const FormData = require('form-data');
  const fs = require('fs');
  
  const form = new FormData();
  form.append('video', fs.createReadStream(videoPath));
  form.append('title', title);
  form.append('description', description);
  
  const response = await api.post('/api/videos/upload', form, {
    headers: form.getHeaders(),
  });
  
  return response.data;
};

// Get user profile
const getProfile = async () => {
  const response = await api.get('/api/user/profile');
  return response.data;
};
```

### Using Python

```python
import requests
import json

# Base configuration
BASE_URL = "http://localhost:8080"
TOKEN = None

# Login
def login(username, password):
    global TOKEN
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "username": username,
        "password": password
    })
    data = response.json()
    TOKEN = data["token"]
    return data

# Upload video
def upload_video(video_path, title, description=""):
    global TOKEN
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    with open(video_path, "rb") as video_file:
        files = {"video": video_file}
        data = {"title": title, "description": description}
        
        response = requests.post(
            f"{BASE_URL}/api/videos/upload",
            headers=headers,
            files=files,
            data=data
        )
    
    return response.json()

# Get videos
def get_videos():
    response = requests.get(f"{BASE_URL}/api/videos")
    return response.json()

# Usage example
if __name__ == "__main__":
    # Login
    login("john_doe", "securePassword123")
    
    # Upload video
    result = upload_video("video.mp4", "My Video", "A sample video")
    print(f"Uploaded: {result}")
    
    # Get videos
    videos = get_videos()
    print(f"Total videos: {len(videos['videos'])}")
```

## 🚨 Error Handling

### Common HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **413** - Payload Too Large (file too big)
- **500** - Internal Server Error

### Error Response Format

```json
{
  "message": "Error description",
  "error": "ErrorType",
  "details": {
    "field": "additional error details"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Handling Errors in JavaScript

```javascript
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      console.error('API Error:', errorData.message);
      
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        // Redirect to login
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    throw error;
  }
};
```

## 📊 Rate Limiting & Best Practices

### Rate Limiting
- **Upload endpoints**: Consider implementing rate limiting for video uploads
- **Authentication**: Limit login attempts to prevent brute force attacks
- **General API**: Implement rate limiting per IP/user

### Best Practices
1. **Always handle errors gracefully**
2. **Validate file types and sizes before upload**
3. **Use HTTPS in production**
4. **Implement proper logging**
5. **Monitor API usage and performance**
6. **Cache frequently accessed data**
7. **Use pagination for large datasets**
8. **Implement proper CORS policies**

## 🔍 Testing the API

### Using Postman
1. Import the Swagger specification from `/api-docs`
2. Set up environment variables for base URL and token
3. Test all endpoints with proper authentication

### Using cURL
All examples above use cURL for easy testing from command line.

### Using Swagger UI
Visit `/api-docs` in your browser for interactive API testing.

---

For more information, check the main [README.md](README.md) file or visit the Swagger documentation at `/api-docs`.
