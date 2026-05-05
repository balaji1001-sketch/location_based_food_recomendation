/**
 * Simple Frontend Server
 * Serves the React build folder on port 3000
 */

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Food Recommendation Frontend Server      ║
║   ✅ Running on http://localhost:${PORT}        ║
║   📁 Serving React build folder             ║
╚════════════════════════════════════════════╝
  `);
});
