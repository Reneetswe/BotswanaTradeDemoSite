import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Stock } from "@shared/schema";

interface TradePanelProps {
  stock: Stock;
  broker: string;
  portfolio: any;
}

export default function TradePanel({ stock, broker, portfolio }: TradePanelProps) {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState("100");
  const [price, setPrice] = useState(stock.currentPrice);
  const [orderStyle, setOrderStyle] = useState("MARKET");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const placeMutation = useMutation({
    mutationFn: async (orderData: any) => {
      await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: `${orderType} order for ${quantity} shares of ${stock.symbol} placed successfully`,
      });
      
      // Reset form
      setQuantity("100");
      setPrice(stock.currentPrice);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!broker) {
      toast({
        title: "Broker Required",
        description: "Please select a broker before placing an order",
        variant: "destructive",
      });
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      stockId: stock.id,
      broker,
      orderType,
      orderStyle,
      quantity: parseInt(quantity),
      price: orderStyle === "MARKET" ? undefined : price,
    };

    placeMutation.mutate(orderData);
  };

  const estimatedCost = parseInt(quantity || "0") * parseFloat(price) + 2.50; // Including commission
  const canAfford = portfolio && parseFloat(portfolio.cashBalance) >= estimatedCost;
  
  // Get current holding for this stock
  const currentHolding = portfolio?.holdings?.find((h: any) => h.stock.id === stock.id);
  const canSell = currentHolding && currentHolding.quantity >= parseInt(quantity || "0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buy/Sell Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={orderType === "BUY" ? "default" : "outline"}
              onClick={() => setOrderType("BUY")}
              className={orderType === "BUY" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Buy
            </Button>
            <Button
              type="button"
              variant={orderType === "SELL" ? "default" : "outline"}
              onClick={() => setOrderType("SELL")}
              className={orderType === "SELL" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Sell
            </Button>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              placeholder="Enter quantity"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (BWP)</Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={orderStyle === "MARKET"}
              placeholder="Enter price"
            />
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select value={orderStyle} onValueChange={setOrderStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MARKET">Market Order</SelectItem>
                <SelectItem value="LIMIT">Limit Order</SelectItem>
                <SelectItem value="STOP_LOSS">Stop Loss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated Cost:</span>
              <span className="font-medium">BWP {estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Commission:</span>
              <span className="font-medium">BWP 2.50</span>
            </div>
            {portfolio && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Cash Balance:</span>
                <span className="font-medium">BWP {parseFloat(portfolio.cashBalance).toFixed(2)}</span>
              </div>
            )}
            {currentHolding && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Holdings:</span>
                <span className="font-medium">{currentHolding.quantity} shares</span>
              </div>
            )}
          </div>

          {/* Validation Messages */}
          {orderType === "BUY" && !canAfford && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Insufficient funds for this order
            </div>
          )}
          
          {orderType === "SELL" && !canSell && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Insufficient shares for this order
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              placeMutation.isPending ||
              !broker ||
              (orderType === "BUY" && !canAfford) ||
              (orderType === "SELL" && !canSell)
            }
          >
            {placeMutation.isPending ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
