# AI Trading Assistant Setup Guide

## Overview

The AI Trading Assistant is a powerful feature that provides users with intelligent trading advice, market analysis, and educational content about the Botswana Stock Exchange (BSE). The assistant can help with:

- **Market Analysis**: Real-time market trends and insights
- **Trading Strategies**: Entry/exit strategies and risk management
- **Portfolio Management**: Performance analysis and rebalancing recommendations
- **Educational Content**: Trading basics and advanced concepts
- **Stock Research**: Company analysis and financial health

## Features

### 🤖 Smart Chat Interface
- Natural language conversation with the AI
- Quick question buttons for common queries
- Real-time responses with typing indicators
- Message history and timestamps

### 📊 Context-Aware Responses
- Access to user's portfolio data
- Market data integration
- Personalized recommendations based on holdings
- Risk assessment based on current positions

### 🎯 Quick Actions
- Market trends analysis
- Trading strategy recommendations
- Portfolio analysis
- Risk management tips

## Current Implementation

The AI assistant currently uses **mock responses** that provide realistic trading advice based on:
- Current market data from your application
- User's portfolio holdings
- Common trading scenarios and questions

## Setting Up Real AI Integration

### Option 1: OpenAI Integration

1. **Get an OpenAI API Key**:
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your dashboard
   - Add it to your environment variables

2. **Configure the AI Service**:
   ```typescript
   import { setAIConfig, openAIConfig } from '@/lib/aiConfig';
   
   // Set up OpenAI configuration
   setAIConfig({
     ...openAIConfig,
     apiKey: 'your-openai-api-key-here'
   });
   ```

3. **Environment Variables**:
   Create a `.env` file in your project root:
   ```
   REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
   ```

### Option 2: Claude Integration

1. **Get an Anthropic API Key**:
   - Sign up at [Anthropic](https://console.anthropic.com/)
   - Create an API key
   - Add it to your environment variables

2. **Configure the AI Service**:
   ```typescript
   import { setAIConfig, claudeConfig } from '@/lib/aiConfig';
   
   // Set up Claude configuration
   setAIConfig({
     ...claudeConfig,
     apiKey: 'your-claude-api-key-here'
   });
   ```

3. **Environment Variables**:
   ```
   REACT_APP_CLAUDE_API_KEY=your-claude-api-key-here
   ```

## Usage

### For Users

1. **Access the AI Assistant**:
   - Click the floating AI button (bottom-right corner)
   - The chat interface will open

2. **Ask Questions**:
   - Type your question in natural language
   - Use quick question buttons for common topics
   - Press Enter or click Send

3. **Example Questions**:
   - "What are today's market trends?"
   - "Should I buy LETSHEGO stock?"
   - "How can I manage my portfolio risk?"
   - "What's the best trading strategy for beginners?"

### For Developers

1. **Customize Responses**:
   Edit `client/src/lib/aiService.ts` to modify mock responses or add new patterns.

2. **Add New AI Providers**:
   - Implement new provider in `getRealAIResponse` method
   - Add configuration options in `aiConfig.ts`

3. **Extend Market Context**:
   Modify the `MarketContext` interface to include additional data.

## File Structure

```
client/src/
├── components/ui/
│   ├── ai-assistant.tsx          # Main chat interface
│   └── ai-assistant-button.tsx   # Floating action button
├── lib/
│   ├── aiService.ts              # AI service logic
│   └── aiConfig.ts               # Configuration management
└── pages/
    └── dashboard.tsx             # Integration point
```

## Customization

### Adding New Response Patterns

In `aiService.ts`, add new conditions to the `getMockResponse` method:

```typescript
// Add new pattern matching
if (lowerMessage.includes('your-keyword')) {
  return {
    content: "Your custom response here...",
    type: 'analysis',
    confidence: 0.85,
    sources: ['Your Source'],
    actions: ['Action 1', 'Action 2']
  };
}
```

### Styling Customization

The AI assistant uses Tailwind CSS classes. You can customize:
- Colors: Modify the gradient classes in the button
- Size: Adjust the `max-w-2xl` and `h-[600px]` classes
- Position: Change the `bottom-6 right-6` positioning

### Adding New Quick Questions

In `ai-assistant.tsx`, modify the `quickQuestions` array:

```typescript
const quickQuestions = [
  "Market trends today?",
  "Best trading strategy?",
  "Portfolio analysis",
  "Risk management tips",
  "Your new question here"
];
```

## Security Considerations

1. **API Key Protection**:
   - Never commit API keys to version control
   - Use environment variables
   - Consider server-side proxy for production

2. **Rate Limiting**:
   - Implement rate limiting for AI requests
   - Add request throttling to prevent abuse

3. **Data Privacy**:
   - Be mindful of what data is sent to AI services
   - Consider data anonymization for sensitive information

## Troubleshooting

### Common Issues

1. **AI Assistant Not Opening**:
   - Check if the component is properly imported
   - Verify the button is rendered in the dashboard

2. **No Responses**:
   - Check browser console for errors
   - Verify the AI service is properly configured

3. **Slow Responses**:
   - Mock responses have artificial delays
   - Real AI APIs may have varying response times

### Debug Mode

Enable debug logging by adding to `aiService.ts`:

```typescript
console.log('AI Request:', userMessage);
console.log('AI Response:', response);
```

## Future Enhancements

1. **Voice Integration**: Add speech-to-text and text-to-speech
2. **Image Analysis**: Analyze charts and graphs
3. **Predictive Analytics**: Stock price predictions
4. **Sentiment Analysis**: Market sentiment from news
5. **Multi-language Support**: Support for different languages
6. **Advanced Context**: More detailed market and portfolio data

## Support

For issues or questions about the AI assistant:
1. Check the browser console for errors
2. Review the configuration settings
3. Test with different questions to isolate issues
4. Consider the current implementation limitations

---

**Note**: The current implementation uses mock responses for demonstration. For production use, integrate with a real AI service for more accurate and dynamic responses. 