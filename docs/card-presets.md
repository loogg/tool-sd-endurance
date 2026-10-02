# 预设卡资料与自动填入边界

核查日期：2026-10-02。扩展数据位于 `src/presets.js`，原始交付包 `docs/handoff/preset-sources.json` 保留不变。共 5 个厂商、44 个型号 / 容量组合；资料记录用于识别与计算参考，不代表全部型号覆盖或当前在售清单。

| 厂商与系列 | 所引容量（GB） | 公开耐久指标 | 来源与限定 |
|---|---|---|---|
| Kingston Industrial SDCIT2 | 8、16、32、64、128 | 系列 30K P/E；仅最高容量 128 GB 的 up to 3,840 TBW | [官方规格](https://www.kingston.com/datasheets/SDCIT2_us.pdf)，MKD-02122026，pp.1–2 / 脚注3；pSLC，内部指标，未明确 Host / NAND 计数口径 |
| Transcend USD230I | 2、4、8、16、32、64 | 逐容量 TBW 为 98、98、360、1,400、1,400、5,800 TB；所引产品线资料为 60K P/E | [官方产品线表](https://jp.transcend-info.com/Embedded/About/press/11754)；SLC 模式，不用最大容量外推，具体料号 / 批次需核对 |
| Samsung PRO Endurance 2022 | 32、64、128、256 | 17,520、35,040、70,080、140,160 录像小时 | [官方 2022 规格](https://news.samsung.com/global/samsung-unveils-new-pro-endurance-memory-card-optimized-for-surveillance-and-dashboard-cameras)；Full HD / 26 Mbps，非主机 TBW |
| SanDisk High Endurance | 32、64、128、256、512 | 2,500、5,000、10,000、20,000、40,000 录像小时 | [05/2023 规格](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/product/memory-cards/high-endurance-uhs-i-microsd/data-sheet-high-endurance-uhs-i-microsd.pdf)；Full HD，所引资料未公开测试码率 |
| SanDisk MAX Endurance | 32、64、128、256 | 15,000、30,000、60,000、120,000 录像小时 | [01/2020 规格](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/product/memory-cards/max-endurance-uhs-i-microsd/data-sheet-max-endurance-uhs-i-microsd.pdf)；Full HD，4K 总小时更少，码率未公开 |
| SanDisk Ultra 120 MB/s 版 | 16、32、64、128、200、256、400、512、1000（1 TB） | 所引资料未公开可用 TBW / P/E | [2020 容量规格](https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/product/memory-cards/ultra-uhs-i-microsd/data-sheet-ultra-uhs-i-microsd-120mb.pdf)；16 GB 读取上限不同，读取速度不是耐久 |
| KIOXIA EXCERIA | 16、32、64、128、256 | 所引资料未公开可用 TBW / P/E | [官方产品规格](https://europe.kioxia.com/en-europe/personal/micro-sd/exceria.html)；存储录像分钟数是单次容量，非循环写入耐久 |
| Kingston Canvas Select Plus SDCS2 | 16、32、64、128、256、512 | 所引资料未公开可用 TBW / P/E | [2024 规格](https://www.kingston.com/datasheets/SDCS2_en.pdf)给出 64–512 GB；16 / 32 GB 分别引用[16 GB 官方停产档案](https://www.kingston.com/en/memory/search/discontinuedmodels?partId=SDCS2%2F16GB)、[32 GB 官方停产档案](https://www.kingston.com/en/memory/search/discontinuedmodels?partId=SDCS2%2F32GB)，界面明确标记旧版 / 已停产 |

选择型号会填入名称、标称容量和来源记录。A / D 仅自动填该具体容量公开的厂商 TBW；B 仅自动填公开 P/E。所引厂商 TBW 没有清晰区分 Host / NAND，必须由用户勾选采用为本次主机预算假设，或手改为自己的假设。确认来源不等于实际使用条件经过验证。

日均写入量、已使用历史、有效 NAND 循环容量和 WAF 不能从品牌或分类推出。选择卡片保留个人负载和消耗来源；B 的型号参考保留用户已经填写的循环容量及历史 / 未来 WAF 假设，并明确提示核对其是否适用于当前卡片。空白输入仍为空，不用标称容量填循环池，也不填默认 WAF。录像小时保留为原指标，不自动转成额定主机 TBW。

分类、品牌和容量只用于浏览筛选，不替换当前卡片或改变成功计算快照。选新型号才更新卡片参数；明确切换自定义会移除未手改的厂家值，保留用户主动修改的预算 / P/E 假设。自定义型号与标称容量可不填；若填容量，则校验为有限正值，仅用于记录，不参与预算公式。
