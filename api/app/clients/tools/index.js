const availableTools = require('./manifest.json');
const additionalTools = require('./manifest-additions.json');

// Structured Tools
const DALLE3 = require('./structured/DALLE3');
const OpenWeather = require('./structured/OpenWeather');
const createYouTubeTools = require('./structured/YouTube');
const StructuredWolfram = require('./structured/Wolfram');
const StructuredACS = require('./structured/AzureAISearch');
const StructuredSD = require('./structured/StableDiffusion');
const GoogleSearchAPI = require('./structured/GoogleSearch');
const TraversaalSearch = require('./structured/TraversaalSearch');
const TavilySearchResults = require('./structured/TavilySearchResults');
const CustomTools = require('./structured/CustomTools');

/** @type {Record<string, TPlugin | undefined>} */
const manifestToolMap = {};

/** @type {Array<TPlugin>} */
const toolkits = [];

// Combine base tools with additional tools
const allTools = [...availableTools, ...additionalTools];

allTools.forEach((tool) => {
  manifestToolMap[tool.pluginKey] = tool;
  if (tool.toolkit === true) {
    toolkits.push(tool);
  }
});

module.exports = {
  toolkits,
  availableTools: allTools,
  manifestToolMap,
  // Structured Tools
  DALLE3,
  OpenWeather,
  StructuredSD,
  StructuredACS,
  GoogleSearchAPI,
  TraversaalSearch,
  StructuredWolfram,
  createYouTubeTools,
  TavilySearchResults,
  CustomTools,
};
