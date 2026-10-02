import test from 'node:test'
import assert from 'node:assert/strict'
import { blankInput, calculate, clearChangedErrors, estimateHistory, formatPercent, formatTime, parseNumber, projection, requiredFields, sensitivity } from '../src/model.js'

const valid = {
  A: { E: '128', history: 'used', H: '18.5', q: '35' },
  B: { C: '32', PE: '3000', consumption: 'estimate', H: '9.6', wafPast: '4', wafFuture: '2', q: '35' },
  D: { Y: '5', q: '35', E: '128', history: 'used', H: '18.5' },
}
const evaluate = (mode, values) => calculate(mode, { ...blankInput(mode), ...valid[mode], ...values })
const invalid = ['', ' ', '-1', 'NaN', 'Infinity', '1e999', '1e-999', '0x10', '1,000', '35 GB', '1/2']

test('every active numeric parameter rejects missing, negative, nonfinite, malformed and unrepresentable values', () => {
  const fields = { A: ['E', 'H', 'q'], B: ['C', 'PE', 'H', 'wafPast', 'wafFuture', 'q'], D: ['Y', 'E', 'H', 'q'] }
  for (const [mode, names] of Object.entries(fields)) for (const key of names) for (const value of invalid) {
    // A blank optional candidate disables the comparison rather than invalidating D.
    if (mode === 'D' && key === 'E' && !value.trim()) continue
    assert.ok(evaluate(mode, { [key]: value }).errors?.[key], `${mode}/${key}/${value}`)
  }
  for (const value of invalid) assert.ok(evaluate('B', { consumption: 'nand', N: value }).errors?.N, `B/N/${value}`)
})

test('zero rules distinguish budgets, rates, explicit histories and amplification factors', () => {
  for (const [mode, key] of [['A', 'E'], ['B', 'C'], ['B', 'PE'], ['B', 'wafPast'], ['B', 'wafFuture'], ['D', 'Y'], ['D', 'E']]) assert.ok(evaluate(mode, { [key]: '0' }).errors?.[key])
  for (const mode of ['A', 'B', 'D']) assert.equal(evaluate(mode, { q: '0' }).errors, undefined)
  assert.equal(evaluate('A', { H: '0' }).result.H, 0)
  assert.equal(evaluate('B', { consumption: 'nand', N: '0' }).result.N, 0)
  assert.equal(evaluate('B', { H: '0' }).result.N, 0)
  assert.equal(evaluate('D', { E: '', H: 'bad', history: '' }).result.available, null)
})

test('inactive histories do not leak old values or errors into another consumption path', () => {
  assert.equal(evaluate('A', { history: 'new', H: 'bad' }).result.H, 0)
  assert.equal(evaluate('A', { history: 'unknown', H: '-1' }).result.H, null)
  assert.equal(evaluate('B', { consumption: 'new', N: 'bad', H: 'bad', wafPast: 'bad' }).result.N, 0)
  assert.equal(evaluate('B', { consumption: 'nand', N: '1', H: 'bad', wafPast: 'bad' }).result.N, 1)
  assert.equal(evaluate('B', { consumption: 'unknown', N: 'bad', H: 'bad', wafPast: 'bad' }).result.N, null)
  const errors = { N: 'old', H: 'old', wafPast: 'old', q: 'current' }
  assert.deepEqual(clearChangedErrors(errors, 'consumption', { consumption: 'new' }, 'B'), { q: 'current' })
  assert.deepEqual(clearChangedErrors({ E: 'old', H: 'old', history: 'old', q: 'current' }, 'E', { E: '' }, 'D'), { q: 'current' })
})

