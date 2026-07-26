# 🛍️ Luminest — Production-Grade Full-Stack E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Executive Summary

**Luminest** is a modern, high-performance, containerized full-stack E-Commerce application designed with clean architecture principles. It features a responsive Next.js storefront, a RESTful Node/Express API built using the **Layered (Repository) Pattern**, and a fully relational PostgreSQL database with automatic schema initialization and indexed queries.

The platform provides a seamless end-to-end shopping experience for customers alongside a feature-rich management dashboard for administrators to control inventory, order lifecycles, marketing banners, and coupon promotions.

---

## ⚡ Quick Start (TL;DR)

Get the entire stack (Frontend, Backend, and PostgreSQL database) running in seconds with **Docker Compose**:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/luminest.git
cd luminest

# 2. Start all services using Docker Compose
docker compose up --build
```

- **Storefront / App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:5000](http://localhost:5000)
- **Database**: PostgreSQL on `localhost:5432`

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Dynamic Catalog & Filtering**: Browse products by category, price ranges, and custom tags.
- **Instant Search & Reviews**: Real-time product search with customer rating/review aggregations (`average_rating` & `total_reviews`).
- **Interactive Cart System**: Dynamic shopping cart persisted per authenticated customer with line item quantities.
- **Checkout & Discount Coupons**: Multi-field checkout supporting Cash on Delivery (COD) and Online payments with category/product-specific promotional coupon redemption.
- **Customer Authentication**: Secure JWT-based authentication with encrypted passwords (`bcryptjs`).

### 🛠️ Admin Management Dashboard
- **Catalog Management**: Full CRUD operations for products, categories, and tags with image uploads via Multer.
- **Order Lifecycle Processing**: Real-time status tracking (`placed` ➔ `processing` ➔ `shipped` ➔ `delivered` / `cancelled`).
- **Marketing & Promotions**: Dynamic home carousel slider management, site-wide announcement banners, and targeted coupon creation.
- **Sales Analytics**: Integrated visual reporting powered by `Recharts` and Radix UI data components.

---

## 🏗️ Architecture & Design Patterns

### Backend Architecture: Layered (Repository) Pattern

The Express backend strictly enforces a separation of concerns across distinct conceptual layers:

```
[ Client / Next.js ]
        │  (HTTP / REST JSON API)
        ▼
 ┌───────────────┐
 │    Routes     │  --> Express endpoints & request routing
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │ Middleware    │  --> Auth verification (JWT), CORS, Multer File Handling
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │  Controllers  │  --> Request validation & response formatting
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │   Services    │  --> Business logic execution & transaction management
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │ Repositories  │  --> Raw SQL execution & Data Access Layer (DAL)
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │  PostgreSQL   │  --> Relational Database (`pg` connection pool with UUIDs & indexes)
 └───────────────┘
```

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | React 18 framework with Server Components & SSR |
| | **TypeScript** | Strict type safety across components and hooks |
| | **Tailwind CSS & Radix UI** | Accessible UI primitives, custom styling, glassmorphism |
| | **Lucide Icons & Recharts** | Modern UI iconography and data visualization |
| **Backend** | **Node.js & Express.js** | Lightweight, high-throughput REST API runtime |
| | **JSON Web Tokens (JWT)** | Stateless authentication with access & refresh flows |
| | **Bcrypt.js** | Salted password hashing security |
| | **Multer** | Multipart form handling & disk storage for media |
| **Database** | **PostgreSQL 16** | Relational DB with foreign key constraints, UUID extension (`uuid-ossp`) |
| | **node-postgres (`pg`)** | High-performance pooled connection client |
| **DevOps** | **Docker & Docker Compose** | Multi-stage Docker builds & container orchestration |

---

## 🗄️ Database Schema & Relational Design

The PostgreSQL database enforces relational integrity with UUID primary keys and targeted B-Tree indexes (`title`, `price`, `category_id`, `product_id`, `customer_id`, `order_status`).

```
                    ┌──────────────┐
                    │  Customers   │
                    └──────┬───────┘
                           │ 1:N
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌───────────┐      ┌───────────┐      ┌───────────┐
  │   Carts   │      │  Orders   │      │  Reviews  │
  └─────┬─────┘      └─────┬─────┘      └─────┬─────┘
        │ M:N              │ 1:N              │ N:1
        └──────────┐       ▼                  │
                   │  ┌───────────┐           │
                   ├─>│OrderItems │           │
                   │  └─────┬─────┘           │
                   │        │ N:1             │
                   ▼        ▼                 ▼
             ┌─────────────────────────────────────┐
             │              Products               │
             └─┬─────────────────────────────────┬─┘
               │ M:N                             │ M:N
               ▼                                 ▼
      ┌──────────────────┐             ┌──────────────────┐
      │  ProductCategories│             │   ProductTags    │
      └────────┬─────────┘             └────────┬─────────┘
               │ N:1                            │ N:1
               ▼                                ▼
      ┌──────────────────┐             ┌──────────────────┐
      │    Categories    │             │       Tags       │
      └──────────────────┘             └──────────────────┘
