import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import Login from './components/Login';
import SharedNote from './components/SharedNote';

// Toastify for notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// FontAwesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css';

// The main application component. It handles global state, routing, and authentication.
function App() {
  // State variables for application-wide data.
  const [user, setUser] = useState(null); // The authenticated user object.
  const [notes, setNotes] = useState([]); // Array of all notes belonging to or shared with the user.
  const [selectedNote, setSelectedNote] = useState(null); // The currently selected note to be edited.
  const [socket, setSocket] = useState(null); // The WebSocket connection for real-time updates.
  const [searchQuery, setSearchQuery] = useState(''); // The user's search query.
  const [searchResults, setSearchResults] = useState([]); // The results of the search query.
  const [isLoading, setIsLoading] = useState(true); // Tracks initial loading state (e.g., auth check).
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detects if the device is mobile.

  // Effect to check and update the screen size state for responsive design.
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', checkScreenSize);
    // Cleanup function to remove the event listener on component unmount.
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Main effect for authentication and initial data fetching.
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      // Check for a token and user data in local storage.
      if (token && userData) {
        try {
          // Verify the token with the backend.
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            // If verification is successful, set the user state.
            const userObj = JSON.parse(userData);
            setUser(userObj);

            // Establish a WebSocket connection with the auth token.
            const newSocket = io(process.env.REACT_APP_API_URL, {
              auth: {
                token: token
              }
            });
            setSocket(newSocket); // Store the socket instance in state.

            // Fetch the user's notes.
            await fetchUserNotes(userObj._id, token);
          } else {
            // If verification fails, clear local storage.
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check error:', error);
          // On any error, clear local storage.
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false); // End the initial loading state.
    };

    checkAuth();

    // Cleanup function to close the socket connection on component unmount.
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []); // Empty dependency array means this effect runs only once on mount.

  // Effect to trigger note fetching when a user successfully logs in.
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUserNotes(user._id, token);
      }
    }
  }, [user]); // Runs whenever the 'user' state changes.

  // Effect to handle real-time note updates from the WebSocket server.
  useEffect(() => {
    if (!socket) return;

    // Handler for the 'note-update' event.
    const handleNoteUpdate = (data) => {
      // Update the notes state immutably by mapping over the array.
      setNotes(prevNotes =>
        prevNotes.map(note =>
          // Find the updated note by its ID and replace it with the new data.
          note._id === data.noteId ? { ...note, title: data.title, content: data.content } : note
        )
      );
    };

    // Listen for the 'note-update' event.
    socket.on('note-update', handleNoteUpdate);

    // Cleanup function to stop listening to the event.
    return () => {
      socket.off('note-update', handleNoteUpdate);
    };
  }, [socket, setNotes]); // Runs when 'socket' or 'setNotes' changes.

  // Asynchronous function to fetch all notes for the authenticated user.
  const fetchUserNotes = async (userId, token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include auth token for access.
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data); // Set the notes state with the fetched data.
      } else if (response.status === 401) {
        // If the token is invalid, clear local storage and log the user out.
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        console.error('Failed to fetch notes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Function to handle note search by title and content.
  const handleSearch = (query) => {
    setSearchQuery(query);
    // If the query is empty, clear the search results.
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Filter the notes array to find matching notes.
    const results = notes.filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results); // Update the search results state.
  };

  // Renders a loading message while the app is initializing.
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    // Sets up the application's routing.
    <Router>
      <div className="app">
        <ToastContainer position="top-right" autoClose={3000} /> {/* Notification container. */}
        
        {/* Conditional rendering based on user authentication status. */}
        {!user ? (
          // If no user is authenticated, show the Login page and SharedNote route.
          <Routes>
            <Route path="/shared/:shareLink" element={<SharedNote />} />
            <Route path="*" element={<Login setUser={setUser} setNotes={setNotes} />} />
          </Routes>
        ) : (
          // If a user is authenticated, show the main application UI.
          <>
            <Header
              user={user}
              setUser={setUser}
              onSearch={handleSearch}
              searchQuery={searchQuery}
            />
            {/* Main body of the application with responsive classes. */}
            <div className={`app-body ${selectedNote ? 'note-selected' : 'no-note-selected'}`}>
              {/* Conditionally renders the Sidebar for mobile view. */}
              {/* It shows if it's not mobile or if a note is not selected. */}
              {(!isMobile || !selectedNote) && (
                <Sidebar
                  // Pass search results to the sidebar if a search query is active.
                  notes={searchQuery ? searchResults : notes}
                  selectedNote={selectedNote}
                  setSelectedNote={setSelectedNote}
                  user={user}
                  setNotes={setNotes}
                />
              )}
              {/* Conditionally renders the NoteEditor for mobile view. */}
              {/* It shows if it's not mobile or if a note is selected. */}
              {(!isMobile || selectedNote) && (
                <Routes>
                  <Route path="/" element={
                    <NoteEditor
                      note={selectedNote}
                      socket={socket}
                      user={user}
                      setNotes={setNotes}
                      setSelectedNote={setSelectedNote}
                    />
                  } />
                </Routes>
              )}
              <Routes>
                {/* Route for a shared note view. This route is nested but accessible at the same level. */}
                <Route path="/shared/:shareLink" element={<SharedNote />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;