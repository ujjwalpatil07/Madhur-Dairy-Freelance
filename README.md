# Madhur Dairy and Daily Needs – AI-Integrated MERN Stack Dairy E-Commerce Platform

## 📌 About the Project

**Madhur Dairy and Daily Needs** is a full-featured dairy product e-commerce platform built using the **MERN Stack** — MongoDB, Express.js, React.js, and Node.js.

The platform provides a complete online dairy shopping experience with secure authentication, product browsing, cart management, order processing, online and cash-on-delivery payments, product reviews, and an administrative management system.

The project also integrates modern technologies such as **Google OAuth, EmailJS, Cloudinary, Razorpay, and AI-powered assistance** to simulate a real-world e-commerce application.

---

## 🎯 Key Highlights

- Full-stack MERN architecture
- Responsive customer-facing shopping platform
- Dedicated admin dashboard
- Secure JWT-based authentication
- Google OAuth authentication
- Email OTP verification
- Product and inventory management
- Shopping cart and checkout
- Razorpay online payments
- Cash on Delivery
- Order management and tracking
- Product reviews and ratings
- Cloudinary image management
- AI-powered customer assistance
- MongoDB-based persistent data storage

---

## 🔧 Technology Stack

### 🖥️ Frontend

- React.js
- Vite
- Tailwind CSS
- Material UI
- Chart.js
- Axios
- EmailJS
- Google OAuth
- Razorpay Checkout
- Cloudinary
- Responsive UI design

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- RESTful APIs
- Cloudinary
- Razorpay

### 🤖 AI Service

- Python
- FastAPI
- LangChain
- LangGraph
- Google Gemini
- AI tool-calling
- Context-aware application assistance

---

## 🛒 Core Features

### 👤 Customer Features

#### Authentication

- User registration and login
- JWT-based authentication
- Google OAuth login
- Email OTP verification
- Secure password handling

#### Product Browsing

- Browse available dairy products
- Product search
- Category-based filtering
- Product details
- Related products
- Product availability information

#### Cart & Checkout

- Add products to cart
- Update product quantities
- Remove products from cart
- Cart total calculation
- Address management
- Checkout process
- Cash on Delivery
- Razorpay online payment

#### Orders

- Place orders
- View order history
- View order details
- Track order status
- Payment status tracking

#### Reviews

- Product ratings
- Product reviews
- Review interaction

#### Profile

- Manage profile information
- Manage saved addresses
- Manage wishlist
- Update profile picture

#### AI Assistant

The integrated AI assistant helps users with application-related queries such as:

- Finding products
- Searching products
- Getting product information
- Checking available products
- Viewing order history
- Checking order status
- Answering product-related questions

---

## 🛠️ Admin Panel

### Product Management

- Add new products
- Update products
- Delete products
- Manage product images
- Manage product pricing
- Manage product inventory
- Manage product availability

### Order Management

- View all customer orders
- View customer-specific order history
- Accept and process orders
- Update order status
- Manage order payment information

### Customer Management

- View registered customers
- View customer information
- View customer order history

### Analytics

- Dashboard statistics
- Product and order insights
- Inventory monitoring
- Data visualization using Chart.js

---

## 🤖 AI Architecture

The AI functionality is implemented as a dedicated Python service rather than being tightly coupled with the main Node.js backend.

```text
                    ┌──────────────────────┐
                    │     React Client     │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js / Express  │
                    │       Backend        │
                    └───────┬────────┬─────┘
                            │        │
                      MongoDB│        │AI Request
                            │        │
                            ▼        ▼
                     ┌────────────┐ ┌─────────────────┐
                     │  MongoDB   │ │  FastAPI AI     │
                     │ + Mongoose │ │    Service      │
                     └────────────┘ └────────┬────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  LangGraph  │
                                      └──────┬──────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  LangChain  │
                                      └──────┬──────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │    Gemini   │
                                      └─────────────┘
```

The AI service communicates with the main backend through controlled APIs and does not directly manipulate the application's MongoDB database.

---

## 🗄️ Database

The application uses **MongoDB** with **Mongoose** as the ODM.

### Main Collections

