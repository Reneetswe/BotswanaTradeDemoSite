import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Search, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Broker {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  features: string[];
  website: string;
  supported: boolean;
}

interface BrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableBrokers: Broker[] = [
  {
    id: "absa",
    name: "ABSA Securities",
    logo: "AB",
    description: "Leading securities firm in Botswana with comprehensive trading services",
    rating: 4.8,
    features: ["Real-time trading", "Research reports", "Mobile app", "24/7 support"],
    website: "https://www.absa.co.bw",
    supported: true
  },
  {
    id: "fnbb",
    name: "First National Bank Securities",
    logo: "FN",
    description: "Trusted banking and securities services with extensive market coverage",
    rating: 4.6,
    features: ["Online trading", "Market analysis", "Portfolio management"],
    website: "https://www.fnbbotswana.co.bw",
    supported: true
  },
  {
    id: "stanbic",
    name: "Stanbic Bank Securities",
    logo: "SB",
    description: "International banking group with local expertise in Botswana markets",
    rating: 4.5,
    features: ["Global markets access", "Expert advisors", "Advanced tools"],
    website: "https://www.stanbicbank.co.bw",
    supported: true
  },
  {
    id: "stockbrokers",
    name: "Stockbrokers Botswana",
    logo: "SB",
    description: "Specialized stockbroking services with deep market knowledge",
    rating: 4.7,
    features: ["Specialized research", "Personal service", "Competitive rates"],
    website: "https://www.stockbrokers.co.bw",
    supported: false
  }
];

export default function BrokerModal({ isOpen, onClose }: BrokerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'select' | 'connect'>('select');
  const { toast } = useToast();

  const filteredBrokers = availableBrokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setConnectionStep('connect');
  };

  const handleConnect = async () => {
    if (!selectedBroker) return;

    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Account Connected",
      description: `Successfully connected to ${selectedBroker.name}`,
    });

    setIsConnecting(false);
    onClose();
    setConnectionStep('select');
    setSelectedBroker(null);
  };

  const handleBack = () => {
    setConnectionStep('select');
    setSelectedBroker(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">
            {connectionStep === 'select' ? 'Connect Broker Account' : 'Connect to Broker'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {connectionStep === 'select' ? (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for brokers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Broker List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredBrokers.map((broker) => (
                  <div
                    key={broker.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleBrokerSelect(broker)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{broker.logo}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{broker.name}</h3>
                            {broker.supported ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Supported
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{broker.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500">Rating:</span>
                              <span className="text-sm font-medium">{broker.rating}/5</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500">Features:</span>
                              <span className="text-sm font-medium">{broker.features.length}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {broker.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {broker.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{broker.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(broker.website, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </Button>
                        {broker.supported && (
                          <Button size="sm">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Connection Form */}
              {selectedBroker && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{selectedBroker.logo}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedBroker.name}</h3>
                      <p className="text-sm text-gray-600">{selectedBroker.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="Enter your broker account number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Enter your broker username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter your broker password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key (Optional)</Label>
                      <Input id="apiKey" placeholder="Enter API key if available" />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Secure Connection</p>
                        <p>Your credentials are encrypted and securely transmitted to your broker. We never store your passwords.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handleConnect} 
                      disabled={isConnecting}
                      className="flex-1"
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Connect Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 