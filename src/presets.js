import sourceData from '../docs/handoff/preset-sources.json'

export const presets = sourceData.records
export const categories = [{ id: 'consumer', label: '消费卡' }, { id: 'high_endurance', label: '高耐久卡' }, { id: 'industrial', label: '工业卡' }, { id: 'custom', label: '自定义' }]

export function applyPreset(mode, input, advanced, presetId) {
  const preset = presets.find(record => record.id === presetId)
  if (!preset) return { input: { ...input, presetId: '', presetAdopted: false, presetModified: false }, advanced: { ...advanced, sourceKind: 'assumption' } }
  const updated = { ...input, presetId, presetAdopted: false, presetModified: false, category: preset.category }
  if (mode === 'B') {
    const pe = preset.published_metrics.find(metric => metric.type === 'PE_cycles')
    updated.PE = pe ? String(pe.value) : ''
    // The nominal card capacity is not an effective NAND cycle pool.
    updated.C = ''; updated.wafFuture = ''; updated.wafPast = ''
  } else updated.E = ''
  return { input: updated, advanced: { ...advanced, sourceKind: 'manufacturer', model: `${preset.manufacturer} ${preset.series} ${preset.capacity_gb} GB`, source: preset.source_url, locator: preset.source_locator } }
}

export function adoptPreset(input) {
  const preset = presets.find(record => record.id === input.presetId)
  const metric = preset?.published_metrics.find(metric => metric.type === 'manufacturer_TBW')
  if (!metric) return input
  return { ...input, E: String(metric.value), eUnit: 'TB', presetAdopted: true, presetModified: false }
}
