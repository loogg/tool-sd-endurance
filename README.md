# SD 卡耐久分析

独立、纯前端的 SD 卡写入预算与选型工具。全部用户输入和计算留在浏览器本地，无后端、遥测或输入上传。

- A：以主机写入预算与完整 Host 历史计算剩余量和达到预算的情景时间，不再除以 WAF。
- B：按有效循环容量 × P/E，先扣 NAND 消耗，再除未来 WAF；支持独立的全历史 WAF 估算。
- D：只填自然日日均写入和目标年限即可计算需求；候选卡可选。
- 帮助、计算原理、真实型号来源、高级设置草稿、单位换算与完整分析图表。

结果是预算及情景时间，不能解释为失效日期、健康百分比或保证寿命。未知历史不默认为零。Kingston / Samsung 首批预设保留原指标与缺项，不把录像小时记成主机 TBW。

## 运行与检查

需要 Node.js 24 LTS（CI 使用 LTS）。在本仓库运行：

```powershell
npm ci
npm run dev
# 浏览器打开 Vite 输出的 /tool-sd-endurance/ 地址
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

构建目录为 `dist/`，资源 base 固定为 `/tool-sd-endurance/`，GitHub Actions 使用当前仓库名。静态服务器应将构建内容挂载于该路径；`npm run preview` 可直接验证。发布附件保留同名目录，可从解压根目录启动静态服务器。

## 交付与验收

- 开发包原件：`docs/handoff/`。
- 使用的 Figma 基线：2026-10-01 读取的文件 `jw3p4QykbgwxkEE9MFQnF4`，模型 00、产品 01、设计系统 02。
- 成品检查证据与结论：`docs/acceptance-report.md`。
- 独立完成审核：`docs/finish-review.md`。
- 设计系统记录：`DESIGN.md`。

版本以 `package.json.version` 为准。普通提交运行 CI，仅 `v*.*.*` 标签部署本仓库的 GitHub Pages。工具箱目录更新与工具发布各自在自己的仓库中完成。
