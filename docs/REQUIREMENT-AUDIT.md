# AUTO Tailor 需求符合性验收矩阵

验收日期：2026-11-02（Asia/Shanghai）  
依据：`D:\桌面\AUTO_Tailor_海外展示站任务包\交付执行说明.md`、用户本次完整执行要求，以及实际构建、静态检查和 Playwright 结果。  
状态枚举：`PASS` 已用本地证据闭环；`PARTIAL` 已有实现但仍缺少本地可完成的部分；`FAIL` 不符合；`BLOCKED_EXTERNAL` 依赖真实账号、授权、域名或品牌确认；`N/A` 不适用。

## 逐项矩阵

| 编号 | 需求原文（摘录） | 预期结果 | 实际证据 | 状态 |
|---:|---|---|---|---|
| R01 | “交付一个面向海外客户的汽车膜品牌展示网站” | 英文优先、非交易型、可运行的 AUTO Tailor 展示站 | `dist/` 生成 49 个 HTML 页面；首页、目录、详情、技术、FAQ、联系和 404 均存在；`npm run build` 通过 | PASS |
| R02 | “以隐形车衣/TPU 膜、汽车窗膜为核心” | 三条产品线清晰分组 | `src/data/catalog.mjs` 40 条目；PPF 8、Color TPU 11、Window Film 21；分类页与首页入口均可访问 | PASS |
| R03 | “英文优先的首页、产品分类列表、产品详情” | 主要界面为英文，产品信息可扫描 | 所有构建页面为 `<html lang="en">`；49 个唯一 title 和唯一 H1；`docs/page-inventory.json` 可核对 | PASS |
| R04 | “准确使用资料中的产品名称、参数、卖点和图片” | 每个条目有来源文件、页码、参数和图片映射，不补造价格等事实 | 40 个详情页均渲染中文来源文件和页码；`docs/product-inventory.json`、`src/data/asset-sources.json` 有逐项映射；`npm run check` 校验规格和图片；桌面 AUTO Tailor 文件夹三份 PDF 与 ZIP 内对应 PDF 的 SHA-256 完全一致 | PASS |
| R05 | “产品目录：至少区分 Paint Protection Film / TPU 与 Window Film；可按系列、性能筛选” | 分类、搜索、系列/性能筛选、排序、空状态、重置可用 | 浏览器测试覆盖全目录、三分类计数、搜索、空结果、AE Series、5 项性能/材料筛选、厚度和名称排序 | PASS |
| R06 | “产品详情：展示产品图、规格、可验证的性能数据、适用场景、安装/保养资料和询价入口” | 40 个详情页结构完整，数据带证据和保守边界 | 40 个详情路由逐页检查；规格与来源页对应；详情含图、features、care、source strip 和 `/contact/?product=...` | PASS |
| R07 | “品牌与技术、FAQ、联系/询盘页面” | 三类内容页面存在且可导航 | `/technology/`、`/faq/`、`/contact/` 均在 49 路由清单；FAQ disclosure 与导航在浏览器回归通过 | PASS |
| R08 | “采用适配手机与桌面的高品质视觉设计” | 桌面、手机无溢出、图片正常、文字不重叠 | 1440/390 代表页面截图 14 张；额外 320/768/1920 检查；0 `layoutIssues`、0 `elementOverflows`、图片 naturalWidth 正常 | PASS |
| R09 | “所有询价入口改为邮件、WhatsApp 或询价表单等非交易联系方式” | 只保留询盘/草稿入口，不出现购买路径 | 详情页仅链接联系表单；`src/data/site.json` 联系方式为空时明确显示未配置；源码/产物扫描无 checkout/cart/order/payment 等交易残留 | PASS |
| R10 | “PHP 源码仅供参考其分类、商品列表和详情页结构” | 不运行、不复用不明商城代码 | `docs/LICENSES-AND-PHP-REVIEW.md` 记录只参考信息组织；交付目录无 PHP、数据库、商城模板和源码密钥 | PASS |
| R11 | “逐项移除或禁用支付接口、购物车/下单、自动发货、卡密、会员/商家入驻、用户登录注册、订单及相关后台功能” | 全站和 dist 均无上述功能或遗留代码 | `npm run check` 扫描 `src/`、`public/`、`dist/` 共 162 文件；无支付、购物车、订单、登录、卡密、自动发货、后台和私钥模式 | PASS |
| R12 | “不保留演示商品、中文商城品牌和无关支付代码” | 只展示 40 个资料条目，不显示旧商城商品/品牌 | 产品清单仅含三份 AUTO Tailor 画册条目；无旧商城品牌/虚拟商品文本；构建扫描通过 | PASS |
| R13 | “提供可运行预览、源码、部署说明和内容/图片来源清单” | 可在本机运行，文档能说明部署和来源 | `README.md`、`docs/DEPLOYMENT.md`、`docs/CONTENT-SOURCES.md`、`docs/LICENSES-AND-PHP-REVIEW.md` 已交付；4173 预览运行中；独立 dist 静态服务验证 105 文件 | PASS |
| R14 | “交付前逐页检查英文文案、移动端布局、链接及图片” | 全路由逐页检查，链接和图片无破损 | Playwright 49 路由 × 1440/390；131 个站内目标均 HTTP 200；0 控制台错误、0 失败请求、0 横向溢出 | PASS |
| R15 | “询盘表单的必填校验、邮箱校验、错误提示、产品预选、草稿下载和发送状态” | 校验可见、产品参数对应、未配置服务不假报发送 | `/contact/?product=t75` 预选通过；4 个必填错误、无效邮箱、短留言和可访问错误提示通过；草稿含 `DRAFT ONLY - NOT SENT` 和 T75 | PASS |
| R16 | “没有真实服务时绝不能显示已经发送成功” | 无 endpoint 时只能下载草稿并明确未发送 | `site.json.inquiryEndpoint` 为空；联系页显示 “Sending is not available yet”；测试确认无 POST、状态含 “Nothing has been sent” | PASS |
| R17 | “检查 SEO、导航、筛选、排序、空状态、图片替代文字和控件功能” | SEO/导航/控件/alt 均有机器证据 | 49 个 title、description、404 noindex；移动导航 Escape、筛选排序空状态、所有图片 `alt` 和 131 个目标均通过 | PASS |
| R18 | “不得编造联系方式、参数、认证、质保、客户评价、销量、素材商用授权或发送成功状态” | 未确认内容不以事实或成功状态发布 | 联系配置为空；warranty 标为 brochure period；未发布价格、销量、评价、认证；冲突参数和授权列在 `docs/MISSING-INFORMATION.md` | PASS |
| R19 | “检查内容来源、图片映射、许可证、待补信息和部署文档是否与当前实现一致” | 文档、源数据和构建产物一致 | `docs/CONTENT-SOURCES.md`、`docs/LICENSES-AND-PHP-REVIEW.md`、`docs/MISSING-INFORMATION.md`、`docs/DEPLOYMENT.md` 与当前空配置、40 条目和 29 个资产映射一致；check 通过 | PASS |
| R20 | 用户要求“实际执行并记录：npm run build、npm run check、npm run test” | 三条命令均实际执行并留下最新机器结果 | 本轮实际执行：build 49/40；check 162 文件扫描通过；test 写入 `docs/qa-results.json`，时间戳 2026-11-02T09:47:06.072Z | PASS |
| R21 | 用户要求“至少检查首页、目录、详情和联系页的桌面与手机视口，查看最新截图” | 代表页面双视口截图和布局复核 | `docs/screenshots/` 14 张最新截图，含 home/catalogue/detail/contact 的 1440 与 390；Playwright 图片加载和溢出检查通过 | PASS |
| R22 | 用户要求“如果 4173 被占用…另一个空闲端口…TEST_BASE_URL 指向它” | 不影响交付预览，测试服务使用独立端口 | 4173 交付预览保持运行；本轮 `TEST_BASE_URL=http://127.0.0.1:4176 npm run test`，无破坏现有服务 | PASS |
| R23 | 用户要求“浏览器回归…检查控制台错误、失败请求、图片丢失、文字重叠、横向溢出和产品对应关系” | 机器结果全部为零错误并核对产品对应 | `qa-results.json`：`errors=[]`、`failedRequests=[]`、`badResponses=[]`、`layoutIssues=[]`、`elementOverflows=[]`；40 个详情 H1/来源/询价对应通过 | PASS |
| R24 | 用户要求“真实邮件投递、域名/TLS/托管、实际外部联系方式” | 生产环境真实接收和公开访问可验证 | 当前没有真实邮箱、WhatsApp、HTTPS endpoint、域名或托管账号；本地仅草稿和本机预览 | BLOCKED_EXTERNAL |
| R25 | 用户要求“不得编造…素材商用授权” | 可证明画册图片、品牌标识、车辆照片具海外公开商用权 | 当前仅能确认素材来自用户资料包，未取得公开商用授权凭证 | BLOCKED_EXTERNAL |
| R26 | 用户要求“准确使用…参数、质保、英文名称” | 品牌确认冲突值、官方英文名、测试条件和海外政策 | A75M 光泽、T 30590、TPU 官方颜色名、测试条件、海外质保和可售型号仍待品牌/技术资料确认；已列入缺失信息 | BLOCKED_EXTERNAL |
| R27 | 用户要求“桌面与手机布局”并要求真实环境闭环 | 实体 iOS/Android、辅助设备人工验证 | 已完成 Edge Chromium 多尺寸视口；真实 iOS Safari、Android 实机和辅助设备未具备本地可验证环境 | BLOCKED_EXTERNAL |
| R28 | “提供…部署说明”并完成公网可用性 | 真实主机 DNS、TLS、404、缓存和上线行为验证 | 本地 Python 静态服务已验证独立 `dist` 的 13 个代表端点；公网发布、DNS、TLS、主机 404 未执行 | BLOCKED_EXTERNAL |

## 统计

共 28 项：`PASS 23`，`PARTIAL 0`，`FAIL 0`，`BLOCKED_EXTERNAL 5`，`N/A 0`。  
本地可执行范围已全部闭环；5 项外部阻塞分别是生产接收/域名联系方式、素材商用授权、品牌事实确认、真实设备和公网托管验证。补齐条件及复验方法见 `docs/MISSING-INFORMATION.md`、`docs/DEPLOYMENT.md`。

## 证据索引

- 机器结果：`docs/qa-results.json`
- 静态部署：`docs/STATIC-DEPLOYMENT-CHECK.json`
- 最新截图：`docs/screenshots/`
- 产品/页面清单：`docs/product-inventory.json`、`docs/page-inventory.json`
- 内容与图片来源：`docs/CONTENT-SOURCES.md`、`src/data/asset-sources.json`
