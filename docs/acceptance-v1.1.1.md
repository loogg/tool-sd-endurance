# v1.1.1 全功能与参数验收

日期：2026-10-02。仓库：`tool-sd-endurance`。本轮按用户“每个功能、参数合理性、审核优化直到验收”的要求审查现有功能；开发包作为模型和设计来源，用户后续反馈作为本轮验收要求。沿用 Figma 模型 00 和既有 Fluent 浅色界面。

## 验收范围与证据

验收针对下表的已发布功能、明确边界和回归组合。覆盖不意味着枚举所有浮点数、所有设备或证明实体 SD 卡寿命。实际 Browser Review 与自动化测试分别执行。

| 功能 | 验收内容 | 自动化证据 | 实际 Browser Review |
|---|---|---|---|
| A 主机 TBW | 新卡明确零历史；已用卡扣完整 Host 历史；未知不当零；不再除 WAF | model / parameters；tool.spec A / unknown | 新卡、已用、未知、修改后重新计算 |
| B 工程预算 | 同池有效容量 × P/E；扣 NAND 再除未来 WAF | model / parameters；tool.spec B | 实测 NAND：32 GB × 3000 − 16 TB，再 ÷ 2.5 = 32 TB |
| B 历史估算 | Host × 全历史 WAF；未来 WAF 独立；缺值定位和纠错 | model；audit.spec history modal | 5 TB × 3 = 15 TB NAND；未来 WAF 保留 2.5；可写 32.4 TB |
| D 两参数需求 | 只填自然日日均与年限；不暗加系数 | model / parameters；tool.spec D | 0.1 GB/天 × 365 × 0.5 = 0.01825 TB |
| D 候选比较 | 可选；新卡、完整历史、未知；正 / 负 / 零余量；收起保留 | model；tool.spec D；audit.spec removing candidate | 预算不足、历史缺失、清空候选恢复、未知不显示确定余量、采用 8 GB 预设 |
| 输入与单位 | 必填跟随当前分支；GB/TB/GiB/TiB；数字和单位分开；非法 / 极端输入 | parameters；audit.spec required / units | 输入、下拉、首错焦点、纠正和隐藏分支错误清除 |
| 自定义记录 | 型号和标称容量可选；无预设时一直可编辑；容量不参与 A 算术 | presets；tool.spec custom；audit.spec browsing | 浏览分类仍可纠正无效容量；高级记录同步型号 |
| 44 项预设 | 5 厂商；分类、品牌、容量过滤；逐项自动填公开数据；个人输入保留 | presets；audit.spec 每项 × A/B/D，共132次选取验证 | 工业卡 / Transcend / 8 GB 原生筛选与选取、360 TB 自动填入 |
| 来源与采用 | 型号、版本、原指标和缺项可查；未明确 Host/NAND 口径需显式假设采用 | presets；tool.spec preset adoption | 未确认提交聚焦复选框；确认后计算；展开厂商来源 |
| 未知历史恢复 | 已知总预算与年度需求；补历史 / 带入负载；旧快照时 Disabled | model；tool.spec recovery | 修改 q 后入口禁用；计算后 q36 显式带入 D；原模式数据保留 |
| 成功快照 | 输入修改和无效提交不混入结果；Enter / 按钮；重置仅当前模式 | model；tool.spec dirty / reset / navigation | A/B/D 切换、D 重置、A/B 原值保留、原理页返回 |
| 图表与数值 | 同一未舍入快照；阈值 / 累积；键盘提示框；数值表 | model；tool.spec reflow；audit.spec days / tooltip | 曲线、图表节点表、200% 提示框、320 px 提示框及真实滚动 |
| 敏感性与过程 | 仅改变指定量；未知 / 零负载 / 已达预算；无法表示的派生值不显示伪结果 | model；parameters；audit.spec zero | 零负载解释、已达预算优先、小时间按天显示、接近100%仍未达到 |
| 帮助与原理 | 展开、关闭、Esc、轻关闭、跳到对应原理与焦点 | tool.spec help；audit.spec help focus | 点击其他输入后焦点保持；跳转聚焦 theory-host；320 px 帮助 |
| 高级设置 | 来源和工况全部保存；只读身份；取消 / 关闭 / Esc / 背景丢弃草稿；Tab 环路 | tool.spec advanced；audit.spec records / modal | 逐项填写、保存并在来源快照查看、首尾 Tab、窄屏滚动和焦点返回 |
| 空 / 错误 / 禁用 | 空态不代填；错误可恢复；过期恢复入口禁用；实时播报 | tool / audit / accessibility | 均实际操作；计算同步执行，无人工 Loading 状态 |
| 响应式与本地处理 | 最小320px、典型1024px、桌面1440px、断点附近；200%文字；减少运动；无用户输入上传 | tool.spec reflow / text / requests；accessibility | 25个宽度、顶部与分析区分别滚动、文字放大、弹窗和帮助；临时覆盖已恢复 |