```text
User
├── Authentication information
├── Profile information
├── Addresses
├── Wishlist
└── Account information

Product
├── Product information
├── Category
├── Pricing
├── Images
├── Inventory
└── Availability

Cart
├── User reference
├── Product reference
└── Quantity

Order
├── User reference
├── Ordered products
├── Delivery address
├── Pricing
├── Order status
└── Payment information

Review
├── User reference
├── Product reference
├── Rating
└── Review content
```

---

# 🌐 API Documentation

The backend follows a modular REST API structure with resources grouped by domain.

## Authentication APIs

### Admin Authentication

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| POST   | `/auth/admin/login`               | Admin login               |
| POST   | `/auth/admin/get-admin`           | Get admin information     |
| POST   | `/auth/admin/update-password`     | Update admin password     |
| DELETE | `/auth/admin/delete-notification` | Delete admin notification |

### User Authentication

| Method | Endpoint                             | Description                          |
| ------ | ------------------------------------ | ------------------------------------ |
| POST   | `/auth/user/signup`                  | Register a new user                  |
| POST   | `/auth/user/login`                   | User login                           |
| POST   | `/auth/user/google-login`            | Google OAuth login                   |
| POST   | `/auth/user/verify-email`            | Verify user email                    |
| POST   | `/auth/user/reset-password`          | Reset user password                  |
| POST   | `/auth/user/signup/otp-verification` | Verify signup OTP                    |
| POST   | `/auth/user/signup/info-input`       | Submit additional signup information |
| POST   | `/auth/user/get-user`                | Get user information                 |
| DELETE | `/auth/user/delete-notification`     | Delete user notification             |
| GET    | `/auth/user/customers`               | Get registered customers             |
| GET    | `/auth/user/test-auth`               | Test authenticated user access       |

---

## User Profile APIs

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| PUT    | `/users/profile`       | Update user profile          |
| POST   | `/users/profile/data`  | Get user profile data        |
| POST   | `/users/profile/photo` | Update profile photo         |
| GET    | `/users/addresses`     | Get saved addresses          |
| POST   | `/users/addresses`     | Add a new address            |
| DELETE | `/users/addresses`     | Delete an address            |
| PUT    | `/users/addresses`     | Update an address            |
| GET    | `/users/wishlist`      | Get wishlisted products      |
| PUT    | `/users/wishlist`      | Add product to wishlist      |
| DELETE | `/users/wishlist`      | Remove product from wishlist |

For GET requests that retrieve user-specific addresses or wishlist data, the user ID is passed as a query parameter.

Example:

```text
GET /users/addresses?userId=<userId>
GET /users/wishlist?userId=<userId>
```

---

## Admin Profile APIs

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| PUT    | `/admin/profile` | Update admin profile |

---

## Product APIs

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/products`                     | Fetch available products   |
| GET    | `/products/search/:productName` | Search products            |
| PUT    | `/products/:productId/like`     | Like a product             |
| GET    | `/products/reviews/recent`      | Get recent product reviews |

Example:

```text
GET /products
GET /products/search/milk
PUT /products/<productId>/like
GET /products/reviews/recent
```

---

## Order APIs

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/orders`        | Get all orders        |
| POST   | `/orders/user`   | Get orders for a user |
| POST   | `/orders/admin`  | Get admin order data  |
| POST   | `/orders/status` | Get order status      |
| GET    | `/orders/recent` | Get recent orders     |

Example:

```text
POST /orders/user
POST /orders/status
GET /orders/recent
```

---

## Payment APIs

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/payments/razorpay` | Create a Razorpay payment order |

---

## Store APIs

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/stores`               | Get all stores          |
| POST   | `/stores/order-history` | Get store order history |

---

## PDF APIs

| Method | Endpoint                    | Description                      |
| ------ | --------------------------- | -------------------------------- |
| GET    | `/pdf/orders/:orderId/bill` | Generate/download order bill PDF |

Example:

```text
GET /pdf/orders/<orderId>/bill
```

---

## AI APIs

| Method | Endpoint   | Description                        |
| ------ | ---------- | ---------------------------------- |
| POST   | `/ai/chat` | Send a message to the AI assistant |

Example request:

```json
{
  "message": "Show me the available dairy products"
}
```

