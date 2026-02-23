document.addEventListener('DOMContentLoaded', async () => {
  const config = await chrome.storage.local.get('global_config');
  const globalConfig = config.global_config || {};

  document.getElementById('fontFamily').value = globalConfig.fontFamily || '';
  document.getElementById('fontSize').value = parseInt(globalConfig.fontSize) || 16;
  document.getElementById('lineHeight').value = parseFloat(globalConfig.lineHeight) || 1.6;
  document.getElementById('fontWeight').value = globalConfig.fontWeight || '';

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
    await chrome.storage.local.set({
      global_config: {
        enabled: true,
        fontFamily: document.getElementById('fontFamily').value,
        fontSize: document.getElementById('fontSize').value + 'px',
        lineHeight: document.getElementById('lineHeight').value,
        fontWeight: document.getElementById('fontWeight').value
      }
    });
    alert('设置已保存');
  });
});
