# MediBook – Online Doctor Appointment Management System

## Project Overview

MediBook is a full-stack web application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The system allows patients to browse doctors, book appointments, manage their bookings, and track appointment statuses. An admin panel is provided for managing doctors, appointments, and users.

This project was developed as a semester project to demonstrate three-tier architecture, RESTful API development, frontend-backend integration, database management, and CRUD operations.

---

## Features

### Patient Features

* User Registration and Login
* View Available Doctors
* Search Doctors by Name or Specialization
* Book Doctor Appointments
* View My Appointments
* Update Appointment Details
* Cancel Appointments
* Manage User Profile

### Admin Features

* Dashboard with Statistics
* Add New Doctors
* Edit Doctor Information
* Delete Doctors
* View All Appointments
* Approve or Reject Appointments
* View Registered Users

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Context API
* Bootstrap / CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* REST APIs

### Database

* MongoDB Atlas
* Mongoose ODM

---

## Project Structure

appointment-system/

├── frontend/

│   ├── src/

│   ├── public/

│   └── package.json

│

├── backend/

│   ├── controllers/

│   ├── models/

│   ├── routes/

│   ├── middleware/

│   ├── config/

│   └── server.js

│

├── README.md

└── .gitignore

---

## Database Collections

### Users

* name
* email
* password
* role (admin / patient)

### Doctors

* name
* specialization
* experience
* consultationFee
* image

### Appointments

* userId
* doctorId
* appointmentDate
* appointmentTime
* status

---

## REST API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Doctors

GET /api/doctors

GET /api/doctors/:id

POST /api/doctors

PUT /api/doctors/:id

DELETE /api/doctors/:id

### Appointments

GET /api/appointments

POST /api/appointments

PUT /api/appointments/:id

PATCH /api/appointments/:id/status

DELETE /api/appointments/:id

### Users

GET /api/users

GET /api/users/profile

PUT /api/users/profile

---

## Installation Guide

### Clone Repository

git clone <repository-url>

cd appointment-system

---

## Backend Setup

cd backend

npm install

Create a .env file inside the backend folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

Run Backend Server:

npm run dev

Backend will start on:

http://localhost:5000

---

## Frontend Setup

cd frontend

npm install

npm start

Frontend will start on:

http://localhost:3000

---

## CRUD Operations Implemented

### Create

* Register User
* Add Doctor
* Book Appointment

### Read

* View Doctors
* View Appointments
* View User Information

### Update

* Update Doctor Information
* Update Appointment Details
* Update User Profile

### Delete

* Delete Doctor
* Cancel Appointment
* Remove User (Admin)

---

## Future Enhancements

* Online Payment Integration
* Email Notifications
* SMS Appointment Reminders
* Doctor Availability Calendar
* Video Consultation
* Prescription Management

---

## Screenshots

Add project screenshots here after completing the application.

Example:

* Login Page
* Dashboard
* Doctors Listing
* Appointment Booking Page
* Admin Panel

---

## Author

Qurban Ali

BS Computer Science

Semester Project – Enterprise Application Development (EAD)

---

## License

This project is developed for educational purposes only.
