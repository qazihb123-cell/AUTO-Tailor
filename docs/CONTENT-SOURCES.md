# 内容与图片来源

## 原始资料

### 两份资料位置的核对

2026-11-02 已对桌面 AUTO Tailor 文件夹和任务包 AUTO Tailor.zip 内同名 PDF 做 SHA-256 校验，三份文件完全一致：

| 文件 | 文件大小 | SHA-256 |
|---|---:|---|
| AT TPU宣传册.中文版.pdf | 474,755,160 bytes | 769CADC10A2D06A92FE6CC6F104D70C828494276A771ADBD885A53F4BF5F7BF5 |
| AT窗膜画册中文版.pdf | 43,946,084 bytes | 2AA62DDDE7251D4AAFCB2FC74CD50408622B06227AEF93ED64CB460D1D792ADA |
| AUTO Tailor 隐形车衣.中文版.pdf | 5,362,539 bytes | DA0D8FC7481B3FFA8C4A78F97F664A5C0F664B10E3F0E087BEA151A96BB3E833 |

因此，本网站早期从 ZIP 解压得到的 PDF 与老师指定的 D:桌面AUTO Tailor 文件夹资料是同一版本，产品参数、产品名称和图片来源一致。没有使用 D:桌面__MACOSX 下的文件；该目录只有三个 AppleDouble ._* 元数据附属文件，不是产品资料。

用户目录：`D:\桌面\AUTO_Tailor_海外展示站任务包`。需求来自用户的执行指令及交付执行说明。产品事实来自 `AUTO Tailor.zip` 中的三份 PDF：

| 文件 | 页数 | 用途 |
|---|---:|---|
| AUTO Tailor 隐形车衣.中文版.pdf | 40 | 品牌图形、8 个 PPF 型号、厚度、画册质保、安装后养护、车型示意 |
| AT TPU宣传册.中文版.pdf | 32 | 彩色 TPU、11 个名单条目、卷尺寸、安装方式及条件质保 |
| AT窗膜画册中文版.pdf | 12 | 21 个窗膜型号、7 项规格、系列技术和养护 |

页码均为 PDF 从 1 开始的物理页序，不是版面可能出现的印刷页码。原始资料保留在原目录，解压和渲染中间结果在工作区 `work/`。忽略 `__MACOSX`、`._*` 和点开头附属文件。没有运行资料包中的程序。

PPF PDF 是图片型文件，采用逐页渲染、联系表浏览和参数页放大人工读取。窗膜和 TPU 可抽取文字，另对产品表、安装/养护和名单页进行视觉对照。没有将自动提取结果未经核验直接当作完整数据。

## 逐条映射

- `src/data/catalog.mjs` 为内容唯一数据源；`source.file`、`source.page`、`additionalPages` 对应每个产品的事实来源。
- `docs/product-inventory.json` 是构建生成的全量产品记录，含中英文名称、参数、卖点、养护、复核备注和图片路径。
- `docs/PRODUCTS.md` 是便于人工核对的完整 40 条清单。
- `src/data/asset-sources.json` 对应每张图片和中文证据页的原始文件、页码、裁切坐标、像素尺寸或原图序号。
- `docs/page-inventory.json` 对应全部 49 个页面；详情页由同一模板生成，不使用逐页手写的参数副本。

## 核心资料对应

| 公开内容 | 中文依据/核对点 | 来源 |
|---|---|---|
| T75、T85、T75M | 厚度 7.5 / 8.5 / 7.5 mil；质保 5 年 | PPF pp16–18 |
| A75、A85、A75M | 厚度 7.5 / 8.5 / 7.5 mil；质保 5 / 8 / 5 年 | PPF pp21–23 |
| AT Super Black / Super Matte Black | AT 超级黑 / AT 超亚黑，7.5 mil、5 年 | PPF pp26–27 |
| Heat-assisted scratch recovery | 划痕热修复性能 | PPF 各产品页 |
| Impact / abrasion resistance | 抗冲击性强 / 耐磨性强 | PPF 各产品页 |
| Hydrophobic surface (A Series) | 荷叶疏水 | PPF pp21–23 |
| Storage | 20±2°C，相对湿度 40–60%，原包装水平放置、避光、避免极端温度 | PPF 产品页储存说明 |
| PPF aftercare | 前 3 天避免接触边缘，约一周待干燥后洗车，避免研磨性清洁 | PPF p39；拆除见 p38 |
| Color TPU collection | 名单 11 条，包含“TPU 常规系列”集合项 | TPU p31 |
| Film thickness / roll size | 厚度 7.5 mil ±5%，规格 1.524×15 m | TPU p31 |
| Conditional warranty | 5 年；自然褪色 3 年；授权施工及电子质保条件 | TPU p31 |
| Color TPU installation | 亮面微水施工，哑面干贴导气槽，大面可湿贴 | TPU p21 |
| AE / AT / T / AK specifications | 透光率、内反光率、紫外线阻隔、红外线阻隔、总太阳能阻隔、厚度、质保 | 窗膜 pp5、7、9、11 |
| Window aftercare | 施工完成后至少 30 天不要清洁 | 窗膜参数页备注 |

## 英文与发布边界

英文是针对海外目录重写的自然表达，不代表原画册已有官方英文版本。型号数字原样保留；颜色译名与碳纤效果描述需品牌确认。Standard Collection / Special Effects / Carbon Fiber 为方便检索的编辑分组，不假定是官方出口系列体系。

所有 warranty 均表述为 brochure period，并附海外适用条件待确认的说明。没有发布价格、库存、运输承诺、性能保证、成立年份、销量、客户评价、公司所在地或无法核验的独立认证。

没有补造 PPF 缺单位测试值；A75M 光泽冲突等列在待补清单。原始参数页作为中文核对依据，不将它们当作独立认证文件。中文证据页上的工厂测试说明应与页面的保守英文解读一并阅读。

首页品牌标语为编辑性文案，不是性能数值或政策承诺。FAQ 的每个答案附来源说明。网站不作任何地区窗膜法规符合性承诺。

## 图片处理

品牌标识来自 PPF p6；首页白车摄影来自 TPU p28；彩色膜卷来自 TPU p4；窗膜集合图来自窗膜 p4、6、8、10、11；8 个 PPF 车辆裁切来自各自产品规格页。

产品图保持等比显示；仅为画册中的车型/集合示意，不宣称车型专用、车辆厂家背书或某个 TPU 颜色的准确样片。原图已有的半透明叠影/车辆轮廓并非本项目添加的性能演示。

图片全部本地提供，不依赖第三方图片服务。未在公开站点放出含中国零售价格的完整 TPU p31；其规格和名单通过结构化内容展示。完整原 PDF 不复制到交付站点。
