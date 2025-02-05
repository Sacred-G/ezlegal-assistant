const fs = require('fs');
const path = require('path');

class ToolConfigs {
  constructor() {
    this.configs = new Map();
    this.loadConfigs();
  }

  loadConfigs() {
    const wellKnownPath = path.join(__dirname, '..', '.well-known');
    const files = fs.readdirSync(wellKnownPath);
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const configPath = path.join(wellKnownPath, file);
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          this.configs.set(config.name_for_model, config);
        } catch (error) {
          console.error(`Error loading config from ${file}:`, error);
        }
      }
    });
  }

  getConfig(toolName) {
    return this.configs.get(toolName);
  }

  getApiUrl(toolName) {
    const config = this.configs.get(toolName);
    return config?.api?.url || null;
  }

  getAuthConfig(toolName) {
    const config = this.configs.get(toolName);
    return config?.auth || { type: 'none' };
  }

  getDescription(toolName) {
    const config = this.configs.get(toolName);
    return config?.description_for_model || '';
  }
}

module.exports = new ToolConfigs();
