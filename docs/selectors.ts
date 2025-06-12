import { SCMCalculatedValues, CollapseZone } from './types';

/**
 * Selects the effective zone and raw zone from SCMCalculatedValues.
 * @param v - The SCMCalculatedValues object.
 * @returns An object containing zoneEff (effective collapse zone) and zoneRaw (raw collapse zone).
 */
export const selectZones = (v: SCMCalculatedValues): { zoneEff: CollapseZone; zoneRaw: CollapseZone } => ({
  zoneEff: v.zone,
  zoneRaw: v.zoneRaw,
});
