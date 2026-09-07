# MilkyWay Farms – AI-Integrated MERN Stack Dairy E-Commerce Platform

## 📌 About the Project

**MilkyWay Farms** is a full-featured dairy product e-commerce platform built using the **MERN Stack** — MongoDB, Express.js, React.js, and Node.js.

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
                  ┌────────────┐  ┌─────────────────┐
                  │  MongoDB   │  │  FastAPI AI     │
                  │ + Mongoose │  │    Service      │
                  └────────────┘  └────────┬────────┘
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

## 🌐 Basic API Overview

The backend exposes REST APIs for the major application modules.

| Module | Method | Endpoint | Description |
|---|---|---|---|
| Authentication | POST | `/auth/...` | User/Admin authentication |
| Products | GET | `/products/get-products` | Fetch products |
| Products | GET | `/products/search/:productName` | Search products |
| Products | GET | `/products/:productId` | Get product details |
| Products | POST | `/products/admin` | Create product |
| Products | PUT | `/products/admin/:productId` | Update product |
| Products | DELETE | `/products/admin/:productId` | Delete product |
| Cart | GET | `/cart` | Get user cart |
| Cart | POST | `/cart/items` | Add item to cart |
| Cart | PUT | `/cart/items/:itemId` | Update cart item |
| Cart | DELETE | `/cart/items/:itemId` | Remove cart item |
| Orders | POST | `/orders` | Create order |
| Orders | GET | `/orders/my` | Get user's orders |
| Orders | GET | `/orders/my/:orderId` | Get order details |
| Orders | GET | `/orders/admin` | Get all orders |
| Orders | PATCH | `/orders/admin/:orderId/status` | Update order status |
| Payments | POST | `/payments/razorpay/create` | Create Razorpay payment order |
| Payments | POST | `/payments/razorpay/verify` | Verify Razorpay payment |
| AI | POST | `/ai/...` | AI assistant requests |

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
https://milky-way-farms.vercel.app

### Backend

**Backend API:**  
https://milkyway-farms.onrender.com

### AI Service

The AI service is deployed separately as a Python FastAPI service.

**AI Service:**  
[Add your deployed AIService URL here]

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
git clone https://github.com/ujjwalpatil07/MilkyWay-Farms.git
```


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
venv\Scriptsctivate
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

The primary objectives of MilkyWay Farms are:

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

- LinkedIn: https://www.linkedin.com/in/ujjwal-patil-9908782b0/
- Email: ujjwal.patilofficial07@gmail.com

---

## 📜 License

This project is developed for educational, demonstration, and portfolio purposes.
