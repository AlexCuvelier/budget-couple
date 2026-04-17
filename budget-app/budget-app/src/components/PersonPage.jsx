import React from 'react';
import { FIXED_CHARGES_CATEGORIES, ALLOCATION_CATEGORIES } from '../data/defaults';
import { fmt, calcPersonTotals, uid } from '../utils';

export default function PersonPage({ person, data, onChange }) {
  const t = calcPersonTotals(data);

  function updateField(field, value) {
    onChange({ ...data, [field]: value });
  }

  // Incomes
  function addIncome() {
    onChange({ ...data, otherIncomes: [...(data.otherIncomes || []), { id: uid(), name: '', amount: 0, recur: 'monthly' }] });
  }
  function updateIncome(id, field, value) {
    onChange({ ...data, otherIncomes: data.otherIncomes.map(i => i.id === id ? { ...i, [field]: value } : i) });
  }
  function removeIncome(id) {
    onChange({ ...data, otherIncomes: data.otherIncomes.filter(i => i.id !== id) });
  }

  // Charges
  function addCharge() {
    onChange({ ...data, charges: [...(data.charges || []), { id: uid(), catId: 'loyer', name: '', amount: 0 }] });
  }
  function updateCharge(id, field, value) {
    onChange({ ...data, charges: data.charges.map(c => c.id === id ? { ...c, [field]: value } : c) });
  }
  function removeCharge(id) {
    onChange({ ...data, charges: data.charges.filter(c => c.id !== id) });
  }

  // Allocations
  function addAlloc() {
    onChange({ ...data, allocations: [...(data.allocations || []), { id: uid(), catId: 'celi', name: 'CELI', value: 10, mode: '%' }] });
  }
  function updateAlloc(id, field, value) {
    onChange({ ...data, allocations: data.allocations.map(a => a.id === id ? { ...a, [field]: value } : a) });
  }
  function removeAlloc(id) {
    onChange({ ...data, allocations: data.allocations.filter(a => a.id !== id) });
  }

  const progressColor = t.allocPct > 100 ? '#ff6b7a' : t.allocPct > 80 ? '#ffb347' : '#4fd1a5';

  return (
    <div className="scroll-area">
      <div className="page-header">
        <div className="page-title">{data.name}</div>
        <div className="page-subtitle">Gestion de ton budget mensuel</div>
      </div>

      {/* Summary */}
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-label">Revenus</div>
          <div className="metric-value purple">{fmt(t.totalIncome)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Charges</div>
          <div className="metric-value red">{fmt(t.totalCharges)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Disponible</div>
          <div className="metric-value" style={{ color: t.disposable >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {fmt(t.disposable)}
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="card">
        <div className="card-title">Salaire net mensuel</div>
        <div className="salary-wrap">
          <input
            className="salary-input"
            type="number"
            value={data.salary || ''}
            onChange={e => updateField('salary', parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            step="50"
          />
          <span className="salary-currency">$ CAD</span>
        </div>
      </div>

      {/* Other incomes */}
      <div className="card">
        <div className="card-title">Autres revenus</div>
        {(data.otherIncomes || []).map(inc => (
          <div key={inc.id} className="input-row">
            <input
              type="text"
              className="name-input"
              placeholder="Nom du revenu"
              value={inc.name}
              onChange={e => updateIncome(inc.id, 'name', e.target.value)}
            />
            <input
              type="number"
              className="amount-input"
              placeholder="0"
              value={inc.amount || ''}
              onChange={e => updateIncome(inc.id, 'amount', parseFloat(e.target.value) || 0)}
              min="0"
            />
            <select
              style={{ width: 90 }}
              value={inc.recur}
              onChange={e => updateIncome(inc.id, 'recur', e.target.value)}
            >
              <option value="monthly">Mensuel</option>
              <option value="once">Unique</option>
            </select>
            <button className="btn-del" onClick={() => removeIncome(inc.id)}>×</button>
          </div>
        ))}
        <button className="btn-add" onClick={addIncome}>+ Ajouter un revenu</button>
      </div>

      {/* Fixed charges */}
      <div className="card">
        <div className="card-title">Charges fixes — {fmt(t.totalCharges)}/mois</div>
        {(data.charges || []).map(charge => {
          const cat = FIXED_CHARGES_CATEGORIES.find(c => c.id === charge.catId);
          return (
            <div key={charge.id} className="input-row">
              <select
                className="cat-select"
                value={charge.catId}
                onChange={e => {
                  const newCat = FIXED_CHARGES_CATEGORIES.find(c => c.id === e.target.value);
                  updateCharge(charge.id, 'catId', e.target.value);
                  if (newCat) updateCharge(charge.id, 'name', newCat.label);
                }}
              >
                {FIXED_CHARGES_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
              <input
                type="number"
                className="amount-input"
                placeholder="0 $"
                value={charge.amount || ''}
                onChange={e => updateCharge(charge.id, 'amount', parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
              />
              {charge.catId === 'netflix' || charge.catId === 'disney' || charge.catId === 'amazon' ? (
                <span className="included-badge">Telus?</span>
              ) : null}
              <button className="btn-del" onClick={() => removeCharge(charge.id)}>×</button>
            </div>
          );
        })}
        <button className="btn-add" onClick={addCharge}>+ Ajouter une charge</button>
      </div>

      {/* Allocations */}
      <div className="card">
        <div className="card-title">Allocations budgétaires</div>
        <div className="progress-wrap">
          <div className="progress-fill" style={{ width: `${t.allocPct}%`, background: progressColor }} />
        </div>
        <div className="progress-label">
          {t.allocPct}% alloué · {fmt(t.totalAllocated)} / {fmt(t.afterCharges)} disponible
        </div>
        {(data.allocations || []).map(alloc => {
          const computed = alloc.mode === '%'
            ? t.totalIncome * (parseFloat(alloc.value) || 0) / 100
            : parseFloat(alloc.value) || 0;
          return (
            <div key={alloc.id} className="input-row">
              <select
                style={{ flex: 1, minWidth: 0 }}
                value={alloc.catId}
                onChange={e => {
                  const newCat = ALLOCATION_CATEGORIES.find(c => c.id === e.target.value);
                  updateAlloc(alloc.id, 'catId', e.target.value);
                  if (newCat) updateAlloc(alloc.id, 'name', newCat.label);
                }}
              >
                {ALLOCATION_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
              <input
                type="number"
                className="amount-input"
                value={alloc.value || ''}
                onChange={e => updateAlloc(alloc.id, 'value', parseFloat(e.target.value) || 0)}
                min="0"
                step={alloc.mode === '%' ? 1 : 10}
              />
              <select
                className="mode-select"
                value={alloc.mode}
                onChange={e => updateAlloc(alloc.id, 'mode', e.target.value)}
              >
                <option value="%">%</option>
                <option value="$">$</option>
              </select>
              <span className="alloc-computed">{fmt(computed)}</span>
              <button className="btn-del" onClick={() => removeAlloc(alloc.id)}>×</button>
            </div>
          );
        })}
        <button className="btn-add" onClick={addAlloc}>+ Ajouter une allocation</button>
      </div>
    </div>
  );
}
