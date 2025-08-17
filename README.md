# 🇧🇼 Botswana Trading Platform

A comprehensive trading platform for the Botswana Stock Exchange (BSE) with real-time market data, AI-powered trading assistance, and broker integration.

## 🚀 Features

### 📊 Trading Dashboard
- **Real-time Market Data**: Live BSE stock prices and market information
- **Active Positions**: Track your open trades with P&L calculations
- **Account Metrics**: Balance, Equity, Free Margin, and Margin Level monitoring
- **Interactive Charts**: Technical analysis with multiple timeframes

### 🤖 AI Trading Assistant
- **Smart Chat Interface**: Natural language trading advice
- **Market Analysis**: AI-powered market insights and trends
- **Portfolio Management**: Personalized investment recommendations
- **Risk Assessment**: Intelligent risk management strategies

### 🏦 Broker Integration
- **Multi-Broker Support**: Connect to ABSA, FNB, Stanbic, and other BSE brokers
- **Secure Authentication**: Encrypted credential transmission
- **Account Management**: Easy broker account setup and management
- **Real Trading**: Execute actual trades through connected brokers

### ⚙️ Advanced Settings
- **Mobile-Style Interface**: Clean, intuitive settings management
- **Trading Preferences**: Customizable order types and risk levels
- **Notification System**: Price alerts and trade confirmations
- **Security Features**: OTP generation and account protection

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Authentication**: Custom auth system with session management
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI/Claude API ready
- **Deployment**: Vite + Express.js

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Reneetswe/botswana-trading-platform.git
   cd botswana-trading-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

1.GitHub

## 📱 Usage

### For Traders
1. **Register/Login**: Create your trading account
2. **Connect Broker**: Add your BSE broker account
3. **Start Trading**: Use the intuitive trading interface
4. **AI Assistance**: Get trading advice from the AI assistant
5. **Monitor Positions**: Track your portfolio performance

### For Developers
1. **Fork Repository**: Create your own copy
2. **Customize**: Modify for your specific needs
3. **Deploy**: Use your preferred hosting platform
4. **Contribute**: Submit pull requests for improvements

## 🔧 Configuration

### AI Assistant Setup
```typescript
// Configure AI service in src/lib/aiConfig.ts
import { setAIConfig, openAIConfig } from '@/lib/aiConfig';

setAIConfig({
  ...openAIConfig,
  apiKey: 'your-openai-api-key'
});
```

### Broker Integration
```typescript
// Add new brokers in src/components/ui/broker-modal.tsx
const availableBrokers: Broker[] = [
  // Add your broker here
];
```

## 📊 Supported Stocks

- **LETSHEGO**: Letshego Holdings Limited
- **ABSA**: ABSA Bank Botswana
- **FNBB**: First National Bank Botswana
- **STANBIC**: Stanbic Bank Botswana
- **CHOBE**: Chobe Holdings Limited

## 🔒 Security Features

- **Encrypted Storage**: All sensitive data is encrypted
- **Session Management**: Secure user sessions
- **API Protection**: Rate limiting and authentication
- **Broker Security**: Secure credential transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BSE**: Botswana Stock Exchange for market data
- **shadcn/ui**: Beautiful UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Community**: Amazing ecosystem and tools

## 📞 Support

- **Email**: support@botswanatrading.com
- **GitHub Issues**: [Report bugs here](https://github.com/Reneetswe/botswana-trading-platform/issues)
- **Documentation**: [Full documentation](https://docs.botswanatrading.com)

## 🚀 Roadmap

- [ ] Mobile app development
- [ ] Advanced charting tools
- [ ] Social trading features
- [ ] Multi-language support
- [ ] Advanced AI features
- [ ] Real-time news integration

---

**Built with ❤️ for the Botswana trading community** 