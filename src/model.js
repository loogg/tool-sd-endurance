// Model 00, retrieved from Figma on 2026-10-01. Internal units: decimal TB, days.
export const UNIT_TB = { TB: 1, GB: 0.001, TiB: 2 ** 40 / 1e12, GiB: 2 ** 30 / 1e12 }

export function blankAdvanced() {
  return { sourceKind: 'assumption', model: '', locator: '', source: '', workloadSource: 'planning', window: '', workload: '', operating: '', storage: '', retention: '', conditions: 'unverified' }
}

export function blankInput(mode) {
  const shared = { q: '', qUnit: 'GB', category: 'custom', presetId: '', presetAdopted: false, presetModified: false }
  if (mode === 'B') return { ...shared, C: '', cUnit: 'GB', PE: '', consumption: '', N: '', nUnit: 'TB', H: '', hUnit: 'TB', wafPast: '', wafFuture: '', referenceOpen: false }
  if (mode === 'D') return { ...shared, Y: '', E: '', eUnit: 'TB', history: 'new', H: '', hUnit: 'TB', candidateOpen: false }
  return { ...shared, E: '', eUnit: 'TB', history: '', H: '', hUnit: 'TB' }
}

export function signature(input, advanced) {
  const { candidateOpen: _candidateOpen, referenceOpen: _referenceOpen, ...parameters } = input
  return JSON.stringify([parameters, advanced])
}

const NUMERIC = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i

export function parseNumber(value, { positive = false } = {}) {
  const text = String(value ?? '').trim()
  if (!text) return { error: positive ? '请输入大于 0 的数值。' : '请输入大于或等于 0 的数值。' }
  if (!NUMERIC.test(text)) return { error: '请输入有限数值，不要附加单位或其他文字。' }
  const number = Number(text)
  if (!Number.isFinite(number)) return { error: '数值超出可计算范围，请减小数值。' }
  if (number === 0 && /[1-9]/.test(text.split(/e/i)[0])) return { error: '数值过小，无法保持计算精度。' }
  if (positive ? number <= 0 : number < 0) return { error: positive ? '数值必须大于 0。' : '数值不能为负。' }
  return { value: number }
}

function finite(value, field, positive = false) {
  if (!Number.isFinite(value) || (positive && value === 0)) {
    const error = new Error('数值或单位换算超出可计算范围，请调整输入。')
    error.field = field
    throw error
  }
  return value
}

export function estimateHistory(input) {
  const host = parseNumber(input.H)
  const waf = parseNumber(input.wafPast, { positive: true })
  const errors = {}
  if (host.error) errors.H = host.error
  if (waf.error) errors.wafPast = waf.error
  if (!UNIT_TB[input.hUnit]) errors.H = '请选择支持的单位。'
  if (Object.keys(errors).length) return { errors }
  try {
    const H = finite(host.value * UNIT_TB[input.hUnit], 'H', host.value > 0)
    return { result: { H, wafPast: waf.value, N: finite(H * waf.value, 'wafPast', H > 0) } }
  } catch (error) { return { errors: { [error.field]: error.message } } }
}

