import React, { useState } from 'react';
import './movie-game.css';
import MovieSearch from "./MovieSearch";
import GamePath from "./GamePath";
import GameControls from "./GameControls";

const MovieConnectionGame = ({ 
  challenge, 
  selectedDate,
  userPath, 
  lifelinesUsed, 
  onAddMovie, 
  onBacktrack, 
  onHint, 
  onShowSolution, 
  onEndGame 
}) => {
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost
  const [hintedMovieId, setHintedMovieId] = useState(null);
  const [hintedMovies, setHintedMovies] = useState(new Set());
  const [showShareResults, setShowShareResults] = useState(false);

  // Guard clause to handle undefined challenge (after all hooks)
  if (!challenge) {
    return (
      <div className="game-container">
        <div className="loading">
          <p>Loading challenge...</p>
        </div>
      </div>
    );
  }

  const handleMovieSelect = (movieStep) => {
    // Check if this is the end movie
    if (challenge?.end_movie?.title && 
        (movieStep.movie.title.toLowerCase().includes(challenge.end_movie.title.toLowerCase()) ||
        challenge.end_movie.title.toLowerCase().includes(movieStep.movie.title.toLowerCase()))) {
      setGameStatus("won");
    }
    
    // Clear hints when a new movie is added
    setHintedMovieId(null);
    setHintedMovies(new Set());
    
    onAddMovie(movieStep);
  };

  const handleHint = async () => {
    onHint();
    
    try {
      let movieId;
      
      if (userPath.length === 0) {
        // First step hint - show info about the start movie
        movieId = challenge?.start_movie?.id;
      } else {
        // Show info about the current movie in the path
        const currentMovie = userPath[userPath.length - 1].movie;
        movieId = currentMovie.id;
      }

      setHintedMovieId(movieId);
      setHintedMovies(prev => new Set([...prev, movieId]));
    } catch (error) {
      console.error("Error providing hint:", error);
    }
  };

  const handleShowSolution = () => {
    onShowSolution();
    setGameStatus("lost");
  };

  const resetGame = () => {
    setGameStatus("playing");
    setHintedMovieId(null);
    setHintedMovies(new Set());
    setShowShareResults(false);
    onEndGame();
  };

  const generateShareText = () => {
    const date = selectedDate;
    const difficultyText = challenge?.difficulty ? challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1) : 'Unknown';
    const steps = userPath.length; // Total steps is just the user path length
    const hintsUsed = lifelinesUsed.hint;
    const backtracksUsed = lifelinesUsed.backtrack;
    
    // Create the emoji grid - only show circles for actual movies in the path
    let emojiGrid = "";
    let movieList = "";
    
    // Start movie (always gray since it's given)
    emojiGrid += "⚪";
    movieList += `${challenge?.start_movie?.title || 'Unknown'} (${challenge?.start_movie?.year || 'Unknown'})`;
    
    // User path movies (green if not hinted, yellow if hinted, except the last one which is gray)
    userPath.forEach((step, index) => {
      const isLastMovie = index === userPath.length - 1;
      if (isLastMovie) {
        // Last movie (end movie) is always gray since it's the target
        emojiGrid += "⚪";
      } else {
        // Other user movies (green if not hinted, yellow if hinted)
        const movieHinted = hintedMovies.has(step.movie.id);
        emojiGrid += movieHinted ? "🟡" : "🟢";
      }
      movieList += `\n→ ${step.movie.title} (${step.movie.year})`;
    });
    
    const shareText = `Baconator ${date} - ${difficultyText}\n${emojiGrid}\nSteps: ${steps} | Hints: ${hintsUsed} | Backtracks: ${backtracksUsed}\n${movieList}`;
    
    return shareText;
  };

  const copyToClipboard = async () => {
    try {
      const shareText = generateShareText();
      
      // Try modern clipboard API first (with better error handling)
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(shareText);
          setShowShareResults(false);
          return;
        } catch (clipboardError) {
          console.log('Modern clipboard API failed, trying fallback:', clipboardError);
          // Continue to fallback method
        }
      }
      
      // Fallback for mobile and older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        
        // Focus and select on next tick to avoid mobile issues
        setTimeout(() => {
          try {
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            if (successful) {
              setShowShareResults(false);
            } else {
              throw new Error('execCommand copy failed');
            }
          } catch (selectError) {
            console.error('Text selection failed:', selectError);
            // Show manual copy option
            alert('Copy failed. Please manually select and copy the text above.');
          } finally {
            // Clean up
            if (document.body.contains(textArea)) {
              document.body.removeChild(textArea);
            }
          }
        }, 100);
        
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        // Show the text for manual copying
        alert('Copy failed. Please manually select and copy the text above.');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Show the text for manual copying as last resort
      alert('Copy failed. Please manually select and copy the text above.');
    }
  };

  if (gameStatus === "won") {
    return (
      <div className="game-container">
        <div className="win-screen">
          <h1>🎉 Congratulations!</h1>
          <p>You've successfully connected the movies!</p>
          <div className="final-path">
            <h3>Your Path:</h3>
            <div className="path-display-vertical">
              <div className="movie-step start">
                <div className="step-number">1</div>
                <div className="movie-info">
                  <span className="movie-title">{challenge.start_movie.title}</span>
                  <span className="movie-year">({challenge.start_movie.year})</span>
                </div>
                <div className="step-label">START</div>
              </div>
              {userPath.map((step, index) => (
                <div key={index} className="connection-step-vertical">
                  <div className="connection-compact">
                    <span className="person-name">{step.connection.name}</span>
                    <span className="person-role">({step.connection.movie1_role})</span>
                    {step.connection.movie1_character && step.connection.movie1_character !== "Various" && (
                      <span className="person-character">as {step.connection.movie1_character}</span>
                    )}
                  </div>
                  <div className="movie-step">
                    <div className="step-number">{index + 2}</div>
                    <div className="movie-info">
                      <span className="movie-title">{step.movie.title}</span>
                      <span className="movie-year">({step.movie.year})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="stats">
            <p>Steps taken: {userPath.length}</p>
            <p>Hints used: {lifelinesUsed.hint}</p>
            <p>Backtracks used: {lifelinesUsed.backtrack}</p>
          </div>
          
          <div className="win-buttons">
            {!showShareResults ? (
              <button className="btn-primary" onClick={() => setShowShareResults(true)}>
                Share Results
              </button>
            ) : (
              <div className="share-results">
                <div className="share-text">
                  <p className="copy-instructions">Tap and hold to copy:</p>
                  <pre 
                    className="share-text-content"
                    style={{
                      userSelect: 'text',
                      WebkitUserSelect: 'text',
                      MozUserSelect: 'text',
                      msUserSelect: 'text',
                      padding: '10px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: '0'
                    }}
                  >
                    {generateShareText()}
                  </pre>
                </div>
                <div className="share-buttons">
                  <button className="btn-primary" onClick={copyToClipboard}>
                    Copy to Clipboard
                  </button>
                  <button className="btn-secondary" onClick={() => setShowShareResults(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <button className="btn-secondary" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === "lost") {
    return (
      <div className="game-container">
        <div className="lose-screen">
          <h1>Game Over</h1>
          <p>You chose to see the solution.</p>
          <div className="solution-path">
            <h3>Solution Path:</h3>
            <div className="path-display-vertical">
              <div className="movie-step start">
                <div className="step-number">1</div>
                <div className="movie-info">
                  <span className="movie-title">{challenge?.start_movie?.title || 'Unknown'}</span>
                  <span className="movie-year">({challenge?.start_movie?.year || 'Unknown'})</span>
                </div>
                <div className="step-label">START</div>
              </div>
              {challenge.solution_path.map((step, index) => {
                // Check if this is a person (has name and role) or a movie (has title)
                if (step.name && step.role) {
                  // This is a person
                  return (
                    <div key={index} className="connection-step-vertical">
                      <div className="connection-compact">
                        <span className="person-name">{step.name}</span>
                        <span className="person-role">({step.role})</span>
                        {step.character && (
                          <span className="person-character">as {step.character}</span>
                        )}
                      </div>
                    </div>
                  );
                } else if (step.title) {
                  // This is a movie
                  return (
                    <div key={index} className="connection-step-vertical">
                      <div className="movie-step">
                        <div className="step-number">{index + 2}</div>
                        <div className="movie-info">
                          <span className="movie-title">{step.title}</span>
                          <span className="movie-year">({step.release_date?.split('-')[0] || 'Unknown'})</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              <div className="movie-step target">
                <div className="step-number">{challenge?.solution_path?.length ? challenge.solution_path.length + 2 : 2}</div>
                <div className="movie-info">
                  <span className="movie-title">{challenge?.end_movie?.title || 'Unknown'}</span>
                  <span className="movie-year">({challenge?.end_movie?.year || 'Unknown'})</span>
                </div>
                <div className="step-label">TARGET</div>
              </div>
            </div>
          </div>
          <button className="btn-primary" onClick={resetGame}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="back-button-container">
        <a href="/projects" className="back-button">← Back to Projects</a>
      </div>
      <div className="game-header">
        <h1>Baconator</h1>
        <div className="difficulty-badge">
          <div>Difficulty: {challenge?.difficulty ? challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1) : 'Unknown'}</div>
          <div className="challenge-date">📅 {selectedDate}</div>
        </div>
      </div>

      <div className="challenge-display">
        <div className="challenge-movies">
          <div className="movie-card start">
            <h3>START</h3>
            <div className="movie-info">
              <h4>{challenge?.start_movie?.title || 'Unknown'}</h4>
              <p>({challenge?.start_movie?.year || 'Unknown'})</p>
            </div>
          </div>
          
          <div className="connection-arrow">→</div>
          
          <div className="movie-card end">
            <h3>END</h3>
            <div className="movie-info">
              <h4>{challenge?.end_movie?.title || 'Unknown'}</h4>
              <p>({challenge?.end_movie?.year || 'Unknown'})</p>
            </div>
          </div>
        </div>
        

      </div>

      <GamePath 
        userPath={userPath} 
        startMovie={challenge.start_movie} 
        endMovie={challenge.end_movie}
        hintedMovieId={hintedMovieId}
        hintedMovies={hintedMovies}
        onHint={handleHint}
        onBacktrack={onBacktrack}
        canBacktrack={userPath.length > 0}
      />

      <MovieSearch 
        onMovieSelect={handleMovieSelect}
        userPath={userPath}
        startMovie={challenge.start_movie}
        endMovie={challenge.end_movie}
      />

              <GameControls
          lifelinesUsed={lifelinesUsed}
        />
        
        <button 
          className="give-up-btn"
          onClick={handleShowSolution}
          title="Give up and see the solution"
        >
          Give Up
        </button>
    </div>
  );
};

export default MovieConnectionGame;
