import React, { useState } from "react";
import { searchMovies, validateMovieStep } from "./gameService";

const MovieSearch = ({ onMovieSelect, userPath, startMovie, endMovie }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    // Debounce the search
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchMovies(value);
        setSearchResults(results);
      } catch (err) {
        console.error("Error searching movies:", err);
        setError("Failed to search movies. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setSearchTerm(movie.title);
    setSearchResults([]);
    setError(null); // Clear any previous errors when selecting a movie
    
    // Automatically validate and add the movie when clicked
    setIsValidating(true);
    
    try {
      const movieStep = await validateMovieStep(movie, userPath, startMovie);
      
      if (movieStep) {
        onMovieSelect(movieStep);
        setSelectedMovie(null);
        setSearchTerm("");
        setSearchResults([]);
      } else {
        setError(`No connection found between ${movie.title} and the current path. Try a different movie.`);
      }
    } catch (err) {
      console.error("Error validating movie step:", err);
      setError("Failed to validate connection. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };



  const getCurrentConnectionTarget = () => {
    if (userPath.length === 0) {
      return startMovie;
    }
    return userPath[userPath.length - 1].movie;
  };

  const currentTarget = getCurrentConnectionTarget();

  return (
    <div className="movie-search">
      <div className="search-header">
        <h3>Search for Movies</h3>
        <p>Find movies that connect to: <strong>{currentTarget.title}</strong></p>
      </div>

      <div className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter movie title..."
            className="search-input"
          />
        </div>

        {isSearching && (
          <div className="search-loading">
            <span>Searching...</span>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            <h4>Search Results ({searchResults.length} found):</h4>
            <div className="results-list">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className={`result-item ${selectedMovie?.id === movie.id ? 'selected' : ''}`}
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-year">({movie.year})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="search-error">
            <p>Error: {error}</p>
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !isSearching && !error && !selectedMovie && (
          <div className="no-results">
            <p>No movies found for "{searchTerm}"</p>
          </div>
        )}

        {isValidating && (
          <div className="validating-message">
            <p>Validating connection...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
