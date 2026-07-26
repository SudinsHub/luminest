# Luminest — Production-Grade Full-Stack E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## Executive Summary

Luminest is a high-performance, containerized full-stack e-commerce platform built on clean architecture principles. It features a responsive Next.js storefront, a RESTful Node.js and Express API structured around the Layered (Repository) Pattern, and a fully relational PostgreSQL database with automated schema initialization and indexed queries.

The platform delivers an end-to-end shopping interface for customers alongside an administrative dashboard for managing inventory, order lifecycles, marketing assets, and promotional campaigns.

---

## Quick Start

Execute the complete application stack (Frontend, Backend, and PostgreSQL database) using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/luminest.git
cd luminest

# 2. Start all services using Docker Compose
docker compose up --build
```

- **Storefront / Web Application**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:5000](http://localhost:5000)
- **Database**: PostgreSQL on `localhost:5432`

---

## Key Features

### Customer Storefront
- **Dynamic Catalog and Filtering**: Browse products filtered by category, price range, and custom tags.
- **Search and Review System**: Real-time product search accompanied by customer rating and review aggregations (`average_rating` and `total_reviews`).
- **Cart Management**: Dynamic shopping cart persisted per authenticated customer session.
- **Checkout and Promotions**: Multi-step checkout supporting Cash on Delivery (COD) and Online payments with category- and product-specific promotional coupon redemption.
- **Customer Authentication**: Secure JWT-based authentication using salted password hashing (`bcryptjs`).

### Admin Management Dashboard
- **Catalog Operations**: Comprehensive CRUD operations for products, categories, and tags with file uploads powered by Multer.
- **Order Lifecycle Management**: Order status tracking across sequential states (`placed` -> `processing` -> `shipped` -> `delivered` / `cancelled`).
- **Marketing Controls**: Administrative controls for homepage carousel slides, site-wide announcement banners, and promotional coupons.
- **Sales Analytics**: Visual reporting interfaces integrated with `Recharts` and Radix UI components.

---

## Architecture and Design Patterns

### Backend Architecture: Layered (Repository) Pattern

The Express backend enforces separation of concerns across distinct architectural layers:

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

## Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | React 18 framework with Server Components & SSR |
| | **TypeScript** | Strict type safety across components and hooks |
| | **Tailwind CSS & Radix UI** | Accessible UI primitives and custom styling |
| | **Lucide Icons & Recharts** | UI iconography and data visualization |
| **Backend** | **Node.js & Express.js** | High-throughput REST API runtime |
| | **JSON Web Tokens (JWT)** | Stateless authentication with access and refresh flows |
| | **Bcrypt.js** | Password hashing security |
| | **Multer** | Multipart form handling and disk storage for media assets |
| **Database** | **PostgreSQL 16** | Relational database with foreign key constraints and UUID extension (`uuid-ossp`) |
| | **node-postgres (`pg`)** | Pooled database connection client |
| | **Docker & Docker Compose** | Multi-stage Docker builds and container orchestration |

---

## Database Schema and Relational Design

The PostgreSQL database enforces relational integrity utilizing UUID primary keys and B-Tree indexes (`title`, `price`, `category_id`, `product_id`, `customer_id`, `order_status`).

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

## REST API Endpoints

| Resource | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/auth/register` | Customer Registration | No |
| | `POST` | `/api/auth/login` | Authentication and JWT issuance | No |
| **Products** | `GET` | `/api/products` | Paginated product list with search and filtering | No |
| | `GET` | `/api/products/:id` | Detailed product view and ratings | No |
| **Categories** | `GET` | `/api/categories` | Fetch active category list | No |
| **Cart** | `GET` | `/api/customer/cart` | View authenticated customer cart | Customer |
| | `POST` | `/api/customer/cart` | Add or update cart items | Customer |
| **Orders** | `POST` | `/api/customer/orders` | Place new order and compute discounts | Customer |
| | `GET` | `/api/customer/orders` | Customer order history | Customer |
| **Admin** | `POST` | `/api/admin/products` | Create product (with media upload) | Admin |
| | `PATCH`| `/api/admin/orders/:id` | Update order fulfillment status | Admin |
| | `POST` | `/api/admin/coupons` | Create promotional discount codes | Admin |

---

## Project Directory Structure

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

## Local Development Setup

### Prerequisites
- Node.js v20.x or higher
- PostgreSQL v16.x running locally

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database setup and start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

The frontend will start at `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

---

## License

Distributed under the ISC License.
