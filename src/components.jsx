import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import helpIcon from './assets/figma/help.svg'
import rightIcon from './assets/figma/chevron-right.svg'
import downIcon from './assets/figma/chevron-down.svg'
import { help } from './help'
import { estimateHistory } from './model'

export function Chevron({ open = false }) { return <img src={open ? downIcon : rightIcon} alt="" /> }

export function Field({ name, label, value, onChange, unit, unitValue, onUnitChange, error, placeholder = '请输入', helpKey, onHelp, disabled = false, multiline = false }) {
  const id = useId()
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className="field">
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
        {helpKey ? <button type="button" className="info-button" aria-label={`帮助：${label}`} aria-haspopup="dialog" onClick={event => onHelp(helpKey, event.currentTarget)}><img src={helpIcon} alt="" /></button> : null}
      </div>
      <div className={`input-shell ${error ? 'invalid' : ''} ${disabled ? 'disabled' : ''}`}>
        <Tag id={id} name={name} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} disabled={disabled} inputMode={['E', 'H', 'q', 'Y', 'C', 'PE', 'N', 'wafPast', 'wafFuture'].includes(name) ? 'decimal' : undefined} autoComplete="off" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} rows={multiline ? 3 : undefined} />
        {onUnitChange ? <select aria-label={`${label}单位`} value={unitValue} onChange={event => onUnitChange(event.target.value)} disabled={disabled}>{['GB', 'TB', 'GiB', 'TiB'].map(u => <option key={u} value={u}>{u}{name === 'q' ? '/天' : ''}</option>)}</select> : unit ? <span className="input-unit">{unit}</span> : null}
      </div>
      {error ? <p id={`${id}-error`} className="field-error">{error}</p> : null}
    </div>
  )
}

export function SelectField({ name, label, value, onChange, options, error, disabled = false }) {
  const id = useId()
  return <div className="field"><label htmlFor={id}>{label}</label><select id={id} name={name} value={value} onChange={event => onChange(event.target.value)} disabled={disabled} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select>{error ? <p id={`${id}-error`} className="field-error">{error}</p> : null}</div>
}

export function HelpPopover({ topic, anchor, onClose, onTheory }) {
  const ref = useRef(null)
  const info = help[topic]
  useEffect(() => {
    const element = ref.current
    function position() {
      const rect = anchor.getBoundingClientRect()
      const viewportWidth = document.documentElement.clientWidth
      const width = Math.min(320, viewportWidth - 24)
      element.style.width = `${width}px`
      element.style.left = `${Math.max(12, Math.min(rect.left, viewportWidth - width - 12))}px`
      const height = element.getBoundingClientRect().height
      const below = rect.bottom + 8
      element.style.top = `${Math.max(12, below + height > window.innerHeight - 12 ? rect.top - height - 8 : below)}px`
    }
    element.showPopover()
    position()
    element.querySelector('button').focus()
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
      if (element.matches(':popover-open')) element.hidePopover()
      if (anchor.isConnected) anchor.focus({ preventScroll: true })
    }
  }, [anchor])
  return createPortal(<div ref={ref} popover="auto" className="help-popover" role="dialog" aria-labelledby="help-title" onToggle={event => { if (event.newState === 'closed') onClose() }}><h3 id="help-title">{info.title}</h3><p>{info.body}</p><div className="help-actions"><button type="button" className="text-button" onClick={() => onTheory(info.section)}>查看计算原理</button><button type="button" className="text-button" onClick={onClose}>关闭</button></div></div>, document.body)
}

export function Modal({ title, onClose, children, footer, labelId = 'modal-title' }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement
    dialog.showModal()
    return () => { dialog.close(); if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }) }
  }, [])
  return createPortal(<dialog ref={ref} className="modal" aria-labelledby={labelId} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }}><div className="modal-header"><h2 id={labelId}>{title}</h2><button type="button" className="close-button" aria-label="关闭弹窗" onClick={onClose}>×</button></div><div className="modal-body">{children}</div><div className="modal-footer">{footer}</div></dialog>, document.body)
}

