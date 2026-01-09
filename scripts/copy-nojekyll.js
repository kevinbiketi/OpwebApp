const fs = require('fs');
const path = require('path');

// Copy .nojekyll to build folder if it doesn't exist
const buildDir = path.join(__dirname, '..', 'build');
const nojekyllPath = path.join(buildDir, '.nojekyll');

if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('✓ Created .nojekyll file in build folder');
}
