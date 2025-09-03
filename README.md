# 📒 CollabNotes – Real-Time Collaborative Note-Taking App

## 🔎 Overview

- MERN stack app (MongoDB, Express.js, React, Node.js)
- Real-time collaboration on notes
- Instant sync across users

## 🎨 User Interface & Frontend

- Clean, modern design (Tailwind CSS + custom CSS)
- Responsive layout (flex, grid, mobile-first)
- Smooth animations (GSAP, ScrollTrigger)
- Feedback via modals + toast notifications
- Dark mode & accessibility features

## ⚙️ Backend Functionality

- Node.js + Express.js for REST APIs
- MongoDB Atlas with Mongoose schemas
- JWT authentication + bcrypt password hashing
- Socket.IO for real-time updates
- Robust CRUD operations with secure access control

## 🗂️ Database Schema

- **User Schema:** username, email, hashed password, role
- **Note Schema:** title, content, owner, permissions, history
- Relationships:
  - Notes reference User (owner)
  - Permissions array for shared access

## 🔐 Security

- Password encryption with bcrypt
- JWT for stateless authentication
- Role-based access (Owner / Editor / Viewer)
- Input validation + XSS protection
- Error handling with try–catch & middleware

## 🚀 Performance & Reliability

- Optimized queries (select, slice)
- Debounced auto-save (reduces API spam)
- Efficient socket room management
- Stable under edge cases (invalid JWT, server downtime)
- Logging with Winston/Morgan

## ⭐ Key Features

- Real-time collaborative editing
- Role-based permissions (granular access control)
- Document version history (revert changes)
- Advanced sharing (email invites + links)
- Search by title/content
- Responsive + modern UI/UX

## 🛠️ Tech Stack

**Frontend:** React, Tailwind, Axios, React Toastify, GSAP, Socket.io-client  
**Backend:** Node.js, Express.js, JWT, bcryptjs, Socket.IO  
**Database:** MongoDB + Mongoose  
**Tools:** Concurrently, CORS, GitHub Actions for CI/CD

## 📥 Installation

1. Clone repo
2. Install dependencies (`npm install` in backend + frontend)
3. Setup `.env` (Mongo URI + JWT secret)
4. Run backend (`npm run server`) and frontend (`npm start`)
5. Open LandingPage.html in browser

## ▶️ Usage

- Register/Login
- Create, edit, delete notes
- Share with collaborators
- Set roles (Owner, Editor, Viewer)
- View & restore history
- Search notes

## 🔗 API Endpoints (Examples)

- `POST /api/auth/register` → Register user
- `POST /api/auth/login` → Login user
- `GET /api/notes` → Fetch user’s notes
- `POST /api/notes` → Create note
- `PUT /api/notes/:id` → Update note
- `DELETE /api/notes/:id` → Delete note

## ⚡ Real-Time Features

- Room-based Socket.IO communication
- Instant updates broadcasted to collaborators
- Live editing indicators
- Optimistic UI for smooth user experience

## 🧪 Testing & CI/CD

- Jest + React Testing Library for unit & integration tests
- Automated CI via GitHub Actions
- Test coverage badge included

## 🖼️ Screenshots

- Landing Page (Hero + Features)
- Real-time collaboration view
- Collaborator management
