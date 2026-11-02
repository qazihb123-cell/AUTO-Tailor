# AUTO Tailor 展示站进度

更新时间：2026-11-02（Asia/Shanghai）；最新机器回归 UTC 2026-11-02T09:47:06.072Z

## 当前状态

本地可运行、可预览、可交付的版本已完成。当前预览：

http://127.0.0.1:4173

预览服务只绑定本机。源码、构建结果和交付文档都在本目录；没有发布到公网，也没有购买或连接任何外部服务。

已完成：

- 阅读交付执行说明、检查两个压缩包，并提取三份真实产品 PDF 的 40 个可确认条目。
- 建立结构化产品、站点配置和逐图来源数据；记录中英文名称、参数、来源页码与待确认项。
- 完成英文首页、产品目录、3 个分类页、40 个统一详情页、品牌与技术、FAQ、联系询盘和 404，共 49 页。
- 完成桌面与手机布局、搜索、系列筛选、排序、空结果、移动导航、FAQ 展开、表单校验和产品预选。
- 没有真实收件地址，因此不显示“发送成功”；表单明确说明未发送，只下载本地草稿。可选 HTTPS 接口只有在服务返回成功 JSON 后才显示被接受。
- 完成基础 SEO、语义标题、description、图片 alt、404 和条件式 sitemap/canonical。当前无域名，robots 禁止索引。
- 独立复制 `dist` 作静态部署检查，13 个代表端点均返回 200；临时检查服务已停止。
- 浏览器回归通过：49 路由、40 产品、131 个站内目标、5 个视口、14 张截图、0 控制台错误、0 失败请求、0 横向溢出。
- 完成源码、部署、内容来源、产品/页面清单、许可证与 PHP 评估、待补信息、验收结果和截图交付。
- 完成逐项需求矩阵：`docs/REQUIREMENT-AUDIT.md` 共 28 项，PASS 23、BLOCKED_EXTERNAL 5，无 PARTIAL/FAIL。
- 本轮按用户指定实际重跑 `npm run build`、`npm run check`、`TEST_BASE_URL=http://127.0.0.1:4176 npm run test`；最新 `qa-results.json` 和 14 张截图已刷新。

## 验证入口

- 验收细节：`docs/QA.md`
- 逐项需求矩阵：`docs/REQUIREMENT-AUDIT.md`
- 机器结果：`docs/qa-results.json`
- 静态部署记录：`docs/STATIC-DEPLOYMENT-CHECK.json`
- 部署与询盘接口：`docs/DEPLOYMENT.md`
- 内容和图片来源：`docs/CONTENT-SOURCES.md`
- 待确认事实：`docs/MISSING-INFORMATION.md`
- 原商城评估与许可证：`docs/LICENSES-AND-PHP-REVIEW.md`

## 正式上线前

以下事项未完成，因此当前版本属于本地展示交付，不是已上线网站：

1. 提供可公开的真实邮箱、WhatsApp 或联系人渠道（BLOCKED_EXTERNAL）。
2. 配置 HTTPS 询盘接收服务，补充隐私告知、数据留存和垃圾提交治理，并做一次真实投递测试（BLOCKED_EXTERNAL）。
3. 提供正式域名和托管方案；在 `src/data/site.json` 填写 `siteUrl` 后重新构建，才会生成正式 sitemap/canonical 并允许索引（BLOCKED_EXTERNAL）。
4. 确认画册品牌标识、车辆照片和膜材图片的海外公开商用授权；必要时替换为品牌自有素材（BLOCKED_EXTERNAL）。
5. 确认 A75M 光泽冲突、T 原色陶瓷 30590 型号、TPU 官方英文名和色卡、测试标准，以及海外质保和可售型号（BLOCKED_EXTERNAL）。
6. 真实接收服务、域名、素材权利和产品事实确认后，再完成公网发布、HTTPS、托管端 404 和真实手机/辅助设备人工验收（BLOCKED_EXTERNAL）。

## 后续接续

在项目根目录恢复工作：

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run check
npm run preview
```

若 4173 被占用，先设置 `$env:PORT="4174"`。修改产品内容时以 `src/data/catalog.mjs` 为唯一来源；修改联系方式、域名或接口时编辑 `src/data/site.json`；每次修改后重新 build 和 check。

- 已核对老师指定的桌面资料：D:桌面AUTO Tailor 中三份 PDF 与 AUTO Tailor.zip 内对应 PDF 的 SHA-256 完全一致；D:桌面__MACOSX 仅含 ._* 元数据文件，未作为产品资料使用。
