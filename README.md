# Pharmacy Drug Management System

> **Live Application**: [Frontend URL - To be deployed on Vercel/Netlify](https://your-frontend-url.vercel.app)  
> **Backend API**: [Backend URL - To be deployed on Render/Railway](https://your-backend-url.onrender.com)  
> **Status**: 🚧 Under Development

---

## 📋 Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [System Features](#system-features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Project Proposal](#project-proposal)

---

## Overview

The Pharmacy Drug Management System is a comprehensive full-stack web application designed to streamline and automate pharmacy operations. This system provides an efficient solution for managing medicines, suppliers, and customers, enabling robust inventory control, order management, and secure access mechanisms. The application emphasizes role-based authorization, ensuring that pharmacists and administrators have appropriate access levels to perform their respective duties effectively.

---

## Objectives

- **Automate drug inventory and supplier management** — Implement automated tracking and management of pharmaceutical inventory, including stock levels, expiration dates, and supplier relationships to minimize manual errors and improve operational efficiency.

- **Maintain detailed records of drugs, purchases, and customers** — Create a comprehensive database system that stores and manages all critical information including drug specifications, purchase history, supplier details, and customer records for accurate tracking and reporting.

- **Secure authentication and authorization** — Implement robust security measures using JWT-based authentication with role-based access control (RBAC) to ensure that only authorized personnel (pharmacists and administrators) can access sensitive pharmacy data and perform critical operations.

- **Provide user-friendly and responsive interface for pharmacy operations** — Develop an intuitive, modern web interface that is fully responsive across devices, enabling pharmacy staff to efficiently manage daily operations with minimal training and maximum productivity.

---

## System Features

### **Frontend**

The frontend is built using **React.js** with **Tailwind CSS** for modern, responsive styling. The application includes comprehensive pages for Home, Inventory Management, Order Processing, Supplier Management, Login/Signup authentication, and an Admin Dashboard. The frontend consumes REST API endpoints for all backend interactions and implements client-side routing using React Router for seamless navigation. The application is deployed on **Vercel** or **Netlify** for optimal performance and global CDN distribution.

**Key Features:**
- 🎨 Modern, responsive UI with Tailwind CSS
- 📊 Interactive dashboard with real-time statistics
- 🔍 Advanced search and filtering capabilities
- 📱 Mobile-friendly design
- 🔐 Secure authentication flow
- ⚡ Fast page transitions with React Router

### **Backend**

The backend is developed using **Node.js** with **Express.js** framework, providing robust server-side logic and API endpoints. The system implements comprehensive CRUD operations for drugs, suppliers, and customers, ensuring complete data management capabilities. **JWT authentication** is integrated with role-based access control, distinguishing between pharmacist and admin roles. Advanced features include filtering, sorting, and pagination for efficient data retrieval and management. The backend is deployed on **Render**, **Railway**, or similar cloud platforms for scalability and reliability.

**Key Features:**
- 🔒 JWT-based authentication with refresh tokens
- 👥 Role-based access control (Pharmacist, Admin)
- 📄 Pagination, searching, sorting, and filtering
- ✅ Input validation with Zod
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)
- 📝 Comprehensive error handling

### **Database**

The system utilizes **MongoDB** (Note: Proposal mentioned PostgreSQL, but implementation uses MongoDB) hosted on MongoDB Atlas or local MongoDB instance. The database schema is carefully designed with well-structured collections for drugs, suppliers, orders, and users. The implementation ensures data integrity and consistency, with optimized queries and proper indexing for enhanced performance and reliability.

**Collections:**
- **Drugs**: Inventory management with status tracking
- **Suppliers**: Supplier contact and company information
- **Orders**: Order processing and tracking
- **Users**: Authentication and authorization

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router, React Query, React Hook Form
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Deployment:** 
  - Frontend: Vercel / Netlify
  - Backend: Render / Railway
  - Database: MongoDB Atlas

---

## API Endpoints

### Authentication
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register new pharmacist/admin | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/auth/refresh` | POST | Refresh access token | Public |

### Drugs
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/drugs` | GET | Get all drugs (with pagination, search, filter) | Authenticated |
| `/api/drugs/:id` | GET | Get drug by ID | Authenticated |
| `/api/drugs` | POST | Create new drug | Admin |
| `/api/drugs/:id` | PUT | Update drug | Admin |
| `/api/drugs/:id` | DELETE | Delete drug | Admin |

**Query Parameters for GET /api/drugs:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by drug name
- `category` - Filter by category
- `status` - Filter by status (in-stock, low-stock, out-of-stock, expired)
- `supplier` - Filter by supplier ID
- `minQuantity` / `maxQuantity` - Filter by quantity range
- `expiryBefore` - Filter by expiry date

### Suppliers
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/suppliers` | GET | Get all suppliers (with pagination, search) | Authenticated |
| `/api/suppliers/:id` | GET | Get supplier by ID | Authenticated |
| `/api/suppliers` | POST | Create new supplier | Admin |
| `/api/suppliers/:id` | PUT | Update supplier | Admin |
| `/api/suppliers/:id` | DELETE | Delete supplier | Admin |

**Query Parameters for GET /api/suppliers:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search by name or company

### Orders
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/orders` | GET | Get all orders (with pagination, filter) | Authenticated |
| `/api/orders/:id` | GET | Get order by ID | Authenticated |
| `/api/orders` | POST | Create new order | Pharmacist/Admin |
| `/api/orders/:id/status` | PATCH | Update order status | Pharmacist/Admin |
| `/api/orders/:id` | DELETE | Delete order | Admin |

**Query Parameters for GET /api/orders:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status (pending, fulfilled, cancelled)
- `customerName` - Search by customer name
- `pharmacistId` - Filter by pharmacist
- `dateFrom` / `dateTo` - Filter by date range

### Users
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/users` | GET | Get all users (with pagination, filter) | Admin |
| `/api/users/:id` | GET | Get user by ID | Admin |
| `/api/users/:id` | PUT | Update user | Admin |
| `/api/users/:id` | DELETE | Delete user | Admin |

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/pharmacy
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
CLIENT_ORIGIN=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5001):
```env
REACT_APP_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Database Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Or on macOS with Homebrew:
brew services start mongodb-community
```

**Option 2: MongoDB Atlas**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file

### Seed Database (Optional)

To populate the database with sample data:
```bash
cd backend
npm run seed
```

---

## Project Proposal

### Full Project Proposal

<details>
<summary>Click to view full project proposal</summary>

# Pharmacy Drug Management System

---

## Overview

The Pharmacy Drug Management System is a comprehensive full-stack web application designed to streamline and automate pharmacy operations. This system provides an efficient solution for managing medicines, suppliers, and customers, enabling robust inventory control, order management, and secure access mechanisms. The application emphasizes role-based authorization, ensuring that pharmacists and administrators have appropriate access levels to perform their respective duties effectively.

---

## Objectives

- **Automate drug inventory and supplier management** — Implement automated tracking and management of pharmaceutical inventory, including stock levels, expiration dates, and supplier relationships to minimize manual errors and improve operational efficiency.

- **Maintain detailed records of drugs, purchases, and customers** — Create a comprehensive database system that stores and manages all critical information including drug specifications, purchase history, supplier details, and customer records for accurate tracking and reporting.

- **Secure authentication and authorization** — Implement robust security measures using JWT-based authentication with role-based access control (RBAC) to ensure that only authorized personnel (pharmacists and administrators) can access sensitive pharmacy data and perform critical operations.

- **Provide user-friendly and responsive interface for pharmacy operations** — Develop an intuitive, modern web interface that is fully responsive across devices, enabling pharmacy staff to efficiently manage daily operations with minimal training and maximum productivity.

---

## System Features

### **Frontend**

The frontend is built using **React.js** with **Tailwind CSS** for modern, responsive styling. The application includes comprehensive pages for Home, Inventory Management, Order Processing, Supplier Management, Login/Signup authentication, and an Admin Dashboard. The frontend consumes REST API endpoints for all backend interactions and implements client-side routing using React Router for seamless navigation. The application is deployed on **Vercel** or **Netlify** for optimal performance and global CDN distribution.

### **Backend**

The backend is developed using **Node.js** with **Express.js** framework, providing robust server-side logic and API endpoints. The system implements comprehensive CRUD operations for drugs, suppliers, and customers, ensuring complete data management capabilities. **JWT authentication** is integrated with role-based access control, distinguishing between pharmacist and admin roles. Advanced features include filtering, sorting, and pagination for efficient data retrieval and management. The backend is deployed on **Render**, **Railway**, or similar cloud platforms for scalability and reliability.

### **Database**

The system utilizes **PostgreSQL** hosted on a secure managed cloud database service such as **Aiven**, **Supabase**, or **Neon**. The database schema is carefully designed with well-structured relational tables for drugs, suppliers, customers, and transactions. The implementation ensures strong **ACID guarantees** for data integrity and consistency, with optimized SQL queries and proper indexing for enhanced performance and reliability.

---

## Sample API Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register new pharmacist/admin | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/drugs` | GET | Get all drugs (filter/search/sort) | Authenticated |
| `/api/drugs/:id` | PUT | Update drug | Authenticated |
| `/api/drugs/:id` | DELETE | Delete drug | Admin only |
| `/api/suppliers` | GET | Retrieve supplier list | Authenticated |

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Deployment:** Vercel (frontend), Render/Railway/Aiven (backend + DB)

---

*Document Version: 1.0*  
*Last Updated: 2024*

</details>

---

## Features Implemented

✅ **Complete CRUD Operations**
- Drugs: Create, Read, Update, Delete
- Suppliers: Create, Read, Update, Delete
- Orders: Create, Read, Update, Delete

✅ **Advanced Features**
- Pagination on all list endpoints
- Search functionality (drugs, suppliers, orders)
- Filtering by multiple criteria
- Sorting by creation date
- Role-based access control
- JWT authentication with refresh tokens

✅ **User Interface**
- Modern, responsive design
- Interactive dashboard
- Real-time statistics
- Intuitive navigation
- Loading states and error handling

---

## Contributing

This is a capstone project. For issues or suggestions, please contact the development team.

---

## License

This project is developed as part of a capstone project.

---

*Last Updated: December 2024*

