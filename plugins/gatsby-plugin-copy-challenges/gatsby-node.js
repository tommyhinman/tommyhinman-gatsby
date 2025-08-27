const fs = require('fs');
const path = require('path');

exports.onPostBuild = ({ store }) => {
  const { program } = store.getState();
  const publicDir = path.join(program.directory, 'public');
  
  // Source and destination directories
  const sourceDir = path.join(program.directory, 'src/static/projects/movie-game/challenges');
  const targetDir = path.join(publicDir, 'projects/movie-game/challenges');
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy all challenge files
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${file} to public directory`);
      }
    });
    console.log('Challenge files copied successfully during build!');
  } else {
    console.log('Source directory not found:', sourceDir);
  }
};
