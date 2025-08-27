import React from "react";

const GameControls = ({ lifelinesUsed }) => {
  return (
    <div className="game-controls">
      <div className="controls-header">
        <h3>Game Controls</h3>
        <div className="lifeline-stats">
          <span className="lifeline-count">
            💡 Hints: {lifelinesUsed.hint}
          </span>
          <span className="lifeline-count">
            🔄 Backtracks: {lifelinesUsed.backtrack}
          </span>
        </div>
      </div>



      <div className="how-to-play">
          <h3>How to Play</h3>
          <ul>
            <li><strong>💡 Hint 💡</strong> See movie credits</li>
            <li><strong>🔄 Backtrack 🔄</strong> Go back one movie</li>
          </ul>
        </div>
    </div>
  );
};

export default GameControls;
