---
name: "SD 卡耐久分析"
description: "指定 Figma 的浅色 SD 写入预算工具视觉系统"
colors:
  primary: "#0067c0"
  primary-hover: "#005aa8"
  primary-pressed: "#004b8c"
  surface: "#fff"
  base: "#fafafa"
  subtle: "#f3f3f3"
  text: "#1b1b1b"
  text-secondary: "#5d5d5d"
  info-bg: "#f0f6fc"
  border: "#d2d2d2"
  border-subtle: "#e5e5e5"
  control-hover-border: "#8a8a8a"
  warning: "#8a5200"
  warning-bg: "#fff4ce"
  error: "#c42b1c"
  sensitivity-bar: "#6ba7df"
typography:
  display:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.35
  budget:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.4
  headline:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.5
  word-result:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.35
  analysis-title:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.5
  title:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.45
  section-title:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".875rem"
    fontWeight: 400
    lineHeight: 1.4
  input:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".875rem"
    fontWeight: 400
    lineHeight: 1.45
  detail:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".75rem"
    fontWeight: 500
    lineHeight: 1.45
  compact-control:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".75rem"
    fontWeight: 400
    lineHeight: 1.4
  chip:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".75rem"
    fontWeight: 400
    lineHeight: 1.45
  hint:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".6875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif"
    fontSize: ".625rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "4px"
  panel: "8px"
  pill: "999px"
  circle: "50%"
spacing:
  small: "8px"
  medium: "16px"
  panel: "18px"
  layout: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
  button-primary-active:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  button-secondary-hover:
    backgroundColor: "{colors.subtle}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  button-secondary-active:
    backgroundColor: "{colors.border-subtle}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  button-disabled:
    backgroundColor: "{colors.subtle}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.control}"
  choice-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.compact-control}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
  choice-button-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.compact-control}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
  field-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    padding: "8px"
  field-unit:
    backgroundColor: "{colors.base}"
    textColor: "{colors.text-secondary}"
    rounded: "0 4px 4px 0"
    padding: "4px"
  navigation:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  navigation-active:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  status-chip:
    backgroundColor: "{colors.subtle}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  status-chip-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  result-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "16px 18px"
  semantic-notice:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    rounded: "{rounded.control}"
    padding: "12px"
  help-popover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.detail}"
    rounded: "{rounded.panel}"
    padding: "{spacing.medium}"
    width: "min(320px, calc(100vw - 24px))"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "0"
    width: "min(560px, calc(100vw - 32px))"
---

# Design System: SD 卡耐久分析

## Overview

**Creative North Star: "指定 Figma 的 SD 卡耐久分析"**

系统沿用指定 Figma 的浅色 Fluent 风格：白色工作面置于近白页面上，蓝色标识操作和当前选择，灰色承担结构与辅助信息。界面紧凑、清楚，数值结果形成稳定的视觉重心，语义提示保持可见而克制。

同一套字体、边框和圆角用于参数、分析、帮助与原理页。排布服从实际内容宽度；窄屏和文本放大保留字号，让字段、公式、导航及分析面板重排。此文档记录完成实现中的可复用规则，指定 Figma 的世界与结果字号继续作为视觉约束。