```

---

## 📡 REST API Endpoint Overview

| Resource | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/auth/register` | Customer Registration | ❌ |
| | `POST` | `/api/auth/login` | Authentication & JWT issuance | ❌ |
| **Products** | `GET` | `/api/products` | Paginated product list with search/filter | ❌ |
| | `GET` | `/api/products/:id` | Detailed product view & ratings | ❌ |
| **Categories** | `GET` | `/api/categories` | Fetch active category list | ❌ |
| **Cart** | `GET` | `/api/customer/cart` | View authenticated customer cart | 🔐 Customer |
| | `POST` | `/api/customer/cart` | Add / Update cart items | 🔐 Customer |
| **Orders** | `POST` | `/api/customer/orders` | Place new order & compute discounts | 🔐 Customer |
| | `GET` | `/api/customer/orders` | Customer order history | 🔐 Customer |
| **Admin** | `POST` | `/api/admin/products` | Create product (with media upload) | 🔐 Admin |
| | `PATCH`| `/api/admin/orders/:id` | Update order fulfillment status | 🔐 Admin |
| | `POST` | `/api/admin/coupons` | Create promotional discount codes | 🔐 Admin |

---

## 📂 Project Directory Structure

```
luminest/
├── docker-compose.yml        # Orchestration for frontend, backend, and PostgreSQL
├── backend/
│   ├── config/               # Database connection pool setup
│   ├── controllers/          # Express route handler logic
│   ├── db/                   # Schema migrations & auto-initialization script
│   │   ├── init.js
│   │   └── schema.sql
│   ├── middleware/           # Auth JWT & validation middleware
│   ├── repositories/         # Database access layer (Data abstraction)
│   ├── routes/               # Modular Express API route definitions
│   ├── services/             # Core business & domain logic
│   ├── uploads/              # Static file uploads directory
│   ├── app.js                # Express app initialization & middleware configuration
│   ├── server.js             # HTTP server entrypoint
│   └── Dockerfile            # Multi-stage production container setup
└── frontend/
    ├── app/                  # Next.js 14 App Router (Pages & Layouts)
    ├── components/           # Reusable Radix UI & custom React components
    ├── contexts/             # Global Auth & Cart state providers
    ├── hooks/                # Custom React hooks
    ├── lib/                  # Utilities, API client (Axios), and helpers
    ├── public/               # Static assets & icons
    ├── styles/               # Global CSS & Tailwind imports
    └── Dockerfile            # Multi-stage Next.js builder container
```

---

## 💻 Local Development Setup (Without Docker)

### 1. Prerequisites
- **Node.js** v20.x or higher
- **PostgreSQL** v16.x running locally

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database setup & start dev server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

The frontend will start at `http://localhost:3000` and proxy API calls to `http://localhost:5000`.

---

## ⚖️ License

Distributed under the ISC License.
