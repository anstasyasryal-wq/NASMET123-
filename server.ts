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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'حسب قلب الله' });
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
          // Share the app's HTTP server so the HMR WebSocket uses the same port as the proxied preview
          ws: { server: httpServer },
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
