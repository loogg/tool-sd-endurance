export const help = {
  E: { title: '主机写入预算', body: '具体型号与容量的主机侧 TBW，或你明确设定的假设预算。不是卡片容量。评级工况需匹配，本路径不再除以 WAF。', section: 'host' },
  H: { title: '全寿命累计 Host Writes', body: '从首次使用以来的累计主机写入，与预算保持相同计数口径。操作系统重启后的计数可能不覆盖完整历史；历史未知不能当作 0。', section: 'parameters' },
  q: { title: '自然日日均写入', body: '完整自然日的主机写入平均值，包含停机与工作日安排。不是现有文件大小；已经包含占空比时，不再重复乘开机时长。', section: 'parameters' },
  C: { title: '有效循环容量', body: '对应同一 NAND 工作模式与循环池的有效容量基数。不是默认的卡面容量或 TLC 原始容量；需核对 pSLC、保留区与坏块口径。', section: 'pe' },
  PE: { title: 'P/E 上限', body: '对应有效循环池、验证工况和 EOL / 保持要求的擦写次数。不能只凭消费卡、工业卡或 TLC 分类推定。', section: 'pe' },
  N: { title: '全寿命 NAND 写入', body: '采用计数定义清晰的全寿命 NAND 写入量。编程字节不是擦除循环的精确替代品；本模型假设同一循环池与近似均匀磨损。', section: 'pe' },
  wafFuture: { title: '未来 WAF', body: '未来负载下 NAND 写入量 ÷ Host 写入量，应来自代表性窗口或明确假设。必须大于 0，不从卡片分类推定，也不能代替全历史 WAF。', section: 'pe' },
  wafPast: { title: '全历史 WAF', body: '覆盖同一完整历史区间的 NAND / Host 写入比，用于估算已消耗 NAND 量。与未来 WAF 独立，不自动相等。', section: 'pe' },
  Y: { title: '目标年限', body: '按 365 天/年，以恒定自然日日均主机写入计算目标周期需求。候选卡不是必填项；基准需求不暗加安全或增长系数。', section: 'selection' },
}

export const sources = [
  ['S01', 'SD Association · SD 卡数据保持与使用条件', 'https://www.sdcard.org/press/thoughtleadership/what-to-know-before-storing-data-on-a-sd-memory-card/', 'SD 技术文章；保持、refresh 与掉电联合验证。'],
  ['S02', 'SD Association · 消费卡与工业卡的区别', 'https://www.sdcard.org/press/thoughtleadership/understanding-the-difference-between-consumer-and-industrial-sd-memory-cards/', '卡片分类不能提供统一耐久参数。'],
  ['S03', 'KIOXIA · SSD 耐久、TBW 与 WAF', 'https://americas.kioxia.com/content/dam/kioxia/en-us/business/memory/asset/KIOXIA-SSD-NAND-Endurance-Tech-Brief.pdf', '2021-03 Rev.1.0，pp.2–5；仅作定义与单位参照。'],
  ['S04', 'Kingston · TBW 与 DWPD', 'https://www.kingston.com/en/blog/servers-and-data-centers/understanding-ssd-endurance-tbw-dwpd', 'SSD 简化方法；没有任意 SD 的容量池或默认 WAF。'],
  ['S05', 'Seagate · 建立 SSD 耐久标准', 'https://www.seagate.com/files/staticfiles/docs/pdf/whitepaper/tp618-ssd-tech-paper-us.pdf', '2010-11 TP618.1-1011US；历史 JEDEC 要求解读，非 SD 保证。'],
  ['S06', 'Kingston · eMMC 生命周期', 'https://www.kingston.com/en/blog/embedded-and-industrial/emmc-lifecycle', 'eMMC 范围；文中 WAF 4–8 不是 SD 默认值。'],
  ['S07', 'Kingston · SDCIT2 官方产品规格', 'https://www.kingston.com/en/memory-cards/industrial-grade-microsd-uhs-i-u3', '最高容量 128 GB，up to 3840 TBW；内部指标，计数口径尚需确认。'],
  ['S08', 'Samsung · PRO Endurance 2022 官方规格', 'https://news.samsung.com/global/samsung-unveils-new-pro-endurance-memory-card-optimized-for-surveillance-and-dashboard-cameras', '2022-05-03；128 GB 为 70,080 录像小时，Full HD / 26 Mbps，非主机 TBW。'],
  ['S09', 'Western Digital · 工业 SD / microSD 产品简介', 'https://www.sandisk.com/tools/documentRequestHandler?docPath=/content/dam/doc-library/en_us/assets/public/western-digital/product/embedded-flash/product-brief/product-brief-western-digital-industrial-sd-microsd.pdf', 'WPB26-EN-US-0219–02；未核对图片表格，不作为预设数值。'],
  ['S10', 'Linux Kernel · I/O 统计与计数重置', 'https://docs.kernel.org/admin-guide/iostats.html', 'OS 计数不必然等于卡片全寿命写入。'],
  ['S11', 'Google / FAST · Flash Reliability in Production', 'https://www.usenix.org/system/files/conference/fast16/fast16-papers-schroeder.pdf', '2016 数据中心 SSD 研究，不用于 SD 失效概率推算。'],
  ['S12', 'Swissbit · NAND 耐久测试', 'https://www.swissbit.com/en/support/application-notes/nand-flash-endurance-testing', 'AN2107en Rev.1.0；循环速率和间歇影响应力，不默认加速等效。'],
]