test('supported syntax and explicit unit errors retain mathematical meaning', () => {
  for (const value of ['35', ' 35 ', '+35', '35.0', '3.5e1', '.35e2']) assert.equal(parseNumber(value).value, 35)
  for (const [mode, key, unitKey] of [['A', 'E', 'eUnit'], ['A', 'H', 'hUnit'], ['A', 'q', 'qUnit'], ['B', 'C', 'cUnit'], ['B', 'H', 'hUnit']]) assert.ok(evaluate(mode, { [unitKey]: 'MB' }).errors?.[key])
  assert.ok(evaluate('B', { consumption: 'nand', N: '1', nUnit: 'MB' }).errors?.N)
  assert.ok(estimateHistory({ H: '1', hUnit: 'GB', wafPast: 'Infinity' }).errors?.wafPast)
  assert.equal(evaluate('B', { wafFuture: '0.5' }).errors, undefined, 'positive explicit engineering hypotheses are not silently replaced by a default')
})

test('required field contract follows the active path rather than making optional planning data mandatory', () => {
  assert.deepEqual(requiredFields('A', { history: 'new' }).sort(), ['E', 'history', 'q'])
  assert.ok(requiredFields('A', { history: 'used' }).includes('H'))
  assert.ok(requiredFields('B', { consumption: 'nand' }).includes('N'))
  assert.equal(requiredFields('B', { consumption: 'nand' }).includes('wafPast'), false)
  assert.deepEqual(requiredFields('D', { E: '' }).sort(), ['Y', 'q'])
  assert.ok(requiredFields('D', { E: '128', history: 'used' }).includes('H'))
})

test('time and percentage presentation preserves nonzero amounts and threshold direction', () => {
  assert.equal(formatTime(10 / 365), '10.0 天')
  assert.equal(formatTime(8.571428571428571), '8.6 年')
  assert.equal(formatTime(null), '—')
  assert.equal(formatPercent(99.999), '<100%'); assert.equal(formatPercent(100.001), '>100%')
  assert.equal(formatPercent(100), '100.0%'); assert.equal(formatPercent(0), '0.0%')
  assert.notEqual(formatPercent(0.01825), '0.0%')
})

test('exact authored decimal and binary-unit boundaries retain equality and genuine tiny differences', () => {
  const plan = { q: '0.1', qUnit: 'GB', Y: '0.5', history: 'new', E: '0.01825', eUnit: 'TB' }
  const d = evaluate('D', plan).result
  assert.equal(d.required, 0.01825); assert.equal(d.margin, 0)
  assert.equal(evaluate('D', { ...plan, E: '18.25', eUnit: 'GB' }).result.margin, 0)
  assert.equal(evaluate('D', { q: '1', qUnit: 'GiB', Y: '1', history: 'new', E: '0.39191576576', eUnit: 'TB' }).result.margin, 0)
  const b = { C: '0.1', cUnit: 'GB', PE: '1001', consumption: 'nand', N: '0.1001', nUnit: 'TB', wafFuture: '2', q: '35' }
  for (const input of [b, { ...b, N: '100.1', nUnit: 'GB' }, { ...b, consumption: 'estimate', H: '0.1', hUnit: 'TB', wafPast: '1.001' }]) {
    const result = evaluate('B', input).result
    assert.equal(result.status, 'reached'); assert.equal(result.remaining, 0); assert.equal(result.days, 0)
  }
  const a = evaluate('A', { E: '1', eUnit: 'TiB', history: 'used', H: '1099.511627776', hUnit: 'GB' }).result
  assert.equal(a.status, 'reached'); assert.equal(a.remaining, 0)
  const smallA = evaluate('A', { E: '1', history: 'used', H: '0.99999999999999999999999' }).result
  assert.equal(smallA.status, 'assumption'); assert.ok(smallA.remaining > 0)
  const short = evaluate('D', { ...plan, E: '0.01824999999999999999999' }).result
  const surplus = evaluate('D', { ...plan, E: '0.01825000000000000000001' }).result
  assert.ok(short.margin < 0); assert.ok(surplus.margin > 0)
  const remaining = evaluate('B', { ...b, N: '0.10009999999999999999999' }).result
  assert.equal(remaining.status, 'assumption'); assert.ok(remaining.remaining > 0); assert.ok(remaining.days > 0)
  assert.equal(formatPercent(remaining.usedRatio * 100, remaining.usedComparison), '<100%')
})

