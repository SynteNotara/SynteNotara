const mongoose = require('mongoose');

// Defines a sub-schema for user permissions on a note
const PermissionSchema = new mongoose.Schema({
 user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
 },
 role: {
  type: String,
  enum: ['viewer', 'editor', 'owner'],
  default: 'viewer'
 }
});

// Defines the main schema for a Note document
const NoteSchema = new mongoose.Schema({
 title: {
  type: String,
  required: true,
  default: 'Untitled Note'
 },
 content: {
  type: String,
  default: ''
 },
 owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
 },
 shared: {
  type: Boolean,
  default: false
 },
 shareLink: {
  type: String,
  unique: true,
  sparse: true
 },
 sharePermission: {
  type: String,
  enum: ['view', 'edit'],
  default: 'view'
 },
 // Array of user-specific permissions
 permissions: [PermissionSchema],
 // Array to track note history
 history: [{
  content: String,
  updatedBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
  },
  updatedAt: {
   type: Date,
   default: Date.now
  }
 }]
}, {
 timestamps: true
});

// Exports the Note model for use in other files
module.exports = mongoose.model('Note', NoteSchema);