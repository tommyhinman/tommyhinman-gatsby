import React, { useState, useEffect } from "react";
import { getMovieCreditsForHint } from "./gameService";

const MovieStepWithHint = ({ movie, stepNumber, label, isHinted, onHintLoad, isCurrentMovie, onHint, onBacktrack, canBacktrack, hasBeenHinted }) => {
  const [hintData, setHintData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHinted && movie?.id) {
      setLoading(true);
      getMovieCreditsForHint(movie.id)
        .then(credits => {
          setHintData(credits);
          onHintLoad && onHintLoad();
        })
        .catch(error => {
          console.error("Error loading hint:", error);
          setHintData({ error: true });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isHinted, movie?.id, onHintLoad]);

  // Guard clause to handle undefined movie (after all hooks)
  if (!movie) {
    return (
      <div className="movie-step">
        <div className="step-number">{stepNumber}</div>
        <div className="movie-info">
          <span className="movie-title">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`movie-step ${label?.toLowerCase()}`}>
      <div className="step-number">{stepNumber}</div>
      <div className="movie-info">
        {label && <div className="step-label-badge">{label}</div>}
        <span className="movie-title">{movie.title}</span>
        <span className="movie-year">({movie.year})</span>
        {isHinted && (
          <div className="movie-hint">
            {loading && <span className="hint-loading">Loading credits...</span>}
            {hintData && !hintData.error && (
              <div className="hint-content">
                {hintData.director && (
                  <div className="hint-line">Director: {hintData.director}</div>
                )}
                {hintData.writer && (
                  <div className="hint-line">Writer: {hintData.writer}</div>
                )}
                {hintData.topActors && hintData.topActors.length > 0 && (
                  <div className="hint-line">
                    Top actors: {hintData.topActors.slice(0, 3).map(actor => actor.name).join(", ")}
                  </div>
                )}
              </div>
            )}
            {hintData?.error && (
              <div className="hint-error">Unable to load credits</div>
            )}
          </div>
        )}
      </div>
      {isCurrentMovie && (
        <div className="movie-controls">
          <button 
            className={`movie-control-btn hint-btn ${hasBeenHinted ? 'disabled' : ''}`}
            onClick={onHint}
            disabled={hasBeenHinted}
            title={hasBeenHinted ? "Hint already used for this movie" : "Get hint for this movie"}
          >
            💡
          </button>
          {canBacktrack && (
            <button 
              className="movie-control-btn backtrack-btn"
              onClick={onBacktrack}
              title="Remove this movie from path"
            >
              🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const GamePath = ({ userPath, startMovie, endMovie, hintedMovieId, hintedMovies, onHint, onBacktrack, canBacktrack }) => {
  // Guard clause to handle undefined movies
  if (!startMovie || !endMovie) {
    return (
      <div className="game-path">
        <div className="path-header">
          <h3>Your Path</h3>
        </div>
        <div className="loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (userPath.length === 0) {
    return (
      <div className="game-path">
        <div className="path-header">
          <h3>Your Path</h3>
        </div>
        
        <div className="path-display-vertical">
          <MovieStepWithHint 
            movie={startMovie}
            stepNumber="1"
            label="START"
            isHinted={hintedMovieId === startMovie?.id}
            isCurrentMovie={userPath.length === 0}
            onHint={onHint}
            onBacktrack={onBacktrack}
            canBacktrack={false}
            hasBeenHinted={hintedMovies.has(startMovie?.id)}
          />
          
          <div className="path-arrow-vertical">↓</div>
          
          <MovieStepWithHint 
            movie={endMovie}
            stepNumber="?"
            label="TARGET"
            isHinted={hintedMovieId === endMovie?.id}
            isCurrentMovie={false}
            onHint={onHint}
            onBacktrack={onBacktrack}
            canBacktrack={false}
            hasBeenHinted={hintedMovies.has(endMovie?.id)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="game-path">
      <div className="path-header">
        <h3>Your Path</h3>
      </div>
      
      <div className="path-display-vertical">
        <MovieStepWithHint 
          movie={startMovie}
          stepNumber="1"
          label="START"
                      isHinted={hintedMovieId === startMovie?.id}
            isCurrentMovie={userPath.length === 0}
            onHint={onHint}
            onBacktrack={onBacktrack}
            canBacktrack={false}
            hasBeenHinted={hintedMovies.has(startMovie?.id)}
        />
        
        {userPath.map((step, index) => (
          <div key={index} className="connection-step-vertical">
            <div className="connection-compact">
              <span className="person-name">{step.connection.name}</span>
              <span className="person-role">({step.connection.movie1_role})</span>
              {step.connection.movie1_character && step.connection.movie1_character !== "Various" && (
                <span className="person-character">as {step.connection.movie1_character}</span>
              )}
            </div>
            
            <MovieStepWithHint 
              movie={step.movie}
              stepNumber={index + 2}
                          isHinted={hintedMovieId === step.movie?.id}
            isCurrentMovie={index === userPath.length - 1}
            onHint={onHint}
            onBacktrack={onBacktrack}
            canBacktrack={canBacktrack}
            hasBeenHinted={hintedMovies.has(step.movie?.id)}
            />
          </div>
        ))}
        
        <div className="path-arrow-vertical">↓</div>
        
        <MovieStepWithHint 
          movie={endMovie}
          stepNumber={userPath.length + 2}
          label="TARGET"
                      isHinted={hintedMovieId === endMovie?.id}
            isCurrentMovie={false}
            onHint={onHint}
            onBacktrack={onBacktrack}
            canBacktrack={false}
            hasBeenHinted={hintedMovies.has(endMovie?.id)}
        />
      </div>
    </div>
  );
};

export default GamePath;
