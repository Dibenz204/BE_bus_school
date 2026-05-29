# Smart School Bus Management System — Backend

> RESTful API server for a real-time school bus tracking and management platform, built with Node.js + Express.js + Socket.IO.

---

## Overview

A responsive web application serving **3 user roles** — Admin, Parent, and Driver — with real-time bus tracking via interactive map, student attendance visibility, and route/bus stop management.

**Live Demo:** https://bus-smart-school.vercel.app/

| Role | Email | Password |
|---|---|---|
| Admin | abc@gmail.com | 123456 |
| Driver | xeom@gmail.com | 123456 |
| Parent | lala@gmail.com | 123456 |

**Frontend Repo:** [https://github.com/Dibenz204/FE_Bus_School](https://github.com/Dibenz204/FE_Bus_School)

---

## Key Features

- **RESTful API** — 122 endpoints covering route management, bus stops, student attendance, and driver operations
- **Real-time GPS Tracking** — Socket.IO integration for live bus location broadcast to parent clients
- **Role-based Access** — Separate permission logic for Admin, Parent, and Driver
- **Scalable Database Schema** — MySQL with Sequelize ORM, 13 tables designed for extensibility
- **Cloud Deployment** — Backend hosted on Render, database on Railway

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Real-time | Socket.IO |
| Database | MySQL |
| ORM | Sequelize |
| Deployment | Render (API), Railway (DB) |

---

## Project Structure

```
BE_bus_school/
├── src/
│   ├── config/          # DB config, environment setup
│   ├── controllers/     # Request handlers for each module
│   ├── migrations/      # Sequelize migration files
│   ├── models/          # Sequelize model definitions
│   ├── routes/          # API route definitions
│   ├── seeders/         # Database seed data
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper functions
│   └── views/           # [server-side views nếu có]
├── .babelrc             # Babel config (ES module support)
├── .env.example
├── .sequelizerc         # Sequelize CLI config
├── cronJob.js           
├── server.js            # App entry point
├── socketNotifier.js    # Socket.IO notification handlers
├── socketServer.js      # Socket.IO server setup
├── package.json
└── .gitignore
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

## API Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/login` | User login |
| | POST | `/send-otp` | Send OTP to email |
| | POST | `/verify-otp` | Verify OTP code |
| | POST | `/reset-password` | Reset password via OTP |
| | POST | `/change-password-with-old` | Change password with old password |
| | POST | `/verify-old-password` | Verify old password before change |
| **User** | GET | `/read_user` | Get all users |
| | GET | `/users-by-role` | Get users filtered by role |
| | GET | `/user-count-by-role` | Get user count per role |
| | GET | `/user-by-phone` | Get user by phone number |
| | POST | `/create-new-user` | Create new user |
| | PUT | `/update-user` | Update user info |
| | DELETE | `/delete-user` | Delete user |
| **Bus** | GET | `/get-buses` | Get all buses |
| | GET | `/get-bus` | Get bus by ID |
| | GET | `/get-routes` | Get routes list |
| | GET | `/get-drivers` | Get drivers list |
| | POST | `/create-bus` | Create new bus |
| | PUT | `/update-bus` | Update bus info |
| | DELETE | `/delete-bus` | Delete bus |
| **Route** | GET | `/read_route` | Get all routes |
| | GET | `/get-busstops-by-route` | Get bus stops by route |
| | POST | `/create-new-route` | Create new route |
| | POST | `/save-route-busstops` | Assign bus stops to route |
| | PUT | `/update-route` | Update route |
| | DELETE | `/delete-route` | Delete route |
| **Bus Stop** | GET | `/get-all-bus-stops` | Get all bus stops |
| | POST | `/create-bus-stop` | Create new bus stop |
| | DELETE | `/delete-bus-stop` | Delete bus stop |
| **Driver** | GET | `/read-driver` | Get all drivers |
| | GET | `/driver-byid` | Get driver by ID |
| | GET | `/all-locations` | Get all driver locations |
| | POST | `/create-new-driver` | Create new driver |
| | PUT | `/update-status-driver` | Update driver status |
| | PUT | `/update-user` | Update driver info |
| | PUT | `/update-location` | Update driver GPS location |
| | DELETE | `/delete-driver` | Delete driver |
| **Tracking** | GET | `/get-driver-locations-for-parent` | Get live driver locations for parent view |
| | WS | `socket: location_update` | Driver emits GPS coordinates |
| | WS | `socket: bus_location` | Parent receives live bus location |
| **Student** | GET | `/read_student` | Get all students |
| | GET | `/get-student-by-id` | Get student by ID |
| | GET | `/get-by-parent` | Get students by parent |
| | POST | `/create-new-student` | Create new student |
| | PUT | `/update-student` | Update student info |
| | DELETE | `/delete-student` | Delete student |
| **Schedule** | GET | `/get-schedules` | Get all schedules |
| | GET | `/get-schedule` | Get schedule by ID |
| | GET | `/get-schedule-by-driver` | Get schedules by driver |
| | GET | `/get-statuses` | Get schedule status list |
| | GET | `/auto-update-status` | Trigger auto status update (cron) |
| | POST | `/create-schedule` | Create new schedule |
| | PUT | `/update-schedule` | Update schedule |
| | PUT | `/update-student-status` | Update student pickup status |
| | DELETE | `/delete-schedule` | Delete schedule |
| **Notification** | GET | `/read_notification` | Get all notifications |
| | GET | `/get-notification-by-id` | Get notification by ID |
| | GET | `/get-by-user` | Get notifications for current user |
| | GET | `/get-for-admin` | Get notifications for admin |
| | GET | `/get-users-by-role` | Get users by role (for targeting) |
| | GET | `/get-all-users` | Get all users (for targeting) |
| | GET | `/stats` | Get notification statistics |
| | POST | `/create-new-notification` | Create notification |
| | POST | `/send-by-admin` | Admin broadcasts notification |
| | POST | `/send-incident` | Send incident alert notification |
| | PUT | `/mark-as-read` | Mark notification as read |
| | DELETE | `/delete-notification` | Delete notification |
| **Evaluate** | GET | `/get-evaluates` | Get all evaluations |
| | GET | `/get-evaluate` | Get evaluation by ID |
| | GET | `/get-evaluates-by-parent` | Get evaluations by parent |
| | POST | `/create-evaluate` | Create new evaluation |
| | PUT | `/update-evaluate` | Update evaluation |
| | DELETE | `/delete-evaluate` | Delete evaluation |
| **Request** | GET | `/get-requests` | Get all requests |
| | GET | `/get-request` | Get request by ID |
| | GET | `/get-requests-by-parent` | Get requests by parent |
| | POST | `/create-request` | Create new request |
| | PUT | `/update-request` | Update request |
| | DELETE | `/delete-request` | Delete request |
| **Dashboard** | GET | `/total-students` | Total student count |
| | GET | `/total-users` | Total user count |
| | GET | `/total-busstops` | Total bus stop count |
| | GET | `/total-routes` | Total route count |
| | GET | `/user-stats-by-role` | User statistics by role |
| | GET | `/students-by-month` | Student registrations by month |
| | GET | `/available-years` | Available years for filtering |
| | GET | `/students-by-route` | Students grouped by route |
| | GET | `/all-stats` | All dashboard stats in one call |

## Database Schema

Sơ đồ ERD: (https://drive.google.com/file/d/12aWOQIqqWAxhGhUqqHdgEP-g9PkdCcfI/view?usp=sharing)


## Team

| Role | Member |
|---|---|
| Backend Lead & Team Leader | Nguyễn Đình Phong |
| Backend | Bùi Nguyên Thịnh |

---

This project is for academic and portfolio purposes.
