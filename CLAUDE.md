# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

网页字体定制工具，支持 Chrome 插件和油猴脚本两种形式，功能独立实现。

## 架构

```
chrome-extension/
  manifest.json       # Manifest V3，权限: storage, activeTab, scripting
  content.js          # 注入页面，读取配置并应用字体（document_start）
  popup/              # 弹出界面，按域名配置字体
    popup.html/js
  options/            # 选项页，配置全局默认字体
    options.html/js
  icons/              # 扩展图标 (16/48/128)
userscript/
  font-change.user.js # 单文件实现，含内联 UI 面板 + FAB 按钮
```

### Chrome 插件
- 配置存储: `chrome.storage.local`，key 为 `config_${domain}` 或 `global_config`
- popup.js 通过 `chrome.scripting.executeScript` 获取当前页面字体作为默认值
- content.js 注入 `<style>` 元素应用字体，所有属性用 `!important`

### 油猴脚本
- 存储: `GM_setValue/GM_getValue`，key 为 `config_${domain}` 或 `global_config`
- 右下角 FAB 按钮（蓝色圆形 "A"），点击弹出设置面板
- 面板使用 `:not(#font-change-panel):not(#font-change-panel *)` 排除自身不受字体修改影响
- 面板弹出动画: `transform-origin: bottom right`，从右下角缩放弹出

## 配置数据结构

```javascript
{ enabled: boolean, fontFamily: string, fontSize: "16px", lineHeight: "1.6", fontWeight: "400" }
```

## 开发

### Chrome 插件
1. `chrome://extensions/` → 开发者模式 → 加载已解压的扩展程序 → 选择 `chrome-extension/`
2. 修改后点刷新按钮重新加载

### 油猴脚本
1. 安装 Tampermonkey/Violentmonkey
2. 新建脚本，粘贴 `userscript/font-change.user.js` 内容

## CSS 注意事项

- 油猴脚本中 `#font-change-panel *` 只设置 `box-sizing: border-box`，不要加 `margin:0; padding:0`，否则会因高优先级覆盖子元素样式
- flex 布局中子元素需要 `min-width: 0` 防止内容溢出容器
- label 固定宽度 36px + `flex-shrink: 0` + `white-space: nowrap` 防止换行
