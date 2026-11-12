import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { initDb } from './db.js';
import { api, apiErrorHandler } from './routes.js';
import { validateStory } from './story/index.js';
import { mentorConfigured, providerName } from './ai.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.use(express.json({ limit: '120kb' }));
app.use('/api', api);
app.use('/api', apiErrorHandler);

const distDir = path.join(here, '..', 'dist');
app.use(
  express.static(distDir, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      else if (/\.[a-f0-9]{8,}\.(js|css|woff2?)$/.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  }),
);

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) {
      res
        .status(503)
        .type('text/plain')
        .send('The Future You 2036 client has not been built yet. Run `npm run build` first.');
    }
  });
});

const problems = validateStory();
if (problems.length) {
  console.warn('[story] validation problems:', problems);
}

await initDb();

const server = app.listen(PORT, HOST, () => {
  console.log(`[futureyou] listening on http://${HOST}:${PORT}`);
  console.log(`[futureyou] mentor configured: ${mentorConfigured()} (${providerName()})`);
});

function shutdown(signal) {
  console.log(`[futureyou] ${signal} received, closing`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };
