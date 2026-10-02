// Manufacturer facts are tied to a series, generation and exact capacity.
// This expanded catalog is separate from the original handoff source file.
const checked = '2026-10-02'
const unknownTbw = '厂商资料未明确 Host / NAND 计数口径；采用为主机预算时须确认是本次假设。'
const unreported = '所引资料未公开可用于本工具的主机 TBW 或 P/E；不按容量、速度等级或保修年限推定。'
const videoOnly = '录像耐久小时不是主机 TBW，不自动换算成额定写入预算。'
const tbw = (value, qualifier = '厂商原指标') => ({ type: 'manufacturer_TBW', value, unit: 'TB', counting_scope: 'unspecified', qualifier })
const pe = value => ({ type: 'PE_cycles', value, unit: 'cycles', scope: 'series' })
const video = (value, bitrate) => ({ type: 'video_hours', value, unit: 'hours', workload: { resolution: 'Full HD', ...(bitrate ? { bitrate_mbps: bitrate } : {}) } })

function family({ id, manufacturer, series, category, generation = '', capacities, source_url, source_locator, metrics = () => [], limitations = [], part = () => '' }) {
  return capacities.map(capacity => {
    const published_metrics = metrics(capacity)
    const hasTbw = published_metrics.some(metric => metric.type === 'manufacturer_TBW')
    const hasPe = published_metrics.some(metric => metric.type === 'PE_cycles')
    return { id: `${id}-${capacity}gb`, manufacturer, series, category, generation, capacity_gb: capacity, part_number: part(capacity), source_url, source_locator, checked, published_metrics, limitations,
      model_A_use: hasTbw ? unknownTbw : published_metrics.some(metric => metric.type === 'video_hours') ? videoOnly : hasPe ? '所引资料公开系列 P/E，但未公开此容量的主机 TBW；P/E 不能单独推出主机预算。' : unreported }
  })
}

export const presets = [
  ...family({ id: 'kingston-sdcit2', manufacturer: 'Kingston', series: 'Industrial SDCIT2', category: 'industrial', capacities: [8, 16, 32, 64, 128],
    source_url: 'https://www.kingston.com/datasheets/SDCIT2_us.pdf', source_locator: 'MKD-02122026 · pp.1–2，规格与脚注 3', part: capacity => `SDCIT2/${capacity}GB`,
    metrics: capacity => [...(capacity === 128 ? [tbw(3840, 'up to，最高容量 128 GB')] : []), pe(30000)],
    limitations: ['TLC 在 pSLC 模式；系列 P/E 不提供有效循环池容量或 WAF。', '3,840 TBW 仅对应最高容量 128 GB，不分配给 8 / 16 / 32 / 64 GB。'] }),
  ...family({ id: 'transcend-usd230i', manufacturer: 'Transcend', series: 'USD230I', category: 'industrial', generation: '产品线资料版', capacities: [2, 4, 8, 16, 32, 64],
    source_url: 'https://jp.transcend-info.com/Embedded/About/press/11754', source_locator: '产业用 SD 产品线 · USD230I 容量 / TBW 表与 60K P/E 说明', part: capacity => `TS${capacity}GUSD230I`,
    metrics: capacity => [tbw({ 2: 98, 4: 98, 8: 360, 16: 1400, 32: 1400, 64: 5800 }[capacity]), pe(60000)],
    limitations: ['SLC 模式；逐容量引用厂商表格，未用最大容量数值线性外推。', '资料不提供有效循环容量和 WAF；不同批次或资料版本需按具体料号核对。'] }),
  ...family({ id: 'samsung-pro-endurance-2022', manufacturer: 'Samsung', series: 'PRO Endurance', category: 'high_endurance', generation: '2022', capacities: [32, 64, 128, 256],
    source_url: 'https://news.samsung.com/global/samsung-unveils-new-pro-endurance-memory-card-optimized-for-surveillance-and-dashboard-cameras', source_locator: '2022-05-03 · 产品规格表及脚注 1',
    metrics: capacity => [video({ 32: 17520, 64: 35040, 128: 70080, 256: 140160 }[capacity], 26)],
    limitations: ['测试条件为 Full HD 1920×1080、26 Mbps；实际耐久随使用条件变化。'] }),
  ...family({ id: 'sandisk-high-endurance', manufacturer: 'SanDisk', series: 'High Endurance', category: 'high_endurance', generation: '05/2023 资料', capacities: [32, 64, 128, 256, 512],
    source_url: 'https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/product/memory-cards/high-endurance-uhs-i-microsd/data-sheet-high-endurance-uhs-i-microsd.pdf', source_locator: '05/2023 · pp.1–2，耐久表与脚注 1',
    metrics: capacity => [video({ 32: 2500, 64: 5000, 128: 10000, 256: 20000, 512: 40000 }[capacity])],
    limitations: ['耐久小时只针对 Full HD；4K UHD 总小时数更少。该资料未公开测试码率。'] }),
  ...family({ id: 'sandisk-max-endurance', manufacturer: 'SanDisk', series: 'MAX Endurance', category: 'high_endurance', generation: '01/2020 资料', capacities: [32, 64, 128, 256],
    source_url: 'https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/product/memory-cards/max-endurance-uhs-i-microsd/data-sheet-max-endurance-uhs-i-microsd.pdf', source_locator: '01/2020 · pp.1–2，容量 / 耐久表与脚注 1',
    metrics: capacity => [video({ 32: 15000, 64: 30000, 128: 60000, 256: 120000 }[capacity])],
    limitations: ['耐久小时只针对 Full HD；4K UHD 总小时数更少。该资料未公开测试码率。'] }),
  ...family({ id: 'sandisk-ultra-120', manufacturer: 'SanDisk', series: 'Ultra', category: 'consumer', generation: '120 MB/s 版', capacities: [16, 32, 64, 128, 200, 256, 400, 512, 1000],
    source_url: 'https://documents.sandisk.com/content/dam/asset-library/en_us/assets/public/sandisk/product/memory-cards/ultra-uhs-i-microsd/data-sheet-ultra-uhs-i-microsd-120mb.pdf', source_locator: '2020 · p.2，可用容量表（16 GB 版读取上限不同）',
    limitations: ['这份资料对应 120 MB/s 系列版本；读取速度与 A1 / U1 等级均不表示写入耐久。'] }),
  ...family({ id: 'kioxia-exceria', manufacturer: 'KIOXIA', series: 'EXCERIA', category: 'consumer', capacities: [16, 32, 64, 128, 256],
    source_url: 'https://europe.kioxia.com/en-europe/personal/micro-sd/exceria.html', source_locator: 'EXCERIA microSD · Capacity / Product Info', part: capacity => `LMEX1L${String(capacity).padStart(3, '0')}GG2`,
    limitations: ['仅引用标称容量；可存放视频的分钟数是单次存储量，不能当作循环写入耐久。'] }),
  ...family({ id: 'kingston-canvas-sdcs2', manufacturer: 'Kingston', series: 'Canvas Select Plus', category: 'consumer', generation: 'SDCS2 旧版', capacities: [64, 128, 256, 512],
    source_url: 'https://www.kingston.com/datasheets/SDCS2_en.pdf', source_locator: 'MKD-01102024 · pp.2–3，容量和料号表', part: capacity => `SDCS2/${capacity}GB`,
    limitations: ['SDCS2 系列资料；不与 SDCS3 或其他代际参数合并。'] }),
  ...[16, 32].flatMap(capacity => family({ id: 'kingston-canvas-sdcs2', manufacturer: 'Kingston', series: 'Canvas Select Plus', category: 'consumer', generation: 'SDCS2 旧版 / 已停产', capacities: [capacity],
    source_url: `https://www.kingston.com/en/memory/search/discontinuedmodels?partId=SDCS2%2F${capacity}GB`, source_locator: `官方已停产料号档案 · SDCS2/${capacity}GB`, part: value => `SDCS2/${value}GB`, limitations: ['旧卡型号留作识别；所引官方页面标记为已停产，不代表当前在售。'] })),
]

