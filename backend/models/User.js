// models/User.js

const mongoose = require('mongoose');

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true, // The name is a required field
  trim: true // Removes whitespace from both ends of the string
 },
 email: {
  type: String,
  required: true,
  unique: true, // Ensures the email is unique in the database
  lowercase: true, // Converts the email to lowercase
  trim: true
 },
 password: {
  type: String,
  required: true,
  minlength: 6 // The password must be at least 6 characters long
 },
 avatar: {
  type: String,
  default: null // Default value is null if no avatar is provided
 },
 role: {
  type: String,
  enum: ['user', 'admin'], // The role must be either 'user' or 'admin'
  default: 'user'
 }
}, {
 timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Method to remove the password field from the user object when it's converted to JSON
UserSchema.methods.toJSON = function() {
 const user = this.toObject(); // Converts the Mongoose document to a plain JavaScript object
 delete user.password; // Deletes the password field
 return user;
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);