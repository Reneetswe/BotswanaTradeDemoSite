import { useState, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Wallet, 
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Shield,
  ChevronRight,
  Mail,
  BookOpen,
  Calendar,
  MessageCircle,
  Users,
  Bot,
  Key,
  Globe,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import TradingDashboard from "@/components/trading/TradingDashboard";
import OrderBook from "@/components/trading/OrderBook";
import TradePanel from "@/components/trading/TradePanel";
import StockChart from "@/components/trading/StockChart";
import AIAssistantButton from "@/components/ui/ai-assistant-button";
import BrokerModal from "@/components/ui/broker-modal";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();
  
  // Mock data for demonstration
  const portfolioData = {
    totalValue: 125000,
    totalCost: 120000,
    profitLoss: 5000,
    profitLossPercentage: 4.17,
    cashBalance: 15000,
    holdings: [
      { symbol: "LETSHEGO", name: "Letshego Holdings", quantity: 1000, avgPrice: 2.50, currentPrice: 2.75, value: 2750, pnl: 250 },
      { symbol: "ABSA", name: "ABSA Bank Botswana", quantity: 500, avgPrice: 1.80, currentPrice: 1.95, value: 975, pnl: 75 },
      { symbol: "CHOBE", name: "Chobe Holdings", quantity: 200, avgPrice: 3.20, currentPrice: 3.45, value: 690, pnl: 50 },
    ]
  };

  const marketData = [
    { symbol: "LETSHEGO", name: "Letshego Holdings", price: 2.75, change: 0.25, changePercent: 10.00, volume: 150000 },
    { symbol: "ABSA", name: "ABSA Bank Botswana", price: 1.95, change: 0.15, changePercent: 8.33, volume: 89000 },
    { symbol: "CHOBE", name: "Chobe Holdings", price: 3.45, change: 0.25, changePercent: 7.81, volume: 67000 },
    { symbol: "FNBB", name: "First National Bank", price: 4.20, change: -0.10, changePercent: -2.33, volume: 120000 },
    { symbol: "STANBIC", name: "Stanbic Bank", price: 3.80, change: 0.20, changePercent: 5.56, volume: 95000 },
  ];

  const [activeTab, setActiveTab] = useState("overview");
  
  // Market tab state
  const [selectedStock, setSelectedStock] = useState("LETSHEGO");
  const [timeframe, setTimeframe] = useState("1D");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(marketData[0]?.price || 0);
  const [showBrokerModal, setShowBrokerModal] = useState(false);

  // Filtered market data based on search
  const filteredMarketData = useMemo(() => {
    return marketData.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Handle trade execution
  const handleTrade = () => {
    if (!quantity || !price) {
      toast({
        title: "Invalid order",
        description: "Please enter quantity and price",
        variant: "destructive",
      });
      return;
    }

    const totalCost = quantity * price + 2.50;
    
    toast({
      title: `${orderType} Order Submitted`,
      description: `${orderType} ${quantity} shares of ${selectedStock} at BWP ${price}`,
    });

    // Reset form
    setQuantity(0);
    setPrice(0);
  };

  // Set initial price when stock changes
  const handleStockChange = (symbol: string) => {
    setSelectedStock(symbol);
    const stock = marketData.find(s => s.symbol === symbol);
    if (stock) {
      setPrice(stock.price);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    window.location.href = "/auth/login";
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BSE Trading Platform</h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Live Trading
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">BWP {portfolioData.totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{portfolioData.profitLossPercentage}% from cost
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +BWP {portfolioData.profitLoss.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{portfolioData.profitLossPercentage}% return
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">BWP {portfolioData.cashBalance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Available for trading
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Holdings</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{portfolioData.holdings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Different stocks
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Holdings */}
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Current stock positions in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.holdings.map((holding) => (
                    <div key={holding.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{holding.symbol}</h3>
                          <p className="text-sm text-gray-500">{holding.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">BWP {holding.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {holding.quantity} shares @ BWP {holding.avgPrice}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.pnl >= 0 ? '+' : ''}BWP {holding.pnl}
                        </div>
                        <div className="text-sm text-gray-500">
                          BWP {holding.currentPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            {/* Account Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">BWP 125,000.00</div>
                  <p className="text-xs text-muted-foreground">
                    Initial deposit
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Equity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">BWP 127,500.00</div>
                  <p className="text-xs text-muted-foreground">
                    +BWP 2,500.00 (+2.00%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Free Margin</CardTitle>
                  <Wallet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">BWP 85,000.00</div>
                  <p className="text-xs text-muted-foreground">
                    Available for trading
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Margin Level</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">147.06%</div>
                  <p className="text-xs text-muted-foreground">
                    Safe margin level
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Active Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Active Positions</span>
                </CardTitle>
                <CardDescription>Your current open trades and positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Position Item */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">LETSHEGO</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">LETSHEGO Holdings</h3>
                          <p className="text-sm text-gray-500">Buy • 1,000 shares</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Open
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Open Price</p>
                        <p className="font-semibold">BWP 2.50</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Price</p>
                        <p className="font-semibold text-green-600">BWP 2.75</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P&L</p>
                        <p className="font-semibold text-green-600">+BWP 250.00</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P&L %</p>
                        <p className="font-semibold text-green-600">+10.00%</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">Modify</Button>
                      <Button size="sm" variant="outline">Close</Button>
                      <Button size="sm" variant="outline">Add to Watchlist</Button>
                    </div>
                  </div>

                  {/* Another Position */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">ABSA</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">ABSA Bank Botswana</h3>
                          <p className="text-sm text-gray-500">Buy • 500 shares</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Open
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Open Price</p>
                        <p className="font-semibold">BWP 1.80</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Price</p>
                        <p className="font-semibold text-green-600">BWP 1.95</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P&L</p>
                        <p className="font-semibold text-green-600">+BWP 75.00</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P&L %</p>
                        <p className="font-semibold text-green-600">+8.33%</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">Modify</Button>
                      <Button size="sm" variant="outline">Close</Button>
                      <Button size="sm" variant="outline">Add to Watchlist</Button>
                    </div>
                  </div>

                  {/* Loss Position */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold">FNBB</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">First National Bank</h3>
                          <p className="text-sm text-gray-500">Sell • 300 shares</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Open
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Open Price</p>
                        <p className="font-semibold">BWP 4.30</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Price</p>
                        <p className="font-semibold text-red-600">BWP 4.20</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P&L</p>
                        <p className="font-semibold text-green-600">+BWP 30.00</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P&L %</p>
                        <p className="font-semibold text-green-600">+2.33%</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">Modify</Button>
                      <Button size="sm" variant="outline">Close</Button>
                      <Button size="sm" variant="outline">Add to Watchlist</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Dashboard */}
            <TradingDashboard />
          </TabsContent>



          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stock Chart */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Stock Chart</CardTitle>
                        <CardDescription>Real-time price movements</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select 
                          className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800"
                          onChange={(e) => handleStockChange(e.target.value)}
                          value={selectedStock}
                        >
                          {marketData.map((stock) => (
                            <option key={stock.symbol} value={stock.symbol}>
                              {stock.symbol} - {stock.name}
                            </option>
                          ))}
                        </select>
                        <select 
                          className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800"
                          onChange={(e) => setTimeframe(e.target.value)}
                          value={timeframe}
                        >
                          <option value="1D">1 Day</option>
                          <option value="1W">1 Week</option>
                          <option value="1M">1 Month</option>
                          <option value="3M">3 Months</option>
                          <option value="6M">6 Months</option>
                          <option value="1Y">1 Year</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {selectedStock} Chart
                        </h3>
                        <p className="text-sm text-gray-500">
                          {timeframe} Timeframe
                        </p>
                        <div className="mt-4 space-y-2">
                                                  <div className="flex justify-between text-sm">
                          <span>Current Price:</span>
                          <span className="font-semibold">
                            BWP {marketData.find(s => s.symbol === selectedStock)?.price || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Change:</span>
                          <span className={`font-semibold ${
                            (marketData.find(s => s.symbol === selectedStock)?.change || 0) >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {(marketData.find(s => s.symbol === selectedStock)?.change || 0) >= 0 ? '+' : ''}
                            {marketData.find(s => s.symbol === selectedStock)?.change || 0} 
                            ({(marketData.find(s => s.symbol === selectedStock)?.changePercent || 0)}%)
                          </span>
                        </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trading Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Trade {selectedStock}</CardTitle>
                    <CardDescription>Execute buy/sell orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Type */}
                      <div>
                        <Label className="text-sm font-medium">Order Type</Label>
                        <div className="flex space-x-2 mt-2">
                          <Button
                            variant={orderType === 'BUY' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setOrderType('BUY')}
                            className="flex-1"
                          >
                            Buy
                          </Button>
                          <Button
                            variant={orderType === 'SELL' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setOrderType('SELL')}
                            className="flex-1"
                          >
                            Sell
                          </Button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label htmlFor="quantity" className="text-sm font-medium">Quantity (Shares)</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Enter quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium">Price (BWP)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>

                      {/* Total */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Total Value:</span>
                          <span className="font-semibold">BWP {(quantity * price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Commission:</span>
                          <span className="font-semibold">BWP 2.50</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1 font-semibold">
                          <span>Total Cost:</span>
                          <span>BWP {(quantity * price + 2.50).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Execute Button */}
                      <Button 
                        className="w-full" 
                        onClick={handleTrade}
                        disabled={!quantity || !price}
                      >
                        {orderType} {selectedStock}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Market Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Market Overview</CardTitle>
                    <CardDescription>Live BSE market data</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search stocks..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMarketData.map((stock) => (
                    <div 
                      key={stock.symbol} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => handleStockChange(stock.symbol)}
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{stock.symbol}</h3>
                          <p className="text-sm text-gray-500">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">BWP {stock.price}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Volume</div>
                        <div className="font-semibold">{stock.volume.toLocaleString()}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStockChange(stock.symbol);
                        }}
                      >
                        Trade
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            {/* User Account Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">BSE Trading Platform</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Account ID: 95374365</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">- BSE-Demo</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Access Point: AF 1</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Demo
                  </Badge>
                </div>
              </div>
            </div>

            {/* Settings List */}
            <div className="space-y-1">
              {/* Account & Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Account & Information
                  </h3>
                </div>
                
                {/* New Account - Prominent Feature */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowBrokerModal(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">New Account</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Mailbox */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Mailbox</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">You have registered a new account - BSE Trading</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* News */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">News</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Tradays */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Tradays</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Economic calendar</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Community & Trading Tools Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Community & Trading Tools
                  </h3>
                </div>

                {/* Chat and Messages */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Chat and Messages</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sign in to BSE Community!</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Traders Community */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Traders Community</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* AI Trading Assistant */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">AI Trading Assistant</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Application Preferences Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Application Preferences
                  </h3>
                </div>

                {/* OTP */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Key className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">OTP</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">One-time password generator</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Interface */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Interface</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">English</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Charts */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Charts</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Journal */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Journal</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Settings */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* AI Assistant Button */}
      <AIAssistantButton 
        marketContext={{
          portfolioValue: portfolioData.totalValue,
          holdings: portfolioData.holdings.map(h => ({
            symbol: h.symbol,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
            currentPrice: h.currentPrice,
            pnl: h.pnl
          })),
          marketData: marketData
        }}
      />

      {/* Broker Modal */}
      <BrokerModal isOpen={showBrokerModal} onClose={() => setShowBrokerModal(false)} />
    </div>
  );
} 