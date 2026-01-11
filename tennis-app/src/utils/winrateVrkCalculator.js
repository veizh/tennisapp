// utils/winrateVrkCalculator.js
// Version simplifiée et fidèle à ta feuille Transpose J2 / Traitement J2
// Sans arbitraire, sans log, sans simulation, sans coef favori/outsider

/**
 * Calcule le winrate pondéré vrk/rk exactement comme dans ton Excel
 * 
 * @param {Array} playerMatches   // Tableau TennisAbstract (doit avoir won, Rk, vRk)
 * @param {number} oppR_vRk       // Rank de l'adversaire pour le match à venir
 * @param {object} options
 * @returns {object}
 */

export function calculateVrkWeightedWinrate(playerMatches, oppR_vRk, options = {}) {
  const {
    useRecency = true,        // true = Calcul 2 (avec ancienneté), false = Calcul 1
    lambda = 1.0,             // Intensité recency exp (si useRecency true)
    useLinearRecency = false  // Si true → recency linéaire comme ton Excel
  } = options;

  // Filtre matchs valides
  const validMatches = playerMatches
    .filter(m => typeof m.won === 'boolean' && m.Rk && m.vRk && m.vRk > 0 && oppR_vRk > 0)
    .map((m, index) => ({
      WL: m.won ? 1 : 0,
      vRk: parseInt(m.vRk),
      matchIndex: index  // 0 = plus récent
    }));

  if (validMatches.length === 0) {
    return {
      winrate: 0.5,
      marge: 0.2,
      method: 'no_data',
      totalMatchesUsed: 0,
      details: 'Aucun match avec rank valide'
    };
  }

  // Winrate global réel (non arbitraire)
  const globalWR = validMatches.reduce((sum, m) => sum + m.WL, 0) / validMatches.length;

  const n = validMatches.length;

  let sumWeights = 0;
  let sumWeightedWL = 0;
  const individualWeightedWR = []; // Pour calculer la vraie variance (marge)

  validMatches.forEach(match => {
    // Similarité vrk : ratio brut comme dans ton Excel original
    const simVrk = Math.min(match.vRk, oppR_vRk) / Math.max(match.vRk, oppR_vRk);

    // Recency
    let recencyWeight = 1;
    if (useRecency) {
      if (useLinearRecency) {
        recencyWeight = (n - match.matchIndex) / n; // Linéaire exact comme Excel
      } else {
        recencyWeight = Math.exp(-lambda * match.matchIndex / n); // Exp (meilleure modélisation)
      }
    }

    const weight = simVrk * recencyWeight;

    sumWeights += weight;
    sumWeightedWL += weight * match.WL;

    // On garde le winrate "local" pour variance
    individualWeightedWR.push(weight > 0 ? match.WL : globalWR);
  });

  // Cas aucun poids (aucun adversaire similaire)
  if (sumWeights === 0) {
    return {
      winrate: globalWR,
      marge: 0.15, // Incertitude plus grande car pas de similarité
      method: useRecency ? 'calc2_no_similarity' : 'calc1_no_similarity',
      totalMatchesUsed: validMatches.length,
      details: 'Aucun adversaire avec rank similaire'
    };
  }

  const winrate = sumWeightedWL / sumWeights;

  // Marge = écart-type réel des contributions pondérées (non arbitraire)
  const weightedContributions = individualWeightedWR.map(wr => wr * (sumWeights / validMatches.length));
  const meanContribution = weightedContributions.reduce((a, b) => a + b, 0) / validMatches.length;
  const variance = weightedContributions.reduce((sum, val) => sum + Math.pow(val - meanContribution, 2), 0) / validMatches.length;
  const marge = Math.sqrt(variance) / Math.sqrt(sumWeights); // Normalisé par force des poids

  return {
    winrate: Number(winrate.toFixed(4)),
    marge: Number(marge.toFixed(4)),
    method: useRecency 
      ? (useLinearRecency ? 'calc2_lin' : 'calc2_exp') 
      : 'calc1',
    lambdaUsed: useRecency && !useLinearRecency ? lambda : null,
    totalMatchesUsed: validMatches.length,
    sumWeights: Number(sumWeights.toFixed(4)),
    details: useRecency 
      ? (useLinearRecency ? 'recency linéaire' : `recency exp λ=${lambda}`)
      : 'sans recency'
  };
}

// Version qui teste les options et garde la meilleure (marge la plus faible)
export function selectBestVrkMethod(playerMatches, oppR_vRk) {
  const tests = [
    { useRecency: false },                                           // Calc 1
    { useRecency: true, useLinearRecency: true },                    // Calc 2 linéaire
    { useRecency: true, lambda: 0.5 },
    { useRecency: true, lambda: 1.0 },
    { useRecency: true, lambda: 1.5 },
    { useRecency: true, lambda: 2.0 }
  ];

  let best = null;
  let bestMarge = Infinity;

  tests.forEach(opts => {
    const res = calculateVrkWeightedWinrate(playerMatches, oppR_vRk, opts);
    if (res.marge < bestMarge) {
      bestMarge = res.marge;
      best = res;
    }
  });

  return best;
}