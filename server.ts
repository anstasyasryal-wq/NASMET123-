import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Open access & CORS middleware to allow sharing across external clients and previews
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.removeHeader('X-Frame-Options');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'حسب قلب الله', shareable: true });
});

async function startServer() {
  const httpServer = http.createServer(app);
  const distPath = path.join(__dirname, 'dist');
  const distIndex = path.join(distPath, 'index.html');

  if (isProduction && fs.existsSync(distIndex)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: false,
          ws: {
            server: httpServer,
          },
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch {
      if (fs.existsSync(distIndex)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(distIndex);
        });
      }
    }
  }

  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
