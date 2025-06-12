
import React, { useEffect, useMemo, useCallback } from 'react';
import { SCMSimulator } from './components/SCMSimulator';
import { GeminiInteraction } from './components/GeminiInteraction';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Section } from './components/Section';
import { SCMParameters, SCMVariables, SCMCalculatedValues, SCMEvent, SymbolicNode } from './types';
import { SCM_MODEL_TEXT } from './constants';
import { InfoPanel } from './components/InfoPanel';
import { SCMVisualizer } from './components/SCMVisualizer';
import { CollapseMeter } from './components/CollapseMeter';
import { SCMNNPlayground } from './components/SCMNNPlayground';
import { EventInjector } from './components/EventInjector';
import { SymbolManager } from './components/SymbolManager'; // New component
import { useSymbolStore } from './store'; // Zustand store
import { computeSCMInternal } from './utils/scmUtils';

const App: React.FC = () => {
  const {
    symbols,
    selectedSymbolId,
    isPlaying,
    simulationSpeedFactor,
    activeEventMessage,
    advanceTimeAndApplyEntropySelectedSymbol,
    togglePlayPause,
    setSimulationSpeedFactor,
    selectSymbol, // To pause when time is manually changed via slider
    updateSelectedSymbolParam,
    applyEventToSelectedSymbol,
    setActiveEventMessage,
  } = useSymbolStore();

  const selectedSymbol = useMemo(() => {
    return symbols.find(s => s.id === selectedSymbolId);
  }, [symbols, selectedSymbolId]);

  const globalComputeSCM = useCallback((params: SCMParameters): SCMCalculatedValues => {
    return computeSCMInternal(params);
  }, []);

  // Compute SCM values for the selected symbol
  const calculatedValues = useMemo(() => {
    if (selectedSymbol) {
      const currentCalc = globalComputeSCM(selectedSymbol.params);
      // This is a bit tricky, the store updates previousCalculatedValues internally when params change.
      // For immediate display, we might need to be careful or ensure store has it.
      // For now, let's rely on the store having updated the node correctly.
      // We can directly pass selectedSymbol.previousCalculatedValues to components that need it.
      return currentCalc;
    }
    return null;
  }, [selectedSymbol, globalComputeSCM]);

  // Effect for auto-advancing time for the selected symbol
  useEffect(() => {
    let intervalId: number | undefined = undefined;
    if (isPlaying && selectedSymbolId) { // Only run if a symbol is selected
      intervalId = setInterval(() => {
        advanceTimeAndApplyEntropySelectedSymbol(1);
      }, 1000 / simulationSpeedFactor);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, simulationSpeedFactor, selectedSymbolId, advanceTimeAndApplyEntropySelectedSymbol]);

  const handleEventTrigger = useCallback((event: SCMEvent) => {
    if (selectedSymbolId) {
      applyEventToSelectedSymbol(event);
      // Message setting is handled in the store action now
    } else {
      setActiveEventMessage("No symbol selected to apply event.");
      setTimeout(() => setActiveEventMessage(null), 3000);
    }
  }, [selectedSymbolId, applyEventToSelectedSymbol, setActiveEventMessage]);

  const handleTimeChange = useCallback((newTime: number) => {
    if (selectedSymbolId) {
      if (isPlaying) togglePlayPause(); // Pause simulation when time is manually changed
      updateSelectedSymbolParam('time', newTime);
    }
  }, [selectedSymbolId, updateSelectedSymbolParam, isPlaying, togglePlayPause]);

  const scmVariablesForVisualizer: SCMVariables | null = useMemo(() => {
    if (selectedSymbol) {
      return {
        I: selectedSymbol.params.I,
        S: selectedSymbol.params.S,
        P: selectedSymbol.params.P,
        T: selectedSymbol.params.T,
        E: selectedSymbol.params.E,
      };
    }
    return null;
  }, [selectedSymbol]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        
        <SymbolManager />

        {activeEventMessage && (
            <div className="my-4 p-3 bg-indigo-700 bg-opacity-80 border border-indigo-500 rounded-md text-indigo-100 text-sm transition-opacity duration-300 fixed bottom-4 right-4 z-50 shadow-lg">
                {activeEventMessage}
            </div>
        )}

        {selectedSymbol && calculatedValues ? (
          <>
            <Section title={`SCM Interactive Explorer: ${selectedSymbol.name}`} initiallyOpen={true}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl backdrop-blur-md border border-gray-700">
                  <SCMSimulator
                    // Pass the whole symbol and relevant store actions
                    symbolNode={selectedSymbol}
                    calculatedValues={calculatedValues}
                    // previousParams and previousCalculatedValues are now part of symbolNode in store
                    // dispatchParams is replaced by direct store actions
                    isPlaying={isPlaying}
                    setIsPlaying={togglePlayPause} // Use store action
                    simulationSpeedFactor={simulationSpeedFactor}
                    setSimulationSpeedFactor={setSimulationSpeedFactor} // Use store action
                    onTimeChange={handleTimeChange} // Custom handler for manual time changes
                    updateParam={(key, value) => updateSelectedSymbolParam(key, value)} // Direct store action
                  />
                </div>
                <div className="space-y-6 bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl backdrop-blur-md border border-gray-700">
                  <CollapseMeter calculatedValues={calculatedValues} />
                  {scmVariablesForVisualizer && <SCMVisualizer variables={scmVariablesForVisualizer} calculatedValues={calculatedValues} />}
                </div>
              </div>
            </Section>

            <Section title="Global Event Injector" initiallyOpen={false}>
                <EventInjector onEventTrigger={handleEventTrigger} />
            </Section>

            <Section title="SCM Neural Network Playground" initiallyOpen={false}>
              <SCMNNPlayground computeSCM={computeSCMInternal} selectedSymbol={selectedSymbol} />
            </Section>

            <Section title="SCM Definitions & Formulae" initiallyOpen={false}>
              <InfoPanel calculatedValues={calculatedValues} />
            </Section>

            <Section title="Gemini AI Playground & SCM Contextual Analysis" initiallyOpen={false}>
              <GeminiInteraction scmParams={selectedSymbol.params} geminiModel={SCM_MODEL_TEXT} />
            </Section>
          </>
        ) : (
          <Section title="Symbolic Collapse Model Explorer" initiallyOpen={true}>
            <p className="text-lg text-gray-300 mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              Please add or select a symbol using the "Symbol Ecosystem" manager above to begin the simulation.
            </p>
          </Section>
        )}
        
        <Section title="Applications & Future Work" initiallyOpen={false}>
            <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-purple-400">Applications</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>AI Alignment:</strong> Calibrate LLMs to reduce symbolic collapse under abstract or divisive prompts. Embed collapse scoring in inference loops.</li>
                    <li><strong>Media Detox Portals:</strong> Web interfaces that filter content by SCM score. Interactive reader feedback to improve coherence.</li>
                    <li><strong>Civilizational Diagnostics:</strong> Model historical collapses via symbolic overload (e.g. Rome, USSR, USA media). Simulate epistemic decay over time.</li>
                    <li><strong>Game Design:</strong> SCM as core mechanic: players must manage symbolic load and prevent system breakdown. Visual epistemic architectures and symbolic identity networks.</li>
                </ul>
                <h3 className="text-xl font-semibold text-purple-400 mt-4">Future Work</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>Implement full Symbol Ecosystem Engine (fusion, ancestry, node-specific collapse events).</li>
                    <li>Advanced Collapse Analytics Panel with mitigation suggestions.</li>
                    <li>User Profile Compatibility and filtering.</li>
                    <li>Save/Load worldstates and preset scenarios.</li>
                    <li>Enhanced visualizations (constellation graphs, force-directed layouts).</li>
                    <li>Deeper Gemini AI integration with SCM-evaluated feedback loops.</li>
                </ul>
            </div>
        </Section>

      </main>
      <Footer />
    </div>
  );
};

export default App;
