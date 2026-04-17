export function fmt(amount) {
  if (isNaN(amount)) return '0 $';
  return Math.round(amount).toLocaleString('fr-CA') + ' $';
}

export function calcPersonTotals(person) {
  const salary = parseFloat(person.salary) || 0;
  const otherIncome = (person.otherIncomes || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const totalIncome = salary + otherIncome;
  const totalCharges = (person.charges || []).reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
  const afterCharges = totalIncome - totalCharges;
  const totalAllocated = (person.allocations || []).reduce((s, a) => {
    const v = parseFloat(a.value) || 0;
    return s + (a.mode === '%' ? totalIncome * v / 100 : v);
  }, 0);
  const disposable = afterCharges - totalAllocated;
  const allocPct = afterCharges > 0 ? Math.min(100, Math.round(totalAllocated / afterCharges * 100)) : 0;

  return { salary, otherIncome, totalIncome, totalCharges, afterCharges, totalAllocated, disposable, allocPct };
}

export function calcCommonTotals(commun, alexIncome, aurIncome) {
  const totalIncome = alexIncome + aurIncome;
  const totalCharges = (commun.charges || []).reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
  const totalAllocated = (commun.allocations || []).reduce((s, a) => {
    const v = parseFloat(a.value) || 0;
    return s + (a.mode === '%' ? totalCharges * v / 100 : v);
  }, 0);

  const alexPct = totalIncome > 0 ? alexIncome / totalIncome : 0.5;
  const aurPct = totalIncome > 0 ? aurIncome / totalIncome : 0.5;

  return {
    totalCharges,
    totalAllocated,
    alexPct50: totalCharges * 0.5,
    aureliePct50: totalCharges * 0.5,
    alexPctProp: totalCharges * alexPct,
    aureliePctProp: totalCharges * aurPct,
    alexPctNum: Math.round(alexPct * 100),
    aureliePctNum: Math.round(aurPct * 100),
  };
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}