// Independent byte-based rational oracle: no conversion constants or formulas
// imported from the production module. Decimal values are hundredths of a unit.
const bytes = { GB: 1000000000n, TB: 1000000000000n, GiB: 1073741824n, TiB: 1099511627776n }
const fraction = (n, d = 1n) => ({ n, d })
const multiply = (a, b) => fraction(a.n * b.n, a.d * b.d)
const divide = (a, b) => fraction(a.n * b.d, a.d * b.n)
const subtract = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d)
const nonnegative = a => a.n < 0n ? fraction(0n) : a
const number = a => Number(a.n) / Number(a.d)
const amount = (hundredths, unit) => fraction(BigInt(hundredths) * bytes[unit], 100n)
const tb = a => divide(a, fraction(1000000000000n))
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-11, `${actual} != ${expected}`)
let seed = 20261002
const random = maximum => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % maximum }
const text = value => String(value / 100)

test('2400 deterministic scenarios match an independent rational-byte oracle across all unit combinations', () => {
  const units = Object.keys(bytes)
  for (let index = 0; index < 800; index++) {
    const eu = units[index % 4], hu = units[Math.floor(index / 4) % 4], qu = units[Math.floor(index / 16) % 4]
    const e = 100 + random(999900), h = random(1000000), q = 1 + random(200000), y = 1 + random(2000)
    const E = amount(e, eu), H = amount(h, hu), Q = amount(q, qu), R = nonnegative(subtract(E, H))
    const a = evaluate('A', { E: text(e), eUnit: eu, H: text(h), hUnit: hu, q: text(q), qUnit: qu })
    assert.equal(a.errors, undefined, JSON.stringify(a.errors))
    near(a.result.remaining, number(tb(R)))
    near(a.result.days, number(divide(R, Q)))
    near(a.result.years, number(divide(divide(R, Q), fraction(365n))))
    near(projection(a.result)?.points.at(-1).tb ?? a.result.E, a.result.E)

    const c = 100 + random(25500), pe = 100 + random(29901), n = random(1000000), wf = 100 + random(701)
    const C = amount(c, eu), N = amount(n, hu), nandBudget = multiply(C, fraction(BigInt(pe)))
    const hostRemaining = divide(nonnegative(subtract(nandBudget, N)), fraction(BigInt(wf), 100n))
    const b = evaluate('B', { C: text(c), cUnit: eu, PE: String(pe), consumption: 'nand', N: text(n), nUnit: hu, wafFuture: text(wf), q: text(q), qUnit: qu })
    assert.equal(b.errors, undefined, JSON.stringify(b.errors))
    near(b.result.nandBudget, number(tb(nandBudget))); near(b.result.remaining, number(tb(hostRemaining)))
    near(b.result.days, number(divide(hostRemaining, Q)))

    const demand = multiply(multiply(Q, fraction(365n)), fraction(BigInt(y), 100n))
    const d = evaluate('D', { Y: text(y), q: text(q), qUnit: qu, E: text(e), eUnit: eu, H: text(h), hUnit: hu })
    assert.equal(d.errors, undefined, JSON.stringify(d.errors))
    near(d.result.required, number(tb(demand))); near(d.result.available, number(tb(R)))
    near(d.result.margin, number(tb(subtract(R, demand))))
    for (const result of [a.result, b.result, d.result]) {
      for (const value of Object.values(result)) if (typeof value === 'number') assert.ok(Number.isFinite(value))
      const projected = projection(result)
      if (projected) for (const point of projected.points) assert.ok(Number.isFinite(point.years) && Number.isFinite(point.tb))
      for (const row of sensitivity(result)) assert.ok((row.value === null || Number.isFinite(row.value)) && (row.labelValue === null || Number.isFinite(row.labelValue)))
    }
  }
})
