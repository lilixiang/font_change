// Chrome storage 适配器
const chromeStorage = {
  async get(key) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },
  async set(key, value) {
    await chrome.storage.local.set({ [key]: value });
  }
};

// 应用字体配置
async function applyFont() {
  const domain = window.location.hostname;
  const config = await chromeStorage.get(`config_${domain}`) ||
                 await chromeStorage.get('global_config') ||
                 { enabled: true, fontFamily: 'system-ui, -apple-system, sans-serif' };

  if (!config.enabled) return;

  const style = document.createElement('style');
  style.id = 'font-change-style';
  style.textContent = `
    * {
      font-family: ${config.fontFamily} !important;
      ${config.fontSize ? `font-size: ${config.fontSize} !important;` : ''}
      ${config.lineHeight ? `line-height: ${config.lineHeight} !important;` : ''}
      ${config.fontWeight ? `font-weight: ${config.fontWeight} !important;` : ''}
    }
  `;
  document.head.appendChild(style);
}

applyFont();
