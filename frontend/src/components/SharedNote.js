// components/SharedNote.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// The SharedNote component is responsible for fetching and displaying a note
// that has been shared via a public link.
const SharedNote = () => {
  // `useParams` hook to get the 'shareLink' parameter from the URL.
  const { shareLink } = useParams();
  // State to store the fetched note data.
  const [note, setNote] = useState(null);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any error messages that occur during the fetch.
  const [error, setError] = useState(null);

  // `useEffect` hook to perform the data fetching when the component mounts
  // or when the `shareLink` changes.
  useEffect(() => {
    // Asynchronous function to fetch the note from the backend API.
    const fetchSharedNote = async () => {
      try {
        // Make a GET request to the shared notes endpoint with the unique share link.
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/shared/${shareLink}`);
        const data = await response.json(); // Parse the JSON response.

        // Check if the response was successful.
        if (response.ok) {
          setNote(data); // Set the note data in the state.
        } else {
          // If the response is not OK, set an error message.
          setError(data.message || 'Note not found or no access');
        }
      } catch (err) {
        // Catch any network-related errors.
        console.error(err);
        setError('Failed to fetch shared note.');
      } finally {
        // This block always runs, regardless of success or failure.
        setLoading(false); // Set loading to false.
      }
    };

    // Only run the fetch function if a `shareLink` exists.
    if (shareLink) {
      fetchSharedNote();
    }
  }, [shareLink]);

  // Conditional rendering based on the component's state.
  // Display a loading message while data is being fetched.
  if (loading) {
    return <div className="shared-note">Loading...</div>;
  }

  // Display an error message if an error occurred.
  if (error) {
    return <div className="shared-note error-message">{error}</div>;
  }

  // Display a "not found" message if the note is null after loading.
  if (!note) {
    return <div className="shared-note">Note not found.</div>;
  }

  // Determine if the note is editable based on the `sharePermission` from the server.
  const canEdit = note.sharePermission === 'edit';

  // Render the note content.
  return (
    <div className="shared-note">
      <div className="note-editor">
        <div className="editor-header">
          <input
            type="text"
            className="note-title"
            value={note.title}
            placeholder="Note Title"
            // The input field is read-only unless `canEdit` is true.
            readOnly={!canEdit}
          />
          <div className="editor-actions">
            <div className="view-only-message">
              View only - Shared by {note.owner?.name}
            </div>
          </div>
        </div>
        <textarea
          className="note-content"
          value={note.content}
          placeholder="Start writing your note here..."
          // The text area is read-only unless `canEdit` is true.
          readOnly={!canEdit}
        />
      </div>
    </div>
  );
};

export default SharedNote;