// components/Search.js
import React, { useState } from 'react';

// The Search component provides a search input field and manages its focus state.
const Search = ({ onSearch, searchQuery }) => {
  // `isFocused` state tracks whether the search input field is currently focused.
  const [isFocused, setIsFocused] = useState(false);

  return (
    // The main container for the search bar.
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search notes..."
        // The value of the input is controlled by the `searchQuery` prop.
        value={searchQuery}
        // When the input value changes, it calls the `onSearch` function from props,
        // passing the new value.
        onChange={(e) => onSearch(e.target.value)}
        // Sets the `isFocused` state to true when the input receives focus.
        onFocus={() => setIsFocused(true)}
        // Sets the `isFocused` state to false when the input loses focus.
        // A small timeout is added to allow for clicks on potential search results
        // before the results container disappears.
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {/* Conditionally renders the search results container. */}
      {/* It only appears when the input is focused and there is a search query. */}
      {isFocused && searchQuery && (
        <div className="search-results">
          {/* Search results would be rendered here */}
        </div>
      )}
    </div>
  );
};

export default Search;