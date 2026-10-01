import { useEffect, useRef, useState } from 'react'
import Analysis from './Analysis'
import { AdvancedModal, Chevron, Field, HelpPopover, HistoryModal, SelectField } from './components'
import { blankAdvanced, blankInput, calculate, exact, signature } from './model'
import { adoptPreset, applyPreset, categories, presets } from './presets'
import { help } from './help'
import Theory from './Theory'

const histories = [['', '请选择新卡或已使用'], ['new', '全新卡 · 明确零历史'], ['used', '已使用 · 历史完整'], ['unknown', '已使用 · 历史未知']]
const consumptions = [['', '请选择消耗来源'], ['new', '全新卡 · 明确 NAND 消耗为 0'], ['nand', '已用卡 · 全寿命 NAND 写入计数'], ['estimate', '已用卡 · 完整 Host 历史 × 历史 WAF'], ['unknown', '已使用 · 历史未知']]
const freshState = mode => ({ input: blankInput(mode), advanced: blankAdvanced(), snapshot: null, errors: {} })

export default function App() {
  const [states, setStates] = useState(() => Object.fromEntries(['A', 'B', 'D'].map(mode => [mode, freshState(mode)])))
  const [mode, setMode] = useState('A')
  const [budgetMode, setBudgetMode] = useState('A')
  const [view, setView] = useState('analysis')
  const [modal, setModal] = useState(null)
  const [helpState, setHelpState] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const formRef = useRef(null)
  const viewScroll = useRef({ analysis: 0, theory: 0 })
  const theoryTarget = useRef(null)
  const state = states[mode]
  const { input, advanced, errors, snapshot } = state
  const dirty = !!snapshot && signature(input, advanced) !== snapshot.signature
  const preset = presets.find(record => record.id === input.presetId)
  function updateState(update) { setStates(old => ({ ...old, [mode]: update(old[mode]) })) }
  function change(key, value) {
    updateState(old => ({ ...old, input: { ...old.input, [key]: value, presetModified: old.input.presetModified || (!!old.input.presetId && ['E', 'eUnit', 'C', 'cUnit', 'PE', 'wafFuture', 'wafPast'].includes(key)) }, errors: { ...old.errors, [key]: undefined } }))
  }
  function switchMode(next) {
    setHelpState(null)
    setMode(next)
    if (next !== 'D') setBudgetMode(next)
    setAnnouncement(`已切换到${next === 'D' ? '选型需求' : next === 'B' ? 'P/E 工程估算' : '主机写入预算'}，保留各模式数据。`)
  }
  function navigate(next, section = null) {
    viewScroll.current[view] = window.scrollY
    theoryTarget.current = section
    setHelpState(null)
    setView(next)
  }
  useEffect(() => {
    if (view === 'theory' && theoryTarget.current) document.getElementById(`theory-${theoryTarget.current}`)?.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: viewScroll.current[view], behavior: 'instant' })
  }, [view])
  function submit(event) {
    event.preventDefault()
    const calculated = calculate(mode, input)
    if (calculated.errors) {
      updateState(old => ({ ...old, errors: calculated.errors, input: mode === 'D' && ['E', 'H', 'history'].some(key => calculated.errors[key]) ? { ...old.input, candidateOpen: true } : old.input }))
      setAnnouncement(`计算未更新。请检查 ${Object.keys(calculated.errors).length} 项输入。`)
      requestAnimationFrame(() => {
        const target = Array.from(formRef.current?.elements || []).find(element => calculated.errors[element.name])
        if (target) { target.focus(); target.scrollIntoView({ block: 'center', behavior: 'instant' }) }
      })
      return
    }
    const success = { result: calculated.result, input: { ...input }, advanced: { ...advanced }, signature: signature(input, advanced) }
    updateState(old => ({ ...old, snapshot: success, errors: {} }))
    const r = calculated.result
    setAnnouncement(mode === 'D' ? `计算成功。目标需求 ${exact(r.required)} TB。` : r.status === 'unknown' ? '历史未知，不推算现有卡剩余时间。' : r.status === 'zero' ? `剩余预算 ${exact(r.remaining)} TB。当前负载为零，无法推算时间。` : r.status === 'reached' ? '预算已达到。这不表示卡已损坏。' : `计算成功。剩余预算 ${exact(r.remaining)} TB，预计 ${exact(r.years)} 年达到设定写入量。`)
  }
  function choosePreset(id) {
    updateState(old => ({ ...old, ...applyPreset(mode, old.input, old.advanced, id), errors: {} }))
  }
  const openHelp = (topic, anchor) => setHelpState(old => old?.topic === topic ? null : { topic, anchor })
  const field = (name, label, { unit, unitKey, placeholder, helpKey = name, disabled = false } = {}) => <Field name={name} label={label} value={input[name]} onChange={value => change(name, value)} unit={unit} unitValue={unitKey ? input[unitKey] : undefined} onUnitChange={unitKey ? value => change(unitKey, value) : undefined} error={errors[name]} placeholder={placeholder} helpKey={help[helpKey] ? helpKey : null} onHelp={openHelp} disabled={disabled} />
  const historyField = label => <SelectField name="history" label={label} value={input.history} onChange={value => change('history', value)} options={histories} error={errors.history} />
  const presetControls = <PresetControls mode={mode} input={input} preset={preset} onCategory={category => updateState(old => ({ ...old, input: { ...old.input, category, presetId: '', presetAdopted: false, presetModified: false }, advanced: { ...old.advanced, sourceKind: 'assumption', model: '', source: '', locator: '' } }))} onPreset={choosePreset} onAdopt={() => updateState(old => ({ ...old, input: adoptPreset(old.input), errors: { ...old.errors, E: undefined } }))} />
  const sourceSummary = preset ? `${preset.manufacturer} ${preset.series} ${preset.capacity_gb} GB · ${input.presetModified ? '手改假设' : '有来源，条件未验证'}` : '自定义参数 · 用户假设'
  return <>
    <a className="skip-link" href="#main">跳到主要内容</a>
    <header className="site-header"><div className="header-inner"><div className="brand"><h1>SD 卡耐久分析</h1><span className="version">v{import.meta.env.APP_VERSION}</span></div><nav aria-label="主导航"><button type="button" className={view === 'analysis' ? 'active' : ''} aria-current={view === 'analysis' ? 'page' : undefined} onClick={() => navigate('analysis')}>计算分析</button><button type="button" className={view === 'theory' ? 'active' : ''} aria-current={view === 'theory' ? 'page' : undefined} onClick={() => navigate('theory')}>计算原理</button></nav></div></header>
    <main id="main" className="workspace">
      {view === 'analysis' ? <div className="calculator-layout">
        <form ref={formRef} className="panel input-panel" onSubmit={submit} noValidate>
          <section className="goal-section"><h2>计算目标</h2><div className="choice-buttons" role="group" aria-label="计算目标"><button type="button" aria-pressed={mode !== 'D'} className={mode !== 'D' ? 'selected' : ''} onClick={() => switchMode(budgetMode)}>写入预算</button><button type="button" aria-pressed={mode === 'D'} className={mode === 'D' ? 'selected' : ''} onClick={() => switchMode('D')}>选型需求</button></div></section>
          <div className="parameter-sections">
            {mode === 'A' ? <>
              <section className="parameter-section"><h2>卡片与耐久</h2>{presetControls}{field('E', '主机写入预算', { unitKey: 'eUnit', placeholder: '例如 128' })}<p className="hint">具体型号保留来源限定；自定义数值作为假设。</p></section>
              <section className="parameter-section"><h2>写入负载</h2>{historyField('卡片状态')}<div className={`field-row ${input.history !== 'used' ? 'one-field' : ''}`}>{input.history === 'used' ? field('H', '全寿命累计 Host Writes', { unitKey: 'hUnit', placeholder: '请输入完整历史累计值' }) : null}{field('q', '日均写入', { unitKey: 'qUnit', placeholder: '例如 35' })}</div><p className="hint">{input.history === 'new' ? '你已明确声明全新卡，累计历史按 0 计算。' : input.history === 'unknown' ? '历史未知不能按 0 处理。可切换选型需求，计算未来所需预算。' : '按完整自然日平均，包含停机时间。'}</p></section>
            </> : mode === 'D' ? <section className="parameter-section plan-section"><h2>使用计划</h2><div className="field-row">{field('Y', '目标年限', { unit: '年', placeholder: '例如 5' })}{field('q', '日均写入', { unitKey: 'qUnit', placeholder: '例如 35' })}</div><p className="hint">日均按完整自然日平均，包含停机时间。</p></section> : <>
              <section className="parameter-section pe-section"><h2>NAND 磨损预算</h2><div className="choice-buttons" role="group" aria-label="预算方法"><button type="button" onClick={() => switchMode('A')}>主机 TBW</button><button type="button" className="selected" aria-pressed="true">P/E 估算</button></div><div className="field-row">{field('C', '有效循环容量', { unitKey: 'cUnit' })}{field('PE', 'P/E 上限', { unit: '次' })}</div><p className="hint">容量需对应同一 NAND 工作模式和循环池，不能默认使用卡面容量。</p>
                <details open={input.referenceOpen} onToggle={event => { if (event.currentTarget.open !== input.referenceOpen) change('referenceOpen', event.currentTarget.open) }} className="reference-disclosure"><summary><Chevron open={input.referenceOpen} />型号参考（可选）</summary><div className="detail-content">{presetControls}</div></details>
              </section><section className="parameter-section pe-workload"><SelectField name="consumption" label="已经消耗的写入量来源" value={input.consumption} onChange={value => change('consumption', value)} options={consumptions} error={errors.consumption} />
                {input.consumption === 'nand' ? field('N', '全寿命 NAND 写入', { unitKey: 'nUnit', placeholder: '请输入完整累计值' }) : input.consumption === 'estimate' ? <><div className="field-row">{field('H', '全寿命累计 Host Writes', { unitKey: 'hUnit' })}{field('wafPast', '全历史 WAF', { unit: 'NAND / Host' })}</div><p className="hint">历史 NAND 消耗由完整 Host 历史 × 全历史 WAF 估算。</p></> : null}
                <button type="button" className="button history-button" onClick={() => setModal('history')}>没有 NAND 计数？使用历史 WAF 估算</button><div className="field-row">{field('wafFuture', '未来 WAF', { unit: 'NAND / Host' })}{field('q', '日均写入', { unitKey: 'qUnit' })}</div><p className="hint">{input.consumption === 'unknown' ? '历史未知只显示总预算参考，不推算现有卡时间。' : '明确全新卡才采用零 NAND 消耗；历史 WAF 与未来 WAF 独立。'}</p>
              </section>
            </>}
          </div>
          {mode === 'D' ? <details className="candidate-disclosure" open={input.candidateOpen} onToggle={event => { if (event.currentTarget.open !== input.candidateOpen) change('candidateOpen', event.currentTarget.open) }}><summary><Chevron open={input.candidateOpen} />比较候选卡（可选）</summary><div className="detail-content">{presetControls}{field('E', '候选主机写入预算', { unitKey: 'eUnit', placeholder: '不填也能计算需求', helpKey: 'E' })}{historyField('候选卡状态')}{input.history === 'used' ? field('H', '候选全寿命累计 Host Writes', { unitKey: 'hUnit', helpKey: 'H' }) : null}<p className="hint">默认比较明确全新卡；历史未知时不显示确定余量。收起保留候选数据。</p></div></details> : null}
          <div className="form-tools">{mode === 'A' ? <button type="button" className="button method-button" onClick={() => switchMode('B')}>P/E 工程估算</button> : null}<button type="button" className="disclosure-button" onClick={() => setModal('advanced')}><Chevron />高级设置（可选）</button></div>
          <div className="form-actions"><button type="submit" className="button primary">{snapshot ? '重新计算' : '开始计算'}</button><button type="button" className="button" onClick={() => { setStates(old => ({ ...old, [mode]: freshState(mode) })); setAnnouncement('已重置当前模式，其他模式数据保留。') }}>重置</button></div>
          {Object.values(errors).some(Boolean) ? <p className="field-error" role="alert">请修正标记的输入。{snapshot ? '上一次成功结果仍保留。' : '未生成新的计算结果。'}</p> : null}
          {snapshot ? <div className="assumptions"><strong>本次假设{dirty ? '（上次成功快照）' : ''}</strong><p>{mode === 'D' ? `目标 ${exact(snapshot.result.Y)} 年；日均 ${exact(snapshot.result.qGB)} GB。` : mode === 'B' ? `有效循环容量 ${exact(snapshot.result.C * 1000)} GB；P/E ${exact(snapshot.result.PE)}；未来 WAF ${exact(snapshot.result.wafFuture)}。` : `主机预算 ${exact(snapshot.result.E)} TB；${snapshot.result.H === null ? '历史未知' : `完整历史 ${exact(snapshot.result.H)} TB`}；日均 ${exact(snapshot.result.qGB)} GB。`}<br />不预测失效日期，适用条件仍需核对。</p></div> : null}
        </form>
        <Analysis state={state} mode={mode} dirty={dirty} />
      </div> : <Theory onReturn={() => navigate('analysis')} />}
    </main>
    <footer className="site-footer"><span>全部计算在浏览器本地完成</span><a href="https://loogg.github.io/toolbox/">返回工具箱</a><a href="https://github.com/loogg/tool-sd-endurance" target="_blank" rel="noreferrer">源码</a></footer>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
    {helpState ? <HelpPopover {...helpState} onClose={() => setHelpState(null)} onTheory={section => navigate('theory', section)} /> : null}
    {modal === 'advanced' ? <AdvancedModal initial={advanced} sourceSummary={sourceSummary} onClose={() => setModal(null)} onSave={draft => { updateState(old => ({ ...old, advanced: draft })); setModal(null); setAnnouncement('高级设置已保存；重新计算后应用到结果快照。') }} /> : null}
    {modal === 'history' ? <HistoryModal initial={input} onClose={() => setModal(null)} onSave={draft => { updateState(old => ({ ...old, input: { ...old.input, ...draft }, errors: {} })); setModal(null); setAnnouncement('已采用完整历史与历史 WAF；请重新计算。') }} /> : null}
  </>
}

