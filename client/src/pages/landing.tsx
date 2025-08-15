import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Globe, BarChart3 } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    // Show authentication options
    window.location.href = "/auth/register";
  };

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BSE Trading Platform</h1>
          </div>
          <Button onClick={handleLogin} size="lg">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Trade on the <span className="text-blue-600">Botswana Stock Exchange</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
           Connect with registered brokers, 
          manage your portfolio, and trade BSE-listed companies digitally.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
          <Button onClick={handleLogin} variant="outline" size="lg">
            Sign In
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Our Platform?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Real-Time Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Live BSE market data with real-time price updates and professional charts
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Secure & Licensed</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connected to licensed BSE brokers: Stockbrokers Botswana, Imara Capital, Motswedi Securities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Local Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Trade in BWP with Botswana companies like Letshego, ABSA, Chobe, and more
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your investments, P&L, and portfolio performance in real-time
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Market Stats */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            BSE Market Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">BWP 654B</div>
              <div className="text-gray-600 dark:text-gray-300">Market Capitalization</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">30+</div>
              <div className="text-gray-600 dark:text-gray-300">Listed Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600 dark:text-gray-300">Licensed Brokers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">+3.77%</div>
              <div className="text-gray-600 dark:text-gray-300">BSE DCI YTD</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Start Trading?
        </h3>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Join thousands of Batswana investors trading on the BSE
        </p>
        <Button onClick={handleGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700">
          Create Your Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 BSE Trading Platform. Built for Botswana investors.</p>
        </div>
      </footer>
    </div>
  );
}
