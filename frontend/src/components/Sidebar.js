import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteItem from './NoteItem';

// The Sidebar component displays the list of notes and a button to create a new one.
// It categorizes notes into "My Notes" and "Shared With Me."
const Sidebar = ({ notes, selectedNote, setSelectedNote, user, setNotes }) => {
  const navigate = useNavigate(); // Hook for programmatic navigation.

  // Async function to handle the creation of a new note.
  const handleCreateNote = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the auth token from local storage.
      // Make a POST request to the API to create a new note with a default title.
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the auth token.
        },
        body: JSON.stringify({ title: 'New Note', content: '' }) // Send the initial note data.
      });

      if (response.ok) {
        const newNote = await response.json();
        
        // After creating the note, fetch the entire list of notes again to get the updated list.
        const notesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          setNotes(notesData); // Update the notes state with the new list.
          setSelectedNote(newNote); // Select the newly created note to open it in the editor.
          
          // On mobile, navigate to the root to show the editor.
          if (window.innerWidth <= 768) {
              navigate('/'); 
          }
        } else {
          console.error('Failed to fetch notes after creating a new one');
        }
      } else {
        console.error('Failed to create new note');
      }
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  // Renders a loading state if the 'notes' prop is not an array (e.g., while data is being fetched).
  if (!Array.isArray(notes)) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="new-note-btn" onClick={handleCreateNote}>
            + New Note
          </button>
        </div>
        <div className="notes-list">
          <p className="no-notes">Loading notes...</p>
        </div>
      </div>
    );
  }

  // Filters the notes list to separate notes owned by the user from those shared with them.
  const ownedNotes = notes.filter(note => note.owner?._id === user._id);
  const sharedNotes = notes.filter(note => 
    note.permissions?.some(p => p.user?._id === user._id) && note.owner?._id !== user._id
  );

  return (
    // The main sidebar container.
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Button to create a new note. */}
        <button className="new-note-btn" onClick={handleCreateNote}>
          + New Note
        </button>
      </div>
      
      <div className="notes-list">
        {/* Conditionally renders the "My Notes" section if there are notes owned by the user. */}
        {ownedNotes.length > 0 && (
          <>
            <h3 className="notes-section-title">My Notes</h3>
            {/* Maps over the owned notes and renders a NoteItem for each. */}
            {ownedNotes.map(note => (
              <NoteItem 
                key={note._id} 
                note={note} 
                // Checks if the current note is the selected one to apply a special class.
                isSelected={selectedNote?._id === note._id}
                onClick={() => setSelectedNote(note)} // Sets the selected note on click.
              />
            ))}
          </>
        )}
        
        {/* Conditionally renders the "Shared With Me" section. */}
        {sharedNotes.length > 0 && (
          <>
            <h3 className="notes-section-title">Shared With Me</h3>
            {/* Maps over the shared notes and renders a NoteItem for each. */}
            {sharedNotes.map(note => (
              <NoteItem 
                key={note._id} 
                note={note} 
                isSelected={selectedNote?._id === note._id}
                onClick={() => setSelectedNote(note)}
              />
            ))}
          </>
        )}
        
        {/* Displays a message if the user has no notes at all. */}
        {notes.length === 0 && (
          <p className="no-notes">No notes yet. Create your first note!</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;