# Luminest E-commerce Backend API Documentation

This document provides an overview of the RESTful API endpoints for the Luminest E-commerce backend.

## Base URL
`http://localhost:5000/api` (or your configured backend URL)

## Authentication Headers
Most authenticated endpoints require the following headers:

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

---

## Table of Contents

1.  [Authentication Endpoints](#authentication-endpoints)
    *   [Customer Authentication](#customer-authentication)
    *   [Admin Authentication](#admin-authentication)
2.  [Customer Endpoints](#customer-endpoints)
    *   [Profile Management](#profile-management)
    *   [Cart Management](#cart-management)
    *   [Orders](#orders)
    *   [Reviews](#reviews)
3.  [Public Endpoints (No Auth Required)](#public-endpoints-no-auth-required)
    *   [Products](#products)
    *   [Categories](#categories)
    *   [Reviews (Public)](#reviews-public)
    *   [Carousel](#carousel)
    *   [Banner](#banner)
    *   [Coupons](#coupons)
4.  [Admin Endpoints](#admin-endpoints)
    *   [Dashboard & Analytics](#dashboard--analytics)
    *   [Product Management](#product-management)
    *   [Category Management](#category-management)
    *   [Product Tags Management](#product-tags-management)
    *   [Order Management](#order-management)
    *   [Inventory Management](#inventory-management)
    *   [Coupon Management](#coupon-management)
    *   [Carousel Management](#carousel-management)
    *   [Banner Management](#banner-management)
    *   [Customer Management](#customer-management)
    *   [Review Management](#review-management)
5.  [File Upload Endpoints](#file-upload-endpoints)

---

## Authentication Endpoints

### Customer Authentication

*   `POST /api/auth/customer/register`
    *   **Description:** Register a new customer.
    *   **Request Body:**
        ```json
        {
            "name": "string",
            "address": "string",
            "contact_no": "string",
            "email": "string",
            "password": "string"
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Customer registered successfully",
            "customer": { ... },
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/customer/login`
    *   **Description:** Log in an existing customer.
    *   **Request Body:**
        ```json
        {
            "email": "string",
            "password": "string"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Customer logged in successfully",
            "customer": { ... },
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/customer/google`
    *   **Description:** Authenticate customer using Google.
    *   **Request Body:**
        ```json
        {
            "profile": { /* Google profile object from frontend */ }
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Customer logged in with Google successfully",
            "customer": { ... },
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/customer/refresh-token`
    *   **Description:** Refresh customer's access token.
    *   **Request Body:**
        ```json
        {
            "refreshToken": "string"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Customer token refreshed successfully",
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/customer/logout`
    *   **Description:** Log out a customer (client-side token discard).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Customer logged out successfully"
        }
        ```

### Admin Authentication

*   `POST /api/auth/admin/register`
    *   **Description:** Register a new admin.
    *   **Request Body:**
        ```json
        {
            "name": "string",
            "email": "string",
            "password": "string"
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Admin registered successfully",
            "admin": { ... },
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/admin/login`
    *   **Description:** Log in an existing admin.
    *   **Request Body:**
        ```json
        {
            "email": "string",
            "password": "string"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Admin logged in successfully",
            "admin": { ... },
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/admin/refresh-token`
    *   **Description:** Refresh admin's access token.
    *   **Request Body:**
        ```json
        {
            "refreshToken": "string"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Admin token refreshed successfully",
            "accessToken": "string",
            "refreshToken": "string"
        }
        ```

*   `POST /api/auth/admin/logout`
    *   **Description:** Log out an admin (client-side token discard).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Admin logged out successfully"
        }
        ```

---

## Customer Endpoints

### Profile Management

*   `GET /api/customer/profile`
    *   **Description:** Get the authenticated customer's profile details.
    *   **Authentication:** Required (Customer)
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "name": "string",
            "address": "string",
            "contact_no": "string",
            "email": "string",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
        ```

*   `PUT /api/customer/profile`
    *   **Description:** Update the authenticated customer's profile details.
    *   **Authentication:** Required (Customer)
    *   **Request Body:**
        ```json
        {
            "name": "string",
            "address": "string",
            "contact_no": "string",
            "email": "string"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Profile updated successfully",
            "profile": { ... }
        }
        ```

*   `DELETE /api/customer/account`
    *   **Description:** Delete the authenticated customer's account.
    *   **Authentication:** Required (Customer)
    *   **Response (200 OK):**
        ```json
        {
            "message": "Customer account deleted successfully"
        }
        ```

### Cart Management

*   `GET /api/customer/cart`
    *   **Description:** Get all items in the authenticated customer's cart.
    *   **Authentication:** Required (Customer)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "product_id": "uuid",
                "title": "string",
                "price": "decimal",
                "image": "string",
                "quantity": "integer"
            }
        ]
        ```

*   `POST /api/customer/cart/add`
    *   **Description:** Add a product to the customer's cart or increase its quantity if already exists.
    *   **Authentication:** Required (Customer)
    *   **Request Body:**
        ```json
        {
            "productId": "uuid",
            "quantity": "integer"
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Item added to cart",
            "cartItem": { ... }
        }
        ```

*   `PUT /api/customer/cart/update/:itemId`
    *   **Description:** Update the quantity of a specific item in the customer's cart.
    *   **Authentication:** Required (Customer)
    *   **URL Parameters:**
        *   `itemId`: UUID of the cart item.
    *   **Request Body:**
        ```json
        {
            "quantity": "integer"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Cart item updated",
            "cartItem": { ... }
        }
        ```

*   `DELETE /api/customer/cart/remove/:itemId`
    *   **Description:** Remove a specific item from the customer's cart.
    *   **Authentication:** Required (Customer)
    *   **URL Parameters:**
        *   `itemId`: UUID of the cart item.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Item removed from cart"
        }
        ```

*   `DELETE /api/customer/cart/clear`
    *   **Description:** Clear all items from the authenticated customer's cart.
    *   **Authentication:** Required (Customer)
    *   **Response (200 OK):**
        ```json
        {
            "message": "Cart cleared"
        }
        ```

### Orders

*   `GET /api/customer/orders`
    *   **Description:** Get all orders placed by the authenticated customer.
    *   **Authentication:** Required (Customer)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "order_number": "string",
                "customer_id": "uuid",
                "customer_name": "string",
                "delivery_address": "text",
                "customer_contact": "string",
                "customer_email": "string",
                "subtotal": "decimal",
                "delivery_charge": "decimal",
                "discount_amount": "decimal",
                "coupon_id": "uuid | null",
                "total_amount": "decimal",
                "payment_method": "string",
                "payment_status": "string",
                "order_status": "string",
                "notes": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `GET /api/customer/orders/:orderId`
    *   **Description:** Get details of a specific order placed by the authenticated customer.
    *   **Authentication:** Required (Customer)
    *   **URL Parameters:**
        *   `orderId`: UUID of the order.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "order_number": "string",
            "customer_id": "uuid",
            "customer_name": "string",
            "delivery_address": "text",
            "customer_contact": "string",
            "customer_email": "string",
            "subtotal": "decimal",
            "delivery_charge": "decimal",
            "discount_amount": "decimal",
            "coupon_id": "uuid | null",
            "total_amount": "decimal",
            "payment_method": "string",
            "payment_status": "string",
            "order_status": "string",
            "notes": "text",
            "created_at": "timestamp",
            "updated_at": "timestamp",
            "items": [
                {
                    "id": "uuid",
                    "product_id": "uuid",
                    "title": "string",
                    "image": "string",
                    "quantity": "integer",
                    "unit_price": "decimal",
                    "total_price": "decimal"
                }
            ]
        }
        ```

*   `POST /api/customer/orders/create`
    *   **Description:** Create a new order from the customer's cart.
    *   **Authentication:** Required (Customer)
    *   **Request Body:**
        ```json
        {
            "customer_name": "string",
            "delivery_address": "string",
            "customer_contact": "string",
            "customer_email": "string",
            "payment_method": "COD" | "Online",
            "notes": "string" (optional),
            "couponCode": "string" (optional)
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Order placed successfully",
            "order": { ... }
        }
        ```

### Reviews

*   `GET /api/customer/reviews`
    *   **Description:** Get all reviews written by the authenticated customer.
    *   **Authentication:** Required (Customer)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "product_id": "uuid",
                "product_title": "string",
                "rating": "integer",
                "comment": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `POST /api/customer/reviews/create`
    *   **Description:** Create a new review for a product.
    *   **Authentication:** Required (Customer)
    *   **Request Body:**
        ```json
        {
            "productId": "uuid",
            "rating": "integer" (1-5),
            "comment": "string"
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Review added successfully",
            "review": { ... }
        }
        ```

*   `PUT /api/customer/reviews/:reviewId`
    *   **Description:** Update an existing review by the authenticated customer.
    *   **Authentication:** Required (Customer)
    *   **URL Parameters:**
        *   `reviewId`: UUID of the review.
    *   **Request Body:**
        ```json
        {
            "rating": "integer" (1-5) (optional),
            "comment": "string" (optional)
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Review updated successfully",
            "review": { ... }
        }
        ```

*   `DELETE /api/customer/reviews/:reviewId`
    *   **Description:** Delete an existing review by the authenticated customer.
    *   **Authentication:** Required (Customer)
    *   **URL Parameters:**
        *   `reviewId`: UUID of the review.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Review deleted successfully"
        }
        ```

---

## Public Endpoints (No Auth Required)

### Products

*   `GET /api/products`
    *   **Description:** Get all products with optional filters, search, and sorting.
    *   **Authentication:** Not Required
    *   **Query Parameters:**
        *   `page`: (Optional) Page number for pagination (default: 1).
        *   `limit`: (Optional) Number of items per page (default: 10).
        *   `category`: (Optional) UUID of the category to filter by.
        *   `min_price`: (Optional) Minimum price to filter by.
        *   `max_price`: (Optional) Maximum price to filter by.
        *   `rating`: (Optional) Minimum average rating to filter by.
        *   `sort`: (Optional) Sorting order (e.g., `price_asc`, `price_desc`, `rating_desc`, `newest`, `oldest`, `name_asc`, `name_desc`).
        *   `search`: (Optional) Search term for product title or description.
        *   `tag`: (Optional) Tag name to filter by (e.g., 'new-arrival', 'hot-sales').
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "title": "string",
                "description": "text",
                "price": "decimal",
                "stock_quantity": "integer",
                "images": ["string"],
                "average_rating": "decimal",
                "total_reviews": "integer",
                "created_at": "timestamp",
                "updated_at": "timestamp",
                "categories": ["string"],
                "tags": ["string"]
            }
        ]
        ```

*   `GET /api/products/:id`
    *   **Description:** Get details of a single product.
    *   **Authentication:** Not Required
    *   **URL Parameters:**
        *   `id`: UUID of the product.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "title": "string",
            "description": "text",
            "price": "decimal",
            "stock_quantity": "integer",
            "images": ["string"],
            "average_rating": "decimal",
            "total_reviews": "integer",
            "created_at": "timestamp",
            "updated_at": "timestamp",
            "categories": ["string"],
            "tags": ["string"],
            "reviews": [ { ...review_object... } ]
        }
        ```

*   `GET /api/products/tag/:tag`
    *   **Description:** Get products by a specific tag.
    *   **Authentication:** Not Required
    *   **URL Parameters:**
        *   `tag`: Name of the tag (e.g., 'new-arrival', 'hot-sales').
    *   **Response (200 OK):**
        ```json
        [
            { ...product_object... }
        ]
        ```

*   `GET /api/products/by-category/:categoryId`
    *   **Description:** Get products by a specific category.
    *   **Authentication:** Not Required
    *   **URL Parameters:**
        *   `categoryId`: UUID of the category.
    *   **Response (200 OK):**
        ```json
        [
            { ...product_object... }
        ]
        ```

### Categories

*   `GET /api/categories`
    *   **Description:** Get all product categories.
    *   **Authentication:** Not Required
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "name": "string",
                "slug": "string",
                "description": "text",
                "image_url": "string",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `GET /api/categories/:id`
    *   **Description:** Get details of a single category.
    *   **Authentication:** Not Required
    *   **URL Parameters:**
        *   `id`: UUID of the category.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "name": "string",
            "slug": "string",
            "description": "text",
            "image_url": "string",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
        ```

### Reviews (Public)

*   `GET /api/products/:productId/reviews`
    *   **Description:** Get reviews for a specific product.
    *   **Authentication:** Not Required
    *   **URL Parameters:**
        *   `productId`: UUID of the product.
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "rating": "integer",
                "comment": "text",
                "created_at": "timestamp",
                "customer_name": "string"
            }
        ]
        ```

### Carousel

*   `GET /api/carousel`
    *   **Description:** Get all active carousel images, ordered by display order.
    *   **Authentication:** Not Required
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "image_url": "string",
                "alt_text": "string",
                "link_url": "string",
                "display_order": "integer"
            }
        ]
        ```

### Banner

*   `GET /api/banner`
    *   **Description:** Get the active banner message.
    *   **Authentication:** Not Required
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "message": "string"
        }
        ```

### Coupons

*   `POST /api/coupons/validate`
    *   **Description:** Validate a coupon code.
    *   **Authentication:** Not Required
    *   **Request Body:**
        ```json
        {
            "code": "string"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Coupon validated successfully",
            "coupon": {
                "id": "uuid",
                "code": "string",
                "type": "string",
                "value": "decimal",
                "max_discount": "decimal | null",
                "min_order_amount": "decimal",
                "category_id": "uuid | null",
                "product_id": "uuid | null",
                "is_active": "boolean",
                "valid_from": "timestamp",
                "valid_until": "timestamp | null",
                "usage_limit": "integer | null",
                "used_count": "integer",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        }
        ```

---

## Admin Endpoints

### Dashboard & Analytics

*   `GET /api/admin/dashboard/stats`
    *   **Description:** Get overall dashboard statistics for admin.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        {
            "totalSales": "decimal",
            "totalOrders": "integer",
            "totalCustomers": "integer",
            "productsOutOfStock": "integer",
            "recentOrders": [
                {
                    "id": "uuid",
                    "order_number": "string",
                    "customer_name": "string",
                    "total_amount": "decimal",
                    "order_status": "string",
                    "created_at": "timestamp"
                }
            ]
        }
        ```

*   `GET /api/admin/sales/analytics`
    *   **Description:** Get sales analytics data (e.g., sales by month).
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "month": "string (YYYY-MM)",
                "sales": "decimal"
            }
        ]
        ```

*   `GET /api/admin/orders/analytics`
    *   **Description:** Get order analytics data (e.g., orders by status, top-selling products).
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        {
            "ordersByStatus": [
                {
                    "order_status": "string",
                    "count": "integer"
                }
            ],
            "topSellingProducts": [
                {
                    "title": "string",
                    "total_quantity_sold": "string"
                }
            ]
        }
        ```

### Product Management

*   `GET /api/admin/products`
    *   **Description:** Get all products with their associated categories and tags.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "title": "string",
                "description": "text",
                "price": "decimal",
                "stock_quantity": "integer",
                "images": ["string"],
                "average_rating": "decimal",
                "total_reviews": "integer",
                "created_at": "timestamp",
                "updated_at": "timestamp",
                "categories": ["string"],
                "tags": ["string"]
            }
        ]
        ```

*   `GET /api/admin/products/:id`
    *   **Description:** Get details of a single product for admin, including category IDs and tags.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the product.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "title": "string",
            "description": "text",
            "price": "decimal",
            "stock_quantity": "integer",
            "images": ["string"],
            "average_rating": "decimal",
            "total_reviews": "integer",
            "created_at": "timestamp",
            "updated_at": "timestamp",
            "category_ids": ["uuid"],
            "tags": ["string"]
        }
        ```

*   `POST /api/admin/products/create`
    *   **Description:** Create a new product.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "title": "string",
            "description": "text",
            "price": "decimal",
            "stock_quantity": "integer",
            "images": ["string"] (array of image URLs),
            "categoryIds": ["uuid"] (array of category UUIDs),
            "tags": ["string"] (array of tag names)
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Product created successfully",
            "product": { ... }
        }
        ```

*   `PUT /api/admin/products/:id`
    *   **Description:** Update an existing product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the product.
    *   **Request Body:** (All fields optional, provide only what needs to be updated)
        ```json
        {
            "title": "string",
            "description": "text",
            "price": "decimal",
            "stock_quantity": "integer",
            "images": ["string"] (array of image URLs),
            "categoryIds": ["uuid"] (array of category UUIDs),
            "tags": ["string"] (array of tag names)
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Product updated successfully",
            "product": { ... }
        }
        ```

*   `DELETE /api/admin/products/:id`
    *   **Description:** Delete a product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the product.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Product deleted successfully"
        }
        ```

*   `POST /api/admin/products/:id/images/upload`
    *   **Description:** Upload an image for a product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the product.
    *   **Request Body (multipart/form-data):**
        *   `productImage`: File upload.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Image uploaded successfully",
            "images": ["string"]
        }
        ```

*   `DELETE /api/admin/products/:id/images/:imageId`
    *   **Description:** Delete a specific image from a product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the product.
        *   `imageId`: Filename of the image to delete (e.g., `productImage-1678888888888.jpg`).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Image deleted successfully"
        }
        ```

### Category Management

*   `GET /api/admin/categories`
    *   **Description:** Get all categories for admin management.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "name": "string",
                "slug": "string",
                "description": "text",
                "image_url": "string",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `GET /api/admin/categories/:id`
    *   **Description:** Get details of a single category for admin.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the category.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "name": "string",
            "slug": "string",
            "description": "text",
            "image_url": "string",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
        ```

*   `POST /api/admin/categories/create`
    *   **Description:** Create a new category.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "name": "string",
            "slug": "string",
            "description": "text",
            "imageUrl": "string" (optional)
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Category created successfully",
            "category": { ... }
        }
        ```

*   `PUT /api/admin/categories/:id`
    *   **Description:** Update an existing category.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the category.
    *   **Request Body:** (All fields optional, provide only what needs to be updated)
        ```json
        {
            "name": "string",
            "slug": "string",
            "description": "text",
            "imageUrl": "string" (optional)
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Category updated successfully",
            "category": { ... }
        }
        ```

*   `DELETE /api/admin/categories/:id`
    *   **Description:** Delete a category.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the category.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Category deleted successfully"
        }
        ```

### Product Tags Management

*   `GET /api/admin/products/:productId/tags`
    *   **Description:** Get all tags associated with a specific product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `productId`: UUID of the product.
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "tag_name": "string"
            }
        ]
        ```

*   `POST /api/admin/products/:productId/tags`
    *   **Description:** Add a tag to a product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `productId`: UUID of the product.
    *   **Request Body:**
        ```json
        {
            "tagName": "string"
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Tag added successfully",
            "tag": { ... }
        }
        ```

*   `DELETE /api/admin/products/:productId/tags/:tagId`
    *   **Description:** Delete a tag from a product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `productId`: UUID of the product.
        *   `tagId`: UUID of the product tag entry (from `product_tags` table).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Tag deleted successfully"
        }
        ```

### Order Management

*   `GET /api/admin/orders`
    *   **Description:** Get all orders with customer details.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "order_number": "string",
                "customer_id": "uuid",
                "customer_name": "string",
                "customer_email": "string",
                "delivery_address": "text",
                "customer_contact": "string",
                "subtotal": "decimal",
                "delivery_charge": "decimal",
                "discount_amount": "decimal",
                "coupon_id": "uuid | null",
                "total_amount": "decimal",
                "payment_method": "string",
                "payment_status": "string",
                "order_status": "string",
                "notes": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `GET /api/admin/orders/:id`
    *   **Description:** Get details of a single order with customer and item details.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the order.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "order_number": "string",
            "customer_id": "uuid",
            "customer_name": "string",
            "customer_email": "string",
            "delivery_address": "text",
            "customer_contact": "string",
            "subtotal": "decimal",
            "delivery_charge": "decimal",
            "discount_amount": "decimal",
            "coupon_id": "uuid | null",
            "total_amount": "decimal",
            "payment_method": "string",
            "payment_status": "string",
            "order_status": "string",
            "notes": "text",
            "created_at": "timestamp",
            "updated_at": "timestamp",
            "items": [
                {
                    "id": "uuid",
                    "product_id": "uuid",
                    "title": "string",
                    "quantity": "integer",
                    "unit_price": "decimal",
                    "total_price": "decimal"
                }
            ]
        }
        ```

*   `PUT /api/admin/orders/:id/status`
    *   **Description:** Update the status of an order.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the order.
    *   **Request Body:**
        ```json
        {
            "status": "placed" | "processing" | "shipped" | "delivered" | "cancelled"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Order status updated successfully",
            "order": { ... }
        }
        ```

*   `POST /api/admin/orders/:id/generate-bill-pdf`
    *   **Description:** Generate a PDF bill for an order.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the order.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Bill PDF generated",
            "path": "string" (path to the generated PDF)
        }
        ```

*   `POST /api/admin/orders/:id/generate-shipping-label`
    *   **Description:** Generate a PDF shipping label for an order.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the order.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Shipping label PDF generated",
            "path": "string" (path to the generated PDF)
        }
        ```

### Inventory Management

*   `GET /api/admin/inventory`
    *   **Description:** Get a list of all products with their current stock levels.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "title": "string",
                "stock_quantity": "integer",
                "price": "decimal"
            }
        ]
        ```

*   `PUT /api/admin/inventory/:productId`
    *   **Description:** Update the stock quantity for a specific product.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `productId`: UUID of the product.
    *   **Request Body:**
        ```json
        {
            "stock_quantity": "integer"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Inventory updated successfully",
            "product": { ... }
        }
        ```

*   `GET /api/admin/inventory/low-stock`
    *   **Description:** Get a list of products that are low in stock.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "title": "string",
                "stock_quantity": "integer",
                "price": "decimal"
            }
        ]
        ```

### Coupon Management

*   `GET /api/admin/coupons`
    *   **Description:** Get all coupons.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "code": "string",
                "type": "string",
                "value": "decimal",
                "max_discount": "decimal | null",
                "min_order_amount": "decimal",
                "category_id": "uuid | null",
                "product_id": "uuid | null",
                "is_active": "boolean",
                "valid_from": "timestamp",
                "valid_until": "timestamp | null",
                "usage_limit": "integer | null",
                "used_count": "integer",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `GET /api/admin/coupons/:id`
    *   **Description:** Get details of a single coupon.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the coupon.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "code": "string",
            "type": "string",
            "value": "decimal",
            "max_discount": "decimal | null",
            "min_order_amount": "decimal",
            "category_id": "uuid | null",
            "product_id": "uuid | null",
            "is_active": "boolean",
            "valid_from": "timestamp",
            "valid_until": "timestamp | null",
            "usage_limit": "integer | null",
            "used_count": "integer",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
        ```

*   `POST /api/admin/coupons/create`
    *   **Description:** Create a new coupon.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "code": "string",
            "type": "percentage" | "fixed_amount",
            "value": "decimal",
            "max_discount": "decimal" (optional),
            "min_order_amount": "decimal" (optional),
            "category_id": "uuid" (optional),
            "product_id": "uuid" (optional),
            "is_active": "boolean" (default: true),
            "valid_from": "timestamp" (optional, default: now),
            "valid_until": "timestamp" (optional),
            "usage_limit": "integer" (optional)
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Coupon created successfully",
            "coupon": { ... }
        }
        ```

*   `PUT /api/admin/coupons/:id`
    *   **Description:** Update an existing coupon.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the coupon.
    *   **Request Body:** (All fields optional, provide only what needs to be updated)
        ```json
        {
            "code": "string",
            "type": "percentage" | "fixed_amount",
            "value": "decimal",
            "max_discount": "decimal | null",
            "min_order_amount": "decimal",
            "category_id": "uuid | null",
            "product_id": "uuid | null",
            "is_active": "boolean",
            "valid_from": "timestamp",
            "valid_until": "timestamp | null",
            "usage_limit": "integer | null"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Coupon updated successfully",
            "coupon": { ... }
        }
        ```

*   `DELETE /api/admin/coupons/:id`
    *   **Description:** Delete a coupon.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the coupon.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Coupon deleted successfully"
        }
        ```

*   `GET /api/admin/coupons/:id/usage-stats`
    *   **Description:** Get usage statistics for a coupon.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the coupon.
    *   **Response (200 OK):**
        ```json
        {
            "used_count": "integer",
            "usage_limit": "integer | null"
        }
        ```

### Carousel Management

*   `GET /api/admin/carousel`
    *   **Description:** Get all carousel images for admin management.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "image_url": "string",
                "alt_text": "string",
                "link_url": "string",
                "display_order": "integer",
                "is_active": "boolean",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `POST /api/admin/carousel/create`
    *   **Description:** Create a new carousel image.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "imageUrl": "string",
            "altText": "string" (optional),
            "linkUrl": "string" (optional),
            "displayOrder": "integer",
            "isActive": "boolean" (default: true)
        }
        ```
    *   **Response (201 CREATED):**
        ```json
        {
            "message": "Carousel image created successfully",
            "image": { ... }
        }
        ```

*   `PUT /api/admin/carousel/:id`
    *   **Description:** Update an existing carousel image.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the carousel image.
    *   **Request Body:** (All fields optional, provide only what needs to be updated)
        ```json
        {
            "imageUrl": "string",
            "altText": "string",
            "linkUrl": "string",
            "displayOrder": "integer",
            "isActive": "boolean"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Carousel image updated successfully",
            "image": { ... }
        }
        ```

*   `DELETE /api/admin/carousel/:id`
    *   **Description:** Delete a carousel image.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the carousel image.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Carousel image deleted successfully"
        }
        ```

*   `PUT /api/admin/carousel/reorder`
    *   **Description:** Reorder carousel images.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "updates": [
                {
                    "id": "uuid",
                    "display_order": "integer"
                }
            ]
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Carousel order updated successfully"
        }
        ```

### Banner Management

*   `GET /api/admin/banner`
    *   **Description:** Get the current banner details for admin.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "message": "text",
            "is_active": "boolean",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
        ```

*   `PUT /api/admin/banner`
    *   **Description:** Update the banner message and/or active status.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "message": "string",
            "is_active": "boolean"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Banner updated successfully",
            "banner": { ... }
        }
        ```

*   `POST /api/admin/banner/toggle`
    *   **Description:** Toggle the active status of the banner.
    *   **Authentication:** Required (Admin)
    *   **Request Body:**
        ```json
        {
            "is_active": "boolean"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Banner status updated successfully",
            "banner": { ... }
        }
        ```

### Customer Management

*   `GET /api/admin/customers`
    *   **Description:** Get all customer accounts for admin management.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "name": "string",
                "email": "string",
                "contact_no": "string",
                "address": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `GET /api/admin/customers/:id`
    *   **Description:** Get details of a single customer account for admin.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the customer.
    *   **Response (200 OK):**
        ```json
        {
            "id": "uuid",
            "name": "string",
            "email": "string",
            "contact_no": "string",
            "address": "text",
            "created_at": "timestamp",
            "updated_at": "timestamp"
        }
        ```

*   `PUT /api/admin/customers/:id/status`
    *   **Description:** Update the status of a customer account (placeholder as no status field in schema).
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the customer.
    *   **Request Body:**
        ```json
        {
            "status": "string" // Example: "active" | "inactive"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Customer status update (placeholder) successful",
            "customer": { ... }
        }
        ```

### Review Management

*   `GET /api/admin/reviews`
    *   **Description:** Get all product reviews for admin management.
    *   **Authentication:** Required (Admin)
    *   **Response (200 OK):**
        ```json
        [
            {
                "id": "uuid",
                "product_id": "uuid",
                "product_title": "string",
                "customer_id": "uuid",
                "customer_name": "string",
                "rating": "integer",
                "comment": "text",
                "created_at": "timestamp",
                "updated_at": "timestamp"
            }
        ]
        ```

*   `PUT /api/admin/reviews/:id/status`
    *   **Description:** Update the status of a product review (placeholder as no status field in schema).
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the review.
    *   **Request Body:**
        ```json
        {
            "status": "string" // Example: "approved" | "rejected"
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
            "message": "Review status updated (placeholder) successfully",
            "review": { ... }
        }
        ```

*   `DELETE /api/admin/reviews/:id`
    *   **Description:** Delete a product review.
    *   **Authentication:** Required (Admin)
    *   **URL Parameters:**
        *   `id`: UUID of the review.
    *   **Response (200 OK):**
        ```json
        {
            "message": "Review deleted successfully"
        }
        ```

---

## File Upload Endpoints

*   `POST /api/upload/product-images`
    *   **Description:** Upload a product image.
    *   **Authentication:** Not Required (handled by specific product admin route for association)
    *   **Request Body (multipart/form-data):**
        *   `image`: File upload (single file).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Product image uploaded successfully.",
            "imageUrl": "string" (path to the uploaded image)
        }
        ```

*   `POST /api/upload/carousel-images`
    *   **Description:** Upload a carousel image.
    *   **Authentication:** Not Required (handled by specific carousel admin route for association)
    *   **Request Body (multipart/form-data):**
        *   `image`: File upload (single file).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Carousel image uploaded successfully.",
            "imageUrl": "string" (path to the uploaded image)
        }
        ```

*   `POST /api/upload/category-images`
    *   **Description:** Upload a category image.
    *   **Authentication:** Not Required (handled by specific category admin route for association)
    *   **Request Body (multipart/form-data):**
        *   `image`: File upload (single file).
    *   **Response (200 OK):**
        ```json
        {
            "message": "Category image uploaded successfully.",
            "imageUrl": "string" (path to the uploaded image)
        }
        ```
