document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = new URL(tab.url).hostname;
  const config = await getConfig(domain);

  let pageStyle = { fontSize: 16, lineHeight: 1.6 };
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const style = window.getComputedStyle(document.body);
        return {
          fontSize: parseInt(style.fontSize),
          lineHeight: (parseFloat(style.lineHeight) / parseFloat(style.fontSize)).toFixed(1)
        };
      }
    });
    if (result.result) pageStyle = result.result;
  } catch (e) { /* chrome://, edge:// 等特殊页面无法注入 */ }

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
    chrome.tabs.reload(tab.id);
    window.close();
  });
});

async function getConfig(domain) {
  const result = await chrome.storage.local.get(`config_${domain}`);
  return result[`config_${domain}`] || { enabled: true, fontFamily: '', fontSize: '', lineHeight: '', fontWeight: '' };
}