测试文件：`tests/model.test.js`、`tests/presets.test.js`、`tests/parameters.test.js`、`tests/e2e/tool.spec.js`、`tests/e2e/audit.spec.js`、`tests/e2e/accessibility.spec.js`。

## 参数合理性

| 参数 | 数学输入规则 | 实际使用约束 |
|---|---|---|
| 主机预算 E | 必填且 >0；D 候选可空，填写后必须 >0 | 对应具体型号 / 容量的同口径主机 TBW，或明确用户假设；不是卡面容量 |
| 完整历史 H / N | 活跃分支必填且 ≥0 | 全寿命、未漏重置；H 是 Host，N 是 NAND；未知必须选择未知，不能填零替代 |
| 自然日日均 q | 必填且 ≥0 | 包含停机时间；零仅表示当前无写入，保留预算且不显示无限寿命 |
| 有效循环容量 C | 必填且 >0，显式容量单位 | 同一 NAND 工作模式与循环池；不能从标称容量自动推定 |
| P/E 上限 | 必填且 >0 | 与同一循环池、工作模式和 EOL/保持要求匹配；系列值不等于整卡额定 TBW |
| 历史 / 未来 WAF | 活跃分支必填且 >0，各自独立 | NAND / Host；代表性窗口和同一计数范围。低于1需核对比值方向及计数口径，不能自动套默认值 |
| 目标年限 Y | 必填且 >0；允许小数 | 恒定自然日负载、365天/年；不隐加安全余量、增长率或冗余 |
| 标称容量 | 可空；填写则 >0 | 可选身份记录；不参与主机预算，不替代 NAND 有效容量 |
| 温度 / 断电保持 / 来源 | 可选文字记录，可表达负温度和范围 | 不直接参与乘数；保存或“已自行核对”不升级为厂商认证 |

数值支持十进制、小数和科学计数法，单位单独选择；拒绝空必填、负数、NaN、Infinity、溢出、下溢成零、十六进制、逗号分组及夹带单位。单位换算后及预算、时间、年度需求等派生结果也检查有限性。非活跃分支不验证隐藏历史；变更来源同时移除过时错误。

