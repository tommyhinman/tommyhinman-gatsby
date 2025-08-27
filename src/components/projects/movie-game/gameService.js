// TMDb API configuration
const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGZhMzliOWMxZDgyYzQwYTcwNzk1ZjNmZDE2ZGI5YiIsIm5iZiI6MTcxNjA0OTI1NS40MDcsInN1YiI6IjY2NDhkNTY3NDZmNzA3ZWU5ZjhlN2I1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kFUHxiw_UTQSNdzd-04L25Ss5h7oUA_zlJuchTx-XHQ";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// API helper functions
const makeApiCall = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Search for movies
export const searchMovies = async (query) => {
  try {
    const data = await makeApiCall('/search/movie', {
      query: query,
      page: 1
    });

    return data.results
      .filter(movie => movie.release_date)
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date.split('-')[0],
        poster_path: movie.poster_path,
        overview: movie.overview
      }))
      .slice(0, 10);
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId) => {
  try {
    const data = await makeApiCall(`/movie/${movieId}`, {
      append_to_response: 'credits'
    });
    return data;
  } catch (error) {
    console.error('Error getting movie credits:', error);
    throw error;
  }
};

// Find connection between two movies
export const findConnectionBetweenMovies = async (movie1Id, movie2Id) => {
  try {
    // Get credits for both movies
    const movie1Data = await getMovieCredits(movie1Id);
    const movie2Data = await getMovieCredits(movie2Id);

    if (!movie1Data?.credits || !movie2Data?.credits) {
      return null;
    }

    const credits1 = movie1Data.credits;
    const credits2 = movie2Data.credits;

    // Collect all connections with priority scores
    const connections = [];

    // Get all people from movie1 with their roles and billing order
    const movie1People = {};

    // Add cast members with their billing order
    if (credits1.cast) {
      credits1.cast.forEach((actor, i) => {
        movie1People[actor.id] = {
          id: actor.id,
          name: actor.name,
          role: 'actor',
          character: actor.character || '',
          movie1_role: 'actor',
          movie1_character: actor.character || '',
          billing_order: i, // Lower number = higher billing
          priority_score: 2 // Actor priority (will be adjusted based on billing)
        };
      });
    }

    // Add crew members
    if (credits1.crew) {
      credits1.crew.forEach(crewMember => {
        const job = crewMember.job.toLowerCase();
        if (['director', 'writer', 'original writer', 'screenplay', 'written by', 'story', 'screen story', 'novel'].includes(job)) {
          if (!movie1People[crewMember.id]) { // Don't overwrite if they're also in cast
            const priorityScore = job === 'director' ? 1 : 3; // Director = 1, Writer = 3
            movie1People[crewMember.id] = {
              id: crewMember.id,
              name: crewMember.name,
              role: job,
              character: '',
              movie1_role: job,
              movie1_character: '',
              billing_order: 999, // High number for crew
              priority_score: priorityScore
            };
          }
        }
      });
    }

    // Check if any of these people are in movie2
    Object.values(movie1People).forEach(personInfo => {
      // Check cast of movie2
      if (credits2.cast) {
        credits2.cast.forEach(actor => {
          if (actor.id === personInfo.id) {
            // Adjust priority score for actors based on billing order
            let adjustedPriority;
            if (personInfo.role === 'actor') {
              // Higher billing (lower number) gets better priority
              adjustedPriority = personInfo.priority_score + (personInfo.billing_order * 0.1);
            } else {
              adjustedPriority = personInfo.priority_score;
            }

            connections.push({
              id: personInfo.id,
              name: personInfo.name,
              role: 'actor',
              character: actor.character || '',
              movie1_role: personInfo.movie1_role,
              movie1_character: personInfo.movie1_character,
              movie2_role: 'actor',
              movie2_character: actor.character || '',
              priority_score: adjustedPriority
            });
          }
        });
      }

      // Check crew of movie2
      if (credits2.crew) {
        credits2.crew.forEach(crewMember => {
          const job = crewMember.job.toLowerCase();
          if (crewMember.id === personInfo.id && 
              ['director', 'writer', 'original writer', 'screenplay', 'written by', 'story', 'screen story', 'novel'].includes(job)) {
            connections.push({
              id: personInfo.id,
              name: personInfo.name,
              role: job,
              character: '',
              movie1_role: personInfo.movie1_role,
              movie1_character: personInfo.movie1_character,
              movie2_role: job,
              movie2_character: '',
              priority_score: personInfo.priority_score
            });
          }
        });
      }
    });

    // Return the connection with the best priority score (lowest number)
    if (connections.length > 0) {
      const bestConnection = connections.reduce((min, conn) => 
        conn.priority_score < min.priority_score ? conn : min
      );
      
      // Remove priority_score from the returned connection
      const { priority_score, ...connection } = bestConnection;
      return connection;
    }

    return null;
  } catch (error) {
    console.error('Error finding connection between movies:', error);
    throw error;
  }
};

// Validate if a movie connects to the current path
export const validateMovieStep = async (movieOrTitle, userPath, startMovie) => {
  try {
    let movie;
    
    // Check if we received a movie object or just a title
    if (typeof movieOrTitle === 'object' && movieOrTitle.id) {
      // We received a movie object, use it directly
      movie = movieOrTitle;
    } else {
      // We received a title string, search for the movie
      const searchResults = await searchMovies(movieOrTitle);
      if (searchResults.length === 0) {
        return null;
      }
      // Use the first result (most relevant)
      movie = searchResults[0];
    }

    let connection;
    if (userPath.length === 0) {
      // First movie - check if it connects to start movie
      connection = await findConnectionBetweenMovies(startMovie.id, movie.id);
    } else {
      // Check if it connects to the last movie in the path
      const lastStep = userPath[userPath.length - 1];
      connection = await findConnectionBetweenMovies(lastStep.movie.id, movie.id);
    }

    if (connection) {
      return {
        movie: {
          id: movie.id,
          title: movie.title,
          year: movie.year
        },
        connection: connection
      };
    }

    return null;
  } catch (error) {
    console.error('Error validating movie step:', error);
    throw error;
  }
};

// Get movie credits for hints (similar to Python's show_movie_credits)
export const getMovieCreditsForHint = async (movieId) => {
  try {
    const movieData = await getMovieCredits(movieId);
    if (!movieData?.credits) {
      return null;
    }

    const credits = movieData.credits;
    const hintInfo = {
      director: null,
      writer: null,
      topActors: []
    };

    // Get director
    if (credits.crew) {
      for (const person of credits.crew) {
        if (person.job.toLowerCase() === 'director') {
          hintInfo.director = person.name;
          break;
        }
      }
    }

    // Get writer
    if (credits.crew) {
      for (const person of credits.crew) {
        if (['writer', 'screenplay'].includes(person.job.toLowerCase())) {
          hintInfo.writer = person.name;
          break;
        }
      }
    }

    // Get top 5 billed actors
    if (credits.cast) {
      hintInfo.topActors = credits.cast.slice(0, 5).map(actor => ({
        name: actor.name,
        character: actor.character || ''
      }));
    }

    return hintInfo;
  } catch (error) {
    console.error('Error getting movie credits for hint:', error);
    throw error;
  }
};
