# Smart School Bus Management System — Backend

> RESTful API server for a real-time school bus tracking and management platform, built with Node.js + Express.js + Socket.IO.

---

## Overview

A backend system serving **3 user roles** (Admin, Parent, Driver) with real-time GPS tracking, student attendance management, and route/bus stop operations.

**Live Demo:** (Hiện tại chưa hoạt động, do phần deploy database bằng railway đã hết hiệu lực) 
**Frontend Repo:** [https://github.com/Dibenz204/FE_Bus_School](https://github.com/Dibenz204/FE_Bus_School)

---

## Key Features

- **RESTful API** — 122 endpoints covering route management, bus stops, student attendance, and driver operations
- **Real-time GPS Tracking** — Socket.IO integration for live bus location broadcast to parent clients
- **Role-based Access** — Separate permission logic for Admin, Parent, and Driver
- **Scalable Database Schema** — MySQL with Sequelize ORM, 13 tables designed for extensibility
- **Cloud Deployment** — Backend hosted on Render, database on Railway

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Real-time | Socket.IO |
| Database | MySQL |
| ORM | Sequelize |
| Deployment | Render (API), Railway (DB) |

---

## 🗂 Project Structure

```
BE_bus_school/
├── src/
│   ├── config/          # DB config, env setup
│   ├── controllers/     # Route, stop, attendance, driver controllers
│   ├── migrations/      # Auth, role-check middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API route definitions
│   └── socket/          # Socket.IO event handlers
├── .env.example
├── package.json
└── server.js
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MySQL >= 8.x

### Installation

```bash
# Clone repo
git clone https://github.com/Dibenz204/BE_bus_school.git
cd BE_bus_school

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Điền DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET, PORT vào .env

# Run database migrations
npx sequelize-cli db:migrate

# Start development server
npm run dev
```

---

## API Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|

---

## Database Schema

Sơ đồ ERD: (https://drive.google.com/file/d/12aWOQIqqWAxhGhUqqHdgEP-g9PkdCcfI/view?usp=sharing)


## Team

| Role | Member |
|---|---|
| Backend Lead & Team Leader | Nguyễn Đình Phong |
| Backend | Bùi Nguyên Thịnh |

---

## License

This project is for academic and portfolio purposes.
