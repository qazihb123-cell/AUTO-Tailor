# AUTO Tailor 海外汽车膜展示站

交付日期：2026-11-02。英文静态展示站，49 个页面，40 个真实画册条目。无购物车、支付、订单、会员或交易后台。资料未提供真实海外收件配置，目前询盘只下载本地草稿，不发送信息。

## 本地预览

当前预览地址：http://127.0.0.1:4173

源码与交付文件都在本目录。浏览器应通过本地服务访问，不要直接双击 HTML，因为资源路径以站点根目录为基准。

要求 Node.js 22 或更高版本，已在 Windows / Node.js 24.14.0 / npm 11.9.0 验证。项目没有构建或运行所需的第三方 npm 依赖，也没有交付 node_modules。

在本目录打开终端：

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run check
npm run preview
```

浏览器打开终端显示的地址。默认端口 4173；若已占用，在启动前执行 `$env:PORT="4174"`。停止前台预览使用 Ctrl+C。修改源码后重新执行 build，再刷新浏览器。`npm run dev` 等同于构建后启动，不含自动热更新。

## 目录说明

| 路径 | 用途 |
|---|---|
| `src/data/catalog.mjs` | 40 个产品、分类、FAQ、英文文案、中文名称和来源页码 |
| `src/data/site.json` | 域名、真实邮箱、WhatsApp、询盘接收地址配置，当前均为空 |
| `src/data/asset-sources.json` | 图片逐项来源、PDF 页码、裁切信息 |
| `src/styles.css` | 电脑和手机样式 |
| `src/client.js` | 筛选、导航、表单校验、草稿下载和可选发送逻辑 |
| `scripts/build.mjs` | 页面模板和静态生成器 |
| `scripts/serve.mjs` | 仅绑定本机的预览服务，不是生产业务后台 |
| `public/` | 原画册提取的 WebP 图片、中文参数证据页、Lucide 图标 |
| `dist/` | 已构建的静态网站，可交给静态托管服务 |
| `docs/` | 部署、内容来源、产品/页面清单、验收截图和待补信息 |
| `licenses/` | 使用的图标许可证原文 |

## 交付阅读顺序

1. `PROGRESS.md`：完成状态与后续接续入口。
2. `docs/DEPLOYMENT.md`：运行、部署和询盘服务配置。
3. `docs/CONTENT-SOURCES.md`：资料处理、翻译和使用范围。
4. `docs/PRODUCTS.md`、`docs/product-inventory.json`、`docs/page-inventory.json`：完整条目和页面。
5. `docs/MISSING-INFORMATION.md`：上线前必须补充或确认的信息。
6. `docs/QA.md`、`docs/qa-results.json`、`docs/screenshots/`：实际验收结果。
7. `docs/LICENSES-AND-PHP-REVIEW.md`：旧商城评估和素材授权记录。

未公开发布到互联网，未购买服务，未向外部发送任何询盘。`dist/robots.txt` 当前禁止索引；填写真实域名后构建才会生成正式 sitemap 与 canonical。
