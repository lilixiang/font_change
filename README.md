# Font Change - 网页字体定制工具

支持 Chrome 插件和油猴脚本两种形式的网页字体定制工具。

## 功能特性

- 自定义字体系列（含微信读书常用字体）
- 调整字体大小（步长 2）、行高（步长 0.2）、字重
- 按域名保存不同配置
- 自动检测当前页面字体作为默认值

## 项目结构

```
font_change/
├── chrome-extension/  # Chrome 插件（Manifest V3）
│   ├── manifest.json
│   ├── content.js     # 内容脚本，注入字体样式
│   ├── popup/         # 弹出界面（按域名配置）
│   ├── options/       # 选项页面（全局默认配置）
│   └── icons/
├── userscript/        # 油猴脚本（单文件，含内联 UI）
│   └── font-change.user.js
└── CLAUDE.md
```

## 开发

### Chrome 插件
1. `chrome://extensions/` → 开发者模式 → 加载已解压的扩展程序 → 选择 `chrome-extension/`

### 油猴脚本
1. 安装 Tampermonkey 或 Violentmonkey
2. 新建脚本，粘贴 `userscript/font-change.user.js` 内容
