import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('baconator-theme');
      return saved ? JSON.parse(saved) : true;
    } catch (error) {
      return true; // Default to dark theme
    }
  });

  useEffect(() => {
    try {
      document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
      localStorage.setItem('baconator-theme', JSON.stringify(isDarkMode));
    } catch (error) {
      // Still apply the theme to body even if localStorage fails
      document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
