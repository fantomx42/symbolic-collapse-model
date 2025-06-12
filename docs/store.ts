import { create } from 'zustand';
import { SCMParameters, SymbolicNode, SCMEvent, SCMParameterHistory, SCMCalculatedValues } from './types';
import { DEFAULT_SCM_PARAMETERS, VARIABLE_DETAILS } from './constants';
import { computeSCMInternal } from './utils/scmUtils';

const MAX_HISTORY_POINTS_PER_SYMBOL = 50;

const createInitialHistory = (): SCMParameterHistory => {
  const history: SCMParameterHistory = {} as SCMParameterHistory;
  (Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>).forEach(key => {
    history[key] = [];
  });
  return history;
};

const updateHistoryForNode = (node: SymbolicNode, newParams: SCMParameters): SymbolicNode => {
  const newHistory = { ...node.history };
  (Object.keys(newParams) as Array<keyof SCMParameters>).forEach(key => {
    const historyForKey = node.history[key] ? [...node.history[key]] : [];
    historyForKey.push(newParams[key]);
    if (historyForKey.length > MAX_HISTORY_POINTS_PER_SYMBOL) {
      historyForKey.shift();
    }
    newHistory[key] = historyForKey;
  });
  return { ...node, history: newHistory, previousParams: node.params, params: newParams, updatedAt: Date.now() };
};


interface SymbolState {
  symbols: SymbolicNode[];
  selectedSymbolId: string | null;
  isPlaying: boolean;
  simulationSpeedFactor: number;
  activeEventMessage: string | null;
  
  addSymbol: (name: string) => void;
  selectSymbol: (id: string | null) => void;
  deleteSymbol: (id: string) => void;
  updateSelectedSymbolParam: (key: keyof SCMParameters, value: number) => void;
  updateSelectedSymbolParams: (updatedParams: Partial<SCMParameters>) => void;
  advanceTimeAndApplyEntropySelectedSymbol: (timeStep: number) => void;
  applyEventToSelectedSymbol: (event: SCMEvent) => void;
  
  togglePlayPause: () => void;
  setSimulationSpeedFactor: (speed: number) => void;
  setActiveEventMessage: (message: string | null) => void;

  loadSymbols: (loadedSymbols: SymbolicNode[]) => void; // For future Module 5
}

