import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Stock } from "@shared/schema";
import { useState } from "react";

interface StockChartProps {
  stock: Stock;
}

export default function StockChart({ stock }: StockChartProps) {
  const [timeframe, setTimeframe] = useState("1D");

  const { data: priceHistory = [], isLoading } = useQuery({
    queryKey: ["/api/stocks", stock.id, "history"],
    enabled: !!stock.id,
  });

  // Process data for chart
  const chartData = priceHistory.map((item: any) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    price: parseFloat(item.price),
    volume: item.volume,
  })).reverse(); // Reverse to show chronological order

  // Generate mock data if no historical data available
  const mockData = Array.from({ length: 20 }, (_, i) => {
    const basePrice = parseFloat(stock.currentPrice);
    const variation = (Math.random() - 0.5) * 0.1 * basePrice;
    return {
      time: `${10 + Math.floor(i / 4)}:${(i % 4) * 15}`,
      price: Math.max(0.01, basePrice + variation),
      volume: Math.floor(Math.random() * 1000),
    };
  });

  const data = chartData.length > 0 ? chartData : mockData;

  const currentPrice = parseFloat(stock.currentPrice);
  const firstPrice = data[0]?.price || currentPrice;
  const priceChange = currentPrice - firstPrice;
  const isPositive = priceChange >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Price Chart - {stock.symbol}</CardTitle>
          <div className="flex space-x-2">
            {["1D", "1W", "1M", "1Y"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  domain={['dataMin - 0.05', 'dataMax + 0.05']}
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [`BWP ${value.toFixed(3)}`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: isPositive ? "#10B981" : "#EF4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Current: </span>
            <span className="font-semibold">BWP {currentPrice.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Change: </span>
            <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}BWP {priceChange.toFixed(3)} ({((priceChange / firstPrice) * 100).toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
