
import { SCMParameters, CollapseZone } from './types';

export const DEFAULT_SCM_PARAMETERS: SCMParameters = {
  T: 0.5,
  E: 0.5,
  S: 0.5,
  I: 0.5,
  P: 0.5,
  time_since_reinforcement: 0,
  nostalgia_weight: 0,
  erf: 0,
  delta_X: 0,
  T_max: 1.0,
  E_max: 1.0,
  S_max: 1.0,
  I_max: 1.0,
  P_max: 1.0,
  lambda_lock: 0.1,
  baseline: {
    T: 0.5,
    E: 0.5,
    S: 0.5,
    I: 0.5,
    P: 0.5,
  },
};

export const COLLAPSE_ZONE_THRESHOLDS: Record<CollapseZone, { min: number; max: number; color: string; label: string }> = {
  [CollapseZone.Low]: { min: 0, max: 1, color: "bg-green-500", label: "Stable" },
  [CollapseZone.Moderate]: { min: -0.25, max: 0, color: "bg-yellow-500", label: "Warning" },
  [CollapseZone.High]: { min: -0.5, max: -0.25, color: "bg-orange-500", label: "Critical (High Risk)" },
  [CollapseZone.Critical]: { min: -Infinity, max: -0.5, color: "bg-red-600", label: "Collapse (Extreme Risk)" },
};

export const SCM_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const VARIABLE_DETAILS: Record<keyof SCMParameters, { label: string; description: string; min?: number; max?: number; step?: number; unit?: string }> = {
  T: { label: "Timelessness (T)", description: "How well the symbol withstands the test of time.", min:0, max:1, step:0.01 },
  E: { label: "Emotional Energy (E)", description: "The emotional charge of the symbol.", min:0, max:1, step:0.01 },
  S: { label: "Structural Coherence (S)", description: "How well-formed and internally consistent the symbol is.", min:0, max:1, step:0.01 },
  I: { label: "Interpretive Flexibility (I)", description: "How easily the symbol can be interpreted in different ways.", min:0, max:1, step:0.01 },
  P: { label: "Parasitic Load (P)", description: "The degree to which the symbol is weighed down by negative connotations.", min:0, max:1, step:0.01 },
  time_since_reinforcement: { label: "Time Since Reinforcement", description: "The time since the symbol was last reinforced.", min:0, max:100, step:1, unit:"units" },
  nostalgia_weight: { label: "Nostalgia Weight (NW)", description: "How much nostalgia affects the symbol's emotional energy.", min:0, max:1, step:0.01 },
  erf: { label: "Emotional Resonance Field (ERF)", description: "The emotional context in which the symbol is interacting.", min:-1, max:1, step:0.01 },
  delta_X: { label: "Delta X", description: "The change in the symbol's attributes.", min:0, max:1, step:0.01 },
  T_max: { label: "Max Timelessness", description: "The maximum value for Timelessness.", min:0, max:1, step:0.01 },
  E_max: { label: "Max Emotional Energy", description: "The maximum value for Emotional Energy.", min:0, max:1, step:0.01 },
  S_max: { label: "Max Structural Coherence", description: "The maximum value for Structural Coherence.", min:0, max:1, step:0.01 },
  I_max: { label: "Max Interpretive Flexibility", description: "The maximum value for Interpretive Flexibility.", min:0, max:1, step:0.01 },
  P_max: { label: "Max Parasitic Load", description: "The maximum value for Parasitic Load.", min:0, max:1, step:0.01 },
  lambda_lock: { label: "Lambda Lock", description: "The locking factor for the baseline lock.", min:0, max:1, step:0.01 },
  baseline: { label: "Baseline", description: "The baseline symbol to lock to." },
};
