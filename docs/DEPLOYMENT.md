# 运行、部署与询盘配置

## 已验证的本地流程

在项目根目录执行 README 中的 npm ci、build、check、preview。静态输出为 `dist/`，49 个 HTML 页面。源数据、文档和检测脚本不需要上传到网站。

本项目使用原生 Node.js 文件接口生成 HTML，不需要数据库、PHP、支付 SDK、登录服务或后台管理账号。生产浏览器只加载静态 HTML/CSS/JS、WebP 和 SVG，无远程字体、统计 SDK 或 CDN 依赖。

预览服务只监听 `127.0.0.1`，因此地址仅限当前电脑访问；手机适配已通过浏览器设备视口检查，不表示真实手机可以直接访问此地址。

## 静态部署

1. 补充并确认 `src/data/site.json` 中的生产域名与联系方式。
2. 运行 `npm ci --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm run check`。
3. 将 `dist` 内的文件上传至静态主机的站点根目录，保留各级文件夹。不要上传整个源码根目录。
4. 主机需将目录请求映射至该目录的 `index.html`，不存在的地址以 HTTP 404 返回 `404.html`。不要设置单页应用全部回退到首页。
5. 启用 HTTPS。项目使用根路径资源，部署在域名根目录，不支持未经修改直接部署到子路径。
6. 检查首页、任一详情、图片、404、sitemap 与 inquiry 请求；配置完成后测试真实接收与垃圾邮件处理。

本次已把构建产物作为独立静态目录进行本机 HTTP 验证。未执行任何远程主机发布、DNS 配置或 TLS 签发；这些需要真实账号与用户授权。不同主机控制台操作未实测。

## 配置字段

`src/data/site.json` 是公开构建配置，不能存放密码、API 私钥或邮箱 SMTP 凭据。

| 字段 | 填写方式 | 当前行为 |
|---|---|---|
| `siteUrl` | 真实 HTTPS 域名，仅 origin，无子路径 | 空值不生成 canonical/sitemap，robots 禁止索引 |
| `email` | 真实对外邮箱 | 非空时展示 mailto 联系链接，不代表表单已开通 |
| `whatsapp` | 国际号码，仅数字，含国家代码 | 非空时展示 WhatsApp 联系入口 |
| `inquiryEndpoint` | 真实 HTTPS JSON 接收地址 | 空值只下载草稿；非空才提供发送按钮 |

修改任何配置后必须重新 build 并重新部署。网站不会自动猜测正式域名或联系人。

## 询盘接收接口契约

前端以 POST 和 `Content-Type: application/json` 发送以下字段：

```json
{
  "name": "customer name",
  "email": "customer email",
  "company": "optional company",
  "country": "country or region",
  "product": "catalogue slug or general",
  "productName": "English display name",
  "message": "project details"
}
```

这是字段格式说明，不是联系人数据。接口应自行校验邮箱、必填项、长度和合法产品编号，执行限流、防垃圾提交，并将信息存储或可靠排入通知队列。不能只依赖浏览器校验。服务端凭据留在服务端；前端传入的 productName 不能作为产品身份的唯一依据。

跨域接收需要由服务明确允许实际网站来源，处理 OPTIONS 预检，并允许 JSON POST。若使用现成表单服务，应确认其请求/响应格式兼容；不兼容时需要适配，不应仅粘贴地址后假定有效。

只有 HTTP 成功且 JSON 返回 `{"success":true}` 时，页面显示“接收服务已接受询盘”，并不声称邮件已送达。拒绝、无效 JSON、网络故障或 15 秒超时均显示无法确认接收。测试时的 success/rejection 为浏览器拦截模拟，并未证明真实邮件发送成功。

上线前还需要明确数据接收主体、留存时间、隐私告知、处理目的和适用的地区要求，并据实际流程更新联系页。未完成真实接收配置之前请保留空值，不要填入测试地址冒充可用服务。

## 回归测试

`npm run check` 不需要第三方库，检查产品、来源、图片、询盘链接及遗留交易文件。

`npm run test:browser` 是可选浏览器测试，需要外部安装的 Playwright 与 Edge（默认 `msedge`）。本次复用了 Codex 环境中的 Playwright，没有把该工具依赖打入交付项目。

可通过环境变量 `PLAYWRIGHT_MODULE` 指向 Playwright 的 ES module 文件 URL；`TEST_BASE_URL` 指向已运行的本地站点；`BROWSER_CHANNEL` 可设为已安装的 `chrome`。测试会覆盖 `docs/qa-results.json` 和截图。首次使用自行安装的测试环境时先安装相应浏览器，再运行脚本。交付的构建和运行并不依赖这些测试工具。

发布后若要回滚，恢复上一版完整 `dist/`，不要混用不同版本的页面、数据和脚本。
