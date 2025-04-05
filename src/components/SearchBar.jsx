import { useDispatch, useSelector } from 'react-redux';
import { 
  setQuery, 
  clearSuggestions, 
  setHighlightedIndex,
  fetchLocationSuggestions
} from '../redux/searchSlice';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { query, suggestions, highlightedIndex, error, loading } = useSelector(state => state.search);
  const [validationError, setValidationError] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    dispatch(setQuery(value));
    setValidationError(null);
    
    if (value.trim().length > 1) {
      dispatch(fetchLocationSuggestions(value));
    } else {
      dispatch(clearSuggestions());
    }
  };

  const validateAndSearch = (city) => {
    if (!city || city.trim().length === 0) {
      setValidationError("Please enter a city name");
      return false;
    }
    
    if (!/^[a-zA-Z\s,.'-]+$/.test(city)) {
      setValidationError("Please enter a valid city name");
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const handleSelectLocation = (city) => {
    dispatch(setQuery(city));
    dispatch(clearSuggestions());
    
    if (validateAndSearch(city)) {
      onSearch(city);
    }
  };

  const handleSearchButtonClick = () => {
    if (validateAndSearch(query)) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        dispatch(setHighlightedIndex(
          highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : highlightedIndex
        ));
      } else if (e.key === "ArrowUp") {
        dispatch(setHighlightedIndex(
          highlightedIndex > 0 ? highlightedIndex - 1 : highlightedIndex
        ));
      } else if (e.key === "Enter") {
        if (highlightedIndex >= 0) {
          handleSelectLocation(suggestions[highlightedIndex]);
        } else if (validateAndSearch(query)) {
          onSearch(query);
        }
      }
    } else if (e.key === "Enter") {
      if (validateAndSearch(query)) {
        onSearch(query);
      }
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter city name..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`search-input ${validationError ? 'input-error' : ''}`}
        aria-label="Search for a city"
      />
      <button 
        onClick={handleSearchButtonClick} 
        className="search-button"
        disabled={loading}
      >
        Search
      </button>

      {validationError && (
        <div className="search-error-message">
          {validationError}
        </div>
      )}

      {error && !validationError && (
        <div className="search-api-error">
          Error loading suggestions: {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((location, index) => (
            <li
              key={index}
              onClick={() => handleSelectLocation(location)}
              className={`suggestion-item ${
                index === highlightedIndex ? "highlighted" : ""
              }`}
            >
              {location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;