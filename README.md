# SynteNotara - Real-Time Collaborative Note-Taking App

A modern, full-stack MERN application using React, Tailwind, node, Socket.io, etc that enables teams to collaborate on notes in real-time with powerful features like document history, sharing, and role-based access control.

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
- [Screenshots](#screenshots)

## Overview

SynteNotara is a comprehensive note-taking solution built with the MERN stack (MongoDB, Express.js, React, Node.js) that enables real-time collaboration between users. The application provides a seamless experience for teams to create, edit, and manage notes together with instant synchronization.

``` Folder Structure


project/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── users.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── components/
│       │   ├── CollaboratorsModal.js
│       │   ├── Header.js
│       │   ├── Login.js
│       │   ├── NoteEditor.js
│       │   ├── NoteItem.js
│       │   ├── Search.js
│       │   ├── ShareButton.js
│       │   ├── SharedNote.js
│       │   └── Sidebar.js
│       ├── index.js
│       └── package.json
├── ss/
│   ├── Collaboration2.png
│   ├── Features2.png
│   ├── Hero Section2.png
│   └── Manage2.png
└── LandingPage.html
```
---

## User-Friendly Interface

This project has a strong focus on creating a user-friendly interface. Key aspects include:

- **Clear and Clean Design:**  
  The use of Tailwind CSS and custom CSS variables for a defined color palette (`--primary`, `--secondary`, etc.) suggests a clean, modern aesthetic. The `index.html` file includes a hero section with a bold title and a clear call to action ("Get Started"), which is excellent for user engagement.

- **Intuitive Navigation:**  
  The navigation bar is simple and includes links to key sections like "Features," "How It Works," and "Pricing," making it easy for users to find information.

- **Interactive Elements:**  
  The code incorporates animations using GSAP (GreenSock Animation Platform) and ScrollTrigger for elements like feature cards and the hero illustration. This adds visual feedback and makes the interface feel dynamic and engaging. For example, it has a slight lift and rotation on hover for note cards and a 3D perspective transform on the hero image.

- **Actionable Feedback:**  
  The frontend uses a modal for managing collaborators and a toast notification system (`react-toastify`) to provide feedback on actions like sharing a note or removing a collaborator. This helps guide users and confirms that their actions were successful.

- **Modern UI:**  
  The app interface is clear, modern, and aesthetic, on par with applications like Google Keep.

---

## Responsive Layout

This project is fully responsive, using Tailwind CSS, Flexbox, Grid, viewport meta tags, media queries, and more.

- **Tailwind's Mobile-First Approach:**  
  Responsive utility classes like `md:flex` and `md:hidden` are used to make the design adapt to different screen sizes. Navigation links are hidden inside a hamburger menu on small screens and displayed on medium screens and up.

- **Viewport Meta Tag:**  
  The `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag ensures a responsive layout that scales correctly on all devices.

- **React UI:**  
  React components also use Tailwind CSS to ensure complete responsiveness. Global CSS classes in `App.css` are used alongside Tailwind for custom styles, combining the speed of utility classes with the control of custom CSS.

---

## Proper Use of CSS/Frameworks

This project effectively utilizes multiple frameworks and styling methodologies.

- **Combination of Frameworks:**  
  Tailwind CSS is used for utility-based styling alongside custom CSS for complex styles.

- **Modular Styling:**  
  Each React component can have dedicated CSS or use global styles, promoting maintainability. For example, `CollaboratorsModal.js` imports `App.css` for additional styling.

- **CSS Variables:**  
  Variables for colors ensure theme consistency and easy updates from a single location.

- **Third-Party Libraries:**  
  External libraries like Font Awesome, GSAP, and ScrollTrigger are used to enhance UX and interactivity.

---

## Backend Functionality

The project has a robust and well-structured backend.

- **Core Technologies:**  
  - **Node.js with Express.js:** Efficient creation of API endpoints and HTTP request management.  
  - **MongoDB with Mongoose:** Manages relationships between the app and database. Distinct schemas for User and Note models ensure data consistency.

- **Other Technologies:**  
  JWT, bcrypt, WebSockets, and more are used to enhance functionality.

---

## Proper Schema Design and Relationships

- **User Schema:** Stores username, email, and hashed password securely.  
- **Note Schema:** Includes fields such as title, content, owner, permissions, shared with, and history. Relationships with User schema are managed via:
  - Direct Reference: `owner` field references the User model.  
  - Permissions Array: Granular, many-to-many relationships for note sharing.

- **Denormalization:**  
  Embedding permissions within the Note document allows fast queries and efficient real-time collaboration, which is effective in MongoDB.

- **Secure CRUD Operations:**  
  JWT authentication protects all sensitive operations, ensuring only authorized users can manipulate resources.

---

## Smooth Connection Between Frontend, Backend, and Database

- **Front-End to Back-End:**  
  Axios is used for reliable API calls.  

- **Real-Time Communication:**  
  Socket.IO enables multiple users to edit notes simultaneously. Events are emitted from the frontend, processed by the server, and broadcasted to other clients.  

- **Back-End to Database:**  
  Mongoose simplifies interactions with MongoDB. A debounce mechanism on the frontend saves notes after a 2000ms pause, reducing server load.

---

## Security Measures

- **Password Encryption:**  
  Bcrypt.js hashes and salts passwords to prevent brute-force and dictionary attacks.

- **JWT-based Authentication:**  
  Stateless authentication ensures secure API access and prevents session fixation attacks.

- **Vulnerability Protection:**  
  - NoSQL injection protection via Mongoose schema validation.  
  - Robust `try...catch` blocks handle errors and prevent server crashes.  
  - Generic error messages avoid leaking sensitive backend details.

---

## Efficient Queries and Resource Management

- **Optimized Queries:**  
  Example: `User.findById(decoded.userId).select('-password')` efficiently retrieves user data. `$slice` is used in note history management to prevent unbounded growth.

- **Exception Handling and Stability:**  
  Try-catch blocks in backend and frontend ensure stability under edge cases, with user-friendly error notifications.

---

## Code Quality and Innovative Features

- **High Code Quality and Structure:**  
  - Modular architecture separates routes, models, middleware, and controllers.  
  - React components are reusable and maintainable.  
  - Modern ES6+ syntax, async/await, and React hooks are used.  
  - API versioning (`/api/v1`) ensures future-proofing.

- **Innovative Features:**  
  - **Real-Time Collaborative Editing:** Multiple users can edit notes simultaneously using Socket.IO.  
  - **Role-Based Access Control (RBAC):** Owners can assign viewer/editor roles.  
  - **Note History Management:** Efficiently tracks the last few revisions to maintain performance.  
  - **Modern UI/UX Animations:** GSAP animations enhance interactivity.  
  - **Debounced Saving:** Saves notes after typing pauses to optimize server performance.

---

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
git clone https://github.com/Akmal-Ahmad/SynteNotara.git
cd SynteNotara
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

- **Centralized Error Handler** in Express returns structured JSON
  error responses
- **Fallback UI** in React for API failures with retry options
- **Edge Case Coverage**: Handles empty notes, long content, expired
  JWT tokens, invalid permissions, and network interruptions
- **Network/Server Downtime Fallbacks**:
  - Graceful degradation with "offline mode" indicators when the
    API/server is unreachable
  - Retry strategies with exponential backoff for failed requests
  - Toast notifications to inform users of connection loss and
    automatic reconnection attempts
- **Exception Management**:
  - Extensive use of try...catch in controllers, services, and
    socket events to prevent server crashes
  - Validation errors are returned with detailed messages instead of
    generic 500 errors
  - Socket.io automatically re-establishes connections on disconnect
    events
- **Logging**: Winston/Morgan used for backend logging, optional
  Sentry integration for error tracking

## Exception Handling

- **Centralized Error Handling (Backend):**

  - Implemented an Express middleware to catch and format errors into JSON responses.
  - Differentiates between validation errors, JWT authentication errors, and unexpected server errors.
  - Prevents server crashes by wrapping async routes with try...catch.

- **React Error Boundaries (Frontend):**

  - Error boundaries capture rendering errors and display a user-friendly fallback UI instead of breaking the whole app.
  - Provides retry buttons or navigation to a safe page when an error occurs.

- **Fallback UI Behaviors:**
  - Offline indicators when the API/server is unreachable.
  - Toast notifications for network interruptions with automatic reconnection attempts.
  - Loading skeletons for smoother user experience during API requests.

---

## Testing & Maintenance

- **Unit Testing:**

  - Backend tested with **Jest** and **Supertest** for routes and controllers.
  - Frontend tested with **React Testing Library** and **Jest** for component rendering and state management.

- **Integration Tests:**

  - Authentication flow, collaboration sessions, and role-based permissions tested to ensure reliability.

- **Linting & Code Quality:**

  - **ESLint** and **Prettier** ensure consistent code formatting and style.
  - Git hooks (Husky) prevent committing code that fails lint/test checks.

- **CI/CD Pipelines:**
  - **GitHub Actions** runs automated tests, linting, and build checks on every pull request.
  - Deployments can be automated to **Heroku** or **Vercel** for staging/production environments.

---

## Visual Aids in Documentation

- **Architecture Diagram:**

```
+-----------------+        +-------------------+        +----------------+
|   React Client  | <----> |  Express.js API   | <----> |   MongoDB DB   |
|  (Frontend UI)  |        | (Backend Server)  |        | (Data Storage) |
+-----------------+        +-------------------+        +----------------+
         ↑                           ↑                          ↑
         |                           |                          |
   Socket.IO Client         Socket.IO Server             Mongoose ODM
 (Real-Time Updates)     (Real-Time Collaboration)    (Schema & Queries)
```

### Error Handling Middleware Example

```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Handle specific known errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Generic fallback
  res
    .status(500)
    .json({ error: "Something went wrong, please try again later." });
};
```

## Performance & Stability Optimizations

- **Database Efficiency**

  - Indexed frequently queried fields for faster data retrieval.
  - Implemented selective data fetching to reduce payload size.
  - Paginated notes for optimal load times on large datasets.

- **Frontend Optimization**

  - Used `React.memo`, `useMemo`, and lazy-loading to minimize unnecessary re-renders.
  - Debounced auto-save and throttled API calls to reduce server load.

- **Real-Time Collaboration**

  - Socket.io rooms scoped per document to reduce network traffic.
  - Efficient event handling for simultaneous edits.

- **Exception Handling & Stability**

  - Global error-handling middleware on backend.
  - Graceful handling of socket disconnections and failed API calls.
  - Input validation to prevent crashes on edge cases.
  - Fallback UI and notifications for API failures.

- **Testing**
  - Manually tested edge cases: empty notes, large documents, simultaneous edits, and offline reconnect scenarios.

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

## Code Quality & Innovative Features

- **Code Quality**

  - Consistent folder structure and naming conventions.
  - Clean, modular, and reusable React components.
  - Backend code structured with proper MVC patterns.
  - ESLint and Prettier applied for consistent formatting.
  - Unit and integration tests added for critical functionalities.

- **Innovative Features**
  - Real-time collaborative editing with live updates.
  - Version history and role-based access control.
  - Dark mode toggle for improved UX.
  - Offline note editing with automatic sync upon reconnect.
  - Interactive animations for note changes and collaboration events.

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

## Code Examples

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

## Screenshots

### Some Screenshots

Landing Page Hero section :
![Hero](https://github.com/Akmal-Ahmad/SynteNotara/blob/main/ss/Hero%20Section2.PNG?raw=true)

Landing Page Features section :
![Features](https://github.com/Akmal-Ahmad/SynteNotara/blob/main/ss/Features2.PNG?raw=true)

Real-Time Collaboration :
![Collaboration](https://github.com/Akmal-Ahmad/SynteNotara/blob/main/ss/Collaboration2.PNG?raw=true)

Easily Add/Remove Collaborators :
![Easy Management](https://github.com/Akmal-Ahmad/SynteNotara/blob/main/ss/Manage2.PNG?raw=true)
