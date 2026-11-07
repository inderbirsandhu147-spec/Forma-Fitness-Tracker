import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { exercises, entry, newWorkout, totals, heatColor, initialData } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
);
test('Only completed working sets contribute; secondary muscles receive half credit', () => {
  const e = entry(exercises.find((e) => e.id === 'pushup'));
  e.sets[0].done = true;
  e.sets[0].warmup = true;
  e.sets[1].done = true;
  const w = newWorkout();
  w.entries = [e];
  const result = totals([w]);
  assert.equal(result.chest.total, 1);
  assert.equal(result.triceps.total, 0.5);
  assert.equal(result.chest.primary, 1);
  assert.equal(result.triceps.secondary, 1);
  assert.equal(result.biceps.total, 0);
});
test('Starting or changing a routine preserves historical and template values', () => {
  const r = initialData().routines[0];
  const session = newWorkout(r.name, r.entries);
  session.entries[0].sets[0].weight = 40;
  session.entries[0].sets[0].done = true;
  assert.equal(r.entries[0].sets[0].weight, 0);
  r.entries[0].exercise.name = 'Changed routine exercise';
  assert.equal(session.entries[0].exercise.name, 'Barbell bench press');
  const duplicate = newWorkout(session.name, session.entries);
  assert.equal(duplicate.entries[0].sets[0].weight, 40);
  assert.equal(duplicate.entries[0].sets[0].done, false);
  assert.notEqual(duplicate.entries[0].id, session.entries[0].id);
});
test('Intensity boundaries are absolute and consistent across muscle totals', () => {
  assert.notEqual(heatColor(0), heatColor(0.5));
  assert.equal(heatColor(0.5), heatColor(3.5));
  assert.notEqual(heatColor(3.5), heatColor(4));
  assert.equal(heatColor(12), heatColor(120));
});
test('All catalog movements reference known muscles and sample sessions are removable', () => {
  const known = Object.keys(totals([]));
  for (const e of exercises) {
    assert.ok(e.primary.length);
    assert.ok(e.instructions.length);
    assert.ok([...e.primary, ...e.secondary].every((id) => known.includes(id)));
  }
  const data = initialData();
  assert.ok(data.workouts.every((w) => w.sample));
  assert.equal(data.workouts.filter((w) => !w.sample).length, 0);
  const plank = entry(exercises.find((e) => e.id === 'plank'));
  assert.equal(plank.sets[0].duration, 30);
});