export const useSymbolStore = create<SymbolState>((set, get) => ({
  symbols: [],
  selectedSymbolId: null,
  isPlaying: false,
  simulationSpeedFactor: 1,
  activeEventMessage: null,

  addSymbol: (name) => {
    const newSymbol: SymbolicNode = {
      id: `symbol-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      params: { ...DEFAULT_SCM_PARAMETERS, time: 0 }, // Reset time for new symbol
      history: createInitialHistory(),
      previousParams: null,
      previousCalculatedValues: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    // Initialize history with the first set of parameters
    const initializedSymbol = updateHistoryForNode(newSymbol, newSymbol.params);
    
    set(state => ({
      symbols: [...state.symbols, initializedSymbol],
      selectedSymbolId: state.selectedSymbolId === null ? initializedSymbol.id : state.selectedSymbolId, // Auto-select if no symbol is selected
    }));
  },

  selectSymbol: (id) => set({ selectedSymbolId: id, isPlaying: false }), // Pause simulation when switching symbols

  deleteSymbol: (id) => {
    set(state => {
      const newSymbols = state.symbols.filter(s => s.id !== id);
      let newSelectedSymbolId = state.selectedSymbolId;
      if (state.selectedSymbolId === id) {
        newSelectedSymbolId = newSymbols.length > 0 ? newSymbols[0].id : null;
      }
      return { symbols: newSymbols, selectedSymbolId: newSelectedSymbolId };
    });
  },
  
  updateSelectedSymbolParam: (key, value) => {
    set(state => {
      const selectedId = state.selectedSymbolId;
      if (!selectedId) return state;

      let validatedValue = value;
      const detail = VARIABLE_DETAILS[key];
      if (detail) {
        // Ensure T and E don't go below their defined minimum if it exists (e.g. 0.1)
        if ((key === 'T' || key === 'E') && detail.min !== undefined && validatedValue < detail.min) validatedValue = detail.min;
        else if (detail.min !== undefined) validatedValue = Math.max(detail.min, validatedValue);
        
        if (detail.max !== undefined) validatedValue = Math.min(detail.max, validatedValue);
      }
      
      return {
        symbols: state.symbols.map(s => {
          if (s.id === selectedId) {
            const newParams = { ...s.params, [key]: validatedValue };
            return updateHistoryForNode(s, newParams);
          }
          return s;
        }),
      };
    });
  },

  updateSelectedSymbolParams: (updatedPartialParams) => {
    set(state => {
      const selectedId = state.selectedSymbolId;
      if (!selectedId) return state;
      return {
        symbols: state.symbols.map(s => {
          if (s.id === selectedId) {
            let newParams = { ...s.params, ...updatedPartialParams };
            // Validate all changed parameters
            for (const key in updatedPartialParams) {
              const paramKey = key as keyof SCMParameters;
              const detail = VARIABLE_DETAILS[paramKey];
              if(detail) {
                 // Ensure T and E don't go below their defined minimum if it exists
                if ((paramKey === 'T' || paramKey === 'E') && detail.min !== undefined && newParams[paramKey] < detail.min) newParams[paramKey] = detail.min;
                else if (detail.min !== undefined) newParams[paramKey] = Math.max(detail.min, newParams[paramKey]);

                if (detail.max !== undefined) newParams[paramKey] = Math.min(detail.max, newParams[paramKey]);
              }
            }
            return updateHistoryForNode(s, newParams);
          }
          return s;
        }),
      };
    });
  },

  advanceTimeAndApplyEntropySelectedSymbol: (timeStep) => {
    set(state => {
      const selectedId = state.selectedSymbolId;
      if (!selectedId) return state;

      return {
        symbols: state.symbols.map(s => {
          if (s.id === selectedId) {
            const currentParams = s.params;
            const newTime = Math.min(VARIABLE_DETAILS.time.max!, currentParams.time + timeStep);

            const T_BASE_DECAY = 0.003; 
            const E_BASE_DECAY = 0.003;
            const R_BASE_DECAY = 0.001; // Base decay for all R-factors including NW

            const I_factor = currentParams.I / VARIABLE_DETAILS.I.max!;
            const S_factor = currentParams.S / VARIABLE_DETAILS.S.max!;
            const P_factor = currentParams.P / VARIABLE_DETAILS.P.max!;
            // Average of normalized R-factors (excluding NW for this specific calculation if desired, or include it)
            // For now, R_total_factor considers all R components including NW for resilienceDeficit.
            const R_total_factor = (currentParams.R_memory / VARIABLE_DETAILS.R_memory.max! + 
                                    currentParams.R_redundancy / VARIABLE_DETAILS.R_redundancy.max! + 
                                    currentParams.R_anchoring / VARIABLE_DETAILS.R_anchoring.max! +
                                    currentParams.NW / VARIABLE_DETAILS.NW.max!) / 4;


            const resilienceDeficitFactor = 1 + (1 - R_total_factor); 
            const stressFactor = 1 + (I_factor + S_factor + P_factor) / 3; 

            const tDecayMultiplier = resilienceDeficitFactor * stressFactor;
            const eDecayMultiplier = resilienceDeficitFactor * stressFactor;
            const rDecayMultiplier = 1.2 + (stressFactor - 1) * 0.5; // Same multiplier for all R-factors

            let newT = currentParams.T * (1 - T_BASE_DECAY * tDecayMultiplier * timeStep);
            let newE = currentParams.E * (1 - E_BASE_DECAY * eDecayMultiplier * timeStep);
            let newR_memory = currentParams.R_memory * (1 - R_BASE_DECAY * rDecayMultiplier * timeStep);
            let newR_redundancy = currentParams.R_redundancy * (1 - R_BASE_DECAY * rDecayMultiplier * timeStep);
            let newR_anchoring = currentParams.R_anchoring * (1 - R_BASE_DECAY * rDecayMultiplier * timeStep);
            let newNW = currentParams.NW * (1 - R_BASE_DECAY * rDecayMultiplier * timeStep); // NW also decays

            newT = Math.max(VARIABLE_DETAILS.T.min!, newT);
            newE = Math.max(VARIABLE_DETAILS.E.min!, newE);
            newR_memory = Math.max(VARIABLE_DETAILS.R_memory.min!, newR_memory);
            newR_redundancy = Math.max(VARIABLE_DETAILS.R_redundancy.min!, newR_redundancy);
            newR_anchoring = Math.max(VARIABLE_DETAILS.R_anchoring.min!, newR_anchoring);
            newNW = Math.max(VARIABLE_DETAILS.NW.min!, newNW);
            
            const newParams = {
              ...currentParams,
              time: newTime,
              T: newT,
              E: newE,
              R_memory: newR_memory,
              R_redundancy: newR_redundancy,
              R_anchoring: newR_anchoring,
              NW: newNW,
            };
            return updateHistoryForNode(s, newParams);
          }
          return s;
        }),
      };
    });
  },

  applyEventToSelectedSymbol: (event) => {
    set(state => {
      const selectedId = state.selectedSymbolId;
      if (!selectedId) return state;

      get().setActiveEventMessage(`Event Triggered: ${event.name} on symbol "${state.symbols.find(s=>s.id === selectedId)?.name}".`);
      setTimeout(() => get().setActiveEventMessage(null), 5000);

      return {
        symbols: state.symbols.map(s => {
          if (s.id === selectedId) {
            let eventAppliedParams = { ...s.params };
            if (event.effects) {
              eventAppliedParams = { ...eventAppliedParams, ...event.effects };
            }
            if (event.modifiers) {
              for (const key in event.modifiers) {
                const paramKey = key as keyof SCMParameters;
                const modifier = event.modifiers[paramKey];
                if (modifier && eventAppliedParams[paramKey] !== undefined) {
                  let currentValue = eventAppliedParams[paramKey];
                  if (modifier.add !== undefined) currentValue += modifier.add;
                  if (modifier.multiply !== undefined) currentValue *= modifier.multiply;
                  eventAppliedParams[paramKey] = currentValue;
                }
              }
            }
            // Validate and cap all parameters
            for (const key in eventAppliedParams) {
                const paramKey = key as keyof SCMParameters;
                const detail = VARIABLE_DETAILS[paramKey];
                if (detail && eventAppliedParams[paramKey] !== undefined) {
                    // Ensure T and E don't go below their defined minimum if it exists
                    if ((paramKey === 'T' || paramKey === 'E') && detail.min !== undefined && eventAppliedParams[paramKey] < detail.min) {
                        eventAppliedParams[paramKey] = detail.min;
                    } else if (detail.min !== undefined) {
                       eventAppliedParams[paramKey] = Math.max(detail.min, eventAppliedParams[paramKey]);
                    }
                    if (detail.max !== undefined) eventAppliedParams[paramKey] = Math.min(detail.max, eventAppliedParams[paramKey]);
                }
            }
            return updateHistoryForNode(s, eventAppliedParams);
          }
          return s;
        }),
      };
    });
  },

  togglePlayPause: () => set(state => ({ isPlaying: !state.isPlaying })),
  setSimulationSpeedFactor: (speed) => set({ simulationSpeedFactor: speed, isPlaying: get().isPlaying ? true : false }), // Keep playing if speed changes while playing
  setActiveEventMessage: (message) => set({ activeEventMessage: message }),
  
  loadSymbols: (loadedSymbols) => {
     const processedSymbols = loadedSymbols.map(s => {
        // Ensure history is initialized if loading older data
        const history = s.history || createInitialHistory();
        const currentParams = { ...DEFAULT_SCM_PARAMETERS, ...s.params }; // Ensure all params are present
        let symbolToUpdate = {...s, params: currentParams, history: history};
        // If history is empty but params exist, populate first history point
        if (Object.values(history).every(h => h.length ===0) && currentParams) {
           symbolToUpdate = updateHistoryForNode(symbolToUpdate, currentParams);
        }
        return symbolToUpdate;
     });
    set({ symbols: processedSymbols, selectedSymbolId: processedSymbols.length > 0 ? processedSymbols[0].id : null, isPlaying: false });
  }
}));

// Initialize with a default symbol if none exist
if (useSymbolStore.getState().symbols.length === 0) {
  useSymbolStore.getState().addSymbol("Genesis Symbol");
}