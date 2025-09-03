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

- `join-note` - User joins a specific note room
- `note-change` - Note content is updated
- `note-update` - Broadcast changes to other users
- `user-typing` - Show when users are actively editing

## Security

- **Password Encryption**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Authorization Middleware**: Role-based access control for all operations
- **XSS Protection**: Input sanitization and secure rendering practices

## Performance

- **Database Optimization**: Indexed fields and efficient query design
- **Selective Data Fetching**: Populate only necessary related data
- **Debounced Saving**: Auto-save with timeout to prevent excessive API calls
- **Efficient Re-rendering**: Optimized React component structure
- **Socket Room Management**: Targeted broadcasting to relevant users only
