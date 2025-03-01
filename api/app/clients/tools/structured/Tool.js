class Tool {
  constructor() {
    this.name = '';
    this.description = '';
    this.icon = '';
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getIcon() {
    return this.icon;
  }
}

module.exports = Tool;
