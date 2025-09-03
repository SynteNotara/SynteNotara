// components/NoteItem.js

import React from 'react';

// The NoteItem component is a presentational component that displays a single note
// in the notes list. It shows a title, a preview of the content, and the last updated date.
const NoteItem = ({ note, isSelected, onClick }) => {
  return (
    // The main container for the note item.
    // The class 'selected' is conditionally applied based on the 'isSelected' prop.
    <div
      className={`note-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick} // The onClick handler passed from the parent component.
    >
      {/* Displays the note's title, defaulting to 'Untitled Note' if it's empty. */}
      <h3 className="note-title">{note.title || 'Untitled Note'}</h3>
      
      {/* Displays a truncated preview of the note's content. */}
      {/* It shows the first 60 characters followed by '...' or 'Empty note...' if there's no content. */}
      <p className="note-preview">
        {note.content ? `${note.content.substring(0, 60)}...` : 'Empty note...'}
      </p>
      
      {/* Container for metadata like the date. */}
      <div className="note-meta">
        {/* Displays the note's last updated date in a user-friendly format. */}
        <span className="note-date">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default NoteItem;