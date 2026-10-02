import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { exact, format, projection, sensitivity } from './model'
import { presets } from './presets'
import { SnapshotRecords } from './components'

function ProjectionChart({ result }) {
  const [narrow, setNarrow] = useState(false)
  const [scale, setScale] = useState(1)
  const chart = projection(result)
  const title = result.mode === 'D' ? '目标周期写入累积' : result.mode === 'B' ? '未来主机写入投影' : '写入量投影'
  if (!chart) return <section className="panel chart-card"><h3>{title}</h3><div className="chart-empty"><p>{result.status === 'unknown' ? '历史未知，不能绘制现有卡的时间投影。' : result.status === 'reached' ? '已达到设定写入预算，无剩余时间投影。' : '当前负载为 0，无法推算达到预算的时间。'}</p></div><p className="hint">预算不是健康度，达到预算不等于卡已损坏。</p></section>
  const ticks = Array.from({ length: narrow ? 3 : 5 }, (_, i) => chart.horizon * (i / (narrow ? 2 : 4)))
  const highest = Math.max(chart.points.at(-1).tb, chart.threshold ?? 0)
  const maxY = highest > 0 ? highest : 1
  return <section className="panel chart-card"><h3>{title}</h3><p className="hint">从现在起 · {exact(result.qGB)} GB/自然日{result.mode === 'B' ? ` · 未来 WAF ${exact(result.wafFuture)}` : ''}</p>
    <div className="chart" role="img" aria-label={`${title}：${exact(chart.points[0].tb)} TB 到 ${exact(chart.points.at(-1).tb)} TB；${exact(chart.horizon)} 年。${chart.threshold === null ? '未设候选阈值。' : `预算阈值 ${exact(chart.threshold)} TB。`}`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={width => { const textScale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16; setScale(textScale); setNarrow(width < 380 * textScale) }}>
        <LineChart data={chart.points} margin={{ top: 18 * scale, right: 16 * scale, left: 0, bottom: 4 }} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
          <XAxis dataKey="years" type="number" domain={[0, chart.horizon]} height={40 * scale} tickMargin={12 * scale} ticks={ticks} tickFormatter={value => value === 0 ? '现在' : `${format(value)} 年`} stroke="var(--border)" tick={{ fill: 'var(--text-secondary)', fontSize: '.6875rem' }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, maxY]} ticks={[0, maxY / 2, maxY]} width={(narrow ? 52 : 60) * scale} tickFormatter={value => `${Math.abs(value) >= 1e4 ? value.toExponential(1) : exact(value)}${value === 0 ? '' : ' TB'}`} tick={{ fill: 'var(--text-secondary)', fontSize: '.6875rem' }} tickLine={false} axisLine={false} />
          <Tooltip formatter={value => [`${exact(value)} TB`, '主机写入量']} labelFormatter={value => `从现在起 ${exact(value)} 年`} contentStyle={{ borderRadius: '4px', borderColor: 'var(--border)', color: 'var(--text)', fontSize: '13px' }} />
          {chart.threshold !== null ? <ReferenceLine y={chart.threshold} stroke="var(--warning)" strokeWidth={1} /> : null}
          <Line type="linear" dataKey="tb" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="chart-caption"><span>当前 {exact(chart.points[0].tb)} TB → {exact(chart.points.at(-1).tb)} TB</span>{chart.threshold !== null ? <span className="threshold-label">{result.mode === 'D' ? '候选可用预算' : '设定写入量'} {exact(chart.threshold)} TB</span> : null}</div>
    <details className="chart-data"><summary>查看图表数值</summary><table><caption>{title}的情景节点</caption><thead><tr><th>从现在起（年）</th><th>主机写入量（TB）</th></tr></thead><tbody>{[0, 8, 16].map(i => <tr key={i}><td>{exact(chart.points[i].years)}</td><td>{exact(chart.points[i].tb)}</td></tr>)}</tbody></table></details>
  </section>
}