视觉权威：[Figma SD](https://www.figma.com/design/jw3p4QykbgwxkEE9MFQnF4/SD?node-id=78-123)，基线取回于 2026-10-01。提取依据为当前 `src/index.css`、`App.jsx`、`PresetControls.jsx`、`components.jsx`、`Analysis.jsx`、`Theory.jsx` 和 `presets.js`；产品约束与方向见 `PRODUCT.md`、`.impeccable/surface.md`。源文件指纹与扩展记录见 `.impeccable/design.json`。

v1.1 属于普通扩展：四个新增组合模式复用既有颜色、字级、圆角与断点，前置原始令牌及侧车色阶保持不变。首版复核见 `docs/finish-review.md`，v1.1 的浏览器证据与验收见 `docs/acceptance-v1.1.md`，最终 ship 判定覆盖 F01–F04 修复批次，记录于 `docs/finish-review-v1.1.md`；本次文档提取未重复浏览器审核，也不将该判定扩大为全域或部署认证。

**Key Characteristics:**

- 浅色页面、白色面板和轻灰辅助区，靠色调与细边框区分层级。
- Noto Sans SC 单一字体家族，结果数字醒目，说明与字段保持紧凑。
- 蓝色操作状态与明确的警告、错误语义；焦点环始终可见。
- 控件小圆角、面板中等圆角，容器不足时按内容重排。
- 原生弹窗、帮助浮层与披露，减少动效时移除过渡。

## Colors

蓝色动作配近白中性色，语义提示使用独立的琥珀与红色；前置令牌是规范数值。

### Primary

- **操作蓝（primary）**：主操作、选择按钮、当前导航、图表曲线、预算条和当前敏感性行。
- **悬停蓝 / 按下蓝（primary-hover / primary-pressed）**：分别用于主按钮的悬停和按下状态；链接悬停使用悬停蓝。
- **信息浅蓝（info-bg）**：当前导航和带来源的型号说明。
- **敏感性浅蓝（sensitivity-bar）**：非当前情景的敏感性条，不替代当前情景的操作蓝。

### Neutral

- **工作面白 / 页面近白（surface / base）**：面板与控件 / 页面与单位选择区域。
- **辅助轻灰（subtle）**：事实摘要、假设说明、默认状态标签、禁用控件和条形轨道。
- **正文深灰 / 辅助中灰（text / text-secondary）**：主要文字 / 标签、提示、导航默认项和坐标文字。
- **控件边框 / 轻分隔线（border / border-subtle）**：面板与控件结构 / 内部分隔、图表网格、表格行和页头底线。
- **悬停边框灰（control-hover-border）**：次要按钮与输入外壳的悬停描边。

琥珀文字与浅黄背景（warning / warning-bg）用于状态标签、待重新计算说明和预算阈值；输入错误用 error 标记边框与就近文字。源码中未被当前组件使用的 error-bg 声明不作为现有错误面板规则。

未修复的既有文档漂移：文字选择背景（`#cde7ff`）未列为前置颜色令牌；弹窗遮罩（`rgb(0 0 0 / 28%)`）仍是深度说明与侧车原生表面记录中的值。检测各给出一项颜色文档 advisory，两处源码在本轮均未改变；不因普通扩展将它们补入调色板或生成新色阶。

**The Semantic Color Rule.** 蓝色表达操作、当前选择与数据；琥珀色表达需注意的状态或预算阈值，红色表达输入错误。状态文字始终随颜色一起出现。

## Typography

**Display Font:** Noto Sans SC，回退为 Microsoft YaHei 与 sans-serif。
**Body Font:** 同一字体家族；没有单独的显示字体或等宽字体。

**Character:** 中文界面采用单一字族和紧凑层级。数字、公式、版本、坐标和表格使用等宽数字（`tabular-nums`），不将内容改为等宽字体。根字号为 16px，字号令牌中的 rem 随文本设置缩放；本地字体资源载入 400、500、700 三种字重。

### Hierarchy

- **Display**：主结果数字与单位；固定设计尺度为 36px，粗体，行高见前置令牌。预算达到的文字状态使用 word-result，不压缩数字结果。
- **Budget**：预算百分比、写入需求或选型余量（30px）。
- **Headline / word-result**：原理页总标题与弹窗标题 / 主结果的文字状态（24px），两者行高不同。
- **Analysis title**：结果分析标题（20px）。
- **Title**：页头产品名（18px）。
- **Section title / Body**：参数段与分析卡标题 / 全局基础字号（16px），标题使用粗体。
- **Control / Input**：操作按钮 / 输入文字（14px），分别使用各自的行高。
- **Detail**：帮助正文、原理正文、披露与补充事实（13px）；披露 summary 使用 500 字重。
- **Label / Compact control / Chip**：字段标签 / 目标和分类选择 / 状态标签（12px）；字段标签使用 500 字重。
- **Hint**：字段提示、公式步骤、图表坐标、表格与页脚（11px）。
- **Caption**：版本、图表摘要和步骤序号（10px）。

原理段落的正文最大行长为 85ch、行高为 1.7；其他角色保持前置令牌或对应组件的实际行高。图表 tooltip 使用 13px，与 detail 的基础尺度相同。

**The Assigned Design Rule.** 后续界面继承指定 Figma 的字体、颜色、圆角与结果层级；视觉扩展不替换这套已确定的身份。

## Layout

页头、工作区与页脚共享最大宽度（1280px）。页头默认最小高度为 56px；工作区在页头下方留 20px。宽屏计算区域采用 500px 参数栏与可伸缩分析栏，列间距使用 layout；面板内边距使用 panel。参数区按内容增长，不设固定面板高度。

分析栏是独立的 inline-size 容器：结果、分析标题、预算与图表、敏感性与过程、来源披露依次排布。分析块间距为 12px；宽屏预算与图表使用 `minmax(200px, .48fr) minmax(0, 1fr)`，下方两块等分。原理页使用 200px 目录与可伸缩正文，目录在桌面距顶部 20px 粘附。

字段行自动适应真实空间：`repeat(auto-fit, minmax(min(100%, 11.25rem), 1fr))`，间距 12px。单字段填满行；输入与分析子项使用 `min-width: 0`，长公式、来源和数值允许换行。目标、分类、动作与导航使用 flex-wrap 或对应窄屏换行规则。

新增型号 / 容量与品牌 / 容量筛选沿用同一字段行。公开规格使用可折行的键值摘要；未知历史的恢复入口纵向排列，不建立新的卡片网格。预算大字的百分数与“剩余”按词组换行（`word-break: keep-all`），极长数值仍允许在需要时断行。

- **viewport ≤ 1359px**：外侧边距为 24px；参数栏改为 440px；预算/图表比例改为 .65fr/1fr；下方分析单列。
- **viewport ≤ 1100px**：参数与分析成为一列，间距 20px；参数段尝试两列，间距 20px；工具动作横排并可折行；预算/图表比例为 .42fr/1fr，下方分析恢复两列，仍受分析容器规则约束。
- **viewport ≤ 600px**：外侧边距为 16px，工作区顶部留 16px；页头留纵向 10px 并可折行。参数段、字段行、分析、结果摘要和原理页成为一列；步骤与来源记录的键值换成上下排列。目录取消粘附并横向折行；工具动作改为纵排。弹窗内边距收至 16px。
- **workspace container ≤ 68.75rem**：计算区一列，即使 viewport 媒体规则尚未触发。此内容宽度规则补充 1100px 媒体规则。
- **analysis container ≤ 38rem**：预算/图表与下方分析都成为一列。
- **nearest container ≤ 24rem**：结果主区与计算步骤内部成为一列。

小屏保持可读字级并重排至 320px。常规图表高度为 12.8125rem，600px 以下为 13.75rem；图表实际宽度小于 `380 × textScale` 时仅显示三项 X 刻度，否则五项。Y 轴宽度、X 刻度间距与高度、顶部和右侧留白随根字号缩放；X 刻度间距为 `12 × textScale`，轴高为 `40 × textScale`。这些是已修复文本放大后的刻度留白，而非缩小刻度的规则。

**The Content Reflow Rule.** 在可用空间不足时重排内容，保留字体尺度、字段可读宽度和完整公式。

## Elevation & Depth

常驻面板、按钮、帮助浮层和弹窗没有声明装饰阴影。白色、近白和轻灰的色调层级与一像素边框构成深度。原生 dialog 和 popover 进入浏览器顶层；模态背景为 `rgb(0 0 0 / 28%)`，帮助浮层没有遮罩。图表 tooltip 保留 Recharts 的原生容器行为，应用只明确覆盖小圆角、边框、文字色和字号，不将第三方默认投影升级为系统阴影令牌。

按钮仅对背景色与边框色使用 `150ms ease-out` 过渡。图表线条关闭动画，结果数字不做计数动画。减少动效偏好下移除全部动画和过渡，并使用即时滚动。

**The Flat Surfaces Rule.** 常驻面板通过表面色与细边框分层，不增加投影、悬浮抬升或入场动画。

## Shapes

control 圆角用于按钮、字段、说明区、分类容器与事实摘要；panel 圆角用于参数、分析面板、弹窗与帮助。pill 用于状态标签和条形轨道，circle 用于计算步骤序号。控件和面板描边保持一像素，帮助图标保留指定 Figma 的线性 SVG（16 × 16）与原始几何。

这些圆角承担结构差异；没有在当前设计中使用装饰切角、巨大胶囊按钮或悬浮卡片轮廓。条形轨道对溢出裁切，文字内容通过换行解决空间不足。

## Components

### Buttons

紧凑且明确。主按钮使用 button-primary，次要动作使用 button-secondary；二者默认最小高度为 36px，描边与内边距见令牌。主按钮悬停、按下使用对应蓝色；次按钮悬停使用轻灰和悬停灰描边，按下使用轻分隔灰。禁用时采用辅助灰文字、轻灰背景、正常边框与默认鼠标指针。

全局 `:focus-visible` 为 2px 操作蓝外轮廓，偏移 3px；字段内 input、select、textarea 的偏移为 1px。文字动作使用蓝色，悬停显示下划线，不将所有次要动作都升级为填充按钮。

### Selection controls and chips

目标选择沿用 choice-button，最小高度为 32px，以 `aria-pressed` 与蓝色填充同时表示选中。预设分类在轻灰容器内；分类按钮最小高度为 28px、内边距为 5px 9px，选中使用白面、蓝边框和蓝文字。

写入预算的常用 / 高级方式在目标选择下方使用同一按钮组：主机 TBW（常用）与 P/E 工程估算（高级）共享位置、控件尺度与选中语义，下方用 hint 字级解释适用人群。选型需求不显示预算方式组；切换方式保留各自输入与成功快照。B 的型号参考位于有效循环容量与 P/E 字段下方的可选披露内，避免把工程参数提升为普通用户的必填入口。

状态 chip 没有交互行为。默认使用辅助灰；已有情景、未知历史、待重新计算等状态使用警告配色和明确文字。状态不是健康度徽章。

### Cards / Containers

面板使用 panel 令牌与标准边框；主结果卡使用 result-card 的独立纵横内边距。结果数字与轻灰事实摘要并排，空间不足时上下排布。预算条的高度为 14px，敏感性条为 8px；当前敏感性行同时使用轻灰行底与深蓝条。

空图使用上下轻分隔线、说明文字与留白，不显示虚构曲线。数据图使用 2px 蓝色直线、无常驻数据点，预算阈值使用 1px 琥珀线。图表保留可展开的数值表，视觉数据与当前成功快照一致。

### Inputs / Fields

字段采用外壳包住真实 input 或 textarea，可带原生单位 select。外壳最小高度为 38px，标签与字段间距为 6px；hover 改变描边，focus-within 改为操作蓝。单位区使用页面近白、左侧轻分隔线，最小宽度 72px、最大宽度为外壳的一半。

输入错误使用红色外壳或原生控件边框及就近错误文字，带 `aria-invalid` 与错误描述关联。原生 select 禁用时为辅助灰与轻灰背景。占位符采用辅助文字色，不代替标签；输入光标使用操作蓝。

自定义卡片的可选型号与标称容量直接使用这套 Field，与现有字段行重排规则一致；容量以静态 GB 单位区显示，两项起始为空。标签明确写“可选”，下方提示说明只用于卡片记录，并进入成功快照的来源信息；标称容量不作为有效 NAND 循环容量的填充来源。

### Sourced preset facts and adoption

先浏览，再核对。消费 / 高耐久 / 工业分类、原生品牌和容量筛选、型号选择沿用现有控件样式。筛选后的名单仍保留当前卡片选项与说明，只有选择新型号才替换公开参数；切换回自定义移除未手改的厂商耐久值，保留用户刻意修改的假设。

已选卡片的事实区使用 info-bg、control 圆角与 12px 内边距，正文为 12px、行高 1.6、行间距 6px。规格用可折行的定义列表，项目间距为 12px / 24px；规格名用 hint 字级，值用 500 字重和等宽数字。自动填写说明与动态“还需填写”列表相邻，私人负载和累计历史保持用户输入。

厂商 TBW 的计数口径未明确时，确认区在事实下方以一像素边框和 8px 间距分隔：原生 16px 复选框使用操作蓝，旁边完整说明“作为本次主机写入预算假设”；未确认的错误就近显示。B 只填写公开 P/E，保留用户已写的有效循环容量、历史 WAF 和未来 WAF，并可见地要求核对其适用性；原来为空的参数继续为空。来源与限定使用原生 details，summary 是蓝色下划线文字，链接保留可读名称和新窗口的无障碍说明。录像小时、容量与来源记录均不转为认证耐久值。

### Unknown history and recovery

保留已知信息，再给出下一步。成功计算的历史未知结果用 word-result 表达“暂不能估算”，轻灰事实摘要继续显示总预算与年度未来主机写入需求；下方以“已知信息与下一步”标题引出恢复面板，不绘制现有卡时间曲线或显示虚构剩余量。

恢复面板复用 panel，内部间距为 12px、正文为 detail，说明最大行长为 70ch。两条恢复路径纵向排列，以轻分隔线和纵向 16px 留白区分；小标题为 14px、500 字重，说明为 12px。补充完整历史使用次按钮，带入成功快照负载计算选型使用主按钮；已知计算过程放入蓝色 12px summary 的披露中。

输入变化后，结果与来源仍显示上一次成功快照，保留琥珀提示，并同时禁用两条恢复动作，直到重新计算成功。补充历史聚焦累计量字段；带入负载转至选型并聚焦目标年限，原模式数据保留。此状态模式区分未知量与已知事实，不将总预算当作剩余预算。

### Navigation and disclosures

页头导航是 14px 原生按钮，最小高度 36px；当前页用信息浅蓝底、操作蓝文字和 `aria-current="page"`，hover 使用轻灰底。窄屏页头整体折行。

原理目录使用带边框的链接，hover 改为蓝色文字与边框；移动端改为折行。details 的 summary 使用 13px、500 字重和最小 36px 高度；指示方向由指定 Figma 的 SVG 表达，帮助或关闭操作保留可读名称。

### Native dialog and help popover

dialog 通过 `showModal()` 打开。最宽 560px，与 viewport 留 32px 总安全空间；可视高度同样留 32px，并在内部滚动。头部与正文使用 24px 横向留白，底部动作区粘附于内容下缘；600px 以下收为 16px。Esc、关闭按钮或背景外侧点击关闭，关闭后返回原焦点。关闭按钮为 32px 原生按钮内的 20px 代码 SVG，保留“关闭弹窗”名称；不把字体字形作为关闭图标。高级设置与历史估算在弹窗内编辑草稿，保存 / 采用与取消是独立动作。

帮助使用 `popover="auto"`，以 dialog 角色和标题关联说明。最宽 320px，视口两侧至少留 12px；通常距触发器下方 8px，空间不足时放到上方。滚动与 resize 后重新定位，内容超高时内部滚动；打开后首个动作获得焦点，关闭后返回触发器。示例侧车只展示原生面板的外观；弹窗与浮层生命周期保留在实际应用代码中。

## Do's and Don'ts

### Do:

- **Do** 复用前置令牌中的颜色、字体和圆角，并保留主结果的 display 角色。
- **Do** 让标签与实际输入关联，保留原生 select、details、dialog 和 popover 的语义。
- **Do** 同时展示状态文字与语义颜色；就近放置错误，并保留已显示结果的快照状态提示。
- **Do** 按可用容器宽度折行或单列，允许长公式、来源链接和数值换行。
- **Do** 保留键盘焦点环、帮助关闭后的焦点返回和减少动效支持。
- **Do** 在图表中保留蓝线、预算阈值、可读刻度和可展开的数值表。

### Don't:

- **Don't** 换用新的字体组合、装饰色板、夸张圆角或与指定 Figma 不一致的视觉身份。
- **Don't** 缩小主结果或正文来掩盖窄屏、容器不足或文本放大的排布问题。
- **Don't** 给静态分析面板添加装饰阴影、悬浮位移或数字计数动画。
- **Don't** 仅靠颜色说明警告、错误、当前选择或结果状态。
- **Don't** 将历史空图、断点误记录或已修复的刻度重叠写成设计规则。
- **Don't** 将侧车中的合成色阶当作新调色板令牌或实际主题。
