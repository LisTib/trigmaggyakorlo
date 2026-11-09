// A feladatgenerátorok, a tételellenőrzés és a levezetések ellenőrzése: node tests/verify.js
const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const eng = html.split('// ENGINE START')[1].split('// ENGINE END')[0];
const E = new Function(eng + '; return {TOPICS, makeTask, thirdAngle, usableForms, checkTheorem, buildEq, advance, nextOp, derive, renderEq, valOf, OPP, SIDES, ANGS};')();
let bad = 0, count = 0;
const fail = (...a) => { bad++; if (bad < 15) console.log('HIBA', ...a); };
const close = (x, y) => Math.abs(x - y) < 1e-6 * Math.max(1, Math.abs(y));

for (const t of E.TOPICS.filter(x => x.gen)) for (const L of [1, 2, 3]) for (let i = 0; i < 1500; i++) {
  const q = E.makeTask(t.id, L, ''); count++;
  const tag = t.id + ' L' + L + ' ' + q.key;
  // a háromszög érvényes
  const sum = q.G.α + q.G.β + q.G.γ;
  if (!close(sum, 180)) fail('szögösszeg', tag);
  if ([...Object.values(q.S), ...Object.values(q.G)].some(v => !(v > 0) || !isFinite(v))) fail('érvénytelen adat', tag);
  for (const s of E.SIDES) { const o = E.SIDES.filter(x => x !== s); if (!(q.S[s] < q.S[o[0]] + q.S[o[1]])) fail('háromszög-egyenlőtlenség', tag); }
  // a szinusztétel minden párra teljesül
  const k0 = q.S.a / Math.sin(q.G.α * Math.PI / 180);
  for (const s of E.SIDES) if (!close(q.S[s] / Math.sin(q.G[E.OPP[s]] * Math.PI / 180), k0)) fail('nem konzisztens', tag);

  const known = Object.assign({}, q.given);
  let forms = E.usableForms(t.thm, known, q.target);
  if (!forms.length) {
    const th = E.thirdAngle(known);
    if (!th) { fail('nincs használható felírás', tag); continue; }
    known[th.key] = th.value;
    forms = E.usableForms(t.thm, known, q.target);
  }
  if (!forms.length) { fail('nincs felírás a harmadik szög után sem', tag); continue; }
  // a másik tétellel ne lehessen (egyértelmű döntés a vegyes módban)
  if (E.usableForms(t.thm === 'sin' ? 'cos' : 'sin', known, q.target).length) fail('mindkét tétel működik', tag);

  const variants = [forms[0]];
  if (t.thm === 'sin') {
    const f = forms[0];
    variants.push([f[2], f[3], f[0], f[1]], [f[1], f[0], f[3], f[2]], [f[3], f[2], f[1], f[0]],
      [f[0], f[2], f[1], f[3]], [f[2], f[0], f[3], f[1]], [f[1], f[3], f[0], f[2]], [f[3], f[1], f[2], f[0]]);
  }
  else { const f = forms[0]; variants.push([f[0], f[2], f[1], f[1], f[2], f[5]]); }
  for (const slots of variants) {
    const c = E.checkTheorem(t.thm, slots, known, q.target);
    if (!c.ok) { fail('elutasított helyes tétel', tag, slots.join(' '), c.err); continue; }
    const eq = E.buildEq(t.thm, slots, known, q.target);
    const d = E.derive(eq);
    if (!d.final) { fail('a levezetés nem ér véget', tag, slots.join(' ')); continue; }
    if (!close(d.final.value, E.valOf(q, q.target))) fail('rossz eredmény', tag, d.final.value, E.valOf(q, q.target));
    if (/NaN|undefined|Infinity/.test(E.renderEq(eq) + JSON.stringify(d.rows))) fail('hibás megjelenítés', tag);
  }
  // néhány hibás felírás elutasítása
  if (t.thm === 'sin') {
    const f = forms[0];
    if (E.checkTheorem('sin', [f[0], f[3], f[2], f[1]], known, q.target).ok) fail('rossz párosítást elfogadott', tag);
    if (E.checkTheorem('sin', [f[0], f[1], f[3], f[2]], known, q.target).ok) fail('vegyes szerkezetet elfogadott', tag);
    if (E.checkTheorem('sin', [f[0], f[2], f[3], f[1]], known, q.target).ok) fail('fordított arányt elfogadott', tag);
    if (E.checkTheorem('sin', [f[0], f[0], f[1], f[3]], known, q.target).ok) fail('két azonos oldalt elfogadott', tag);
  } else {
    const f = forms[0], wrongCos = 'cos' + E.OPP[f[1]];
    if (E.checkTheorem('cos', [f[0], f[1], f[2], f[1], f[2], wrongCos], known, q.target).ok) fail('rossz koszinuszt elfogadott', tag);
    if (E.checkTheorem('sin', ['a', 'sinα', 'b', 'sinβ'], known, q.target).ok) fail('szinusztételt elfogadott koszinuszos feladatban', tag);
  }
}

console.log('ellenőrzött feladat:', count, 'hibás:', bad);
process.exit(bad ? 1 : 0);
