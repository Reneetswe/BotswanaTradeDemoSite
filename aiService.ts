// AI Service for trading assistant
// This service can be extended to integrate with real AI APIs like OpenAI, Claude, etc.

export interface AIResponse {
  content: string;
  type: 'analysis' | 'suggestion' | 'education' | 'error';
  confidence?: number;
  sources?: string[];
  actions?: string[];
}

export interface MarketContext {
  portfolioValue: number;
  holdings: Array<{
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    pnl: number;
  }>;
  marketData: Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
  }>;
}

class AIService {
  private apiKey?: string;
  private baseUrl?: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Mock AI responses for demonstration
  private getMockResponse(userMessage: string, context?: MarketContext): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Market analysis
    if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
      return {
        content: `Based on current market data, the BSE is showing mixed signals. LETSHEGO and ABSA are performing well with positive momentum, while some banking stocks are experiencing slight volatility. 

Key observations:
• LETSHEGO: +10% today, strong microfinance growth
• ABSA: +8.33% today, solid banking fundamentals  
• Overall market sentiment: Cautiously optimistic

I recommend monitoring volume patterns and considering defensive positions in utilities if you're risk-averse.`,
        type: 'analysis',
        confidence: 0.85,
        sources: ['BSE Market Data', 'Technical Analysis'],
        actions: ['Monitor volume patterns', 'Consider defensive positions']
      };
    }
    
    // Trading strategies
    if (lowerMessage.includes('strategy') || lowerMessage.includes('trade') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
      return {
        content: `Here are proven trading strategies for the BSE:

**1. Dollar-Cost Averaging**
- Invest fixed amounts regularly to reduce timing risk
- Ideal for long-term investors
- Reduces emotional decision-making

**2. Technical Analysis**
- Use support/resistance levels for entry/exit points
- Monitor moving averages (50-day, 200-day)
- Watch for breakout patterns

**3. Risk Management**
- Never risk more than 2% of your portfolio on a single trade
- Set stop-loss orders for all positions
- Diversify across sectors

**4. Fundamental Analysis**
- Review quarterly earnings reports
- Monitor company debt levels
- Check management quality

Would you like me to analyze specific stocks or help with portfolio allocation?`,
        type: 'education',
        confidence: 0.90,
        sources: ['Trading Best Practices', 'Risk Management Guidelines'],
        actions: ['Set stop-loss orders', 'Review portfolio allocation', 'Analyze specific stocks']
      };
    }
    
    // Portfolio advice
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('holdings') || lowerMessage.includes('investment')) {
      const portfolioValue = context?.portfolioValue || 125000;
      const holdings = context?.holdings || [];
      
      return {
        content: `Your current portfolio analysis:

**Portfolio Value**: BWP ${portfolioValue.toLocaleString()}
**Holdings**: ${holdings.length} different stocks

**Current Performance**:
${holdings.map(h => `• ${h.symbol}: ${h.pnl >= 0 ? '+' : ''}BWP ${h.pnl} (${((h.pnl / (h.avgPrice * h.quantity)) * 100).toFixed(1)}%)`).join('\n')}

**Recommendations**:
• Rebalance if any single position exceeds 20% of your portfolio
• Consider adding defensive stocks for stability
• Monitor sector allocation to avoid over-concentration
• Review stop-loss levels on profitable positions

Would you like a detailed analysis of your current holdings?`,
        type: 'analysis',
        confidence: 0.88,
        sources: ['Portfolio Data', 'Risk Assessment'],
        actions: ['Rebalance portfolio', 'Review stop-loss levels', 'Add defensive positions']
      };
    }
    
    // Stock-specific analysis
    if (lowerMessage.includes('letshego') || lowerMessage.includes('absa') || lowerMessage.includes('chobe')) {
      return {
        content: `**LETSHEGO Holdings Analysis**:

**Current Status**: Strong momentum with 10% gain today
**Price**: BWP 2.75 (+BWP 0.25)

**Key Factors**:
• Strong quarterly earnings growth
• Expanding microfinance portfolio across Africa
• Positive analyst ratings (Buy recommendation)
• Low debt-to-equity ratio

**Technical Indicators**:
• RSI: 65 (neutral, not overbought)
• MACD: Positive momentum
• Volume: Above average

**Recommendation**: 
Technical indicators suggest continued upward movement, but consider taking partial profits if you're up significantly. Always set stop-loss orders to protect gains.

**Risk Level**: Medium
**Target Price**: BWP 3.00`,
        type: 'analysis',
        confidence: 0.82,
        sources: ['Company Reports', 'Technical Analysis', 'Analyst Ratings'],
        actions: ['Set stop-loss at BWP 2.50', 'Consider partial profit taking', 'Monitor volume patterns']
      };
    }
    
    // Risk management
    if (lowerMessage.includes('risk') || lowerMessage.includes('safe') || lowerMessage.includes('protect')) {
      return {
        content: `**Risk Management Strategies**:

**1. Position Sizing**
- Never risk more than 2% of your portfolio on a single trade
- Calculate position size: (Portfolio Value × 0.02) ÷ (Entry Price - Stop Loss)

**2. Stop-Loss Orders**
- Set automatic stop-loss orders for all positions
- Use trailing stops for profitable positions
- Never move stop-loss orders in the wrong direction

**3. Diversification**
- Spread investments across different sectors
- Don't put all your money in one stock
- Consider international diversification

**4. Emotional Control**
- Stick to your trading plan
- Don't chase losses
- Take profits when targets are met

**5. Regular Review**
- Review portfolio monthly
- Rebalance when necessary
- Keep detailed trading journal

Remember: It's better to preserve capital than to chase high returns.`,
        type: 'education',
        confidence: 0.95,
        sources: ['Risk Management Best Practices', 'Trading Psychology'],
        actions: ['Set stop-loss orders', 'Review position sizes', 'Create trading plan']
      };
    }
    
    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('when')) {
      return {
        content: `I'm here to help with all aspects of trading on the Botswana Stock Exchange! Here's what I can assist you with:

**📊 Market Analysis**
- Real-time market trends and insights
- Stock-specific analysis and recommendations
- Technical and fundamental analysis

**💼 Portfolio Management**
- Portfolio performance analysis
- Rebalancing recommendations
- Risk assessment and management

**📈 Trading Strategies**
- Entry and exit strategies
- Risk management techniques
- Position sizing guidance

**🎓 Education**
- Trading basics and advanced concepts
- Market terminology explanations
- Best practices and common mistakes to avoid

**🔍 Research**
- Company analysis and financial health
- Sector trends and opportunities
- Economic factors affecting the market

Just ask me anything specific about trading, and I'll provide detailed, actionable advice!`,
        type: 'education',
        confidence: 0.90,
        sources: ['Trading Education', 'Market Knowledge'],
        actions: ['Ask specific questions', 'Request analysis', 'Get educational content']
      };
    }
    
    // Default response
    return {
      content: `I understand you're asking about trading and the market. I'm here to help with market analysis, trading strategies, portfolio management, and any questions about the Botswana Stock Exchange.

I can assist with:
• Market trends and analysis
• Trading strategies and techniques  
• Portfolio management advice
• Stock-specific research
• Risk management strategies
• Educational content

Could you please provide more details about what specific information or assistance you need?`,
      type: 'education',
      confidence: 0.75,
      sources: ['General Knowledge'],
      actions: ['Ask specific questions', 'Request market analysis', 'Get trading advice']
    };
  }

  // Main method to get AI response
  async getResponse(userMessage: string, context?: MarketContext): Promise<AIResponse> {
    try {
      // If API key is configured, use real AI service
      if (this.apiKey && this.baseUrl) {
        return await this.getRealAIResponse(userMessage, context);
      }
      
      // Otherwise, use mock responses
      return this.getMockResponse(userMessage, context);
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: "I'm sorry, I'm experiencing technical difficulties right now. Please try again in a moment, or contact support if the issue persists.",
        type: 'error',
        confidence: 0
      };
    }
  }

  // Method to integrate with real AI APIs (OpenAI, Claude, etc.)
  private async getRealAIResponse(userMessage: string, context?: MarketContext): Promise<AIResponse> {
    // This is a placeholder for real AI API integration
    // You can implement this with OpenAI, Claude, or other AI services
    
    const prompt = this.buildPrompt(userMessage, context);
    
    // Example OpenAI integration:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading assistant for the Botswana Stock Exchange. Provide helpful, accurate, and actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      type: 'analysis',
      confidence: 0.9
    };
    */
    
    // For now, fall back to mock response
    return this.getMockResponse(userMessage, context);
  }

  private buildPrompt(userMessage: string, context?: MarketContext): string {
    let prompt = `You are an expert trading assistant for the Botswana Stock Exchange (BSE). 
    
User Question: ${userMessage}

Please provide helpful, accurate, and actionable advice. Focus on:
- Market analysis and trends
- Trading strategies and risk management
- Portfolio management advice
- Educational content about trading

`;

    if (context) {
      prompt += `\nContext:\nPortfolio Value: BWP ${context.portfolioValue}\nHoldings: ${context.holdings.length} stocks\n`;
    }

    return prompt;
  }

  // Method to configure AI service with API credentials
  configure(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export for use in components
export default aiService; 