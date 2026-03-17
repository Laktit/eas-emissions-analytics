/**
 * EAS Emissions Analytics — API Proxy Server
 * 
 * Runs alongside the Angular dev server to proxy Anthropic API calls,
 * solving the CORS issue that prevents direct browser → Anthropic calls.
 * 
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   node server.js
 * 
 * Then in a separate terminal:
 *   npm start   (runs ng serve on :4200)
 * 
 * The Angular app calls /api/chat, this proxy adds the auth header.
 */

const http  = require('http');
const https = require('https');
const url   = require('url');

const PORT    = 3001;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!API_KEY) {
  console.warn('[EAS Proxy] ⚠  ANTHROPIC_API_KEY not set — AI assistant will not work.');
  console.warn('[EAS Proxy]    Set it with: export ANTHROPIC_API_KEY=sk-ant-...');
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = url.parse(req.url);

  if (req.method === 'POST' && parsed.pathname === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body),
        }
      };

      const proxyReq = https.request(options, proxyRes => {
        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
        proxyRes.pipe(res);
      });

      proxyReq.on('error', err => {
        console.error('[EAS Proxy] Upstream error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'Proxy upstream error: ' + err.message } }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[EAS Proxy] ✓ Listening on http://localhost:${PORT}`);
  console.log(`[EAS Proxy] ✓ Proxying POST /api/chat → api.anthropic.com/v1/messages`);
});
