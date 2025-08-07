# Book Online Shop API

A comprehensive RESTful API for an online bookstore built with Node.js, Express.js, Sequelize ORM, and PostgreSQL. This API provides complete functionality for book management, user authentication, order processing, reviews, and address management.

## 🚀 Features

- **User Authentication & Authorization** with JWT tokens and role-based permissions
- **Book Management** with categories, authors, and reviews
- **Order Processing** with cash and Stripe payment integration
- **Review System** with ratings and distribution analytics
- **Address Management** for shipping (Province, District, Commune, Village hierarchy)
- **Stock Management** with quantity validation
- **Comprehensive Error Handling** and validation

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Payment Processing**: Stripe
- **Validation**: validator.js
- **CORS**: Cross-Origin Resource Sharing enabled

## 📋 Prerequisites

- Node.js (v14+)
- PostgreSQL database
- Stripe account (for payment processing)

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
DB_NAME=your_database_name
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run database migrations and seeders
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Include the JWT token in the request headers:
```
token: your_jwt_token_here
```

---

## 👤 User Management

### Register User
```http
POST /api/users/register
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone_number": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

### Login User
```http
POST /api/users/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### Get User Profile
```http
GET /api/users/profile
```
**Headers:** `token: jwt_token`

**Response:**
```json
{
  "success": true,
  "data": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "joinDate": "2024-01-15T10:30:00.000Z",
    "totalOrders": 5,
    "totalSpent": 129.99
  }
}
```

### Get Number of Customers
```http
GET /api/users/number
```
**Headers:** `token: jwt_token` (requires `select.user` permission)

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 150
  }
}
```

---

## 📖 Book Management

### Get All Books
```http
GET /api/books
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Learning JavaScript",
      "price": 19.99,
      "stock_quantity": 10,
      "image_url": "https://example.com/image.jpg",
      "averageRating": 4.5,
      "totalReviews": 25,
      "Author": {
        "first_name": "John",
        "last_name": "Doe"
      },
      "Category": {
        "category_name": "Programming"
      }
    }
  ]
}
```

### Get Book by ID
```http
GET /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Learning JavaScript",
    "description": "A comprehensive guide to modern JavaScript development",
    "price": 19.99,
    "stock_quantity": 10,
    "image_url": "https://example.com/image.jpg",
    "isbn": "9781234567897",
    "Author": {
      "first_name": "John",
      "last_name": "Doe"
    },
    "Category": {
      "category_name": "Programming"
    },
    "rating": 4.5,
    "totalReviews": 25,
    "ratingDistribution": [
      {
        "rating": 5,
        "total": 15,
        "percentage": 60
      },
      {
        "rating": 4,
        "total": 8,
        "percentage": 32
      }
    ]
  }
}
```

### Get All Categories
```http
GET /api/books/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category_name": "Programming",
      "description": "Books about coding and software development"
    }
  ]
}
```

### Get Number of Books
```http
GET /api/books/number
```

**Response:**
```json
{
  "success": true,
  "data": 50
}
```

---

## 🛒 Order Management

### Place Order (Cash Payment)
```http
POST /api/orders/place-order
```
**Headers:** `token: jwt_token`

**Request Body:**
```json
{
  "items": {
    "1": 2,
    "2": 1
  },
  "totalAmount": 65.97,
  "village_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully"
}
```

### Place Order (Stripe Payment)
```http
POST /api/orders/place-order-stripe
```
**Headers:** `token: jwt_token`

**Request Body:**
```json
{
  "items": {
    "1": 2,
    "2": 1
  },
  "amount": 65.97,
  "village_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "session_url": "https://checkout.stripe.com/pay/session_id"
}
```

### Verify Stripe Payment
```http
POST /api/orders/verify-payment?orderId=123&success=true
```
**Headers:** `token: jwt_token`

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Get Order History
```http
GET /api/orders/history
```
**Headers:** `token: jwt_token`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2024-01-15T10:30:00.000Z",
      "status": "pending",
      "total": 65.97,
      "paymentStatus": false,
      "paymentMethod": "cash",
      "items": [
        {
          "title": "Learning JavaScript",
          "author": "John Doe",
          "price": 19.99,
          "quantity": 2
        }
      ]
    }
  ]
}
```

### Get Number of Orders
```http
GET /api/orders/number
```

**Response:**
```json
{
  "success": true,
  "data": 75
}
```

---

## ⭐ Review Management

### Add Review
```http
POST /api/reviews
```
**Headers:** `token: jwt_token`

**Request Body:**
```json
{
  "book_id": 1,
  "rating": 5,
  "comment": "Excellent book for learning JavaScript!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "id": 1,
    "book_id": 1,
    "user_id": 1,
    "rating": 5,
    "comment": "Excellent book for learning JavaScript!"
  }
}
```

### Get Reviews by Book
```http
GET /api/reviews/:bookId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent book for learning JavaScript!",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "User": {
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ]
}
```

### Get User's Reviews
```http
GET /api/reviews/my-reviews
```
**Headers:** `token: jwt_token`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great book!",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "Book": {
        "title": "Learning JavaScript",
        "Author": {
          "first_name": "John",
          "last_name": "Doe"
        }
      }
    }
  ]
}
```

### Get Rating Distribution
```http
GET /api/reviews/:bookId/rating-distribution
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rating": 5,
      "count": 15,
      "percentage": 60
    },
    {
      "rating": 4,
      "count": 8,
      "percentage": 32
    }
  ]
}
```

---

## 📍 Address Management

### Get User Address
```http
GET /api/address/user
```
**Headers:** `token: jwt_token`

**Response:**
```json
{
  "success": true,
  "data": {
    "village_id": 123,
    "Village": {
      "village_name": "Village Name",
      "Commune": {
        "commune_name": "Commune Name",
        "District": {
          "district_name": "District Name",
          "Province": {
            "province_name": "Province Name"
          }
        }
      }
    }
  }
}
```

### Get Provinces
```http
GET /api/address/provinces
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "province_name": "Phnom Penh"
    }
  ]
}
```

### Get Districts
```http
GET /api/address/districts?province_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "district_name": "Chamkar Mon",
      "province_id": 1
    }
  ]
}
```

### Get Communes
```http
GET /api/address/communes?district_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "commune_name": "Tonle Bassac",
      "district_id": 1
    }
  ]
}
```

### Get Villages
```http
GET /api/address/villages?commune_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "village_name": "Village 1",
      "commune_id": 1
    }
  ]
}
```

---

## 🔒 Authentication & Authorization

### Roles & Permissions

The API implements role-based access control:

- **Superadmin (role_id: 1)**: Full system access
- **Customer (role_id: 2)**: Standard user access

### Protected Routes

Routes marked with **🔒** require authentication token.
Routes marked with **👑** require specific permissions.

### Error Responses

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "message": "Permission Access Denied"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "All fields are required"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## 📊 Database Schema

### Key Models

- **User**: Customer information and authentication
- **Book**: Book catalog with details
- **Author**: Book authors
- **Category**: Book categories
- **Review**: User reviews and ratings
- **Order**: Purchase orders
- **CartItem**: Items in orders
- **Role**: User roles
- **Permission**: System permissions
- **Address Hierarchy**: Province → District → Commune → Village

---

## 🧪 Testing

Use tools like Postman, Insomnia, or cURL to test the API endpoints. Make sure to:

1. Register a user first
2. Login to get the JWT token
3. Include the token in protected route headers
4. Test with valid and invalid data

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed using bcrypt
- JWT tokens expire based on server configuration
- Stock quantities are validated before order processing
- Stripe integration requires proper webhook setup for production

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.
