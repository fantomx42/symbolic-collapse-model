
export interface SCMVariables {
  T: number; // Timelessness
  E: number; // Emotional Energy
  S: number; // Structural Coherence
  I: number; // Interpretive Flexibility
  P: number; // Parasitic Load
}

export interface SCMParameters extends SCMVariables {
  // Modifiers
  time_since_reinforcement: number;
  nostalgia_weight: number;
  erf: number;
  delta_X: number;
  T_max: number;
  E_max: number;
  S_max: number;
  I_max: number;
  P_max: number;
  lambda_lock: number;
  // Baseline for baseline lock
  baseline: SCMVariables;
}

export enum CollapseZone {
  Low = "Stable",
  Moderate = "Warning",
  High = "Critical (High Risk)",
  Critical = "Collapse (Extreme Risk)"
}

export interface SCMCalculatedValues {
  stability_score: number;
  collapse_pressure: number;
  confidence: number;
  zone: CollapseZone;
}

export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
  NONE = 'NONE' // For initial state or when previous value is null
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  path: VisNode[]; // Sequence of nodes to follow
  currentPathIndex: number; // Index in the 'path' array
  progress: number; // Progress towards current targetX, targetY (0 to 1)
  speed: number;
  color: string;
  opacity: number;
  size: number;
}

export interface VisNode {
  id: keyof SCMVariables | 'SystemInput' | 'SystemOutput';
  label: string;
  x: number;
  y: number;
  value?: number; // Optional: to influence visualization
  color?: string;
}

export type SCMParameterHistory = {
  [K in keyof SCMParameters]: number[];
};