function PresetControls({ mode, input, preset, onCategory, onPreset, onAdopt }) {
  const matches = presets.filter(record => record.category === input.category)
  return <div className="preset-controls"><div className="category-row"><span className="hint">预设分类</span><div className="category-buttons" role="group" aria-label="预设分类">{categories.map(category => <button type="button" key={category.id} aria-pressed={category.id === input.category} className={category.id === input.category ? 'selected' : ''} onClick={() => onCategory(category.id)}>{category.label}</button>)}</div></div><SelectField label={mode === 'D' ? '候选型号 / 容量（可选）' : '卡片型号 / 容量（可选）'} value={input.presetId} onChange={onPreset} disabled={matches.length === 0} options={[[ '', input.category === 'custom' ? '自定义（手动输入）' : matches.length ? '请选择具体型号与容量' : '暂无适用型号资料' ], ...matches.map(record => [record.id, `${record.manufacturer} ${record.series} ${record.generation ? `${record.generation} · ` : ''}${record.capacity_gb} GB`])]} />
    {input.category === 'consumer' ? <p className="hint">暂无口径明确的消费卡耐久资料，请使用自定义假设；分类不提供默认 TBW / P/E。</p> : null}
    {preset ? <div className="preset-facts"><strong>{input.presetModified ? '参数已手改 · 用户假设' : '来源已记录 · 条件未验证'}</strong>{preset.published_metrics.map(metric => <p key={metric.type}>{metric.type === 'manufacturer_TBW' ? `厂商原指标：up to ${metric.value.toLocaleString()} TBW（最高容量）` : metric.type === 'PE_cycles' ? `系列 P/E：${metric.value.toLocaleString()} 次` : `录像耐久：up to ${metric.value.toLocaleString()} 小时 · Full HD / ${metric.workload.bitrate_mbps} Mbps`}</p>)}<p>{mode === 'B' ? '仅填资料公开的 P/E；有效循环容量与 WAF 未提供，请自行核对。' : preset.model_A_use}</p>{mode !== 'B' && preset.published_metrics.some(metric => metric.type === 'manufacturer_TBW') ? <button type="button" className="button" onClick={onAdopt}>{input.presetAdopted && !input.presetModified ? '重新采用 3840 TB 假设' : '采用 3840 TB 作为假设预算'}</button> : null}<a href={preset.source_url} target="_blank" rel="noreferrer">查看厂商来源 ↗</a><p>{preset.source_locator}</p>{preset.limitations?.map(line => <p key={line}>{line}</p>)}</div> : null}
  </div>
}
