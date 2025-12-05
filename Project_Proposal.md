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

