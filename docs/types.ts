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
  NW: number; // Nostalgia Weight
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

// Defines the structure for an SCM event
export interface SCMEvent {
  id: string;
  name: string;
  description: string;
  // Direct value assignments
  effects?: Partial<SCMParameters>; 
  // Modifiers (e.g., multiply T by 0.5, add 2 to I)
  // These are applied AFTER effects.
  modifiers?: {
    [K in keyof SCMParameters]?: { add?: number; multiply?: number };
  };
}

// Represents a single symbolic node in the ecosystem
export interface SymbolicNode {
  id: string; // Unique identifier (e.g., UUID)
  name: string; // User-defined name (e.g., "Democracy")
  params: SCMParameters;
  history: SCMParameterHistory;
  previousParams: SCMParameters | null; // For trend calculation
  previousCalculatedValues: SCMCalculatedValues | null; // For trend calculation
  createdAt: number; // Timestamp of creation
  updatedAt: number; // Timestamp of last update
}

// Action types for scmParams reducer are no longer needed here,
// they will be implicitly defined by Zustand store actions.
// export type SCMParamAction = 
//   | { type: 'SET_PARAM'; key: keyof SCMParameters; value: number }
//   | { type: 'SET_ALL_PARAMS'; payload: SCMParameters }
//   | { type: 'ADVANCE_TIME_AND_APPLY_ENTROPY'; timeStep: number }
//   | { type: 'APPLY_EVENT_EFFECTS'; event: SCMEvent };