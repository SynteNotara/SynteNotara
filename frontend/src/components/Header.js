import React from 'react';
import Search from './Search';

// Header component responsible for the top navigation bar,
// including the app title, search bar, and user-related actions.
const Header = ({ user, setUser, onSearch, searchQuery }) => {
  // handleLogout function to clear user data from local storage
  // and update the user state, effectively logging the user out.
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    // Main container for the header with a flexbox layout.
    <div className="header">
      {/* Left section of the header containing the app logo and title. */}
      <div className="header-left">
        {/* Logo container with a gradient background and rounded corners. */}
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
          {/* Font Awesome icon for a sticky note. */}
          <i className="fas fa-sticky-note text-white text-xl"></i>
        </div>
        {/* App title. */}
        <h1 className="app-title">SynteNotara</h1>
      </div>
      
      {/* Center section of the header, which holds the Search component. */}
      <div className="header-center">
        {/* The Search component, passing down the onSearch and searchQuery props. */}
        <Search onSearch={onSearch} searchQuery={searchQuery} />
      </div>
      
      {/* Right section of the header, displaying user information and the logout button. */}
      <div className="header-right">
        {/* Container for the user's name and logout button. */}
        <div className="user-info">
          {/* Displays the user's name, using optional chaining to prevent errors if the user object is null. */}
          <span className="user-name">{user?.name}</span>
          {/* Logout button with an onClick handler that calls the handleLogout function. */}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Header;