export const categories = [{ id: 'consumer', label: '消费卡' }, { id: 'high_endurance', label: '高耐久卡' }, { id: 'industrial', label: '工业卡' }, { id: 'custom', label: '自定义' }]
export const cardLabel = preset => `${preset.manufacturer} ${preset.series}${preset.generation ? ` · ${preset.generation}` : ''} · ${preset.capacity_gb === 1000 ? '1 TB' : `${preset.capacity_gb} GB`}`

export function applyPreset(mode, input, advanced, presetId) {
  const preset = presets.find(record => record.id === presetId)
  if (!preset) return clearPreset(mode, input, advanced)
  const updated = { ...input, presetId, cardName: `${preset.manufacturer} ${preset.series}`, nominalCapacity: String(preset.capacity_gb), presetAdopted: false, presetModified: false, category: preset.category, budgetNeedsConfirmation: false }
  if (mode === 'B') {
    const metric = preset.published_metrics.find(metric => metric.type === 'PE_cycles')
    updated.PE = metric ? String(metric.value) : ''
    // Reference presets supply published P/E only. Authored pool/WAF assumptions
    // remain the user's inputs; empty inputs stay empty, never nominal defaults.
  } else {
    const metric = preset.published_metrics.find(metric => metric.type === 'manufacturer_TBW')
    updated.E = metric ? String(metric.value) : ''; updated.eUnit = 'TB'
    updated.budgetNeedsConfirmation = !!metric && metric.counting_scope !== 'host'
  }
  return { input: updated, advanced: { ...advanced, sourceKind: 'manufacturer', model: cardLabel(preset), source: preset.source_url, locator: preset.source_locator } }
}

export function clearPreset(mode, input, advanced) {
  const preset = presets.find(record => record.id === input.presetId)
  if (!preset) return { input: { ...input, category: 'custom', brandFilter: '', capacityFilter: '' }, advanced }
  const metric = preset?.published_metrics.find(metric => metric.type === (mode === 'B' ? 'PE_cycles' : 'manufacturer_TBW'))
  const updated = { ...input, category: 'custom', brandFilter: '', capacityFilter: '', presetId: '', cardName: '', nominalCapacity: '', presetAdopted: false, presetModified: false, budgetNeedsConfirmation: false }
  // Remove an untouched factory value when its card is removed; retain deliberate user edits.
  if (metric && !input.presetModified) {
    if (mode === 'B') updated.PE = ''
    else updated.E = ''
  }
  return { input: updated, advanced: { ...advanced, sourceKind: 'assumption', model: '', source: '', locator: '' } }
}

export function adoptPreset(input, adopted = true) { return { ...input, presetAdopted: adopted } }
