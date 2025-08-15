import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, MessageCircle } from "lucide-react";
import AIAssistant from "./ai-assistant";
import { MarketContext } from "@/lib/aiService";

interface AIAssistantButtonProps {
  marketContext?: MarketContext;
}

export default function AIAssistantButton({ marketContext }: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full h-16 w-16 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            <div className="relative">
              <Bot className="h-6 w-6" />
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-green-500 text-white text-xs flex items-center justify-center"
              >
                <Sparkles className="h-3 w-3" />
              </Badge>
            </div>
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>AI Trading Assistant</span>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

             <AIAssistant isOpen={isOpen} onClose={() => setIsOpen(false)} marketContext={marketContext} />
    </>
  );
} 