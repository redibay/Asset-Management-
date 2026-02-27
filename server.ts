import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.use(express.json());

  // API routes
    app.use(cookieParser());

  // API routes
  const apiRoutes = (await import('./src/routes/api')).default;
  app.use('/api', apiRoutes);

  // Auth routes
  const authRoutes = (await import('./src/routes/auth')).default;
  app.use('/api/auth', authRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built frontend files
    const path = require('path');
    app.use(express.static(path.resolve(__dirname, '..', 'dist')));

    // Fallback to index.html for any other requests
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
