async function applyFont() {
  const domain = window.location.hostname;
  const result = await chrome.storage.local.get([`config_${domain}`, 'global_config']);
  const config = result[`config_${domain}`] || result['global_config'];

  if (!config || !config.enabled) return;

  const rules = [
    config.fontFamily && `font-family: ${config.fontFamily} !important;`,
    config.fontSize && `font-size: ${config.fontSize} !important;`,
    config.lineHeight && `line-height: ${config.lineHeight} !important;`,
    config.fontWeight && `font-weight: ${config.fontWeight} !important;`
  ].filter(Boolean).join('\n      ');

  if (!rules) return;

  const style = document.createElement('style');
  style.id = 'font-change-style';
  style.textContent = `* { ${rules} }`;

  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  }
}

applyFont();
