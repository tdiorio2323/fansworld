const fs = require('fs');
const path = require('path');

class V0Client {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://v0.dev/api';
  }

  async generateComponent(prompt, options = {}) {
    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        framework: 'react',
        language: 'typescript',
        styling: 'tailwind',
        ...options
      })
    });

    if (!response.ok) {
      throw new Error(`v0 API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async saveComponent(componentData, filename) {
    const componentPath = path.join(__dirname, '../../src/components/v0', filename);
    
    // Ensure directory exists
    const dir = path.dirname(componentPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save component
    fs.writeFileSync(componentPath, componentData.code);
    console.log(`✅ Component saved to: ${componentPath}`);
    
    return componentPath;
  }
}

module.exports = V0Client;
