document.addEventListener('DOMContentLoaded', async () => {
  const domain = await getCurrentDomain();
  const config = await getConfig(domain);

  // 获取当前页面的字体样式
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return {
        fontFamily: style.fontFamily,
        fontSize: parseInt(style.fontSize),
        lineHeight: parseFloat(style.lineHeight) / parseFloat(style.fontSize),
        fontWeight: style.fontWeight
      };
    }
  });

  const pageStyle = result.result;

  document.getElementById('enabled').checked = config.enabled !== false;
  document.getElementById('fontFamily').value = config.fontFamily || '';
  document.getElementById('fontSize').value = parseInt(config.fontSize) || pageStyle.fontSize;
  document.getElementById('lineHeight').value = parseFloat(config.lineHeight) || pageStyle.lineHeight.toFixed(1);
  document.getElementById('fontWeight').value = config.fontWeight || '';

  document.getElementById('fontSizeInc').addEventListener('click', () => {
    const input = document.getElementById('fontSize');
    input.value = parseInt(input.value || 16) + 2;
  });

  document.getElementById('fontSizeDec').addEventListener('click', () => {
    const input = document.getElementById('fontSize');
    input.value = Math.max(10, parseInt(input.value || 16) - 2);
  });

  document.getElementById('lineHeightInc').addEventListener('click', () => {
    const input = document.getElementById('lineHeight');
    input.value = (parseFloat(input.value || 1.6) + 0.2).toFixed(1);
  });

  document.getElementById('lineHeightDec').addEventListener('click', () => {
    const input = document.getElementById('lineHeight');
    input.value = Math.max(1.0, parseFloat(input.value || 1.6) - 0.2).toFixed(1);
  });

  document.getElementById('save').addEventListener('click', async () => {
    const newConfig = {
      enabled: document.getElementById('enabled').checked,
      fontFamily: document.getElementById('fontFamily').value,
      fontSize: document.getElementById('fontSize').value + 'px',
      lineHeight: document.getElementById('lineHeight').value,
      fontWeight: document.getElementById('fontWeight').value
    };

    await chrome.storage.local.set({ [`config_${domain}`]: newConfig });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.reload(tab.id);
    window.close();
  });
});

async function getCurrentDomain() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new URL(tab.url).hostname;
}

async function getConfig(domain) {
  const result = await chrome.storage.local.get(`config_${domain}`);
  return result[`config_${domain}`] || { enabled: true, fontFamily: '', fontSize: '', lineHeight: '', fontWeight: '' };
}
