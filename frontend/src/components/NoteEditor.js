import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CollaboratorsModal from './CollaboratorsModal';

// NoteEditor component for viewing, editing, and managing a single note.
// It includes logic for real-time collaboration, auto-saving, and permissions.
const NoteEditor = ({ note, setNotes, setSelectedNote, socket, user }) => { 
  // State variables for UI and data management.
  const [lastSaved, setLastSaved] = useState(null); // Tracks the time of the last successful save.
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the visibility of the Collaborators modal.
  const [title, setTitle] = useState(''); // Stores the current title of the note.
  const [content, setContent] = useState(''); // Stores the current content of the note.
  const navigate = useNavigate(); // Hook for programmatic navigation.
  
  // A ref to store the timeout ID for the auto-save functionality.
  const saveTimeoutRef = useRef(null);

  // useEffect to initialize the editor with the selected note's data.
  // It runs whenever the 'note' or 'socket' prop changes.
  useEffect(() => {
    if (note) {
      // If a note is selected, set the title and content states.
      setTitle(note.title || '');
      setContent(note.content || '');
      
      // Join the note-specific socket.io room for real-time collaboration.
      if (socket) {
        socket.emit('join-note', note._id);
      }
    } else {
      // If no note is selected, clear the editor.
      setTitle('');
      setContent('');
    }
  }, [note, socket]);

  // useEffect to set up and clean up the socket.io listener for note updates.
  // This ensures that changes from other collaborators are reflected in real-time.
  useEffect(() => {
    // Exit if there's no socket connection or no note selected.
    if (!socket || !note) return;
    
    // This is the corrected event handler
    const handleNoteUpdate = (data) => {
      // Check if the update is for the current note and not from the current user
      // to avoid infinite loops and unnecessary state updates.
      if (data.noteId === note._id && data.userId !== user._id) {
        // Apply the new title and content from the socket data.
        setContent(data.content);
        setTitle(data.title);
      }
    };

    // Listen for 'note-update' events from the server.
    socket.on('note-update', handleNoteUpdate);
    
    // Cleanup function to remove the listener when the component unmounts or dependencies change.
    return () => {
      socket.off('note-update', handleNoteUpdate);
    };
  }, [socket, note, user]);

  // Helper function to update the notes list and the selected note state locally.
  // This provides an "optimistic UI" feel by instantly updating the sidebar.
  const updateNotesListLocally = (updatedNote) => {
    setNotes(prevNotes => {
      // Maps over the previous notes and replaces the updated note.
      return prevNotes.map(n => n._id === updatedNote._id ? updatedNote : n);
    });
    setSelectedNote(updatedNote); // Updates the selected note to trigger a re-render.
  };
  
  // Helper function to determine if the current user has editing permissions.
  const canEdit = () => {
    if (!note || !user) return false;
    // Check if the user is the owner of the note.
    const isOwner = note.owner?._id === user._id;
    if (isOwner) {
      return true;
    }
    // Check if the user is a collaborator with the 'editor' role.
    const userPermission = note.permissions?.find(p => p.user?._id === user._id);
    return userPermission && userPermission.role === 'editor';
  };

  // Asynchronous function to save the note to the backend API.
  const saveNote = async (newTitle, newContent) => {
    if (!note) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/notes/${note._id}`, {
        title: newTitle,
        content: newContent
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Sends the user's token for authentication.
        }
      });

      if (response.status === 200) {
        // If save is successful, update the 'lastSaved' state.
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  // Main handler for changes in the title or content input fields.
  // It implements a debounce-like pattern for auto-saving.
  const handleInputChange = (newTitle, newContent) => {
    // Clears any existing timeout to prevent a save from an old input state.
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Immediately update the local state for a smooth user experience (Optimistic UI).
    updateNotesListLocally({ ...note, title: newTitle, content: newContent });

    // Emit the change to the socket server for real-time collaboration.
    if (socket && note) {
      socket.emit('note-change', {
        noteId: note._id,
        title: newTitle,
        content: newContent,
        userId: user._id
      });
    }

    // Set a new timeout to call the saveNote function after a 2-second delay.
    saveTimeoutRef.current = setTimeout(() => {
      saveNote(newTitle, newContent);
    }, 2000);
  };

  // Handles the deletion of a note.
  const handleDelete = async () => {
    if (!note) return;

    
    // Asks the user for confirmation before deleting.
    if (window.confirm('Are you sure you want to delete this note?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/notes/${note._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // If deletion is successful, refetch the notes list from the server
          // and navigate back to the home page.
          const notesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/notes`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (notesResponse.status === 200) {
            setNotes(notesResponse.data);
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  // New function to handle closing the current note and returning to the main view.
  const handleClose = () => {
    setSelectedNote(null); // Clears the selected note state.
    navigate('/'); // Navigates to the root path.
  };

  // Conditional rendering for the empty state when no note is selected.
  if (!note) {
    return (
      <div className="note-editor">
        <div className="empty-state">
          <h1>Welcome to your notes!</h1>
          <p>Select a note from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  // Determines if the current user is the owner of the note.
  const isOwner = note.owner?._id === user._id;

  // The main render block for the note editor.
  return (
    <div className="note-editor">
      {/* Header section with title input and action buttons. */}
      <div className="editor-header">
        <input
          id="note-editor-title"
          type="text"
          className="note-title"
          placeholder="Note Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            // Passes both title and content to the input handler.
            handleInputChange(e.target.value, content);
          }}
          disabled={!canEdit()} // Disables the input if the user can't edit.
        />
        <div className="editor-actions">
          <button className="note-action-btn close-btn-desktop" onClick={handleClose}>
            Close
          </button>
          {/* Renders the Collaborators button only if the user is the note's owner. */}
          {isOwner && (
            <button className="note-action-btn" onClick={() => setIsModalOpen(true)}>
              Collaborators
            </button>
          )}
          {/* Renders the Delete button only if the user is the note's owner. */}
          {isOwner && (
            <button className="note-action-btn delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
      {/* The main text area for the note content. */}
      <textarea
        id="note-editor-content"
        className="note-content"
        placeholder="Start writing your note here..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          // Passes both title and content to the input handler.
          handleInputChange(title, e.target.value);
        }}
        disabled={!canEdit()} // Disables the textarea if the user can't edit.
      />
      {/* Displays the last saved time if a save has occurred. */}
      {lastSaved && (
        <span className="last-saved">Last saved: {lastSaved.toLocaleTimeString()}</span>
      )}
      
      {/* Renders the CollaboratorsModal component if isModalOpen is true. */}
      {isModalOpen && (
        <CollaboratorsModal 
          note={note}
          user={user}
          onClose={() => setIsModalOpen(false)}
          setNotes={setNotes}
          setSelectedNote={setSelectedNote}
        />
      )}
    </div>
  );
};

export default NoteEditor;