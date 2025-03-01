const { Tool } = require('@langchain/core/tools');
const ToolConfigs = require('./ToolConfigs');
const axios = require('axios');

class CustomTools extends Tool {
  name = 'custom_tools';
  description = 'A collection of custom tools for various operations';

  constructor(fields) {
    super();
  }

  async makeApiRequest(toolName, endpoint, method = 'GET', data = null) {
    const baseUrl = ToolConfigs.getApiUrl(toolName);
    const auth = ToolConfigs.getAuthConfig(toolName);

    if (!baseUrl) {
      throw new Error(`No API URL configured for tool: ${toolName}`);
    }

    const headers = {};
    if (auth.type === 'bearer') {
      headers['Authorization'] = `Bearer ${process.env[auth.authorization_header]}`;
    } else if (auth.type === 'api_key') {
      headers[auth.header_name || 'X-API-Key'] = process.env[auth.env_key];
    }

    try {
      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        headers,
        data
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${toolName}:`, error.message);
      throw new Error(`Failed to execute ${toolName}: ${error.message}`);
    }
  }

  async _call(input, options = {}) {
    const { pluginKey } = options;
    const config = ToolConfigs.getConfig(pluginKey);

    if (!config) {
      throw new Error(`No configuration found for plugin: ${pluginKey}`);
    }

    try {
      switch (pluginKey) {
        case 'pdf-reader':
          return this.handlePDFReader(input, config);
        case 'weather-wizard':
          return this.handleWeather(input, config);
        case 'image-editor':
          return this.handleImageEditor(input, config);
        case 'code-review':
          return this.handleCodeReview(input, config);
        case 'stock-market':
          return this.handleStockMarket(input, config);
        case 'travel-planner':
          return this.handleTravelPlanner(input, config);
        case 'recipe-finder':
          return this.handleRecipeFinder(input, config);
        case 'language-translator':
          return this.handleTranslator(input, config);
        case 'task-manager':
          return this.handleTaskManager(input, config);
        case 'math-solver':
          return this.handleMathSolver(input, config);
        case 'news-aggregator':
          return this.handleNewsAggregator(input, config);
        case 'calendar-assistant':
          return this.handleCalendar(input, config);
        case 'document-creator':
          return this.handleDocumentCreator(input, config);
        case 'web-search-pro':
          return this.handleWebSearch(input, config);
        case 'data-analyzer':
          return this.handleDataAnalyzer(input, config);
        case 'email-assistant':
          return this.handleEmailAssistant(input, config);
        case 'social-media-manager':
          return this.handleSocialMedia(input, config);
        case 'file-converter':
          return this.handleFileConverter(input, config);
        case 'research-assistant':
          return this.handleResearch(input, config);
        case 'seo-analyzer':
          return this.handleSEO(input, config);
        case 'password-generator':
          return this.handlePasswordGenerator(input, config);
        case 'voice-assistant':
          return this.handleVoiceAssistant(input, config);
        case 'code-generator':
          return this.handleCodeGenerator(input, config);
        case 'diagram-creator':
          return this.handleDiagramCreator(input, config);
        case 'resume-builder':
          return this.handleResumeBuilder(input, config);
        default:
          throw new Error('Unknown plugin key');
      }
    } catch (error) {
      console.error(`Error in ${pluginKey}:`, error);
      throw error;
    }
  }

  // Individual handlers for each tool
  async handlePDFReader(input, config) {
    return await this.makeApiRequest('pdf-reader', '/analyze', 'POST', { document: input });
  }

  async handleWeather(input, config) {
    return await this.makeApiRequest('weather-wizard', `/forecast?location=${encodeURIComponent(input)}`);
  }

  async handleImageEditor(input, config) {
    return await this.makeApiRequest('image-editor', '/edit', 'POST', { image: input });
  }

  async handleCodeReview(input, config) {
    return await this.makeApiRequest('code-review', '/analyze', 'POST', { code: input });
  }

  async handleStockMarket(input, config) {
    return await this.makeApiRequest('stock-market', `/quote/${encodeURIComponent(input)}`);
  }

  async handleTravelPlanner(input, config) {
    return await this.makeApiRequest('travel-planner', '/plan', 'POST', { query: input });
  }

  async handleRecipeFinder(input, config) {
    return await this.makeApiRequest('recipe-finder', '/search', 'GET', { q: input });
  }

  async handleTranslator(input, config) {
    return await this.makeApiRequest('language-translator', '/translate', 'POST', { text: input });
  }

  async handleTaskManager(input, config) {
    return await this.makeApiRequest('task-manager', '/tasks', 'POST', { task: input });
  }

  async handleMathSolver(input, config) {
    return await this.makeApiRequest('math-solver', '/solve', 'POST', { problem: input });
  }

  async handleNewsAggregator(input, config) {
    return await this.makeApiRequest('news-aggregator', '/news', 'GET', { topic: input });
  }

  async handleCalendar(input, config) {
    return await this.makeApiRequest('calendar-assistant', '/events', 'POST', { event: input });
  }

  async handleDocumentCreator(input, config) {
    return await this.makeApiRequest('document-creator', '/create', 'POST', { content: input });
  }

  async handleWebSearch(input, config) {
    return await this.makeApiRequest('web-search-pro', '/search', 'GET', { q: input });
  }

  async handleDataAnalyzer(input, config) {
    return await this.makeApiRequest('data-analyzer', '/analyze', 'POST', { data: input });
  }

  async handleEmailAssistant(input, config) {
    return await this.makeApiRequest('email-assistant', '/compose', 'POST', { content: input });
  }

  async handleSocialMedia(input, config) {
    return await this.makeApiRequest('social-media-manager', '/post', 'POST', { content: input });
  }

  async handleFileConverter(input, config) {
    return await this.makeApiRequest('file-converter', '/convert', 'POST', { file: input });
  }

  async handleResearch(input, config) {
    return await this.makeApiRequest('research-assistant', '/search', 'GET', { query: input });
  }

  async handleSEO(input, config) {
    return await this.makeApiRequest('seo-analyzer', '/analyze', 'POST', { url: input });
  }

  async handlePasswordGenerator(input, config) {
    return await this.makeApiRequest('password-generator', '/generate', 'POST', { requirements: input });
  }

  async handleVoiceAssistant(input, config) {
    return await this.makeApiRequest('voice-assistant', '/process', 'POST', { audio: input });
  }

  async handleCodeGenerator(input, config) {
    return await this.makeApiRequest('code-generator', '/generate', 'POST', { prompt: input });
  }

  async handleDiagramCreator(input, config) {
    return await this.makeApiRequest('diagram-creator', '/create', 'POST', { description: input });
  }

  async handleResumeBuilder(input, config) {
    return await this.makeApiRequest('resume-builder', '/create', 'POST', { details: input });
  }
}

module.exports = CustomTools;
