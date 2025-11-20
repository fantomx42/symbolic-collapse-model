
import { SCMParameters, SCMCalculatedValues, CollapseZone, SCMVariables } from '../types';
import { COLLAPSE_ZONE_THRESHOLDS } from '../constants';

/**
 * Maps a stability score to a collapse zone.
 *
 * @param {number} stability_score - The stability score to map.
 * @returns {CollapseZone} The collapse zone.
 */
export const mapValueToZone = (stability_score: number): CollapseZone => {
    if (stability_score >= 0) return CollapseZone.Low;
    if (stability_score >= -0.25) return CollapseZone.Moderate;
    if (stability_score >= -0.5) return CollapseZone.High;
    return CollapseZone.Critical;
};

/**
 * Calculates the variance of a list of numbers.
 *
 * @param {number[]} data - A list of numbers.
 * @returns {number} The variance of the list of numbers.
 */
export const variance = (data: number[]): number => {
    const n = data.length;
    if (n < 2) {
        return 0;
    }
    const mean = data.reduce((a, b) => a + b) / n;
    return data.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / n;
};

/**
 * Computes the SCM v3.1 calculated values.
 *
 * @param {SCMParameters} params - The SCM parameters.
 * @returns {SCMCalculatedValues} The calculated SCM values.
 */
export const computeSCMInternal = (params: SCMParameters): SCMCalculatedValues => {
  let symbol: SCMVariables = {
    T: params.T,
    E: params.E,
    S: params.S,
    I: params.I,
    P: params.P,
  };

  // 1. Apply temporal decay
  symbol.T *= Math.exp(-0.01 * params.time_since_reinforcement);
  symbol.S *= Math.exp(-0.02 * params.time_since_reinforcement);

  // 2. Apply nostalgia weight
  symbol.E += params.nostalgia_weight * (1 - symbol.S);

  // 3. Apply emotional resonance
  symbol.E *= (1 + params.erf);

  // 4. Apply symbolic damping
  symbol.T += params.delta_X * (1 - Math.abs(symbol.T));
  symbol.E += params.delta_X * (1 - Math.abs(symbol.E));
  symbol.S += params.delta_X * (1 - Math.abs(symbol.S));
  symbol.I += params.delta_X * (1 - Math.abs(symbol.I));
  symbol.P += params.delta_X * (1 - Math.abs(symbol.P));

  // 5. Apply variable influence caps
  symbol.T = Math.min(symbol.T, params.T_max);
  symbol.E = Math.min(symbol.E, params.E_max);
  symbol.S = Math.min(symbol.S, params.S_max);
  symbol.I = Math.min(symbol.I, params.I_max);
  symbol.P = Math.min(symbol.P, params.P_max);

  // 6. Apply baseline lock
  symbol.T = symbol.T * (1 - params.lambda_lock) + params.baseline.T * params.lambda_lock;
  symbol.E = symbol.E * (1 - params.lambda_lock) + params.baseline.E * params.lambda_lock;
  symbol.S = symbol.S * (1 - params.lambda_lock) + params.baseline.S * params.lambda_lock;
  symbol.I = symbol.I * (1 - params.lambda_lock) + params.baseline.I * params.lambda_lock;
  symbol.P = symbol.P * (1 - params.lambda_lock) + params.baseline.P * params.lambda_lock;

  // Clamp all values to [0, 1]
  symbol.T = Math.max(0, Math.min(1, symbol.T));
  symbol.E = Math.max(0, Math.min(1, symbol.E));
  symbol.S = Math.max(0, Math.min(1, symbol.S));
  symbol.I = Math.max(0, Math.min(1, symbol.I));
  symbol.P = Math.max(0, Math.min(1, symbol.P));

  // 7. Compute Σ (Stability Score)
  const stability_score = ((symbol.T + symbol.E + symbol.S + symbol.I) / 4) - symbol.P;

  // 8. Compute CP (Collapse Pressure)
  const collapse_pressure = 1 - stability_score;

  // 9. Compute C (Confidence)
  const confidence = 1 - variance([symbol.T, symbol.E, symbol.S, symbol.I, symbol.P]);

  // 10. Map to zone
  const zone = mapValueToZone(stability_score);

  return {
    stability_score,
    collapse_pressure,
    confidence,
    zone,
  };
};
