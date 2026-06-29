<div align="center">

# 🎓 Student Management System

**Full-Stack Student Management System** built with **Spring Boot 3 (Java 21)**, **Spring Security (JWT)**, **MySQL**, and **React 18 + TypeScript + Tailwind CSS**.

[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 About

A role-based web application for managing students, teachers, courses, attendance, marks, and fee records in an educational institution. Built as a full-stack project to demonstrate secure authentication, relational data modeling, and a clean REST API consumed by a modern React frontend.

### ✨ Features
- 🔐 JWT-based stateless authentication with **Admin / Teacher / Student** role-based access control
- 👨‍🎓 Student CRUD with department and course mapping
- 📋 Attendance tracking
- 📝 Marks & grade management
- 💰 Fee record management
- 📑 Swagger / OpenAPI documentation
- 🐳 Dockerized backend with MySQL for one-command deployment

### 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA/Hibernate |
| Database | MySQL 8 |
| Frontend | React 18, TypeScript, Tailwind CSS, Vite, Axios |
| Auth | JWT (JJWT) |
| DevOps | Docker, Docker Compose, Maven |

---

## 🚀 Run Locally

### Prerequisites
- Java 21 (JDK)
- Node.js 18+
- MySQL 8 (or use the included Docker Compose setup)

### 1. Backend
```bash
cd backend
# Edit src/main/resources/application.yml with your MySQL credentials if needed
mvn clean install
mvn spring-boot:run
```
Backend runs at `http://localhost:8080/api`. Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`

### 3. Or run everything with Docker
```bash
cd backend
docker-compose up -d
```

### 🔑 Demo Accounts (seeded)
| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `password` |
| Teacher | `senthil_kumar` | `password` |
| Student | `karthikeyan` | `password` |
