import { Field, SelectField } from './components'
import { cardLabel, categories, presets } from './presets'

export default function PresetControls({ mode, input, errors, preset, onCategory, onPreset, onChange, onAdopt, onSelection }) {
  const byCategory = presets.filter(record => record.category === input.category)
  const brands = [...new Set(byCategory.map(record => record.manufacturer))].sort()
  const byBrand = byCategory.filter(record => !input.brandFilter || record.manufacturer === input.brandFilter)
  const capacities = [...new Set(byBrand.map(record => record.capacity_gb))].sort((a, b) => a - b)
  const matches = byBrand.filter(record => !input.capacityFilter || String(record.capacity_gb) === input.capacityFilter)
  const outsideFilter = preset && !matches.some(record => record.id === preset.id)
  const tbw = preset?.published_metrics.find(metric => metric.type === 'manufacturer_TBW')
  const pe = preset?.published_metrics.find(metric => metric.type === 'PE_cycles')
  const required = mode === 'B' ? [['C', '有效循环容量'], ['PE', 'P/E 上限'], ['wafFuture', '未来 WAF'], ['consumption', '已消耗写入量来源'], ...(input.consumption === 'nand' ? [['N', '累计 NAND 写入']] : input.consumption === 'estimate' ? [['H', '完整 Host 历史'], ['wafPast', '历史 WAF']] : []), ['q', '日均写入']] : mode === 'D' ? [['Y', '目标年限'], ['q', '日均写入'], ...(input.E && input.history === 'used' ? [['H', '完整 Host 历史']] : [])] : [['E', '主机写入预算'], ['history', '卡片状态'], ...(input.history === 'used' ? [['H', '完整 Host 历史']] : []), ['q', '日均写入']]
  const missing = required.filter(([key]) => !String(input[key] ?? '').trim()).map(([, label]) => label)
  return <div className="preset-controls">
    <div className="category-row"><span className="hint">卡片资料</span><div className="category-buttons" role="group" aria-label="预设分类">{categories.map(category => <button type="button" key={category.id} aria-pressed={category.id === input.category} className={category.id === input.category ? 'selected' : ''} onClick={() => onCategory(category.id)}>{category.label}</button>)}</div></div>
    {input.category !== 'custom' ? <>
      <div className="field-row preset-filters"><SelectField name="brandFilter" label="品牌筛选" value={input.brandFilter} onChange={value => { onChange('brandFilter', value); onChange('capacityFilter', '') }} options={[[ '', '全部品牌' ], ...brands.map(brand => [brand, brand])]} /><SelectField name="capacityFilter" label="容量筛选" value={input.capacityFilter} onChange={value => onChange('capacityFilter', value)} options={[[ '', '全部容量' ], ...capacities.map(capacity => [String(capacity), capacity === 1000 ? '1 TB' : `${capacity} GB`])]} /></div>
      <SelectField name="presetId" label={mode === 'D' ? '候选型号 / 容量（可选）' : '卡片型号 / 容量（可选）'} value={input.presetId} onChange={onPreset} options={[[ '', matches.length ? '请选择具体型号与容量' : '此筛选暂无型号，调整品牌或容量' ], ...(outsideFilter ? [[preset.id, `当前：${cardLabel(preset)}`]] : []), ...matches.map(record => [record.id, cardLabel(record)])]} />
      <p className="hint">已收录 {presets.length} 个型号与容量组合 · 筛选找到 {matches.length} 项。{outsideFilter ? '筛选不会更换当前卡片；选择新型号才会替换参数。' : '只填公开规格，未公开的耐久参数保留为空。'}</p>
    </> : null}
    {!preset ? <>
      <div className="field-row card-identity"><Field name="cardName" label="卡片型号（可选）" value={input.cardName} onChange={value => onChange('cardName', value)} placeholder="例如：品牌与系列" /><Field name="nominalCapacity" label="标称容量（可选）" value={input.nominalCapacity} onChange={value => onChange('nominalCapacity', value)} unit="GB" error={errors.nominalCapacity} placeholder="例如 16" /></div>
      <p className="hint">{input.category !== 'custom' ? '未选择预设，保留当前卡片记录。' : ''}型号和容量用于记录卡片；{mode === 'B' ? '标称容量不能代替有效循环容量。' : '已知主机 TBW 时，不填也能计算。容量本身不能推算耐久。'}</p>
    </> : null}
    {preset ? <div className="preset-facts">
      <strong className="preset-name">{cardLabel(preset)}</strong>
      {preset.part_number ? <p>料号：{preset.part_number}</p> : null}
      <dl className="preset-specs"><div><dt>标称容量</dt><dd>{preset.capacity_gb === 1000 ? '1 TB' : `${preset.capacity_gb} GB`}</dd></div>{preset.published_metrics.map(metric => <div key={metric.type}><dt>{metric.type === 'manufacturer_TBW' ? '厂商 TBW' : metric.type === 'PE_cycles' ? '系列 P/E' : '录像耐久'}</dt><dd>{metric.value.toLocaleString('zh-CN')} {metric.type === 'manufacturer_TBW' ? 'TB' : metric.type === 'PE_cycles' ? '次' : '小时'}</dd></div>)}</dl>
      <p>{input.presetModified ? '耐久参数已手改 · 按你的假设计算。' : `已自动填写：型号、标称容量${mode === 'B' && pe ? '、P/E 上限' : mode !== 'B' && tbw ? '、写入预算' : ''}。`}</p>
      <p>{missing.length ? <><strong>还需填写：</strong>{missing.join('、')}。</> : '使用数据保留你的输入；日均负载和历史不由预设推定。'}</p>
      {mode === 'B' && [input.C, input.wafFuture, input.wafPast].some(value => String(value).trim()) ? <p>已保留你填写的有效循环容量与 WAF 假设；这些数值由你提供，请核对是否适用于当前卡片。</p> : null}
      {mode !== 'B' && tbw && !input.presetModified ? <div className="preset-confirmation">
        <p>{tbw.qualifier} · {preset.model_A_use}</p>
        <label className="check-label"><input name="presetAdopted" type="checkbox" checked={input.presetAdopted} onChange={event => onAdopt(event.target.checked)} required={input.budgetNeedsConfirmation} aria-invalid={!!errors.presetAdopted} aria-describedby={errors.presetAdopted ? 'preset-confirmation-error' : undefined} /><span>将厂商 TBW 作为本次主机写入预算假设</span></label>
        {errors.presetAdopted ? <p id="preset-confirmation-error" className="field-error">{errors.presetAdopted}</p> : null}
      </div> : mode !== 'B' && !tbw ? <><p>{preset.model_A_use}</p>{mode === 'A' ? <button type="button" className="button" onClick={onSelection}>没有 TBW？计算选型需求</button> : null}</> : mode === 'B' ? <p>标称容量不是 NAND 循环池容量；P/E 不能单独推出主机 TBW。WAF 取决于实际负载与控制器。</p> : null}
      <details className="preset-source"><summary>厂商来源与适用条件</summary><div className="detail-content"><a href={preset.source_url} target="_blank" rel="noreferrer" aria-label="查看厂商来源（新窗口）">查看厂商来源</a><p>{preset.source_locator}</p>{preset.published_metrics.filter(metric => metric.type === 'video_hours').map(metric => <p key={metric.type}>Full HD{metric.workload.bitrate_mbps ? ` / ${metric.workload.bitrate_mbps} Mbps` : ' / 测试码率未公开'}；录像小时不自动转为主机 TBW。</p>)}{preset.limitations.map(line => <p key={line}>{line}</p>)}<p>来源核查：{preset.checked} · 来源已记录，实际使用条件仍需核对。</p></div></details>
    </div> : null}
  </div>
}
