import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

const app = express();

// Add CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  await registerRoutes(app);

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to trading feed');
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'subscribe') {
          ws.send(JSON.stringify({ type: 'subscribed', symbols: message.symbols }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    ws.on('close', () => {
      console.log('Client disconnected from trading feed');
    });
  });

  // Simulate real-time price updates
  setInterval(async () => {
    try {
      const stocks = await storage.getStocks();
      for (const stock of stocks) {
        // Simulate price movement (-2% to +2%)
        const currentPrice = parseFloat(stock.currentPrice);
        const change = (Math.random() - 0.5) * 0.04; // -2% to +2%
        const newPrice = Math.max(0.01, currentPrice * (1 + change));
        // Update stock price
        await storage.updateStockPrice(stock.id, newPrice);
        // Add to price history
        await storage.addPriceHistory(stock.id, newPrice, Math.floor(Math.random() * 1000));
        // Broadcast to WebSocket clients
        const priceUpdate = {
          type: 'priceUpdate',
          symbol: stock.symbol,
          price: newPrice,
          change: newPrice - currentPrice,
          changePercent: ((newPrice - currentPrice) / currentPrice) * 100,
          timestamp: new Date().toISOString(),
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(priceUpdate));
          }
        });
      }
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  }, 5000);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5050', 10);
  httpServer.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