function Sensitivity({ result }) {
  const rows = sensitivity(result)
  const max = Math.max(...rows.map(row => row.value ?? 0), 1)
  return <section className="panel sensitivity"><h3>{result.mode === 'D' ? '目标年限敏感性' : '写入负载敏感性'}</h3><p className="hint">仅改变{result.mode === 'D' ? '目标年限，日均写入保持不变' : '自然日日均写入量，其他参数保持不变'}</p><ul>{rows.map((row, index) => <li key={index} className={row.current ? 'current' : ''}><span>{exact(row.labelValue)} {result.mode === 'D' ? '年' : 'GB/天'}</span><span className="bar-track" aria-hidden="true"><span style={{ width: `${(row.value ?? 0) / max * 100}%` }} /></span><strong>{row.value === null ? result.status === 'unknown' ? '历史未知' : result.status === 'zero' ? '无法推算' : '超出范围' : `${format(row.value)} ${result.mode === 'D' ? 'TB' : '年'}`}</strong></li>)}</ul></section>
}

function Steps({ result }) {
  const n = exact
  let rows
  if (result.mode === 'D') rows = [
    ['统一单位', `${n(result.qGB)} GB/天 = ${n(result.qTB)} TB/天`],
    ['一年写入', `${n(result.qTB)} × 365 = ${n(result.qTB * 365)} TB/年`],
    ['目标需求', `${n(result.qTB * 365)} × ${n(result.Y)} = ${n(result.required)} TB`],
    ['候选比较', result.available === null ? result.E === undefined ? '未选候选，不计算余量。' : '候选历史未知，不计算确定余量。' : `${n(result.available)} − ${n(result.required)} = ${n(result.margin)} TB`],
  ]
  else {
    rows = result.mode === 'B' ? [
      ['NAND 预算', `${n(result.C)} TB × ${n(result.PE)} = ${n(result.nandBudget)} TB`],
      ...(result.wafPast !== undefined ? [['历史估算', `${n(result.H)} TB × ${n(result.wafPast)} = ${n(result.N)} TB NAND`]] : []),
      ['剩余主机量', result.N === null ? '历史未知，不计算现有卡剩余预算。' : `max(${n(result.nandBudget)} − ${n(result.N)}, 0) ÷ ${n(result.wafFuture)} = ${n(result.remaining)} TB`],
    ] : [['剩余耐久', result.H === null ? '历史未知，不按 0 扣除。' : `max(${n(result.E)} − ${n(result.H)}, 0) = ${n(result.remaining)} TB`]]
    rows.push(['统一单位', `${n(result.qGB)} GB/天 = ${n(result.qTB)} TB/天`], ['换算天数', result.days === null ? result.status === 'unknown' ? '完整历史未知，无法投影时间。' : '日均写入为 0，无法按当前负载推算。' : result.status === 'reached' ? '预算已达到；剩余预算为 0。' : `${n(result.remaining)} ÷ ${n(result.qTB)} = ${n(result.days)} 天`], ['换算年限', result.years === null ? '不显示无限寿命或现有卡失效日期。' : `${n(result.days)} ÷ 365 ≈ ${format(result.years)} 年`])
  }
  return <section className="panel steps"><h3>计算过程</h3><ol>{rows.map(([title, value]) => <li key={title}><div><strong>{title}</strong><span className="formula">{value}</span></div></li>)}</ol><p className="hint">1 TB = 1000 GB；GiB / TiB 显式换算；中间值不舍入。</p></section>
}

