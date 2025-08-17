import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth"; // Removed
import { insertOrderSchema, insertStockSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<void> {
  // Auth middleware
  // await setupAuth(app); // Removed

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // const userId = req.user.claims.sub; // Removed
      // const user = await storage.getUser(userId); // Removed
      // res.json(user); // Removed
      res.json({ message: "Auth disabled in local mode" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Login route for local development
  app.get('/api/login', async (req: any, res) => {
    // In local development, just redirect to home
    res.redirect('/home');
  });

  // Initialize default data
  app.post('/api/initialize', async (req: any, res) => {
    try {
      // const userId = req.user.claims.sub; // Removed
      
      // Initialize BSE stocks if not exist
      await initializeBSEStocks();
      
      // Initialize brokers if not exist
      await initializeBrokers();
      
      // Create user portfolio if not exists
      // let portfolio = await storage.getUserPortfolio(userId); // Removed
      // if (!portfolio) {
      //   portfolio = await storage.createPortfolio({
      //     userId,
      //     name: "My Trading Portfolio",
      //     cashBalance: "50000", // Starting with BWP 50,000
      //   });
      // }
      
      res.json({ success: true, message: "Initialization complete (auth disabled)" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  // Stock routes
  app.get('/api/stocks', async (req, res) => {
    try {
      const stocks = await storage.getStocks();
      res.json(stocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  app.get('/api/stocks/:id', async (req, res) => {
    try {
      const stock = await storage.getStock(req.params.id);
      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }
      res.json(stock);
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ message: "Failed to fetch stock" });
    }
  });

  app.get('/api/stocks/:id/history', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getPriceHistory(req.params.id, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', async (req: any, res) => {
    try {
      // const userId = req.user.claims.sub; // Removed
      const userId = "local-user"; // Mock user ID for local development
      const portfolio = await storage.getUserPortfolio(userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Order routes
  app.post('/api/orders', async (req: any, res) => {
    try {
      // const userId = req.user.claims.sub; // Removed
      const userId = "local-user"; // Mock user ID for local development
      const orderData = insertOrderSchema.parse(req.body);
      
      // Get user portfolio
      const portfolio = await storage.getUserPortfolio(userId);
      if (!portfolio) {
        return res.status(400).json({ message: "Portfolio not found" });
      }

      // Get stock
      const stock = await storage.getStock(orderData.stockId);
      if (!stock) {
        return res.status(400).json({ message: "Stock not found" });
      }

      // Calculate order cost
      const price = orderData.price ? parseFloat(orderData.price) : parseFloat(stock.currentPrice);
      const totalCost = orderData.quantity * price;
      const commission = parseFloat(orderData.commission || "2.50");
      const finalCost = totalCost + commission;

      // Validate sufficient funds for BUY orders
      if (orderData.orderType === 'BUY') {
        const cashBalance = parseFloat(portfolio.cashBalance);
        if (cashBalance < finalCost) {
          return res.status(400).json({ message: "Insufficient funds" });
        }
      }

      // Validate sufficient holdings for SELL orders
      if (orderData.orderType === 'SELL') {
        const holding = await storage.getHolding(portfolio.id, orderData.stockId);
        if (!holding || holding.quantity < orderData.quantity) {
          return res.status(400).json({ message: "Insufficient shares" });
        }
      }

      // Create order with proper field names
      const order = await storage.createOrder({
        userId: userId,
        portfolioId: portfolio.id,
        stockId: orderData.stockId,
        broker: orderData.broker,
        orderType: orderData.orderType,
        orderStyle: orderData.orderStyle || "MARKET",
        quantity: orderData.quantity,
        price: price.toString(),
        commission: commission.toString(),
        status: "PENDING",
      });

      // Simulate order execution for market orders
      if (orderData.orderStyle === 'MARKET') {
        await executeOrder(order.id, price, orderData.quantity);
      }

      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', async (req: any, res) => {
    try {
      // const userId = req.user.claims.sub; // Removed
      const userId = "local-user"; // Mock user ID for local development
      const status = req.query.status as string;
      const orders = await storage.getUserOrders(userId, status);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch('/api/orders/:id/cancel', async (req: any, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const userId = "local-user"; // Mock user ID for local development
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (order.status !== 'PENDING') {
        return res.status(400).json({ message: "Order cannot be cancelled" });
      }

      await storage.updateOrderStatus(req.params.id, 'CANCELLED');
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  // Broker routes
  app.get('/api/brokers', async (req, res) => {
    try {
      const brokers = await storage.getBrokers();
      res.json(brokers);
    } catch (error) {
      console.error("Error fetching brokers:", error);
      res.status(500).json({ message: "Failed to fetch brokers" });
    }
  });
}

// Helper functions
async function initializeBSEStocks() {
  const bseStocks = [
    {
      id: 'letshego',
      symbol: 'LETSHEGO',
      name: 'Letshego Holdings Limited',
      sector: 'Financials',
      currentPrice: '1.05',
      previousClose: '1.15',
      marketCap: '2100000000',
      peRatio: '8.4',
      dividendYield: '4.2',
    },
    {
      id: 'absa',
      symbol: 'ABSA',
      name: 'Absa Bank Botswana Limited',
      sector: 'Financials',
      currentPrice: '7.30',
      previousClose: '6.90',
      marketCap: '5200000000',
      peRatio: '12.1',
      dividendYield: '5.8',
    },
    {
      id: 'chobe',
      symbol: 'CHOBE',
      name: 'Chobe Holdings Limited',
      sector: 'Consumer Services',
      currentPrice: '17.55',
      previousClose: '17.36',
      marketCap: '3400000000',
      peRatio: '15.2',
      dividendYield: '3.1',
    },
    {
      id: 'choppies',
      symbol: 'CHOPPIES',
      name: 'Choppies Enterprises Limited',
      sector: 'Consumer Services',
      currentPrice: '0.70',
      previousClose: '0.52',
      marketCap: '450000000',
      peRatio: '18.5',
      dividendYield: '2.1',
    },
    {
      id: 'engen',
      symbol: 'ENGEN',
      name: 'Engen Botswana Limited',
      sector: 'Oil & Gas',
      currentPrice: '14.25',
      previousClose: '14.13',
      marketCap: '1800000000',
      peRatio: '9.7',
      dividendYield: '6.2',
    },
    {
      id: 'fnb',
      symbol: 'FNB',
      name: 'First National Bank of Botswana Limited',
      sector: 'Financials',
      currentPrice: '5.30',
      previousClose: '5.11',
      marketCap: '2800000000',
      peRatio: '11.3',
      dividendYield: '4.8',
    },
  ];

  for (const stockData of bseStocks) {
    try {
      await storage.upsertStock(stockData);
    } catch (error) {
      console.error(`Error initializing stock ${stockData.symbol}:`, error);
    }
  }
}

async function initializeBrokers() {
  const brokers = [
    {
      id: 'stockbrokers-botswana',
      name: 'Stockbrokers Botswana',
      description: 'Established in 1989, first broker with research function',
      commission: '2.50',
    },
    {
      id: 'imara-capital',
      name: 'Imara Capital Securities',
      description: 'Part of Capital Group, started operations in March 2000',
      commission: '2.75',
    },
    {
      id: 'motswedi-securities',
      name: 'Motswedi Securities',
      description: 'Citizen-owned company serving individuals and institutions',
      commission: '2.25',
    },
  ];

  for (const brokerData of brokers) {
    try {
      const existingBroker = await storage.getBrokers();
      const brokerExists = existingBroker.some(b => b.id === brokerData.id);
      
      if (!brokerExists) {
        // Insert broker manually since we don't have upsertBroker method
        // This would need to be implemented in storage if brokers can be updated
      }
    } catch (error) {
      console.error(`Error initializing broker ${brokerData.name}:`, error);
    }
  }
}

async function executeOrder(orderId: string, executedPrice: number, executedQuantity: number) {
  try {
    const order = await storage.getOrder(orderId);
    if (!order) return;

    // Update order status
    await storage.updateOrderStatus(orderId, 'FILLED', executedPrice, executedQuantity);

    // Update portfolio holdings
    const portfolio = await storage.getUserPortfolio(order.userId);
    if (!portfolio) return;

    if (order.orderType === 'BUY') {
      // Add to holdings
      const existingHolding = await storage.getHolding(portfolio.id, order.stockId);
      
      if (existingHolding) {
        // Update existing holding
        const newQuantity = existingHolding.quantity + executedQuantity;
        const newTotalCost = parseFloat(existingHolding.totalCost) + (executedPrice * executedQuantity);
        const newAveragePrice = newTotalCost / newQuantity;
        
        await storage.updateHolding(portfolio.id, order.stockId, newQuantity, newAveragePrice);
      } else {
        // Create new holding
        await storage.upsertHolding({
          portfolioId: portfolio.id,
          stockId: order.stockId,
          quantity: executedQuantity,
          averagePrice: executedPrice.toString(),
          totalCost: (executedPrice * executedQuantity).toString(),
        });
      }

      // Deduct cash
      const newCashBalance = parseFloat(portfolio.cashBalance) - parseFloat(order.totalCost);
      await storage.updatePortfolioValue(portfolio.id, parseFloat(portfolio.totalValue), parseFloat(portfolio.totalCost));
    } else if (order.orderType === 'SELL') {
      // Remove from holdings
      const existingHolding = await storage.getHolding(portfolio.id, order.stockId);
      
      if (existingHolding) {
        const newQuantity = existingHolding.quantity - executedQuantity;
        
        if (newQuantity > 0) {
          await storage.updateHolding(portfolio.id, order.stockId, newQuantity, parseFloat(existingHolding.averagePrice));
        } else {
          // Remove holding completely - would need deleteHolding method
        }
      }

      // Add cash
      const proceeds = (executedPrice * executedQuantity) - parseFloat(order.commission);
      const newCashBalance = parseFloat(portfolio.cashBalance) + proceeds;
      await storage.updatePortfolioValue(portfolio.id, parseFloat(portfolio.totalValue), parseFloat(portfolio.totalCost));
    }
  } catch (error) {
    console.error('Error executing order:', error);
  }
}
