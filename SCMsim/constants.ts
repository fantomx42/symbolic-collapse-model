
import { SCMParameters, CollapseZone, SCMEvent } from './types';

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
  NW: 3, // Default for Nostalgia Weight
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
  NW: { label: "Nostalgia Weight (NW)", description: "Emotional or historical attachment buffering against immediate re-evaluation or perceived decay.", min:0, max:10, step:0.1 },
};

export const SCM_EVENTS: SCMEvent[] = [
  {
    id: "ai_emergence",
    name: "AI Emergence",
    description: "Significant advancement in AI capabilities, increasing information load and abstraction.",
    effects: { I: 8, S: 7 },
    modifiers: { T: { multiply: 0.9 }, E: { multiply: 0.9 }}
  },
  {
    id: "censorship_spike",
    name: "Censorship Spike",
    description: "Sudden increase in information control, drastically reducing transmission fidelity and coherence.",
    effects: { T: 1, E: 2, P: 7 },
  },
  {
    id: "scientific_breakthrough",
    name: "Scientific Breakthrough",
    description: "A major discovery improves epistemic coherence and semantic anchoring.",
    modifiers: { E: { add: 2 }, R_anchoring: { add: 1.5 } }
  },
  {
    id: "info_overload_crisis",
    name: "Information Overload Crisis",
    description: "Massive surge in unprocessed information, stressing all aspects of the symbolic system.",
    effects: { I: 9.5, S: 8, P: 6, T: 3, E: 3 }
  },
  {
    id: "resilience_initiative",
    name: "Resilience Boost Initiative",
    description: "Concerted effort to improve system memory, redundancy, anchoring, and leverage nostalgia.",
    modifiers: { R_memory: { add: 2 }, R_redundancy: { add: 2 }, R_anchoring: { add: 2 }, NW: {add: 1.5} }
  },
  {
    id: "polarization_surge",
    name: "Polarization Surge",
    description: "Rapid increase in societal division and interpretive divergence.",
    effects: { P: 9 },
    modifiers: { E: { multiply: 0.7 } }
  },
  {
    id: "educational_reform",
    name: "Educational Reform Success",
    description: "Successful educational reforms improve critical thinking and understanding of complex symbols.",
    modifiers: { S: { add: -1 }, E: { add: 1.5 }, R_memory: { add: 1 } }
  }
];