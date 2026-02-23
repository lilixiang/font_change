// ==UserScript==
// @name         Font Change
// @namespace    http://tampermonkey.net/
// @version      2.1.3
// @description  自定义网页字体样式
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const domain = window.location.hostname;
    let fontStyleElement = null;

    // 获取当前页面的字体样式
    function getPageStyle() {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return {
            fontFamily: style.fontFamily,
            fontSize: parseInt(style.fontSize),
            lineHeight: (parseFloat(style.lineHeight) / parseFloat(style.fontSize)).toFixed(1),
            fontWeight: style.fontWeight
        };
    }

    // 应用字体样式
    function applyFont(config) {
        if (fontStyleElement) {
            fontStyleElement.remove();
        }

        if (!config.enabled) return;

        fontStyleElement = document.createElement('style');
        fontStyleElement.textContent = `
            *:not(#font-change-panel):not(#font-change-panel *) {
                ${config.fontFamily ? `font-family: ${config.fontFamily} !important;` : ''}
                ${config.fontSize ? `font-size: ${config.fontSize} !important;` : ''}
                ${config.lineHeight ? `line-height: ${config.lineHeight} !important;` : ''}
                ${config.fontWeight ? `font-weight: ${config.fontWeight} !important;` : ''}
            }
        `;
        document.head.appendChild(fontStyleElement);
    }

    // 初始应用配置
    const config = GM_getValue(`config_${domain}`) || GM_getValue('global_config') || { enabled: false };
    if (config.enabled) {
        applyFont(config);
    }

    // 创建设置面板
    function createSettingsPanel() {
        const pageStyle = getPageStyle();
        const currentConfig = GM_getValue(`config_${domain}`) || {};

        const panel = document.createElement('div');
        panel.id = 'font-change-panel';
        panel.innerHTML = `
            <style>
                #font-change-panel { position: fixed; bottom: 120px; right: 20px; width: 220px; background: #f9fafb; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; transform-origin: bottom right; animation: fc-popup 0.2s ease-out; }
                @keyframes fc-popup { from { opacity: 0; transform: scale(0.8) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                #font-change-panel * { box-sizing: border-box; }
                #font-change-panel .fc-container { padding: 16px; }
                .fc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
                .fc-title { font-size: 14px; font-weight: 600; color: #111827; }
                .fc-close { width: 24px; height: 24px; border: none; background: none; color: #6b7280; cursor: pointer; font-size: 20px; line-height: 1; }
                .fc-close:hover { color: #111827; }
                .fc-toggle-switch { position: relative; width: 36px; height: 20px; }
                .fc-toggle-switch input { opacity: 0; width: 0; height: 0; }
                .fc-slider { position: absolute; cursor: pointer; inset: 0; background: #d1d5db; border-radius: 20px; transition: 0.3s; }
                .fc-slider:before { content: ''; position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
                .fc-toggle-switch input:checked + .fc-slider { background: #3b82f6; }
                .fc-toggle-switch input:checked + .fc-slider:before { transform: translateX(16px); }
                .fc-form-group { display: flex; align-items: center; margin-bottom: 14px; gap: 10px; min-width: 0; }
                .fc-label { font-size: 12px; font-weight: 500; color: #374151; margin: 0; white-space: nowrap; width: 36px; text-align: right; flex-shrink: 0; }
                .fc-select { flex: 1; min-width: 0; padding: 2px 4px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; color: #111827; background: white; cursor: pointer; overflow: hidden; text-overflow: ellipsis; }
                .fc-control { display: flex; gap: 6px; align-items: center; flex: 1; min-width: 0; }
                .fc-control button { border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; font-size: 12px; font-weight: 500; cursor: pointer; flex-shrink: 0; padding: 2px 6px; }
                .fc-control button:hover { background: #f3f4f6; }
                .fc-control input { flex: 1; min-width: 0; padding: 2px 4px; border: 1px solid #d1d5db; border-radius: 6px; text-align: center; font-size: 12px; color: #111827; }
                .fc-btn-primary { width: 100%; padding: 8px; margin-top: 4px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; text-align: center; }
            </style>
            <div class="fc-container">
                <div class="fc-header">
                    <span class="fc-title">字体设置</span>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <label class="fc-toggle-switch">
                            <input type="checkbox" id="fc-enabled" ${currentConfig.enabled !== false ? 'checked' : ''}>
                            <span class="fc-slider"></span>
                        </label>
                        <button class="fc-close" id="fc-close">×</button>
                    </div>
                </div>
                <div class="fc-form-group">
                    <label class="fc-label">字体</label>
                    <select class="fc-select" id="fc-fontFamily">
                        <option value="">默认</option>
                        <option value="system-ui, -apple-system, sans-serif">系统默认</option>
                        <option value="'Songti SC', 'STSong', serif">宋体</option>
                        <option value="'Heiti SC', 'STHeiti', sans-serif">黑体</option>
                        <option value="'Kaiti SC', 'STKaiti', serif">楷体</option>
                        <option value="'PingFang SC', 'Microsoft YaHei', sans-serif">苹方/微软雅黑</option>
                        <option value="'Source Han Serif SC', 'Noto Serif CJK SC', serif">思源宋体</option>
                        <option value="'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif">思源黑体</option>
                        <option value="'LXGW WenKai', 'STKaiti', serif">霞鹜文楷</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Arial, sans-serif">Arial</option>
                    </select>
                </div>
                <div class="fc-form-group">
                    <label class="fc-label">字号</label>
                    <div class="fc-control">
                        <button type="button" id="fc-fontSizeDec">-</button>
                        <input type="number" id="fc-fontSize" value="${currentConfig.fontSize ? parseInt(currentConfig.fontSize) : pageStyle.fontSize}" step="1">
                        <button type="button" id="fc-fontSizeInc">+</button>
                    </div>
                </div>
                <div class="fc-form-group">
                    <label class="fc-label">行高</label>
                    <div class="fc-control">
                        <button type="button" id="fc-lineHeightDec">-</button>
                        <input type="number" id="fc-lineHeight" value="${currentConfig.lineHeight || pageStyle.lineHeight}" step="0.1">
                        <button type="button" id="fc-lineHeightInc">+</button>
                    </div>
                </div>
                <div class="fc-form-group">
                    <label class="fc-label">字重</label>
                    <select class="fc-select" id="fc-fontWeight">
                        <option value="">默认</option>
                        <option value="300">细 (300)</option>
                        <option value="400">正常 (400)</option>
                        <option value="500">中等 (500)</option>
                        <option value="600">半粗 (600)</option>
                        <option value="700">粗 (700)</option>
                    </select>
                </div>
                <button class="fc-btn-primary" id="fc-save">保存并应用</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 设置当前值
        if (currentConfig.fontFamily) {
            panel.querySelector('#fc-fontFamily').value = currentConfig.fontFamily;
        }
        if (currentConfig.fontWeight) {
            panel.querySelector('#fc-fontWeight').value = currentConfig.fontWeight;
        }

        // 关闭按钮
        panel.querySelector('#fc-close').onclick = () => panel.remove();

        // 加减按钮
        panel.querySelector('#fc-fontSizeInc').onclick = () => {
            const input = panel.querySelector('#fc-fontSize');
            input.value = parseInt(input.value || 16) + 2;
        };
        panel.querySelector('#fc-fontSizeDec').onclick = () => {
            const input = panel.querySelector('#fc-fontSize');
            input.value = Math.max(10, parseInt(input.value || 16) - 2);
        };
        panel.querySelector('#fc-lineHeightInc').onclick = () => {
            const input = panel.querySelector('#fc-lineHeight');
            input.value = (parseFloat(input.value || 1.6) + 0.2).toFixed(1);
        };
        panel.querySelector('#fc-lineHeightDec').onclick = () => {
            const input = panel.querySelector('#fc-lineHeight');
            input.value = Math.max(1.0, parseFloat(input.value || 1.6) - 0.2).toFixed(1);
        };

        // 保存按钮
        panel.querySelector('#fc-save').onclick = () => {
            const newConfig = {
                enabled: panel.querySelector('#fc-enabled').checked,
                fontFamily: panel.querySelector('#fc-fontFamily').value,
                fontSize: panel.querySelector('#fc-fontSize').value + 'px',
                lineHeight: panel.querySelector('#fc-lineHeight').value,
                fontWeight: panel.querySelector('#fc-fontWeight').value
            };

            GM_setValue(`config_${domain}`, newConfig);
            applyFont(newConfig);
            panel.remove();
        };
    }

    // 创建悬浮按钮
    const fab = document.createElement('div');
    fab.id = 'font-change-fab';
    fab.innerHTML = 'A';
    fab.style.cssText = 'position:fixed;bottom:80px;right:20px;width:36px;height:36px;background:#3b82f6;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:bold;cursor:pointer;z-index:999998;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
    fab.onclick = () => {
        const existing = document.getElementById('font-change-panel');
        if (existing) { existing.remove(); return; }
        createSettingsPanel();
    };
    document.body.appendChild(fab);

    // 注册菜单命令
    GM_registerMenuCommand('字体设置', createSettingsPanel);
})();