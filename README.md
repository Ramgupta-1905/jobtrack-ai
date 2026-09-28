# 🚀 JobTrack AI

> A full-stack job application tracking platform designed to help students and job seekers manage applications, assessments, interviews, resumes, and career activity in one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-JobTrack%20AI-blue?style=for-the-badge)](https://jobtrack-ai-chi.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Ramgupta-1905/jobtrack-ai)

---

## 🌐 Live Demo

🔗 **Live Application:** https://jobtrack-ai-chi.vercel.app/
🔗 **GitHub Repository:** https://github.com/Ramgupta-1905/jobtrack-ai

---

## 📌 Overview
JobTrack AI is a full-stack job application tracking platform built to simplify the process of managing job applications and the activities associated with them.
The platform provides a centralized workspace where users can manage their job applications, track assessments and interviews, store resumes, maintain their professional profile, and monitor recent activity through a dashboard.
The project was built to gain practical experience in modern frontend development, REST API development, authentication, database integration, and cloud deployment.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected application routes
- Secure password handling
- Persistent authentication using JWT tokens

### 📊 Dashboard
- Overview of job application activity
- Recent applications
- Upcoming interviews
- Assessment-related activities
- Activity feed
- Needs Attention section
- Quick navigation to application management

### 💼 Application Tracking
- Add job applications
- Edit application details
- Delete applications
- Search applications
- Filter applications
- Sort applications
- Track application status

Supported application statuses:
- Applied
- Assessment
- Interview Scheduled
- Offer Received
- Rejected

### 📝 Assessment Tracking
- Track assessments associated with applications
- Store assessment type
- Store assessment date
- Add optional assessment deadlines
- Display assessment-related activity
- Highlight upcoming assessment deadlines

### 🎯 Interview Tracking
- Track scheduled interviews
- Interview date and time
- Interview type
- Interview mode
- Upcoming interview overview
- Quick access from the dashboard

Supported interview types:
- HR
- Technical

Supported interview modes:
- Virtual
- On-site
- Phone

### 📄 Resume Vault
- Upload resumes
- Store resumes securely
- View stored resumes
- Download resumes
- Rename resumes
- Delete resumes
- Search resumes
- Sort resumes

### 👤 Profile Management
- Personal information
- Academic information
- CGPA
- Graduation year
- Bio
- Skills
- GitHub profile
- LinkedIn profile

### ⚙️ Settings
- Manage account settings
- Update profile-related information
- Change password
- Help Center
- Contact Support
- Report a Bug
- Send Feedback
- About JobTrack AI

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- React Router
- Tailwind CSS
- Lucide React
- Vite

### Backend
- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Maven

### Database
- PostgreSQL
- Supabase

### Deployment
- Vercel — Frontend
- Render — Backend
- Supabase — PostgreSQL Database

---

## 🏗️ System Architecture

                         ┌───────────────────┐
                         │       User        │
                         │     Browser       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Vercel       │
                         │  React Frontend   │
                         └─────────┬─────────┘
                                   │
                              REST API
                              + JWT
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Render       │
                         │  Spring Boot API  │
                         └─────────┬─────────┘
                                   │
                              PostgreSQL
                                   │
                                   ▼
                         ┌───────────────────┐
                         │     Supabase      │
                         │ PostgreSQL DB     │
                         └───────────────────┘

---
## 🔒 Authentication & Security

JobTrack AI uses JWT-based authentication with Spring Security.

The authentication flow is:

```text
User
  ↓
Login / Signup
  ↓
Spring Boot Authentication API
  ↓
Credentials Verified
  ↓
JWT Token Generated
  ↓
Token Stored on Frontend
  ↓
JWT Sent with Protected Requests
  ↓
Spring Security JWT Filter
  ↓
Authenticated User

Protected resources require a valid JWT token.

📁 Project Structure
jobtrack-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── jobtrack-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │
│   ├── pom.xml
│   └── Dockerfile
│
└── README.md
```

## 🚀 Deployment
```text
JobTrack AI is deployed using a cloud-based production architecture.

Frontend — Vercel
The React frontend is deployed on Vercel.
🔗 https://jobtrack-ai-chi.vercel.app/

Backend — Render
The Spring Boot backend is deployed on Render using Docker.

Database — Supabase
The production PostgreSQL database is hosted on Supabase.

Production Architecture
Vercel
   ↓
Render
   ↓
Supabase PostgreSQL

The production application operates independently of the developer's local machine.
```
---
## 🎯 Project Goals
```text
JobTrack AI was built with the following goals:

Build a production-style React application
Learn how frontend applications communicate with REST APIs
Implement authentication using Spring Security and JWT
Work with PostgreSQL and JPA
Build CRUD-based application features
Understand full-stack application architecture
Deploy a complete application to the cloud
Create a portfolio-ready full-stack project
🔮 Future Improvements

The next development phase will focus on AI-powered career assistance.

Planned features include:
🤖 AI Resume / ATS Analysis
📊 ATS Score
📝 Job Description Analyzer
✉️ AI Cover Letter Generator
🎤 AI Interview Preparation
💡 Personalized career suggestions
```
## 📚 What I Learned
```text
Building JobTrack AI helped me gain practical experience with:

React application architecture
React Router
Tailwind CSS
REST API integration
Spring Boot
Spring Security
JWT authentication
Spring Data JPA
PostgreSQL
CRUD operations
Frontend-backend integration
Cloud deployment
Docker
Vercel
Render
Supabase
```
---
## 👨‍💻 Author
```text
Ram Gupta

B.Tech Computer Science & Engineering Student

🔗 GitHub: https://github.com/Ramgupta-1905

⭐ Support

If you find JobTrack AI useful or interesting, consider giving the repository a ⭐ on GitHub.

📄 License

This project is currently intended as a personal portfolio and learning project.
```
