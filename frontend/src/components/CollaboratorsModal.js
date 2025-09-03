// This component renders a modal for managing a note's collaborators.

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';

// CollaboratorsModal component receives note, user, and functions to update state.
const CollaboratorsModal = ({ note, user, onClose, setNotes, setSelectedNote }) => {
  // State for the email of the user to share with.
  const [shareEmail, setShareEmail] = useState('');
  // State for the role to assign to the new collaborator.
  const [shareRole, setShareRole] = useState('editor');
  // State to manage the sharing button's loading state.
  const [isSharing, setIsSharing] = useState(false);

  // Function to handle sharing the note with a new user.
  const handleShare = async () => {
    if (!shareEmail) {
      toast.error('Please enter an email address to share with.');
      return;
    }

    setIsSharing(true);
    try {
      const token = localStorage.getItem('token');
      // API call to add a new permission to the note.
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/notes/${note._id}/permissions`, {
        email: shareEmail,
        role: shareRole
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success('Note shared successfully!');
        setShareEmail(''); // Clear the email input field after successful sharing.
        
        // Fetch all notes again to update the UI with the new permission.
        const notesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/notes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (notesResponse.status === 200) {
          setNotes(notesResponse.data);
          // Find and set the updated note to refresh the selected note's state.
          const updatedNote = notesResponse.data.find(n => n._id === note._id);
          if (updatedNote) {
            setSelectedNote(updatedNote);
          }
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Failed to share note: ${error.response.data.message}`);
      } else {
        toast.error('Failed to share note. Please try again.');
      }
    } finally {
      setIsSharing(false); // Reset the loading state regardless of the outcome.
    }
  };

  // Function to handle removing a collaborator.
  const handleRemoveCollaborator = async (collaboratorId) => {
    const token = localStorage.getItem('token');
    try {
      // API call to remove a permission from the note.
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/notes/${note._id}/permissions/${collaboratorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Collaborator removed successfully!');
        // Fetch all notes again to update the UI.
        const notesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/notes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (notesResponse.status === 200) {
          setNotes(notesResponse.data);
          // Find and set the updated note.
          const updatedNote = notesResponse.data.find(n => n._id === note._id);
          if (updatedNote) {
            setSelectedNote(updatedNote);
          }
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Failed to remove collaborator: ${error.response.data.message}`);
      } else {
        toast.error('Failed to remove collaborator. Please try again.');
      }
    }
  };

  // Filter out the owner from the list of collaborators to display.
  const collaborators = note.permissions?.filter(p => p.user?._id !== user._id);

  return (
    // Modal overlay to handle closing the modal when clicking outside.
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal content area, stops click propagation to prevent closing. */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Manage Collaborators</h2>
        
        {/* Section to add a new collaborator. */}
        <div className="add-collaborator">
          <h4>Add Collaborator</h4>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter user's email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <select value={shareRole} onChange={(e) => setShareRole(e.target.value)}>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button onClick={handleShare} disabled={isSharing}>
              {isSharing ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>

        {/* Section to display and manage existing collaborators. */}
        {collaborators && collaborators.length > 0 && (
          <div className="current-collaborators">
            <h4>Current Collaborators</h4>
            <ul>
              {collaborators.map(p => (
                <li key={p.user?._id}>
                  <span>{p.user?.name} ({p.role})</span>
                  <button onClick={() => handleRemoveCollaborator(p.user?._id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsModal;