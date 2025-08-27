const fs = require('fs');
const path = require('path');

// Copy challenge files to public directory
const sourceDir = path.join(__dirname, '../src/static/projects/movie-game/challenges');
const targetDir = path.join(__dirname, '../public/projects/movie-game/challenges');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all challenge files
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
  if (file.endsWith('.json')) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to public directory`);
  }
});

console.log('Challenge files copied successfully!');
