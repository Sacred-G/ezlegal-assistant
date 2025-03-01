class ToolConfigs {
  static getApiUrl(toolName) {
    // This would typically be loaded from environment variables or a config file
    return process.env[`${toolName.toUpperCase()}_API_URL`];
  }

  static getAuthConfig(toolName) {
    // This would typically be loaded from environment variables or a config file
    const authType = process.env[`${toolName.toUpperCase()}_AUTH_TYPE`];
    if (authType === 'bearer') {
      return {
        type: 'bearer',
        authorization_header: `${toolName.toUpperCase()}_AUTH_TOKEN`
      };
    } else if (authType === 'api_key') {
      return {
        type: 'api_key',
        header_name: process.env[`${toolName.toUpperCase()}_API_KEY_HEADER`],
        env_key: `${toolName.toUpperCase()}_API_KEY`
      };
    }
    return {};
  }

  static getConfig(pluginKey) {
    // This would typically be loaded from a configuration file
    return {
      enabled: true,
      config: {}
    };
  }
}

module.exports = ToolConfigs;
