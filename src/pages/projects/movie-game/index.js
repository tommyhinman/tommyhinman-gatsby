import React, { useState, Component } from "react"
import { Helmet } from "react-helmet"
import WelcomeScreen from "../../../components/projects/movie-game/WelcomeScreen"
import MovieConnectionGame from "../../../components/projects/movie-game/MovieConnectionGame"
import ThemeToggle from "../../../components/projects/movie-game/ThemeToggle"
import { ThemeProvider } from "../../../components/projects/movie-game/ThemeContext"

// Simple Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function MovieGame() {
  const [gameState, setGameState] = useState("welcome"); // welcome, playing, gameOver
  const [challenge, setChallenge] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userPath, setUserPath] = useState([]);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    hint: 0,
    backtrack: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startGame = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/projects/movie-game/challenges/challenge_${date}.json`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No challenge available for ${date}. Please try a different date.`);
        } else {
          throw new Error('Failed to load challenge. Please try again.');
        }
      }
      const challengeData = await response.json();
      setChallenge(challengeData);
      setSelectedDate(date);
      setGameState("playing");
      setUserPath([]);
      setLifelinesUsed({ hint: 0, backtrack: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMovieToPath = (movie) => {
    setUserPath(prev => [...prev, movie]);
  };

  const backtrack = () => {
    setUserPath(prev => prev.slice(0, -1));
    setLifelinesUsed(prev => ({ ...prev, backtrack: prev.backtrack + 1 }));
  };

  const useHint = () => {
    setLifelinesUsed(prev => ({ ...prev, hint: prev.hint + 1 }));
  };

  const showSolution = () => {
    setGameState("gameOver");
  };

  const endGame = () => {
    setGameState("gameOver");
  };

  const playAgain = () => {
    setGameState("playing");
    setUserPath([]);
    setLifelinesUsed({ hint: 0, backtrack: 0 });
  };

  const returnToWelcome = () => {
    setGameState("welcome");
    setChallenge(null);
    setUserPath([]);
    setLifelinesUsed({ hint: 0, backtrack: 0 });
    setError(null);
  };

  return (
    <div className="movie-game-app">
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>Movie Connection Game | tommyhinman</title>
      </Helmet>
      <ErrorBoundary>
        <ThemeProvider>
          <div className="movie-game-container">
            <ThemeToggle />
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
              </div>
            )}
            
            {loading && (
              <div className="loading">
                <p>Loading challenge...</p>
              </div>
            )}
            
            {!loading && !error && (
              <>
                {gameState === "welcome" && (
                  <ErrorBoundary>
                    <WelcomeScreen 
                      onStartGame={startGame} 
                      challengeDate={selectedDate}
                    />
                  </ErrorBoundary>
                )}
                
                {gameState === "playing" && challenge && (
                  <ErrorBoundary>
                    <MovieConnectionGame
                      challenge={challenge}
                      selectedDate={selectedDate}
                      userPath={userPath}
                      lifelinesUsed={lifelinesUsed}
                      onAddMovie={addMovieToPath}
                      onBacktrack={backtrack}
                      onHint={useHint}
                      onShowSolution={showSolution}
                      onEndGame={endGame}
                    />
                  </ErrorBoundary>
                )}

                {gameState === "gameOver" && challenge && (
                  <ErrorBoundary>
                    <div className="game-over-screen">
                      <h2>Game Over</h2>
                      <p>You chose to see the solution for {selectedDate}</p>
                      
                      <div className="solution-path">
                        <h3>Solution Path:</h3>
                        <div className="path-display-vertical">
                          <div className="movie-step start">
                            <div className="step-number">1</div>
                            <div className="movie-info">
                              <span className="movie-title">{challenge.start_movie.title}</span>
                              <span className="movie-year">({challenge.start_movie.year})</span>
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
                              // This is a movie - but skip if it's the end movie since we show it as target
                              if (step.title.toLowerCase() === challenge.end_movie.title.toLowerCase()) {
                                return null;
                              }
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
                            <div className="step-number">{challenge.solution_path.length + 2}</div>
                            <div className="movie-info">
                              <span className="movie-title">{challenge.end_movie.title}</span>
                              <span className="movie-year">({challenge.end_movie.year})</span>
                            </div>
                            <div className="step-label">TARGET</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="game-over-buttons">
                        <button className="btn-primary" onClick={playAgain}>
                          Play Again
                        </button>
                        <button className="btn-secondary" onClick={returnToWelcome}>
                          New Challenge
                        </button>
                      </div>
                    </div>
                  </ErrorBoundary>
                )}
              </>
            )}
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default MovieGame;