没有跨厂商统一的 SD 卡 P/E、WAF、写入负载或温度寿命系数，因此不设置虚构物理上限，不用卡片类别推定参数。数学可计算与参数已被厂商 / 台架验证分开呈现。P/E、TBW、WAF 定义参考 [KIOXIA 技术说明](https://americas.kioxia.com/content/dam/kioxia/en-us/business/memory/asset/KIOXIA-SSD-NAND-Endurance-Tech-Brief.pdf)；其 SSD 范围只用于定义，不作为任意 SD 默认参数。型号逐容量来源见 [预设资料](card-presets.md)。

## 本轮发现与修复

| 问题 | 修复与复核 |
|---|---|
| 历史 / 消耗来源切换留下隐藏错误；D 清空候选仍有比较错误 | 移除失活字段错误；单位更正同步清除对应错误 |
| 帮助轻关闭抢走刚点击输入的焦点 | 仅在焦点仍属于浮层时恢复；原理跳转聚焦目标章节 |
| 浏览预设后自定义无效容量隐藏且无法纠正 | 选定具体型号前仍显示可编辑的自定义身份 |
| 历史弹窗无效提交未定位、纠正后仍报错 | 首错焦点与随输入纠正的错误清除 |
| 正数小预算 / 短时间被显示成0；接近100%误显达到阈值 | 自适应有效位；不足1年按天；使用率保留阈值方向；图表轴、表格和提示同步 |
| 0预算 / 0负载敏感性误报超范围；派生情景极值失真 | 已达到优先；无法表示的情景标记超范围；未达到零负载给出解释 |
| 高级卡片身份与主界面重复编辑、记录不一致 | 来源弹窗只读引用主界面身份 |
| 必填字段未区分活跃分支 | 当前分支星号及原生 required；可选候选 / 身份保持可选 |
| 弹窗 Tab 可越出，方式切换短暂文字对比度不足 | 首尾键盘闭环；选中颜色与背景同时切换 |
| 原生浏览器激活提示后缩小窗口，旧位置撑宽页面 | 窄图表提示固定在内部、内容可换行；原生320px复查文档宽305px，无横向滚动 |
| 独立审核发现 B/D 精确相等被浮点残差误分类 | 预算乘积和差额按输入十进制及精确字节单位先计算，再转换数值快照；不使用统一epsilon；相等、跨单位与真实微小正负差额均作严格分类断言 |

上述提示框溢出由实际 Browser Review 发现，初次自动化未复现；新增测试覆盖激活、放大、缩小、弹窗和提示框边界，真实浏览器复核仍单独保留。

## 验证结果

干净 `npm ci`：205项依赖审计，0已知漏洞。lint、34项模型 / 预设 / 参数测试、66项 E2E 和生产构建全部通过。参数测试包含2,400个确定性场景，以独立 BigInt 有理数字节实现对照 A/B/D，不复用生产单位常量或计算公式；反复覆盖全部64种三单位组合。预设测试逐一覆盖44项在三个模式的选取与自动填写边界。

axe 检查11种主状态 / 浮层，使用 WCAG 2.0 A/AA、2.1 A/AA 和2.2 AA规则标签，无自动检测违规，没有排除规则；人工检查键盘、焦点、响应式和文字放大。自动扫描无违规不等于完成所有辅助技术认证。方法参照 [Playwright 官方可访问性测试说明](https://playwright.dev/docs/accessibility-testing)。

Impeccable 单次检测退出0，无主要发现；两项提示为既有文字选择色和半透明弹窗背景的文档色表覆盖问题，保留视觉系统，不作为功能缺陷。

Browser Review 宽度：1440、1360、1359、1358、1164、1163、1162、1101、1100、1099、1024、865、864、863、672、671、670、601、600、599、550、432、431、430、320 CSS px。覆盖模型成功结果、曲线与节点表；200%根文字单独检查表单、图表、提示和弹窗。截图为内置浏览器原生视口观察图，滚动后的局部取景如实标记，不用 E2E 截图充当视觉验收。

完整本地证据：`.impeccable/review/full-audit/`。公开关键证据：`docs/evidence/v1.1.1/`。独立审核记录见 [独立审核](finish-review-v1.1.1.md)。初审覆盖完整功能与参数范围，提出一项精确阈值材料问题；修正后同一审核者确认F01 resolved、remaining clear、disposition ship。最终verdict范围为已评分修正，初次完整审查仍有效。当前验收矩阵无未关闭的软件问题。

公开截图：[A 成功](evidence/v1.1.1/normal-A-desktop.jpg)、[短时间按天](evidence/v1.1.1/short-time-desktop.jpg)、[B 实测 NAND](evidence/v1.1.1/B-direct-nand.jpg)、[D 小需求](evidence/v1.1.1/D-small-demand.jpg)、[历史弹窗错误定位](evidence/v1.1.1/history-errors.jpg)、[320px弹窗](evidence/v1.1.1/modal-320.jpg)、[320px提示框](evidence/v1.1.1/tooltip-320.jpg)、[200%提示框](evidence/v1.1.1/text-200-tooltip.jpg)、[25宽度测量](evidence/v1.1.1/responsive.json)。均嵌入原生浏览器观察来源；截图拍摄于发布版本提交前，页眉可能仍显示v1.1.0。

独立审核修正证据：[D精确零余量](evidence/v1.1.1/D-equality-desktop.jpg)、[D跨单位320px](evidence/v1.1.1/D-equality-320.jpg)、[B精确已达到](evidence/v1.1.1/B-equality-desktop.jpg)、[B过程320px](evidence/v1.1.1/B-equality-320.jpg)。真实微小差额的额外原生截图与测试保存在完整本地证据中。
