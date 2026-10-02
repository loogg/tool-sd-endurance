import test from 'node:test'
import assert from 'node:assert/strict'
import { adoptPreset, applyPreset, clearPreset, presets } from '../src/presets.js'
import { blankAdvanced, blankInput, calculate, signature } from '../src/model.js'

const record = id => presets.find(preset => preset.id === id)
const select = (mode, id, input = {}) => applyPreset(mode, { ...blankInput(mode), ...input }, blankAdvanced(), id)

test('catalog covers five manufacturers and real 8/16 GB cards with unique sourced identities', () => {
  assert.equal(new Set(presets.map(preset => preset.id)).size, presets.length)
  assert.deepEqual([...new Set(presets.map(preset => preset.manufacturer))].sort(), ['KIOXIA', 'Kingston', 'Samsung', 'SanDisk', 'Transcend'])
  assert.ok(record('kingston-sdcit2-8gb')); assert.ok(record('transcend-usd230i-16gb'))
  assert.ok(record('kioxia-exceria-16gb')); assert.ok(record('sandisk-ultra-120-16gb'))
  for (const preset of presets) {
    assert.ok(preset.capacity_gb > 0)
    assert.ok(new URL(preset.source_url).protocol === 'https:')
    assert.ok(preset.source_locator && preset.checked && preset.model_A_use)
    for (const metric of preset.published_metrics) assert.ok(Number.isFinite(metric.value) && metric.value > 0)
  }
})

test('highest-capacity Kingston TBW is never assigned to lower capacities; Transcend uses explicit rows', () => {
  for (const capacity of [8, 16, 32, 64]) assert.equal(record(`kingston-sdcit2-${capacity}gb`).published_metrics.some(metric => metric.type === 'manufacturer_TBW'), false)
  assert.equal(select('A', 'kingston-sdcit2-128gb').input.E, '3840')
  assert.equal(select('A', 'kingston-sdcit2-8gb', { E: '3840' }).input.E, '')
  assert.equal(select('A', 'transcend-usd230i-8gb').input.E, '360')
  assert.equal(select('A', 'transcend-usd230i-16gb').input.E, '1400')
})

test('factory TBW autofills identity and budget, preserves personal load/history, and requires scope adoption', () => {
  for (const mode of ['A', 'D']) {
    const selected = select(mode, 'transcend-usd230i-8gb', { q: '35', history: 'used', H: '18.5', Y: '5' })
    assert.equal(selected.input.nominalCapacity, '8'); assert.equal(selected.input.E, '360')
    assert.equal(selected.input.q, '35'); assert.equal(selected.input.H, '18.5'); assert.equal(selected.input.history, 'used')
    assert.ok(calculate(mode, selected.input).errors.presetAdopted)
    assert.equal(calculate(mode, adoptPreset(selected.input)).errors, undefined)
    assert.ok(calculate(mode, adoptPreset(selected.input, false)).errors.presetAdopted)
    assert.equal(calculate(mode, { ...selected.input, E: '100', presetModified: true }).errors, undefined)
  }
})

test('P/E fills only published cycles; nominal capacity and unknown WAF never become engineering defaults', () => {
  const selected = select('B', 'kingston-sdcit2-16gb', { q: '35', consumption: 'unknown' })
  assert.equal(selected.input.PE, '30000'); assert.equal(selected.input.nominalCapacity, '16')
  assert.equal(selected.input.C, ''); assert.equal(selected.input.wafFuture, ''); assert.equal(selected.input.wafPast, '')
  assert.equal(selected.input.q, '35'); assert.equal(selected.input.consumption, 'unknown')
  assert.equal(calculate('B', selected.input).errors.consumption, undefined)
})

test('B reference selection preserves authored engineering assumptions without upgrading them to manufacturer facts', () => {
  const selected = select('B', 'kingston-sdcit2-16gb', { C: '32', cUnit: 'GiB', wafFuture: '2', wafPast: '4', H: '9.6', consumption: 'estimate', q: '35' })
  assert.equal(selected.input.C, '32'); assert.equal(selected.input.cUnit, 'GiB')
  assert.equal(selected.input.wafFuture, '2'); assert.equal(selected.input.wafPast, '4')
  assert.equal(selected.input.H, '9.6'); assert.equal(selected.input.consumption, 'estimate')
  assert.equal(selected.input.PE, '30000')
  assert.equal(record('kingston-sdcit2-16gb').published_metrics.some(metric => ['effective_capacity', 'WAF'].includes(metric.type)), false)
})

test('video endurance and consumer storage capacity never silently become host TBW or P/E', () => {
  for (const id of ['samsung-pro-endurance-2022-128gb', 'sandisk-max-endurance-256gb', 'sandisk-ultra-120-16gb', 'kioxia-exceria-16gb']) {
    assert.equal(select('A', id, { E: '3840' }).input.E, '')
    assert.equal(select('B', id, { PE: '30000' }).input.PE, '')
  }
  assert.equal(record('samsung-pro-endurance-2022-128gb').published_metrics[0].value, 70080)
  assert.equal(record('sandisk-max-endurance-256gb').published_metrics[0].workload.bitrate_mbps, undefined)
})

test('removing a card clears untouched sourced parameters but retains deliberate user hypotheses', () => {
  const selected = select('A', 'kingston-sdcit2-128gb')
  const cleared = clearPreset('A', selected.input, selected.advanced)
  assert.equal(cleared.input.E, ''); assert.equal(cleared.input.nominalCapacity, ''); assert.equal(cleared.advanced.source, '')
  const edited = clearPreset('A', { ...selected.input, E: '100', presetModified: true }, selected.advanced)
  assert.equal(edited.input.E, '100'); assert.equal(edited.advanced.sourceKind, 'assumption')
  const custom = { ...blankInput('A'), cardName: 'My card', nominalCapacity: '16' }
  assert.equal(clearPreset('A', custom, blankAdvanced()).input.cardName, 'My card')
})

test('browse filters do not dirty a snapshot; optional card identity does not affect budget arithmetic', () => {
  const input = { ...blankInput('A'), E: '128', history: 'unknown', q: '35' }
  assert.equal(signature(input, blankAdvanced()), signature({ ...input, category: 'industrial', brandFilter: 'Kingston', capacityFilter: '8' }, blankAdvanced()))
  const evaluated = calculate('A', { ...input, cardName: 'My card', nominalCapacity: '16' }).result
  assert.ok(Math.abs(evaluated.annualHostWrites - 12.775) < 1e-12)
  assert.equal(evaluated.remaining, null); assert.equal(evaluated.days, null)
  assert.equal(calculate('A', { ...input, nominalCapacity: '' }).errors, undefined)
  assert.ok(calculate('A', { ...input, nominalCapacity: '-16' }).errors.nominalCapacity)
  assert.ok(calculate('A', { ...input, q: '1e308', qUnit: 'TB' }).errors.q)
})
