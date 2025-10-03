# Mama Parcel - Parcel Delivery API
# Live Link - https://mama-parcel-backend.vercel.app/

A secure, modular, and role-based backend API for a parcel delivery system inspired by services like Pathao Courier or Sundarban Courier.

---

## 🚀 Features

- JWT-based authentication with refresh tokens and cookies
- Role-based access control: `SUPER_ADMIN`, `ADMIN`, `SENDER`, `RECEIVER`
- Sender: Create, view, and cancel parcels
- Receiver: View incoming parcels and confirm delivery
- Admin: View all parcels/users, block/unblock users and parcels
- Embedded status log in each parcel for full tracking history
- Google OAuth2.0 login (ready, but optional to activate)
- Proper error handling (Zod, MongoDB, validation, and global errors)
- Fully modular and scalable code structure

---

## 🏗️ Project Structure

```
src/
├── modules/
│ ├── auth/
│ ├── user/
│ └── parcel/
├── middlewares/
├── utils/
├── config/
├── app.ts
└── server.ts
```

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/md-habibullah/mama-parcel.git
cd mama-parcel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and set the following variables:

```env
PORT=5000
DB_URL=<your-mongodb-url>
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=<access-secret>
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=<refresh-secret>
JWT_REFRESH_EXPIRES=30d

# Bcrypt
BCRYPT_SALT_ROUND=10

# Super Admin Credentials
SUPER_ADMIN_EMAIL=<super admin gmail>
SUPER_ADMIN_PASSWORD=<super admin password>

# Google Auth
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GOOGLE_CALLBACK_URL=http://<callback-url>

# Express session
EXPRESS_SESSION_SECRET=express-session

# Frontend
FRONTEND_URL=http://mamaparcel.vercel.app
```

### 4. Start the Server

```bash
npm run dev
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| POST   | `/api/v1/auth/login`          | Login with email & password    |
| POST   | `/api/v1/auth/refresh-token`  | Get new access token           |
| POST   | `/api/v1/auth/logout`         | Logout and clear cookies       |
| POST   | `/api/v1/auth/reset-password` | Reset password (auth required) |

---

## 👤 User Endpoints

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| POST   | `/api/v1/users/register`    | Register new user          |
| GET    | `/api/v1/users/me`          | Get current user's profile |
| GET    | `/api/v1/users/all-users`   | Get all users (admin only) |
| PATCH  | `/api/v1/users/:id`         | Update user info           |
| PATCH  | `/api/v1/users/block/:id`   | Block user (admin only)    |
| PATCH  | `/api/v1/users/unblock/:id` | Unblock user (admin only)  |

---

## 📦 **Parcel Endpoints**

| Method  | Endpoint                          | Description                                         | Access Roles                              |
| ------- | --------------------------------- | --------------------------------------------------- | ----------------------------------------- |
| **POST**  | `/api/v1/parcels`                   | Create a new parcel                                  | **Sender**                                |
| **GET**   | `/api/v1/parcels`                   | Get all parcels (with filters, search, pagination)   | **Admin / Super Admin**                   |
| **GET**   | `/api/v1/parcels/me`                | Get parcels created by the authenticated sender      | **Sender**                                |
| **GET**   | `/api/v1/parcels/incoming`          | Get parcels assigned to the authenticated receiver   | **Receiver**                              |
| **GET**   | `/api/v1/parcels/history`           | Get delivered parcels (receiver's delivery history)  | **Receiver**                              |
| **GET**   | `/api/v1/parcels/:id`               | Get a specific parcel by ID                          | **Admin / Super Admin / Sender / Receiver** |
| **GET**   | `/api/v1/parcels/track/:trackingId` | Track parcel using tracking ID                       | **Public**                                |
| **PATCH** | `/api/v1/parcels/:id/status`        | Update status (Dispatched, In-Transit, Delivered, etc.) | **Admin / Super Admin**                   |
| **PATCH** | `/api/v1/parcels/:id/block`         | Block or unblock a parcel                            | **Admin / Super Admin**                   |
| **PATCH** | `/api/v1/parcels/:id/cancel`        | Cancel parcel                                       | **Sender**                                |
| **PATCH** | `/api/v1/parcels/:id/confirm`       | Confirm parcel delivery                              | **Receiver**                              |
| **PATCH** | `/api/v1/parcels/:id/return`        | Return parcel                                        | **Receiver / Admin / Super Admin**        |
| **GET**   | `/api/v1/parcels/stats`             | Parcel statistics overview (total, delivered, canceled, etc.) | **Admin / Super Admin**            |


---

## ✅ Super Admin Seeder

A default super admin will be created if one does not exist.

- Email and password controlled by `.env` file
- Seeder script runs automatically on server start

---

## 🧪 Error Handling

- Global Error Handler (`globalErrorHandler.ts`)
- Zod Validation Errors
- MongoDB Duplicate & Cast Errors
- Structured response with statusCode, message, and metadata

---

## 📦 Tech Stack

- **Node.js**, **Express.js**
- **MongoDB**, **Mongoose**
- **TypeScript**
- **Zod** for validation
- **Passport.js** (Google OAuth ready)
- **Bcrypt** & **JWT** for secure auth

---

## 📸 Deployment & Testing

- Tested via **Postman Collection**
- Easily deployable to Render, Railway, or your own VPS
- Add `.env` in deployment dashboard as well

---

## 🧠 Author

- Project: **Mama Parcel**
- Built by: *Md. Habibullah*
- License: MIT

---

> For questions, suggestions or issues, please open an issue in the GitHub repository.

Happy Coding 🚚