export function AdvancedModal({ initial, sourceSummary, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...initial }))
  const change = key => value => setDraft(old => ({ ...old, [key]: value }))
  const text = (key, label, placeholder) => <Field name={key} label={label} value={draft[key]} onChange={change(key)} placeholder={placeholder} />
  return <Modal title="高级设置" onClose={onClose} footer={<><button type="button" className="button" onClick={onClose}>取消</button><button type="button" className="button primary" onClick={() => onSave(draft)}>保存设置</button></>}>
    <p>按需补充来源和使用条件。不填也可以进行情景计算。</p>
    <div className="notice"><strong>当前：{sourceSummary}</strong><p>保存来源记录不等于厂商认证或工况验证。</p></div>
    <details className="advanced-section"><summary><Chevron />来源与测量记录（可选）</summary><div className="detail-content">
      <SelectField label="参数来源" value={draft.sourceKind} onChange={change('sourceKind')} options={[[ 'assumption', '用户假设' ], ['manufacturer', '厂商资料（保留其限定）'], ['measurement', '测量记录']]} />
      <div className="field-row">{text('model', '型号 / 容量', '填写对应型号和容量')}{text('locator', '版本 / 页码 / 固件', '填写可追溯信息')}</div>
      {text('source', '资料来源', '文档链接或报告编号')}
      <div className="field-row"><SelectField label="日均写入来源" value={draft.workloadSource} onChange={change('workloadSource')} options={[[ 'planning', '规划假设' ], ['measurement', '实测平均值']]} />{text('window', '测量窗口 / 计数重置记录', '起止时间 / 重置记录')}</div>
      <p className="hint">模型提供计数单位。测量应覆盖有代表性的完整自然日。</p>
    </div></details>
    <details className="advanced-section"><summary><Chevron />适用条件核对（可选）</summary><div className="detail-content">
      {text('workload', '评级工况与实际负载', '顺序 / 随机、写入大小、占用率')}
      <div className="field-row">{text('operating', '运行温度范围（°C）', '最低 / 最高')}{text('storage', '断电保存温度（°C）', '填写保存温度')}</div>
      <div className="field-row">{text('retention', '断电保持时间（天）', '填写目标时间')}<SelectField label="与厂商条件核对" value={draft.conditions} onChange={change('conditions')} options={[[ 'unverified', '尚未核对' ], ['partial', '部分核对' ], ['recorded', '已自行核对（仅用户记录）']]} /></div>
      <p className="hint">这些记录不直接乘进预算公式，不显示温度修正寿命。</p>
    </div></details>
  </Modal>
}

export function HistoryModal({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ H: initial.H, hUnit: initial.hUnit, wafPast: initial.wafPast }))
  const [errors, setErrors] = useState({})
  function save() {
    const checked = estimateHistory(draft)
    if (checked.errors) { setErrors(checked.errors); return }
    onSave({ ...draft, consumption: 'estimate' })
  }
  return <Modal title="估算已经消耗的 NAND 写入量" onClose={onClose} labelId="history-title" footer={<><button type="button" className="button" onClick={onClose}>取消</button><button type="button" className="button primary" onClick={save}>采用估算</button></>}>
    <Field label="全寿命累计 Host Writes" value={draft.H} onChange={H => setDraft(old => ({ ...old, H }))} name="H" unitValue={draft.hUnit} onUnitChange={hUnit => setDraft(old => ({ ...old, hUnit }))} error={errors.H} placeholder="请输入完整历史累计值" />
    <Field label="全历史 WAF" value={draft.wafPast} onChange={wafPast => setDraft(old => ({ ...old, wafPast }))} name="wafPast" unit="NAND / Host" error={errors.wafPast} placeholder="请输入同一历史区间的 WAF" />
    <strong className="formula">历史 NAND 消耗 ≈ 全寿命 Host Writes × 全历史 WAF</strong>
    <p>历史 WAF 与未来 WAF 独立；历史不完整时无法推算已用卡剩余预算。</p>
    {errors.H || errors.wafPast ? <p role="alert" className="field-error">请修正上述历史参数。</p> : <p className="hint">此处只采用历史记录；主界面重新计算后更新 NAND 消耗。</p>}
  </Modal>
}

export function SnapshotRecords({ advanced, preset, modified }) {
  const records = Object.entries({ '参数来源': { assumption: '用户假设', manufacturer: '厂商资料（保留来源限定）', measurement: '测量记录' }[advanced.sourceKind], '型号 / 容量': advanced.model, '版本 / 页码 / 固件': advanced.locator, '资料来源': advanced.source, '日均写入来源': advanced.workloadSource === 'measurement' ? '实测平均值' : '规划假设', '测量窗口': advanced.window, '负载工况': advanced.workload, '运行温度': advanced.operating, '断电保存温度': advanced.storage, '断电保持时间': advanced.retention, '条件核对': { unverified: '条件未验证', partial: '部分核对（用户记录）', recorded: '已自行核对（用户记录，非厂商认证）' }[advanced.conditions] }).filter(([, value]) => value)
  return <details className="records"><summary>来源与适用范围（本次快照）</summary><dl>{records.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>{preset ? <p>{preset.manufacturer} {preset.series} {preset.capacity_gb} GB · {modified ? '参数已手改，采用用户假设；' : ''}{preset.model_A_use}</p> : null}</details>
}
