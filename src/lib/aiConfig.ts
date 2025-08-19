// AI Configuration for trading assistant
// This file allows you to configure real AI APIs

export interface AIConfig {
  provider: 'openai' | 'claude' | 'mock';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Default configuration (uses mock responses)
export const defaultAIConfig: AIConfig = {
  provider: 'mock',
  temperature: 0.7,
  maxTokens: 1000
};

// Example OpenAI configuration
export const openAIConfig: AIConfig = {
  provider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7
};

// Example Claude configuration
export const claudeConfig: AIConfig = {
  provider: 'claude',
  apiKey: process.env.REACT_APP_CLAUDE_API_KEY || '',
  baseUrl: 'https://api.anthropic.com/v1',
  model: 'claude-3-sonnet-20240229',
  maxTokens: 1000,
  temperature: 0.7
};

// Function to get current AI configuration
export function getAIConfig(): AIConfig {
  const config = localStorage.getItem('ai-config');
  if (config) {
    return JSON.parse(config);
  }
  return defaultAIConfig;
}

// Function to set AI configuration
export function setAIConfig(config: AIConfig): void {
  localStorage.setItem('ai-config', JSON.stringify(config));
}

// Function to reset to default configuration
export function resetAIConfig(): void {
  localStorage.removeItem('ai-config');
} 