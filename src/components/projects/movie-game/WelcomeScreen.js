import React, { useState, useEffect } from 'react';
import './movie-game.css';

const WelcomeScreen = ({ onStartGame, challengeDate }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);

  // Helper function to get local date in YYYY-MM-DD format
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Use a more comprehensive set of dates to check
  useEffect(() => {
    const discoverAvailableDates = async () => {
      const today = new Date();
      
      // Check a comprehensive set of dates around today
      const dateChecks = [];
      
      // Check today and the next 14 days
      for (let i = 0; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateChecks.push(date.toISOString().split('T')[0]);
      }
      
      // Check the previous 14 days
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dateChecks.push(date.toISOString().split('T')[0]);
      }
      
      // Check some known challenge dates (January 2025)
      dateChecks.push('2025-01-28', '2025-01-29', '2025-01-30');
      
      // Check August 2025 dates specifically since we know they exist
      for (let i = 1; i <= 31; i++) {
        const augustDate = `2025-08-${i.toString().padStart(2, '0')}`;
        dateChecks.push(augustDate);
      }
      
      // Remove duplicates
      const uniqueDates = [...new Set(dateChecks)];
      
      console.log('Checking dates for challenges:', uniqueDates.length, 'total dates');
      
      // Check each date efficiently - only include dates that return valid JSON
      const promises = uniqueDates.map(async dateString => {
        try {
          const response = await fetch(`/projects/movie-game/challenges/challenge_${dateString}.json`);
          if (response.ok) {
            // Try to parse the JSON to make sure it's valid
            const data = await response.json();
            if (data && typeof data === 'object') {
              return dateString;
            }
          }
          return null;
        } catch (error) {
          // If fetch fails or JSON parsing fails, return null
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      const validDates = results.filter(date => date !== null).sort();
      
      // Filter out dates that are after today (using local time)
      const currentDate = getLocalDateString();
      const availableDates = validDates.filter(date => date <= currentDate);
      
      console.log('Available challenge dates:', availableDates);
      console.log('Total challenges found:', availableDates.length);
      console.log('Filtered out future dates after:', currentDate);
      console.log('Current local date:', currentDate);
      
      setAvailableDates(availableDates);
      setIsLoadingDates(false);
    };

    discoverAvailableDates();
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      // Always start with today's date (using local time)
      const today = getLocalDateString();
      return today;
    } catch (error) {
      return '2025-08-26'; // Fallback
    }
  });

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      // If we have available dates but no selected date, find the best one
      const today = getLocalDateString();
      
      // If today has a challenge, use it
      if (availableDates.includes(today)) {
        setSelectedDate(today);
        return;
      }
      
      // If today doesn't have a challenge, find the most recent available date
      // (since we've already filtered out future dates, this will be the latest past date)
      const mostRecentDate = availableDates[availableDates.length - 1];
      setSelectedDate(mostRecentDate);
    }
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (challengeDate && availableDates.includes(challengeDate)) {
      try {
        setSelectedDate(challengeDate);
      } catch (error) {
        // Keep current date if setting fails
      }
    }
  }, [challengeDate, availableDates]);

  const handleStartGame = () => {
    try {
      onStartGame(selectedDate);
    } catch (error) {
      // Error will be handled by parent component
    }
  };

  const navigateDate = (direction) => {
    try {
      const currentIndex = availableDates.indexOf(selectedDate);
      if (currentIndex === -1) {
        // If current date is not in available dates, start from the beginning
        setSelectedDate(availableDates[0]);
        return;
      }
      
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < availableDates.length) {
        setSelectedDate(availableDates[newIndex]);
      }
    } catch (error) {
      // Keep current date if navigation fails
    }
  };

  const currentIndex = availableDates.indexOf(selectedDate);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < availableDates.length - 1;

  if (isLoadingDates) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <h1>Baconator</h1>
          <p>Loading available challenges...</p>
        </div>
      </div>
    );
  }

  if (availableDates.length === 0) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <h1>Baconator</h1>
          <p>No challenges available at the moment.</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        
        <h1>Baconator</h1>
        <div className="work-in-progress">
          <div className="wip-banner">
            <span className="wip-emoji">🚧</span>
            <span className="wip-text">Work in Progress</span>
          </div>
          <p className="wip-warning">This game is still under development. Some features may not work as expected.</p>
        </div>
        
        <div className="game-description">
          <div className="rules">
            <h3>Rules</h3>
            <div className="rules-list">
              <div className="rule-item">Connect movies through actors, directors, writers, etc.</div>
              <div className="rule-item">Each step must be a valid connection (same person in both movies)</div>
            </div>
          </div>
        </div>
        
        <div className="date-selection">
          <div className="date-picker">
            <div className="date-navigation">
              <button 
                className="date-nav-btn"
                onClick={() => navigateDate(-1)}
                disabled={!canGoPrevious}
              >
                ←
              </button>
              <div className="date-display">
                <span className="selected-date">{selectedDate}</span>
                <span className="date-counter">({currentIndex + 1} of {availableDates.length})</span>
              </div>
              <button 
                className="date-nav-btn"
                onClick={() => navigateDate(1)}
                disabled={!canGoNext}
              >
                →
              </button>
            </div>
          </div>
        </div>
        
        <div className="start-game">
          <button 
            className="start-btn"
            onClick={handleStartGame}
          >
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
