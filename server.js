const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.BITCOIN_INFO_PORT || 3000;
const SATREWARD_URL = process.env.SATREWARD_URL || 'http://127.0.0.1:30001';

// SatReward proxy — optional so the main site still works if deps are missing
try {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use(
    createProxyMiddleware({
      target: SATREWARD_URL,
      changeOrigin: true,
      ws: true,
      pathFilter: '/satreward',
    })
  );
  console.log(`SatReward proxy enabled → ${SATREWARD_URL}`);
} catch (err) {
  console.warn('SatReward proxy disabled. Run: npm install');
  console.warn(err.message);
}

// Serve static assets from the project root (e.g., index.html, images, css)
app.use(express.static(__dirname));

// Root route serves the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`SatReward at http://localhost:${PORT}/satreward`);
});