function Budget({ result }) {
  if (result.mode === 'D') return <section className="panel budget"><h3>{result.margin === null ? '写入需求' : '选型余量'}</h3><p className="budget-value">{result.margin === null ? `${format(result.required)} TB` : `${result.margin >= 0 ? '+' : ''}${format(result.margin)} TB`}</p><p className="hint">需求 {exact(result.required)} TB{result.available !== null ? ` · 候选可用 ${exact(result.available)} TB` : ''}</p><p className="hint">{result.margin === null ? result.E === undefined ? '未选候选卡，可展开比较。' : '候选历史未知，不计算确定余量。' : result.margin >= 0 ? '写入量比较满足；' : '写入量比较不足；'}温度、断电保持与掉电条件仍需核对。</p></section>
  const b = result.mode === 'B'
  return <section className="panel budget"><h3>{b ? 'NAND 写入预算' : '耐久预算'}</h3><p className="budget-value">{result.usedRatio === null ? '历史未知' : `${format(Math.max(1 - result.usedRatio, 0) * 100)}% 剩余`}</p><p className="hint">{b ? `已用 ${exact(result.N)} TB · 总预算 ${exact(result.nandBudget)} TB` : `已写入 ${exact(result.H)} TB · 剩余 ${exact(result.remaining)} TB`}</p>{result.usedRatio !== null ? <div className="budget-track" role="img" aria-label={`预算已用 ${format(result.usedRatio * 100)}%`}><span style={{ width: `${Math.min(result.usedRatio, 1) * 100}%` }} /></div> : null}<p className="hint">{b ? `剩余 ${exact(result.nandRemaining)} TB NAND；未来 WAF ${exact(result.wafFuture)}。条件性工程近似。` : `设定主机预算 ${exact(result.E)} TB。`}</p><p className="hint">写入量差额不是健康度或存活概率。</p></section>
}

function UnknownHistory({ result, dirty, onHistory, onSelection }) {
  return <section className="panel unknown-history">
    <h3>选择下一步</h3>
    <p>计算现有卡的剩余时间，需要从首次使用以来的{result.mode === 'B' ? '累计 NAND 写入量，或完整 Host 历史与历史 WAF' : '累计主机写入量'}。历史未知时，已知的总预算和未来负载仍可作为参考。</p>
    <div className="recovery-options">
      <div><h4>有完整计数记录</h4><p>补充累计历史后，重新计算剩余预算和时间。</p><button type="button" className="button" disabled={dirty} onClick={onHistory}>补充累计历史</button></div>
      <div><h4>只想规划未来使用</h4><p>带入 {exact(result.qGB)} GB/天，再填目标年限，计算需要多少写入预算。</p><button type="button" className="button primary" disabled={dirty} onClick={onSelection}>带入此负载算选型需求</button></div>
    </div>
    {dirty ? <p className="hint">参数已修改，请重新计算后使用以上入口。</p> : null}
    <details className="known-calculation"><summary>查看已知信息的计算过程</summary><div className="detail-content">
      {result.mode === 'B' ? <p className="formula">总 NAND 磨损预算 ≈ {exact(result.C)} TB × {exact(result.PE)} = {exact(result.nandBudget)} TB NAND。有效循环池与 P/E 均按本次输入假设。</p> : <p>设定主机总预算：{exact(result.E)} TB。未扣除未知历史，不作为剩余预算。</p>}
      <p className="formula">每年主机写入需求 = {exact(result.qGB)} GB/天 ÷ 1000 × 365 = {exact(result.annualHostWrites)} TB/年。</p>
      <p className="hint">这里的需求描述未来负载；无法据此判断现有卡能否满足。</p>
    </div></details>
  </section>
}

