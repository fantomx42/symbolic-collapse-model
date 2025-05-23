export interface SCMVariables {
  I: number; // Information Load
  S: number; // Symbolic Abstraction
  P: number; // Polarization
  T: number; // Transmission Fidelity
  E: number; // Epistemic Coherence
}

export interface SCMParameters extends SCMVariables {
  lambda: number; // Entropy acceleration coefficient
  time: number;   // Time
  R_memory: number; // Resilience: Memory Depth
  R_redundancy: number; // Resilience: Institutional Redundancy
  R_anchoring: number; // Resilience: Semantic Anchoring
}

export enum CollapseZone {
  Low = "Stable",
  Moderate = "Warning",
  High = "Critical (High Risk)",
  Critical = "Collapse (Extreme Risk)"
}

export interface SCMCalculatedValues {
  cRaw: number; // Renamed from C_base
  C_t: number;
  cEffective: number;
  zone: CollapseZone; // Zone based on cEffective
  zoneRaw: CollapseZone; // Zone based on cRaw
  R: number; // Combined Resilience factor
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