export function calculate(mode, input) {
  const errors = {}
  const number = (key, positive = false) => {
    const result = parseNumber(input[key], { positive })
    if (result.error) errors[key] = result.error
    return result.value
  }
  const units = (key, unitKey, positive = false) => {
    const n = number(key, positive)
    const factor = UNIT_TB[input[unitKey]]
    if (!factor) { errors[key] = '请选择支持的单位。'; return undefined }
    if (n === undefined) return undefined
    const converted = n * factor
    if (!Number.isFinite(converted) || (n > 0 && converted === 0)) errors[key] = '单位换算超出可计算范围。'
    return converted
  }
  const qTB = units('q', 'qUnit')
  let E, H = null, C, PE, N = null, wafFuture, wafPast, Y
  if (mode === 'A' || (mode === 'D' && String(input.E).trim())) {
    E = units('E', 'eUnit', true)
    if (!['new', 'used', 'unknown'].includes(input.history)) errors.history = '请选择全新卡、历史完整或历史未知。'
    if (input.history === 'new') H = 0
    if (input.history === 'used') H = units('H', 'hUnit')
  }
  if (mode === 'B') {
    C = units('C', 'cUnit', true)
    PE = number('PE', true)
    wafFuture = number('wafFuture', true)
    if (!['new', 'nand', 'estimate', 'unknown'].includes(input.consumption)) errors.consumption = '请选择已经消耗的写入量来源。'
    if (input.consumption === 'new') N = 0
    if (input.consumption === 'nand') N = units('N', 'nUnit')
    if (input.consumption === 'estimate') {
      H = units('H', 'hUnit')
      wafPast = number('wafPast', true)
    }
  }
  if (mode === 'D') Y = number('Y', true)
  if (Object.keys(errors).length) return { errors }
  try {
    const qGB = finite(qTB * 1000, 'q', qTB > 0)
    const result = { mode, qTB, qGB, E, H, C, PE, N, wafFuture, wafPast, Y, days: null, years: null, remaining: null, margin: null, available: null, usedRatio: null, status: 'assumption' }
    if (mode === 'D') {
      result.required = finite(finite(qTB * 365, 'q', qTB > 0) * Y, 'Y', qTB > 0)
      if (E !== undefined && H !== null) {
        result.available = Math.max(E - H, 0)
        result.margin = finite(result.available - result.required, 'E')
      }
      return { result }
    }
    if (mode === 'B') {
      result.nandBudget = finite(C * PE, 'PE', true)
      result.totalHost = finite(result.nandBudget / wafFuture, 'wafFuture', true)
      if (input.consumption === 'estimate') result.N = N = finite(H * wafPast, 'wafPast', H > 0)
      if (N !== null) {
        result.nandRemaining = Math.max(result.nandBudget - N, 0)
        result.remaining = finite(result.nandRemaining / wafFuture, 'wafFuture', result.nandRemaining > 0)
        result.usedRatio = finite(N / result.nandBudget, 'N', N > 0)
      }
    } else if (H !== null) {
      result.remaining = Math.max(E - H, 0)
      result.usedRatio = finite(H / E, 'H', H > 0)
    }
    if (result.usedRatio !== null) finite(result.usedRatio * 100, mode === 'B' ? 'N' : 'H')
    if (result.remaining === null) result.status = 'unknown'
    else if (result.remaining === 0) { result.status = 'reached'; result.days = 0; result.years = 0 }
    else if (qTB === 0) result.status = 'zero'
    else {
      result.days = finite(result.remaining / qTB, 'q', true)
      result.years = finite(result.days / 365, 'q', true)
    }
    return { result }
  } catch (error) {
    return { errors: { [error.field || 'q']: error.message } }
  }
}

// All derived analysis consumes the same unrounded successful result.
export function projection(result) {
  if (result.mode !== 'D' && result.years === null) return null
  const horizon = result.mode === 'D' ? result.Y : result.years
  if (horizon === 0) return null
  const start = result.mode === 'A' ? result.H : 0
  const amount = result.mode === 'D' ? result.required : result.remaining
  return {
    horizon,
    threshold: result.mode === 'D' ? result.available : result.mode === 'A' ? result.E : result.remaining,
    points: Array.from({ length: 17 }, (_, i) => ({ years: horizon * (i / 16), tb: start + amount * (i / 16) })),
  }
}

export function sensitivity(result) {
  if (result.mode === 'D') {
    return [0.6, 1, 1.4, 2].map(factor => {
      const years = result.Y * factor
      const value = result.required * factor
      return { labelValue: years, value: Number.isFinite(years) && Number.isFinite(value) ? value : null, current: factor === 1 }
    })
  }
  return [0.5, 1, 1.5, 2].map(factor => {
    const q = result.qGB * factor
    const value = result.remaining === null || q === 0 ? null : (result.years ?? 0) / factor
    return { labelValue: Number.isFinite(q) ? q : null, value: Number.isFinite(value) ? value : null, current: factor === 1 }
  })
}

export function format(value, digits = 1) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1e9 || (value !== 0 && Math.abs(value) < 0.001)) return value.toExponential(3)
  return value.toLocaleString('zh-CN', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export function exact(value) { return format(value, 6).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1') }
