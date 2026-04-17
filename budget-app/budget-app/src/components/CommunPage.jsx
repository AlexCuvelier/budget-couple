import React from 'react';
import { FIXED_CHARGES_CATEGORIES, ALLOCATION_CATEGORIES } from '../data/defaults';
import { fmt, calcPersonTotals, calcCommonTotals, uid } from '../utils';

export default function CommunPage({ commun, alex, aurelie, onChange }) {
  const alexT = calcPersonTotals(alex);
  const aurT = calcPersonTotals(aurelie);
  const ct = calcCommonTotals(commun, alexT.totalIncome, aurT.totalIncome);

  function addCharge() {
    onChange({ ...commun, charges: [...(commun.charges || []), { id: uid(), catId: 'loyer', name: 'Loyer', amount: 0 }] });
  }
  function updateCharge(id, field, value) {
    onChange({ ...commun, charges: commun.charges.map(c => c.id === id ? { ...c, [field]: value } : c) });
  }
  function removeCharge(id) {
    onChange({ ...commun, charges: commun.charges.filter(c => c.id !== id) });
  }

  function addAlloc() {
    onChange({ ...commun, allocations: [...(commun.allocations || []), { id: uid(), catId: 'fond_urgence', name: "Fonds d'urgence", value: 10, mode: '%' }] });
  }
  function updateAlloc(id, field, value) {
    onChange({ ...commun, allocations: commun.allocations.map(a => a.id === id ? { ...a, [field]: value } : a) });
  }
  function removeAlloc(id) {
    onChange({ ...commun, allocations: commun.allocations.filter(a => a.id !== id) });
  }

  return (
    <div className="scroll-area">
      <div className="page-header">
        <div className="page-title">Commun</div>
        <div className="page-subtitle">Finances partagées à deux</div>
      </div>

      {/* Summary */}
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-label">Alex</div>
          <div className="metric-value purple">{fmt(alexT.totalIncome)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Aurélie</div>
          <div className="metric-value purple">{fmt(aurT.totalIncome)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Charges</div>
          <div className="metric-value red">{fmt(ct.totalCharges)}</div>
        </div>
      </div>

      {/* Contribution simulation */}
      <div className="card">
        <div className="card-title">Simulation de contribution</div>

        <div className="toggle-group">
          <button
            className={`toggle-btn ${commun.contributionMode === 'equal' ? 'active' : ''}`}
            onClick={() => onChange({ ...commun, contributionMode: 'equal' })}
          >
            50 / 50
          </button>
          <button
            className={`toggle-btn ${commun.contributionMode === 'proportional' ? 'active' : ''}`}
            onClick={() => onChange({ ...commun, contributionMode: 'proportional' })}
          >
            Proportionnel aux revenus
          </button>
        </div>

        {commun.contributionMode === 'equal' ? (
          <div className="sim-box">
            <div className="sim-box-title">Contribution égale — chacun paie la moitié</div>
            <div className="sim-row">
              <span className="sim-label">Alex paie</span>
              <span className="sim-val green">{fmt(ct.alexPct50)}</span>
            </div>
            <div className="sim-row">
              <span className="sim-label">Aurélie paie</span>
              <span className="sim-val green">{fmt(ct.aureliePct50)}</span>
            </div>
          </div>
        ) : (
          <div className="sim-box">
            <div className="sim-box-title">
              Proportionnel — Alex {ct.alexPctNum}% · Aurélie {ct.aureliePctNum}%
            </div>
            <div className="sim-row">
              <span className="sim-label">Alex paie ({ct.alexPctNum}%)</span>
              <span className="sim-val green">{fmt(ct.alexPctProp)}</span>
            </div>
            <div className="sim-row">
              <span className="sim-label">Aurélie paie ({ct.aureliePctNum}%)</span>
              <span className="sim-val green">{fmt(ct.aureliePctProp)}</span>
            </div>
            <div className="note" style={{ marginTop: 8 }}>
              Chacun contribue le même effort relatif par rapport à son salaire.
            </div>
          </div>
        )}
      </div>

      {/* Common charges */}
      <div className="card">
        <div className="card-title">Charges communes — {fmt(ct.totalCharges)}/mois</div>
        {(commun.charges || []).map(charge => (
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
            <button className="btn-del" onClick={() => removeCharge(charge.id)}>×</button>
          </div>
        ))}
        <button className="btn-add" onClick={addCharge}>+ Ajouter une charge</button>
      </div>

      {/* Common allocations / projects */}
      <div className="card">
        <div className="card-title">Projets & épargne commune</div>
        {(commun.allocations || []).map(alloc => {
          const computed = alloc.mode === '%'
            ? ct.totalCharges * (parseFloat(alloc.value) || 0) / 100
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
        <button className="btn-add" onClick={addAlloc}>+ Ajouter un projet</button>
      </div>
    </div>
  );
}
