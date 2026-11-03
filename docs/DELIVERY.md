# AUTO Tailor 交付清单

更新日期：2026-11-03（Asia/Shanghai）。本文件说明当前交付，旧验收报告保留历史记录。

## 访问入口

- 在线预览：https://qazihb123-cell.github.io/AUTO-Tailor/
- 源码仓库：https://github.com/qazihb123-cell/AUTO-Tailor
- 项目主提示词：根目录 PROMPT.md，为需求整理版而非完整聊天转录。
- 分享包中的可复用 Skill：skills/overseas-product-showcase/SKILL.md。来自用户提供的分享资料，保留原文和原始 ZIP，不声明为本项目原创，不自动安装。

## 本轮优化

- 卡片、按钮和主要图片框 6px 圆角，表单控件 4px 圆角。
- 导航吸顶，滚动超过 24px 时使用 96% 不透明白底和轻阴影；手机展开菜单为不透明白底。
- 卡片和按钮轻微悬浮，保留分段入场与桌面首图视差。
- 支持页面打开期间切换减少动态效果，关闭 JavaScript 时主要内容仍可阅读。

## 已执行验证

- 结构检查：49 个页面、40 个产品、资料来源、分类数量和链接。
- 浏览器回归：49 个路由、131 个站内目标；320/390/768/1440/1920px，无页面错误、失败请求或横向溢出。详情见 qa-results.json。
- 专项：1440/768/390px 导航吸顶、圆角、菜单、悬浮，以及即时切换减少动态效果与禁用 JavaScript 检查通过。
- taste-skill 额外审美检查仍报告原有标签、细线、卡片边框、小字号等风格项；未进行整站重设计，不声称全部审美规则通过。

## 使用与更新

下载源码后安装 Node.js 22 或以上版本，在项目目录依次执行 npm ci、npm run build、npm run check、npm run preview。默认本地端口 4173。

本地 build 使用站点根路径；GitHub Actions 构建使用 /AUTO-Tailor/ 子路径。已打包的 dist 是 Pages 版本，本地运行前请重新 build。

推送 main 后会自动构建部署。已发布页面的访问不依赖 VSCode 或本机预览服务器。

## 保留的业务边界

询盘接收服务与业务联系方式尚未配置，表单只下载草稿。产品事实冲突、素材授权、海外质保和实际接收服务仍需品牌方确认。具体见 MISSING-INFORMATION.md；本次不改变这些产品数据。
