// This file defines the API routes for managing notes.
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');
const auth = require('../middleware/auth'); // Middleware for authentication

// Get all notes for the authenticated user (owned and shared)
router.get('/', auth, async (req, res) => {
  try {
    // Find notes where the user is either the owner or has specific permissions
    const notes = await Note.find({ 
      $or: [
        { owner: req.user._id },
        { 'permissions.user': req.user._id }
      ]
    })
    .populate('owner', 'name _id') // Populates the owner's details
    .populate('permissions.user', 'name _id'); // Populates the user details within permissions
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific note by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // Find the note and populate related user data
    const note = await Note.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('permissions.user', 'name email _id');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if the authenticated user has permission to view the note
    const hasPermission = note.owner._id.toString() === req.user._id.toString() ||
      note.permissions.some(p => p.user._id.toString() === req.user._id.toString());
    
    if (!hasPermission) {
      return res.status(403).json({ message: 'Not authorized to view this note' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Create a new note instance
    const newNote = new Note({
      title: title || 'Untitled Note',
      content: content || '',
      owner: req.user._id,
      permissions: [{ user: req.user._id, role: 'owner' }] // Add the creator as the owner with owner role
    });
    
    const savedNote = await newNote.save(); // Save the new note to the database
    await savedNote.populate('owner', 'name email');
    
    res.status(201).json(savedNote); // Respond with the newly created note
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    const isOwner = note.owner.toString() === req.user._id.toString();
    // Check for 'editor' role permission
    const hasEditPermission = note.permissions.some(
      p => p.user.toString() === req.user._id.toString() && p.role === 'editor'
    );
    
    // Only owner or editor can update
    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({ message: 'Not authorized to edit this note' });
    }
    
    // Find the note by ID and update it. Also, push to history and limit the array size.
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        $push: {
          history: {
            $each: [{ content: note.content, updatedBy: req.user._id, updatedAt: new Date() }],
            $slice: -5 // Keep only the last 5 history entries
          }
        },
        updatedAt: Date.now()
      },
      { new: true } // Return the updated document
    )
    .populate('owner', 'name email')
    .populate('permissions.user', 'name email _id')
    .populate('history.updatedBy', 'name email');

    res.json(updatedNote);
    
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Only the owner is allowed to delete the note
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete this note' });
    }
    
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add specific user permissions to a note
router.post('/:id/permissions', auth, async (req, res) => {
  try {
    const { email, role } = req.body;
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Only the owner can manage permissions
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can manage permissions' });
    }
    
    // Find the user to share with by email
    const userToShareWith = await User.findOne({ email });
    if (!userToShareWith) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent a user from sharing a note with themselves
    if (userToShareWith._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot share a note with yourself' });
    }
    
    // Check if permission already exists for this user
    const existingPermissionIndex = note.permissions.findIndex(
      p => p.user?.toString() === userToShareWith._id.toString()
    );
    
    if (existingPermissionIndex !== -1) {
      // If permission exists, update the role
      note.permissions[existingPermissionIndex].role = role;
    } else {
      // Otherwise, add a new permission
      note.permissions.push({ user: userToShareWith._id, role });
    }
    
    const updatedNote = await note.save();
    await updatedNote.populate('permissions.user', 'name email _id');
    
    res.json(updatedNote);
  } catch (error) {
    console.error('Add permission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove user permissions from a note
router.delete('/:id/permissions/:userId', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Only the owner can manage permissions
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can manage permissions' });
    }
    
    // Filter out the permission for the specified user
    note.permissions = note.permissions.filter(
      p => p.user?.toString() !== req.params.userId
    );
    
    const updatedNote = await note.save();
    await updatedNote.populate('permissions.user', 'name email _id');
    
    res.json(updatedNote);
  } catch (error) {
    console.error('Remove permission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get note history
router.get('/:id/history', auth, async (req, res) => {
  try {
    // Find the note and populate the history data
    const note = await Note.findById(req.params.id)
      .populate('history.updatedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if the user has permission to view the history
    const hasPermission = note.owner.toString() === req.user._id.toString() ||
      note.permissions.some(p => p.user.toString() === req.user._id.toString());
    
    if (!hasPermission) {
      return res.status(403).json({ message: 'Not authorized to view this note' });
    }
    
    res.json(note.history);
  } catch (error) {
    console.error('Get note history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate a share token (currently not used in the routes, but good to have)
function generateShareToken() {
  return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

module.exports = router; // Export the router to be used in the main application file