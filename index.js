var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express2 from "express";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  brokers: () => brokers,
  holdings: () => holdings,
  holdingsRelations: () => holdingsRelations,
  insertHoldingSchema: () => insertHoldingSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertPortfolioSchema: () => insertPortfolioSchema,
  insertStockSchema: () => insertStockSchema,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  portfolios: () => portfolios,
  portfoliosRelations: () => portfoliosRelations,
  priceHistory: () => priceHistory,
  priceHistoryRelations: () => priceHistoryRelations,
  sessions: () => sessions,
  stocks: () => stocks,
  stocksRelations: () => stocksRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  decimal,
  integer,
  text,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var stocks = pgTable("stocks", {
  id: varchar("id").primaryKey(),
  symbol: varchar("symbol").notNull().unique(),
  name: varchar("name").notNull(),
  sector: varchar("sector"),
  currentPrice: decimal("current_price", { precision: 10, scale: 3 }).notNull(),
  previousClose: decimal("previous_close", { precision: 10, scale: 3 }),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }),
  peRatio: decimal("pe_ratio", { precision: 8, scale: 2 }),
  dividendYield: decimal("dividend_yield", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull().default("Default Portfolio"),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }).default("0"),
  cashBalance: decimal("cash_balance", { precision: 15, scale: 2 }).default("10000"),
  // Starting balance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var holdings = pgTable("holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  stockId: varchar("stock_id").notNull().references(() => stocks.id),
  quantity: integer("quantity").notNull(),
  averagePrice: decimal("average_price", { precision: 10, scale: 3 }).notNull(),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  stockId: varchar("stock_id").notNull().references(() => stocks.id),
  broker: varchar("broker").notNull(),
  // Stockbrokers Botswana, Imara Capital, Motswedi Securities
  orderType: varchar("order_type").notNull(),
  // BUY, SELL
  orderStyle: varchar("order_style").notNull().default("MARKET"),
  // MARKET, LIMIT, STOP_LOSS
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 3 }),
  executedPrice: decimal("executed_price", { precision: 10, scale: 3 }),
  executedQuantity: integer("executed_quantity").default(0),
  status: varchar("status").notNull().default("PENDING"),
  // PENDING, PARTIAL, FILLED, CANCELLED
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }),
  commission: decimal("commission", { precision: 8, scale: 2 }).default("2.50"),
  createdAt: timestamp("created_at").defaultNow(),
  executedAt: timestamp("executed_at")
});
var priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stockId: varchar("stock_id").notNull().references(() => stocks.id),
  price: decimal("price", { precision: 10, scale: 3 }).notNull(),
  volume: integer("volume").default(0),
  timestamp: timestamp("timestamp").defaultNow()
});
var brokers = pgTable("brokers", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  commission: decimal("commission", { precision: 5, scale: 2 }).default("2.50"),
  isActive: boolean("is_active").default(true)
});
var usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
  orders: many(orders)
}));
var portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id]
  }),
  holdings: many(holdings),
  orders: many(orders)
}));
var stocksRelations = relations(stocks, ({ many }) => ({
  holdings: many(holdings),
  orders: many(orders),
  priceHistory: many(priceHistory)
}));
var holdingsRelations = relations(holdings, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [holdings.portfolioId],
    references: [portfolios.id]
  }),
  stock: one(stocks, {
    fields: [holdings.stockId],
    references: [stocks.id]
  })
}));
var ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  portfolio: one(portfolios, {
    fields: [orders.portfolioId],
    references: [portfolios.id]
  }),
  stock: one(stocks, {
    fields: [orders.stockId],
    references: [stocks.id]
  })
}));
var priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  stock: one(stocks, {
    fields: [priceHistory.stockId],
    references: [stocks.id]
  })
}));
var insertStockSchema = createInsertSchema(stocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  executedAt: true,
  executedPrice: true,
  executedQuantity: true,
  totalCost: true
});
var insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Stock operations
  async getStocks() {
    return await db.select().from(stocks).where(eq(stocks.isActive, true));
  }
  async getStock(id) {
    const [stock] = await db.select().from(stocks).where(eq(stocks.id, id));
    return stock;
  }
  async getStockBySymbol(symbol) {
    const [stock] = await db.select().from(stocks).where(eq(stocks.symbol, symbol));
    return stock;
  }
  async upsertStock(stockData) {
    const [stock] = await db.insert(stocks).values(stockData).onConflictDoUpdate({
      target: stocks.symbol,
      set: {
        ...stockData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return stock;
  }
  // Portfolio operations
  async getUserPortfolio(userId) {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId));
    if (!portfolio) return void 0;
    const portfolioHoldings = await this.getHoldings(portfolio.id);
    return {
      ...portfolio,
      holdings: portfolioHoldings
    };
  }
  async createPortfolio(portfolioData) {
    const [portfolio] = await db.insert(portfolios).values(portfolioData).returning();
    return portfolio;
  }
  async updatePortfolioValue(portfolioId, totalValue, totalCost) {
    await db.update(portfolios).set({
      totalValue: totalValue.toString(),
      totalCost: totalCost.toString(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(portfolios.id, portfolioId));
  }
  // Holdings operations
  async getHoldings(portfolioId) {
    return await db.select().from(holdings).innerJoin(stocks, eq(holdings.stockId, stocks.id)).where(eq(holdings.portfolioId, portfolioId));
  }
  async getHolding(portfolioId, stockId) {
    const [holding] = await db.select().from(holdings).where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.stockId, stockId)));
    return holding;
  }
  async upsertHolding(holdingData) {
    const [holding] = await db.insert(holdings).values(holdingData).onConflictDoUpdate({
      target: [holdings.portfolioId, holdings.stockId],
      set: {
        ...holdingData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return holding;
  }
  async updateHolding(portfolioId, stockId, quantity, averagePrice) {
    const totalCost = quantity * averagePrice;
    await db.update(holdings).set({
      quantity,
      averagePrice: averagePrice.toString(),
      totalCost: totalCost.toString(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.stockId, stockId)));
  }
  // Order operations
  async createOrder(orderData) {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }
  async getUserOrders(userId, status) {
    let query = db.select().from(orders).innerJoin(stocks, eq(orders.stockId, stocks.id)).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    if (status) {
      query = query.where(and(eq(orders.userId, userId), eq(orders.status, status)));
    }
    return await query;
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async updateOrderStatus(id, status, executedPrice, executedQuantity) {
    const updateData = {
      status
    };
    if (executedPrice !== void 0) {
      updateData.executedPrice = executedPrice.toString();
      updateData.executedAt = /* @__PURE__ */ new Date();
    }
    if (executedQuantity !== void 0) {
      updateData.executedQuantity = executedQuantity;
    }
    await db.update(orders).set(updateData).where(eq(orders.id, id));
  }
  // Price history operations
  async addPriceHistory(stockId, price, volume = 0) {
    const [priceRecord] = await db.insert(priceHistory).values({
      stockId,
      price: price.toString(),
      volume
    }).returning();
    return priceRecord;
  }
  async getPriceHistory(stockId, limit = 50) {
    return await db.select().from(priceHistory).where(eq(priceHistory.stockId, stockId)).orderBy(desc(priceHistory.timestamp)).limit(limit);
  }
  // Broker operations
  async getBrokers() {
    return await db.select().from(brokers).where(eq(brokers.isActive, true));
  }
  // Market operations
  async updateStockPrice(stockId, price) {
    await db.update(stocks).set({
      currentPrice: price.toString(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(stocks.id, stockId));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/auth/user", async (req, res) => {
    try {
      res.json({ message: "Auth disabled in local mode" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/login", async (req, res) => {
    res.redirect("/home");
  });
  app2.post("/api/initialize", async (req, res) => {
    try {
      await initializeBSEStocks();
      await initializeBrokers();
      res.json({ success: true, message: "Initialization complete (auth disabled)" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });
  app2.get("/api/stocks", async (req, res) => {
    try {
      const stocks2 = await storage.getStocks();
      res.json(stocks2);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });
  app2.get("/api/stocks/:id", async (req, res) => {
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
  app2.get("/api/stocks/:id/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const history = await storage.getPriceHistory(req.params.id, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });
  app2.get("/api/portfolio", async (req, res) => {
    try {
      const userId = "local-user";
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
  app2.post("/api/orders", async (req, res) => {
    try {
      const userId = "local-user";
      const orderData = insertOrderSchema.parse(req.body);
      const portfolio = await storage.getUserPortfolio(userId);
      if (!portfolio) {
        return res.status(400).json({ message: "Portfolio not found" });
      }
      const stock = await storage.getStock(orderData.stockId);
      if (!stock) {
        return res.status(400).json({ message: "Stock not found" });
      }
      const price = orderData.price ? parseFloat(orderData.price) : parseFloat(stock.currentPrice);
      const totalCost = orderData.quantity * price;
      const commission = parseFloat(orderData.commission || "2.50");
      const finalCost = totalCost + commission;
      if (orderData.orderType === "BUY") {
        const cashBalance = parseFloat(portfolio.cashBalance);
        if (cashBalance < finalCost) {
          return res.status(400).json({ message: "Insufficient funds" });
        }
      }
      if (orderData.orderType === "SELL") {
        const holding = await storage.getHolding(portfolio.id, orderData.stockId);
        if (!holding || holding.quantity < orderData.quantity) {
          return res.status(400).json({ message: "Insufficient shares" });
        }
      }
      const order = await storage.createOrder({
        userId,
        portfolioId: portfolio.id,
        stockId: orderData.stockId,
        broker: orderData.broker,
        orderType: orderData.orderType,
        orderStyle: orderData.orderStyle || "MARKET",
        quantity: orderData.quantity,
        price: price.toString(),
        commission: commission.toString(),
        status: "PENDING"
      });
      if (orderData.orderStyle === "MARKET") {
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
  app2.get("/api/orders", async (req, res) => {
    try {
      const userId = "local-user";
      const status = req.query.status;
      const orders2 = await storage.getUserOrders(userId, status);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.patch("/api/orders/:id/cancel", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const userId = "local-user";
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      if (order.status !== "PENDING") {
        return res.status(400).json({ message: "Order cannot be cancelled" });
      }
      await storage.updateOrderStatus(req.params.id, "CANCELLED");
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });
  app2.get("/api/brokers", async (req, res) => {
    try {
      const brokers2 = await storage.getBrokers();
      res.json(brokers2);
    } catch (error) {
      console.error("Error fetching brokers:", error);
      res.status(500).json({ message: "Failed to fetch brokers" });
    }
  });
}
async function initializeBSEStocks() {
  const bseStocks = [
    {
      id: "letshego",
      symbol: "LETSHEGO",
      name: "Letshego Holdings Limited",
      sector: "Financials",
      currentPrice: "1.05",
      previousClose: "1.15",
      marketCap: "2100000000",
      peRatio: "8.4",
      dividendYield: "4.2"
    },
    {
      id: "absa",
      symbol: "ABSA",
      name: "Absa Bank Botswana Limited",
      sector: "Financials",
      currentPrice: "7.30",
      previousClose: "6.90",
      marketCap: "5200000000",
      peRatio: "12.1",
      dividendYield: "5.8"
    },
    {
      id: "chobe",
      symbol: "CHOBE",
      name: "Chobe Holdings Limited",
      sector: "Consumer Services",
      currentPrice: "17.55",
      previousClose: "17.36",
      marketCap: "3400000000",
      peRatio: "15.2",
      dividendYield: "3.1"
    },
    {
      id: "choppies",
      symbol: "CHOPPIES",
      name: "Choppies Enterprises Limited",
      sector: "Consumer Services",
      currentPrice: "0.70",
      previousClose: "0.52",
      marketCap: "450000000",
      peRatio: "18.5",
      dividendYield: "2.1"
    },
    {
      id: "engen",
      symbol: "ENGEN",
      name: "Engen Botswana Limited",
      sector: "Oil & Gas",
      currentPrice: "14.25",
      previousClose: "14.13",
      marketCap: "1800000000",
      peRatio: "9.7",
      dividendYield: "6.2"
    },
    {
      id: "fnb",
      symbol: "FNB",
      name: "First National Bank of Botswana Limited",
      sector: "Financials",
      currentPrice: "5.30",
      previousClose: "5.11",
      marketCap: "2800000000",
      peRatio: "11.3",
      dividendYield: "4.8"
    }
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
  const brokers2 = [
    {
      id: "stockbrokers-botswana",
      name: "Stockbrokers Botswana",
      description: "Established in 1989, first broker with research function",
      commission: "2.50"
    },
    {
      id: "imara-capital",
      name: "Imara Capital Securities",
      description: "Part of Capital Group, started operations in March 2000",
      commission: "2.75"
    },
    {
      id: "motswedi-securities",
      name: "Motswedi Securities",
      description: "Citizen-owned company serving individuals and institutions",
      commission: "2.25"
    }
  ];
  for (const brokerData of brokers2) {
    try {
      const existingBroker = await storage.getBrokers();
      const brokerExists = existingBroker.some((b) => b.id === brokerData.id);
      if (!brokerExists) {
      }
    } catch (error) {
      console.error(`Error initializing broker ${brokerData.name}:`, error);
    }
  }
}
async function executeOrder(orderId, executedPrice, executedQuantity) {
  try {
    const order = await storage.getOrder(orderId);
    if (!order) return;
    await storage.updateOrderStatus(orderId, "FILLED", executedPrice, executedQuantity);
    const portfolio = await storage.getUserPortfolio(order.userId);
    if (!portfolio) return;
    if (order.orderType === "BUY") {
      const existingHolding = await storage.getHolding(portfolio.id, order.stockId);
      if (existingHolding) {
        const newQuantity = existingHolding.quantity + executedQuantity;
        const newTotalCost = parseFloat(existingHolding.totalCost) + executedPrice * executedQuantity;
        const newAveragePrice = newTotalCost / newQuantity;
        await storage.updateHolding(portfolio.id, order.stockId, newQuantity, newAveragePrice);
      } else {
        await storage.upsertHolding({
          portfolioId: portfolio.id,
          stockId: order.stockId,
          quantity: executedQuantity,
          averagePrice: executedPrice.toString(),
          totalCost: (executedPrice * executedQuantity).toString()
        });
      }
      const newCashBalance = parseFloat(portfolio.cashBalance) - parseFloat(order.totalCost);
      await storage.updatePortfolioValue(portfolio.id, parseFloat(portfolio.totalValue), parseFloat(portfolio.totalCost));
    } else if (order.orderType === "SELL") {
      const existingHolding = await storage.getHolding(portfolio.id, order.stockId);
      if (existingHolding) {
        const newQuantity = existingHolding.quantity - executedQuantity;
        if (newQuantity > 0) {
          await storage.updateHolding(portfolio.id, order.stockId, newQuantity, parseFloat(existingHolding.averagePrice));
        } else {
        }
      }
      const proceeds = executedPrice * executedQuantity - parseFloat(order.commission);
      const newCashBalance = parseFloat(portfolio.cashBalance) + proceeds;
      await storage.updatePortfolioValue(portfolio.id, parseFloat(portfolio.totalValue), parseFloat(portfolio.totalCost));
    }
  } catch (error) {
    console.error("Error executing order:", error);
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const projectRoot = path.resolve(import.meta.dirname, "..");
  const vite = await createViteServer({
    // Load the real Vite config so aliases/plugins are applied in dev
    root: projectRoot,
    configFile: path.resolve(projectRoot, "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
var app = express2();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await registerRoutes(app);
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2) => {
    console.log("Client connected to trading feed");
    ws2.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "subscribe") {
          ws2.send(JSON.stringify({ type: "subscribed", symbols: message.symbols }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws2.on("close", () => {
      console.log("Client disconnected from trading feed");
    });
  });
  setInterval(async () => {
    try {
      const stocks2 = await storage.getStocks();
      for (const stock of stocks2) {
        const currentPrice = parseFloat(stock.currentPrice);
        const change = (Math.random() - 0.5) * 0.04;
        const newPrice = Math.max(0.01, currentPrice * (1 + change));
        await storage.updateStockPrice(stock.id, newPrice);
        await storage.addPriceHistory(stock.id, newPrice, Math.floor(Math.random() * 1e3));
        const priceUpdate = {
          type: "priceUpdate",
          symbol: stock.symbol,
          price: newPrice,
          change: newPrice - currentPrice,
          changePercent: (newPrice - currentPrice) / currentPrice * 100,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(priceUpdate));
          }
        });
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  }, 5e3);
  app.use((err, _req, res, _next) => {
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
  const port = parseInt(process.env.PORT || "5050", 10);
  httpServer.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
