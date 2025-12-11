# Skillverse Backend API

Complete Node.js/Express backend for the Skillverse Play & Learn platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- MongoDB will run on `mongodb://localhost:27017/skillverse`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 3. Configure Environment Variables

Edit `server/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 4. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update User Details
```http
PUT /api/auth/updatedetails
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "New bio"
}
```

---

### Course Endpoints

#### Get All Courses
```http
GET /api/courses
GET /api/courses?category=Web Development
GET /api/courses?level=Beginner
GET /api/courses?search=python
```

#### Get Single Course
```http
GET /api/courses/:id
```

#### Create Course (Instructor/Admin only)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Web Development",
  "description": "Learn full stack development",
  "instructor": "Jane Smith",
  "category": "Web Development",
  "level": "Beginner",
  "duration": "12 weeks",
  "rating": 4.8,
  "price": 0
}
```

#### Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
```

#### Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

#### Enroll in Course
```http
POST /api/courses/:id/enroll
Authorization: Bearer <token>
```

#### Get Enrolled Courses
```http
GET /api/courses/enrolled
Authorization: Bearer <token>
```

---

### Event Endpoints

#### Get All Events
```http
GET /api/events
GET /api/events?category=technical
GET /api/events?location=In Campus
GET /api/events?mode=offline
```

#### Get Single Event
```http
GET /api/events/:id
```

#### Create Event (Admin only)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hackathon 2024",
  "description": "24-hour coding challenge",
  "category": "hackathons",
  "type": "Competition",
  "mode": "offline",
  "date": "Dec 15, 2024",
  "time": "9:00 AM",
  "duration": "24 hours",
  "location": "In Campus",
  "venue": "Main Hall",
  "maxAttendees": 100,
  "organizer": "Tech Club",
  "contact": "tech@university.edu"
}
```

#### Register for Event
```http
POST /api/events/:id/register
Authorization: Bearer <token>
```

#### Unregister from Event
```http
DELETE /api/events/:id/register
Authorization: Bearer <token>
```

#### Get Registered Events
```http
GET /api/events/registered
Authorization: Bearer <token>
```

---

### User Endpoints (Admin only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Get Single User
```http
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **student**: Can enroll in courses and register for events
- **instructor**: Can create and manage courses
- **admin**: Full access to all resources

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── courseController.js   # Course operations
│   ├── eventController.js    # Event operations
│   └── userController.js     # User management
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Course.js            # Course schema
│   ├── Event.js             # Event schema
│   └── Enrollment.js        # Enrollment schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── courses.js           # Course routes
│   ├── events.js            # Event routes
│   └── users.js             # User routes
├── .env                     # Environment variables
├── package.json             # Dependencies
└── server.js                # Entry point
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get courses
curl http://localhost:5000/api/courses
```

### Using Postman or Thunder Client
1. Import the endpoints
2. Set Authorization header with Bearer token
3. Test all routes

---

## 🔧 Environment Variables



| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/skillverse |
| `JWT_SECRET` | Secret key for JWT | - |
| `JWT_EXPIRE` | Token expiration | 7d |
| `CLIENT_URL` | Frontend URL | http://localhost:5173 |

---

## 🚨 Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port 5000

### JWT Error
- Make sure `JWT_SECRET` is set in `.env`
- Token might be expired, login again

---

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **morgan**: HTTP request logger
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variables

---

## 🎯 Next Steps

1. **Install MongoDB** (local or Atlas)
2. **Run `npm install`** in server folder
3. **Configure `.env`** file
4. **Start server** with `npm run dev`
5. **Test endpoints** with Postman/cURL
6. **Connect frontend** to backend API

---

## 📞 Support

For issues or questions, check the code comments or create an issue in the repository.

Happy coding! 🚀
