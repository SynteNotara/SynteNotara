# CollabNotes - Real-Time Collaborative Note-Taking App

A modern, full-stack MERN application that enables teams to collaborate on notes in real-time with powerful features like document history, sharing, and role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Real-Time Features](#real-time-features)
- [Security](#security)
- [Performance](#performance)
- [Error Handling](#error-handling)
- [Accessibility](#accessibility)
- [Testing & CI/CD](#testing--cicd)
- [Architecture & Database Schema](#-architecture--database-schema)
- [Code Examples](#-code-examples)
- [Screenshots & Demo](#screenshots--demo)

## Overview

CollabNotes is a comprehensive note-taking solution built with the MERN stack (MongoDB, Express.js, React, Node.js) that enables real-time collaboration between users. The application provides a seamless experience for teams to create, edit, and manage notes together with instant synchronization.

## Features

- **Real-Time Collaboration**: Multiple users can edit notes simultaneously with changes reflected instantly
- **Secure Authentication**: JWT-based authentication with password encryption using bcryptjs
- **Role-Based Permissions**: Three-tier access system (Owner, Editor, Viewer) for granular control
- **Document Version History**: Track changes and revert to previous versions of any note
- **Advanced Sharing System**: Share via email invitations or generate shareable links
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Search Functionality**: Instant search through all notes by title and content
- **Modern UI/UX**: Beautiful gradient-based design with smooth animations and transitions

## Tech Stack

**Frontend:**

- React 18+ with Hooks
- React Router DOM for navigation
- Axios for API communication
- Socket.io-client for real-time features
- Custom CSS with Tailwind CSS
- React Toastify for notifications
- GSAP for smooth and efficient animations

**Backend:**

- Node.js with Express.js
- JWT for authentication
- Socket.io for real-time communication
- bcryptjs for password hashing
- Mongoose ODM for MongoDB

**Database:**

- MongoDB with optimized schemas
- Mongoose for data validation and relationships

**Development Tools:**

- Concurrently for running frontend/backend
- Environment variables configuration
- CORS enabled for cross-origin requests

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Akmal-Ahmad/CollabNotes.git
cd CollabNotes
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Environment Setup:

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

5. Run the application:

```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm start
```

6. Run the LandingPage.html on a live server.

## Usage

1. **Registration & Login**: Create an account or login with existing credentials
2. **Note Management**: Create new notes, edit existing ones, or delete notes you own
3. **Real-Time Collaboration**: Share notes with team members and see changes in real-time
4. **Permission Management**: Set appropriate access levels for collaborators
5. **Version History**: View and restore previous versions of your notes
6. **Search**: Use the search functionality to quickly find specific notes

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user data
- `POST /api/auth/verify` - Verify JWT token

### Notes Endpoints

- `GET /api/notes` - Get all user's notes (owned + shared)
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/permissions` - Share note with user
- `DELETE /api/notes/:id/permissions/:userId` - Remove user permissions
- `GET /api/notes/:id/history` - Get note version history

### Example API Request

```javascript
// Create a new note
const createNote = async () => {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Project Ideas",
      content: "Brainstorming session notes...",
    }),
  });
  return await response.json();
};
```

## Real-Time Features

The application uses Socket.io to enable real-time collaboration:

1. **Room-Based Communication**: Users join specific note rooms when editing
2. **Instant Updates**: Changes are broadcast to all users in the same note room
3. **User Status Indicators**: See when other users are currently editing
4. **Optimistic UI**: Immediate feedback while synchronizing with backend

**Socket Events:**

```javascript
// Client: join a note
socket.emit("join-note", noteId);

// Server: listen and join
socket.on("join-note", (noteId) => {
  socket.join(noteId);
});

// Client: send changes
socket.emit("note-change", { noteId, title, content, userId });

// Server: broadcast changes
socket.on("note-change", (data) => {
  socket.to(data.noteId).emit("note-update", data);
});
```

## Security

- **Password Encryption**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Authorization Middleware**: Role-based access control for all operations
- **XSS Protection**: Input sanitization and secure rendering practices

### Password Hashing Example

```javascript
const bcrypt = require("bcryptjs");
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

### JWT Middleware Example

```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
```

## Performance

- **Database Optimization**: Indexed fields and efficient query design
- **Selective Data Fetching**: Populate only necessary related data
- **Debounced Saving**: Auto-save with timeout to prevent excessive API calls
- **Efficient Re-rendering**: Optimized React component structure
- **Socket Room Management**: Targeted broadcasting to relevant users only

## Error Handling

- **Centralized Error Handler** in Express returns structured JSON error responses
- **Fallback UI** in React for API failures with retry options
- **Edge Case Coverage**: Handles empty notes, long content, expired JWT tokens, and network interruptions
- **Logging**: Winston/Morgan used for backend logging, optional Sentry integration for error tracking

### Error Handling Middleware Example

```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong, please try again later." });
};
```

## Accessibility

- **ARIA Labels** on inputs, buttons, and interactive components
- **Keyboard Navigation** support across the app
- **Dark Mode Toggle** and font size adjustments for readability
- **High-Contrast Color Scheme** tested with Lighthouse for accessibility compliance

## Testing & CI/CD

- **Unit Tests**: Implemented with Jest (backend) and React Testing Library (frontend)
- **Integration Tests** for authentication and collaboration features
- **Continuous Integration**: GitHub Actions workflow for automated testing and linting on every commit
- **Test Coverage Badge** displayed in README

### Jest Test Example

```javascript
const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "secret123" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
```

## Architecture & Database Schema

### System Architecture

```
Client (React) <-> Server (Node.js/Express) <-> Database (MongoDB)
        ↑↓                    ↑↓
    Socket.io-client       Socket.io
(Real-time Updates)    (Real-time Engine)
```

### User Schema

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
```

### Note Schema

```javascript
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Untitled Note" },
  content: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shared: { type: Boolean, default: false },
  shareLink: { type: String, unique: true, sparse: true },
  sharePermission: { type: String, enum: ["view", "edit"], default: "view" },
  permissions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        enum: ["viewer", "editor", "owner"],
        default: "viewer",
      },
    },
  ],
  history: [
    {
      content: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});
```

## 📡 Code Examples

### Auth Routes

```javascript
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});
```

### Notes Routes

```javascript
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ owner: req.user._id });
  res.json(notes);
});

router.post("/", auth, async (req, res) => {
  const note = new Note({ ...req.body, owner: req.user._id });
  await note.save();
  res.status(201).json(note);
});

router.put("/:id", auth, async (req, res) => {
  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});
```

### Frontend API Helper

```javascript
export const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  token = null
) => {
  const res = await fetch(`/api/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : null,
  });
  if (!res.ok) throw new Error("API request failed");
  return res.json();
};
```

### Frontend Usage (React Component)

```javascript
import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export default function NotesList({ token }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiRequest("notes", "GET", null, token).then(setNotes);
  }, [token]);

  return (
    <div>
      <h2>Your Notes</h2>
      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
```

## Screenshots & Demo

### Screenshots

_(screenshots here)_

### Live Demo

maybe yt link
