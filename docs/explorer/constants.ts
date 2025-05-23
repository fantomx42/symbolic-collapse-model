
import { SCMParameters, CollapseZone } from './types';

export const DEFAULT_SCM_PARAMETERS: SCMParameters = {
  I: 5,
  S: 5,
  P: 3,
  T: 7,
  E: 7,
  lambda: 1, // Default for Entropy Acceleration (λ %/time)
  time: 0,    // Default for Time (t)
  R_memory: 5, // Default for Resilience – Memory Depth
  R_redundancy: 5, // Default for Resilience – Institutional Redundancy
  R_anchoring: 5, // Default for Resilience – Semantic Anchoring
};

export const COLLAPSE_ZONE_THRESHOLDS: Record<CollapseZone, { min: number; max: number; color: string; label: string }> = {
  [CollapseZone.Low]: { min: 0, max: 19.999, color: "bg-green-500", label: "Stable" },
  [CollapseZone.Moderate]: { min: 20, max: 49.999, color: "bg-yellow-500", label: "Warning" },
  [CollapseZone.High]: { min: 50, max: 149.999, color: "bg-orange-500", label: "Critical (High Risk)" },
  [CollapseZone.Critical]: { min: 150, max: Infinity, color: "bg-red-600", label: "Collapse (Extreme Risk)" },
};

export const SCM_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const VARIABLE_DETAILS: Record<keyof SCMParameters, { label: string; description: string; min?: number; max?: number; step?: number; unit?: string }> = {
  I: { label: "Information Load (I)", description: "Volume, density, or cognitive strain of input symbols.", min:0, max:10, step:0.1 },
  S: { label: "Symbolic Abstraction (S)", description: "Indirectness, metaphor, vagueness, or multi-layer encoding.", min:0, max:10, step:0.1 },
  P: { label: "Polarization (P)", description: "Degree of interpretive divergence between system receivers.", min:0, max:10, step:0.1 },
  T: { label: "Transmission Fidelity (T)", description: "Accuracy, bandwidth, and clarity of symbolic transfer.", min:0.1, max:10, step:0.1 }, // min 0.1 to prevent division by zero
  E: { label: "Epistemic Coherence (E)", description: "Internal consistency and contextual integration of symbolic output.", min:0.1, max:10, step:0.1 }, // min 0.1 to prevent division by zero
  lambda: { label: "Entropy Acceleration (λ)", description: "Rate of symbolic overload (% per unit of time). E.g., 1 = 1%.", min:0, max:5, step:0.1, unit:"%/time" },
  time: { label: "Time (t)", description: "Elapsed time units for dynamic calculation.", min:0, max:100, step:1, unit:"units" },
  R_memory: { label: "Resilience: Memory Depth", description: "System's historical context and learned stability.", min:0, max:10, step:0.1 },
  R_redundancy: { label: "Resilience: Institutional Redundancy", description: "Backup systems and diverse information channels.", min:0, max:10, step:0.1 },
  R_anchoring: { label: "Resilience: Semantic Anchoring", description: "Well-defined core concepts and symbols.", min:0, max:10, step:0.1 },
};