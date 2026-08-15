const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Running TechLaunch basic application tests...');

// Required application files
const requiredFiles = [
  'app.js',
  'package.json',
  'package-lock.json',
  'bin/www',
  'routes/index.js',
  'routes/api.js'
];

for (const file of requiredFiles) {
  const fullPath = path.join(process.cwd(), file);

  assert(
    fs.existsSync(fullPath),
    `Required file is missing: ${file}`
  );

  console.log(`PASS: ${file} exists`);
}

// Validate package.json
const packageJson = require('../package.json');

assert(
  packageJson.scripts,
  'package.json scripts section is missing'
);

assert(
  packageJson.scripts.start,
  'npm start script is missing'
);

console.log('PASS: npm start script exists');

// Validate application source syntax
const sourceFiles = [
  'app.js',
  'routes/index.js',
  'routes/api.js'
];

for (const file of sourceFiles) {
  const fullPath = path.join(process.cwd(), file);
  const source = fs.readFileSync(fullPath, 'utf8');

  assert(
    source.length > 0,
    `${file} is empty`
  );

  console.log(`PASS: ${file} contains source code`);
}

// Health endpoint must exist in application source.
const appSource = fs.readFileSync(
  path.join(process.cwd(), 'app.js'),
  'utf8'
);

assert(
  appSource.includes("'/health'") ||
  appSource.includes('"/health"'),
  'Health endpoint /health was not found in app.js'
);

console.log('PASS: /health endpoint exists');

console.log('');
console.log('============================================================');
console.log('        TECHLAUNCH BASIC TESTS PASSED');
console.log('============================================================');
