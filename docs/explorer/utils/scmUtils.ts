import { SCMParameters, SCMCalculatedValues, CollapseZone } from '../types';
import { COLLAPSE_ZONE_THRESHOLDS } from '../constants';

export const mapValueToZone = (value: number): CollapseZone => {
  if (value < COLLAPSE_ZONE_THRESHOLDS[CollapseZone.Low].max) return CollapseZone.Low;
  if (value < COLLAPSE_ZONE_THRESHOLDS[CollapseZone.Moderate].max) return CollapseZone.Moderate;
  if (value < COLLAPSE_ZONE_THRESHOLDS[CollapseZone.High].max) return CollapseZone.High;
  return CollapseZone.Critical;
};

export const computeSCMInternal = (params: SCMParameters): SCMCalculatedValues => {
  const { I, S, P, T, E, lambda, time, R_memory, R_redundancy, R_anchoring } = params;

  const safeT = Math.max(0.1, T);
  const safeE = Math.max(0.1, E);
  const cRaw = (I * S * P) / (safeT * safeE);

  const R_calc = 1 + (R_memory + R_redundancy + R_anchoring) / 20;
  const R = Math.max(0.1, R_calc); 

  // Ensure lambda and time are positive or zero before calculation
  const safeLambda = Math.max(0, lambda);
  const safeTime = Math.max(0, time);
  const C_t_raw = cRaw * (1 + (safeLambda / 100) * safeTime); 
  const C_t = Math.min(Math.max(0,C_t_raw), 100000); // Cap C_t, ensure non-negative

  const cEffective_raw = C_t / R;
  const cEffective = Math.min(Math.max(0,cEffective_raw), 100000); // Cap cEffective, ensure non-negative
  
  const zoneEffective = mapValueToZone(cEffective);
  const zoneRaw = mapValueToZone(cRaw);
  
  return { 
    cRaw: Math.max(0,cRaw), // Ensure cRaw is not negative
    C_t, 
    cEffective, 
    zone: zoneEffective, 
    zoneRaw: zoneRaw, 
    R 
  };
};
