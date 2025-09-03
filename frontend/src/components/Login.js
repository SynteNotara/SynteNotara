// components/Login.js - Updated version
import React, { useState } from 'react';

// Login component handles both user login and registration.
// It manages form state, communicates with the API, and handles user authentication.
const Login = ({ setUser, setNotes }) => {
  // State variables to manage form inputs and component behavior.
  const [email, setEmail] = useState(''); // Stores the user's email input.
  const [password, setPassword] = useState(''); // Stores the user's password input.
  const [isLoading, setIsLoading] = useState(false); // Tracks if an API request is in progress.
  const [error, setError] = useState(''); // Stores any error messages to display.
  const [isLogin, setIsLogin] = useState(true); // A boolean to toggle between login and register views.

  // components/Login.js - Updated API call
  // handleSubmit function handles the form submission for both login and registration.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload).
    setIsLoading(true); // Sets loading state to true to disable the button and show a loading message.
    setError(''); // Clears any previous error messages.
    
    try {
      // Determines the API endpoint and request body based on whether the user is logging in or registering.
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { 
        name: email.split('@')[0], // For registration, the name is auto-generated from the email prefix.
        email, 
        password 
      };
      
      // Logs the API endpoint being accessed for debugging purposes.
      console.log('Making request to:', `${process.env.REACT_APP_API_URL}${endpoint}`);
      
      // Makes the API call to the backend.
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        method: 'POST', // Uses POST method for sending data.
        headers: {
          'Content-Type': 'application/json', // Specifies the content type of the request body.
        },
        body: JSON.stringify(body) // Converts the JavaScript object to a JSON string.
      });
      
      const data = await response.json(); // Parses the JSON response from the server.
      
      if (response.ok) {
        // If the response is successful (status code 200-299), store user data and token in local storage.
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        // Updates the user state in the parent component, which triggers a re-render and changes the view.
        setUser(data.user);
      } else {
        // If the response is not successful, set an error message to display to the user.
        setError(data.message || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (error) {
      // Catches any network or API-related errors.
      console.error('API Error:', error);
      setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
    } finally {
      // This block always executes after the try/catch block, whether it succeeds or fails.
      setIsLoading(false); // Sets loading state back to false.
    }
  };

  return (
    // Main container for the login/registration form.
    <div className="login-container">
      <div className="login-form">
        {/* Title and subtitle that change based on whether it's login or register mode. */}
        <h2>Welcome to CollabNotes</h2>
        <p>{isLogin ? 'Sign in to access your notes' : 'Create a new account'}</p>
        
        {/* Displays an error message if the error state is not empty. */}
        {error && <div className="error-message">{error}</div>}
        
        {/* The form element with an onSubmit handler. */}
        <form onSubmit={handleSubmit}>
          {/* Renders the Name input field only when in registration mode (!isLogin). */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                // The value of the name field is derived from the email prefix.
                value={email.split('@')[0]}
                // The onChange handler updates the email state to keep the email and name in sync.
                onChange={(e) => {
                  const newEmail = e.target.value + '@' + (email.split('@')[1] || '');
                  setEmail(newEmail);
                }}
                required
              />
            </div>
          )}
          
          {/* Email input field. */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Password input field. */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          {/* Submit button. Its text and disabled state depend on the isLoading and isLogin states. */}
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>
        
        {/* Toggle link to switch between login and registration forms. */}
        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)} // Toggles the isLogin state.
            >
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;