import React, { useState } from 'react';

// The ShareButton component handles the logic for sharing a note via a public link.
const ShareButton = ({ note, user }) => {
  // State to control the visibility of the share modal.
  const [showShareModal, setShowShareModal] = useState(false);
  // State to manage the sharing settings (whether it's shared and the permission level).
  // Initializes with the note's existing settings.
  const [shareSettings, setShareSettings] = useState({
    shared: note.shared || false,
    sharePermission: note.sharePermission || 'view'
  });
  // State to store the generated share link token.
  const [shareLink, setShareLink] = useState(note.shareLink || '');
  // State to track if an API request is in progress, for disabling buttons.
  const [isLoading, setIsLoading] = useState(false);
  // State to display feedback messages to the user (e.g., success or error).
  const [message, setMessage] = useState('');

  // Async function to generate a new share link by making a POST request to the API.
  const generateShareLink = async () => {
    setIsLoading(true); // Start loading state.
    try {
      // API call to the backend to create/update the share link.
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${note._id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Auth header.
        },
        body: JSON.stringify(shareSettings) // Send the current share settings.
      });
      
      if (response.ok) {
        const data = await response.json();
        setShareLink(data.shareLink); // Store the generated share link token.
        // Update share settings based on the server response.
        setShareSettings({
          shared: data.shared,
          sharePermission: data.sharePermission
        });
        setMessage('Share link generated successfully!'); // Success message.
      } else {
        setMessage('Error generating share link'); // Error message on bad response.
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      setMessage('Error generating share link'); // Catch network or other errors.
    } finally {
      setIsLoading(false); // End loading state.
    }
  };

  // Async function to update the share settings (e.g., changing permission or un-sharing).
  const updateShareSettings = async () => {
    setIsLoading(true); // Start loading state.
    try {
      // API call to update the share settings.
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${note._id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(shareSettings)
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update share settings from the server response.
        setShareSettings({
          shared: data.shared,
          sharePermission: data.sharePermission
        });
        // If the note is no longer shared, clear the local share link.
        if (!data.shared) {
          setShareLink('');
        }
        setMessage('Settings updated successfully!'); // Success message.
      } else {
        setMessage('Error updating settings'); // Error message.
      }
    } catch (error) {
      console.error('Error updating share settings:', error);
      setMessage('Error updating settings'); // Catch errors.
    } finally {
      setIsLoading(false); // End loading state.
    }
  };

  // Function to copy the share link to the user's clipboard.
  const copyToClipboard = () => {
    // Construct the full URL for the shareable link.
    const link = `${window.location.origin}/shared/${shareLink}`;
    // Use the Clipboard API to write the link.
    navigator.clipboard.writeText(link)
      .then(() => setMessage('Link copied to clipboard!')) // Success message.
      .catch(err => setMessage('Failed to copy link')); // Error message.
  };

  return (
    <>
      {/* The main button that triggers the modal. */}
      <button 
        className="share-btn"
        onClick={() => setShowShareModal(true)} // Opens the modal on click.
      >
        Share
      </button>
      
      {/* Conditionally rendered modal overlay and content. */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Note: {note.title}</h3>
            
            {/* Display a message to the user if one exists. */}
            {message && <div className="message">{message}</div>}
            
            <div className="share-options">
              {/* Checkbox to enable/disable link sharing. */}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={shareSettings.shared}
                  onChange={(e) => setShareSettings({
                    ...shareSettings,
                    shared: e.target.checked
                  })}
                />
                <span>Share via link</span>
              </label>
              
              {/* Conditionally rendered UI for share settings and link display. */}
              {shareSettings.shared && (
                <>
                  <div className="permission-select">
                    <label>Link permission:</label>
                    <select
                      value={shareSettings.sharePermission}
                      onChange={(e) => setShareSettings({
                        ...shareSettings,
                        sharePermission: e.target.value
                      })}
                    >
                      <option value="view">View only</option>
                      <option value="edit">Can edit</option>
                    </select>
                  </div>
                  
                  {shareLink ? (
                    // Display the generated link and a copy button if a link exists.
                    <div className="share-link-container">
                      <label>Shareable link:</label>
                      <div className="share-link">
                        <input
                          type="text"
                          value={`${window.location.origin}/shared/${shareLink}`}
                          readOnly // Link input is read-only.
                        />
                        <button onClick={copyToClipboard}>Copy</button>
                      </div>
                    </div>
                  ) : (
                    // Display a button to generate the link if it doesn't exist yet.
                    <button 
                      onClick={generateShareLink}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Share Link'}
                    </button>
                  )}
                </>
              )}
            </div>
            
            {/* Modal action buttons. */}
            <div className="modal-actions">
              <button 
                onClick={updateShareSettings} // Save settings button.
                disabled={isLoading}
              >
                Save Settings
              </button>
              <button onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;