export default function Analysis({ state, mode, dirty, onHistory, onSelection }) {
  const { snapshot, errors, input } = state
  const result = snapshot?.result
  const unknown = !result && (mode === 'B' ? input.consumption === 'unknown' : mode === 'A' && input.history === 'unknown')
  const status = dirty ? '待重新计算' : result?.status === 'unknown' || unknown ? '历史未知' : result?.status === 'reached' ? '预算已达到' : result?.status === 'zero' ? '零负载' : result ? '假设情景' : '待输入'
  const value = result ? mode === 'D' ? `${format(result.required)} TB` : result.status === 'unknown' ? '暂不能估算' : result.status === 'reached' ? '预算已达到' : result.years === null ? '—' : `${format(result.years)} 年` : '—'
  const label = result?.status === 'unknown' ? '缺少完整历史，无法推算现有卡剩余时间' : mode === 'D' ? '目标周期主机写入需求' : mode === 'B' ? '条件性主机写入预算时间' : '预计达到设定写入量'
  const chartTitle = mode === 'D' ? '目标周期写入累积' : mode === 'B' ? 'NAND 预算对应的主机写入投影' : '写入量投影'
  return <div className="analysis">
    <section className="panel result-panel" aria-label="计算结果"><div className="panel-title"><h2>{Object.values(errors).some(Boolean) && !result ? '请检查输入' : '结果'}</h2><span className={`chip ${dirty || result || unknown ? 'warning' : ''}`}>{status}</span></div><div className="result-main"><div><p className={`result-value ${['reached', 'unknown'].includes(result?.status) ? 'word-value' : ''}`}>{value}</p><p className="hint">{label}</p></div><div className="result-facts">{!result ? <><strong>{unknown ? '暂不能推算现有卡时间' : mode === 'D' ? '填写两项参数即可计算' : '还缺少必要输入'}</strong><p>{unknown ? '提供完整历史，或切换选型需求。' : mode === 'D' ? '目标年限 · 日均写入量' : mode === 'B' ? '有效循环容量 / P/E · 消耗来源 · 未来 WAF / 日均写入' : '主机写入预算 · 卡片状态 · 日均写入量'}</p></> : mode === 'D' ? <><Fact label={result.available === null ? '目标年限' : '候选可用预算'} value={result.available === null ? `${exact(result.Y)} 年` : `${exact(result.available)} TB`} /><Fact label={result.margin === null ? '日均写入' : '候选余量'} value={result.margin === null ? `${exact(result.qGB)} GB/天` : `${result.margin >= 0 ? '+' : ''}${format(result.margin)} TB`} /></> : result.status === 'unknown' ? <><Fact label={mode === 'B' ? '总 NAND 磨损预算' : '设定主机总预算'} value={`${exact(mode === 'B' ? result.nandBudget : result.E)} TB${mode === 'B' ? ' NAND' : ''}`} /><Fact label="每年主机写入需求" value={`${exact(result.annualHostWrites)} TB/年`} /></> : <><Fact label={mode === 'B' ? '可写主机预算' : '剩余写入预算'} value={`${exact(result.remaining)} TB`} /><Fact label={mode === 'B' ? 'NAND 预算已用' : '预算已用'} value={`${format(result.usedRatio * 100)}%`} /></>}</div></div>
      {dirty ? <p className="notice compact">参数已修改。下方结果、图表与过程仍是上一次成功计算的快照。</p> : null}
      {result?.status === 'zero' ? <p className="notice compact">当前负载为 0，保留写入预算；无法推算时间，不表示无限寿命。</p> : null}
      {result?.status === 'reached' ? <p className="notice compact">已达到或超出设定写入量；这不能判定 SD 卡已损坏。</p> : null}
    </section>
    <div className="analysis-heading"><h2>{result?.status === 'unknown' ? '已知信息与下一步' : '结果分析'}</h2>{result ? <span className="hint">{mode === 'B' ? '工程近似' : '假设场景'} · 从现在起</span> : null}</div>
    {!result ? <><section className="panel chart-card empty-card"><h3>{chartTitle}</h3><div className="chart-empty"><p>{unknown ? '提供完整历史后再显示现有卡投影' : mode === 'D' ? '填写日均写入与目标年限后显示需求' : '填写必要参数后显示写入量投影'}</p></div></section><div className="panel empty-analysis">{[mode === 'D' ? '写入需求' : '耐久预算', '敏感性分析', '计算过程'].map(item => <div key={item}><span>{item}</span><span>待计算</span></div>)}</div></> : <>{result.status === 'unknown' ? <UnknownHistory result={result} dirty={dirty} onHistory={onHistory} onSelection={onSelection} /> : <><div className="top-analysis"><Budget result={result} /><ProjectionChart result={result} /></div><div className="bottom-analysis"><Sensitivity result={result} /><Steps result={result} /></div></>}<SnapshotRecords advanced={snapshot.advanced} preset={presets.find(preset => preset.id === snapshot.input.presetId)} modified={snapshot.input.presetModified} mode={mode} /></>}
  </div>
}

function Fact({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div> }