The AI assistant can use backend tools to retrieve product information, search products, retrieve order history, and check order status.

---

## API Architecture

The backend API is organized into resource-based modules:

```text
/auth
├── /admin
└── /user

/users
├── /profile
├── /addresses
└── /wishlist

/admin
└── /profile

/products

/orders

/payments

/stores

/pdf

/ai
```

This structure keeps related endpoints grouped together and follows a cleaner REST-oriented naming convention.

Protected endpoints use **JWT-based authentication and authorization**.

---

## 🔐 Security

The application implements multiple security mechanisms:

- JWT-based authentication
- Role-based admin authorization
- Password hashing using bcryptjs
- Protected customer and admin routes
- Server-side authorization checks
- Product and inventory validation
- Payment signature verification
- Secure environment variable configuration

---

## 🌐 Hosted Links

### Frontend

**Live Application:**
`https://madhurdairy.vercel.app`

### Backend

**Backend API:**
`https://madhur-dairy-nodeservice.onrender.com`

### AI Service

The AI service is deployed separately as a Python FastAPI service.

**AI Service:**
`https://madhur-dairy-aiservice.onrender.com`

---

## 📂 Project Structure

```text
MilkyWay-Farms/
│
├── Client/
│   └── React + Vite frontend
│
├── Server/
│   └── Node.js + Express backend
│
├── AIService/
│   └── Python + FastAPI + LangGraph AI service
│
├── README.md
└── .gitignore
```

---

## ⚙️ Local Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd MilkyWay-Farms
```

---

### 2. Setup Frontend

```bash
cd Client

npm install

npm run dev
```

Create a `.env` file inside `Client`:

```env
VITE_API_BASE_URL=<your_backend_url>

VITE_EMAILJS_SERVICE_ID=<your_emailjs_service_id>
VITE_EMAILJS_TEMPLATE_ID=<your_emailjs_template_id>
VITE_EMAILJS_PUBLIC_KEY=<your_emailjs_public_key>
```

---

### 3. Setup Backend

Open a new terminal:

```bash
cd Server

npm install

npm run dev
```

Create a `.env` file inside `Server`:

```env
PORT=9001

DB_URL=<your_mongodb_uri>

JWT_SECRET=<your_jwt_secret>

CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
RAZORPAY_WEBHOOK_SECRET=<your_razorpay_webhook_secret>

GOOGLE_CLIENT_ID=<your_google_client_id>
```

---

### 4. Setup AI Service

```bash
cd AIService
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the AI service environment file:

```env
GEMINI_API_KEY=<your_gemini_api_key>
BACKEND_URL=<your_backend_url>
PORT=8000
```

Start the AI service:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## 🚀 Deployment

The project follows a multi-service deployment architecture:

```text
Frontend
   ↓
Vercel

Backend
   ↓
Render

AI Service
   ↓
Render

Database
   ↓
MongoDB Atlas

Images
   ↓
Cloudinary

Payments
   ↓
Razorpay
```

---

## 🧪 Payment Support

The platform supports two payment methods:

### Razorpay

Used for online payments and payment verification.

### Cash on Delivery

Allows customers to place orders without online payment.

Inventory is validated server-side to prevent ordering unavailable products.

---

## 📈 Project Objectives

The primary objectives of Madhur Dairy and Daily Needs are:

- Build a complete real-world MERN e-commerce application
- Implement secure authentication and authorization
- Provide a responsive and intuitive shopping experience
- Build an administrative management dashboard
- Integrate online payment processing
- Implement scalable REST APIs
- Integrate AI capabilities into an existing full-stack application
- Demonstrate deployment across multiple cloud services

---

## 🔮 Future Enhancements

Possible future improvements include:

- Advanced product recommendation system
- More sophisticated AI-powered recommendations
- Automated customer notifications
- Advanced analytics
- Improved search and personalization
- Expanded payment and delivery integrations
- Enhanced review and customer engagement features

---

## 👨‍💻 Author

**Ujjwal Patil**

- LinkedIn: [Add LinkedIn profile]
- Email: [Add email address]

---

## 📜 License

This project is developed for educational, demonstration, and portfolio purposes.
