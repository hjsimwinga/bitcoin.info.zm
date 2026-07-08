const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.BITCOIN_INFO_PORT || 3000;
const SATREWARD_URL = process.env.SATREWARD_URL || 'http://127.0.0.1:30001';

// SatReward Next.js app at /satreward (keep full path when forwarding)
app.use(
  createProxyMiddleware({
    target: SATREWARD_URL,
    changeOrigin: true,
    ws: true,
    pathFilter: '/satreward',
  })
);

// Serve static assets from the project root (e.g., index.html, images, css)
app.use(express.static(__dirname));

// Root route serves the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`SatReward at http://localhost:${PORT}/satreward (${SATREWARD_URL})`);
});


