
import React, { useState, useCallback, useMemo, useReducer, useRef, useEffect } from 'react';
import { SCMSimulator } from './components/SCMSimulator';
import { GeminiInteraction } from './components/GeminiInteraction';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Section } from './components/Section';
import { SCMParameters, SCMVariables, SCMCalculatedValues, SCMParameterHistory } from './types';
import { DEFAULT_SCM_PARAMETERS, SCM_MODEL_TEXT } from './constants';
import { InfoPanel } from './components/InfoPanel';
import { SCMVisualizer } from './components/SCMVisualizer';
import { CollapseMeter } from './components/CollapseMeter';
import { SCMNNPlayground } from './components/SCMNNPlayground'; // Import new component
import { computeSCMInternal, mapValueToZone } from './utils/scmUtils'; // Import from new util file

// Action types for scmParams reducer
type SCMParamAction = 
  | { type: 'SET_PARAM'; key: keyof SCMParameters; value: number }
  | { type: 'SET_ALL_PARAMS'; payload: SCMParameters };

// Reducer function for SCMParameters
const scmParamsReducer = (state: SCMParameters, action: SCMParamAction): SCMParameters => {
  switch (action.type) {
    case 'SET_PARAM':
      if ((action.key === 'T' || action.key === 'E') && action.value < 0.1) {
        return { ...state, [action.key]: 0.1 };
      }
      return { ...state, [action.key]: action.value };
    case 'SET_ALL_PARAMS':
      const validatedPayload = {...action.payload};
      if (validatedPayload.T < 0.1) validatedPayload.T = 0.1;
      if (validatedPayload.E < 0.1) validatedPayload.E = 0.1;
      return validatedPayload;
    default:
      return state;
  }
};

const MAX_HISTORY_POINTS = 30;

const App: React.FC = () => {
  const [scmParams, dispatchScmParams] = useReducer(scmParamsReducer, DEFAULT_SCM_PARAMETERS);
  
  const previousScmParamsRef = useRef<SCMParameters | null>(null);
  const previousCalculatedValuesRef = useRef<SCMCalculatedValues | null>(null);

  const [scmParamsHistory, setScmParamsHistory] = useState<SCMParameterHistory>(() => {
    const initialHistory: SCMParameterHistory = {} as SCMParameterHistory;
    (Object.keys(DEFAULT_SCM_PARAMETERS) as Array<keyof SCMParameters>).forEach(key => {
        initialHistory[key] = [DEFAULT_SCM_PARAMETERS[key]]; 
    });
    return initialHistory;
  });

  // Renamed to globalComputeSCM to avoid conflict if SCMNNPlayground also has a computeSCM name
  const globalComputeSCM = useCallback((params: SCMParameters): SCMCalculatedValues => {
    return computeSCMInternal(params);
  }, []);

  const calculatedValues = useMemo(() => globalComputeSCM(scmParams), [scmParams, globalComputeSCM]);

  useEffect(() => {
    previousScmParamsRef.current = scmParams;

    setScmParamsHistory(prevHistory => {
        const newHistory = { ...prevHistory } as SCMParameterHistory;
        (Object.keys(scmParams) as Array<keyof SCMParameters>).forEach(key => {
            const currentValue = scmParams[key];
            const historyForKey = prevHistory[key] ? [...prevHistory[key]] : [];
            
            historyForKey.push(currentValue);
            if (historyForKey.length > MAX_HISTORY_POINTS) {
                historyForKey.shift(); 
            }
            newHistory[key] = historyForKey;
        });
        return newHistory;
    });

  }, [scmParams]);

  useEffect(() => {
    previousCalculatedValuesRef.current = calculatedValues;
  }, [calculatedValues]);

  const scmVariablesForVisualizer: SCMVariables = {
    I: scmParams.I,
    S: scmParams.S,
    P: scmParams.P,
    T: scmParams.T,
    E: scmParams.E,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <Section title="Symbolic Collapse Model (SCM) Interactive Explorer" initiallyOpen={true}>
          <p className="text-lg text-gray-300 mb-6">
            Explore the Symbolic Collapse Model by adjusting variables and observing the impact on system stability. 
            The SCM provides a framework for understanding how information load, abstraction, polarization, transmission fidelity, and epistemic coherence interact to influence symbolic systems.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl backdrop-blur-md border border-gray-700">
              <SCMSimulator 
                params={scmParams} 
                previousParams={previousScmParamsRef.current}
                dispatchParams={dispatchScmParams} 
                calculatedValues={calculatedValues}
                previousCalculatedValues={previousCalculatedValuesRef.current}
                scmParamsHistory={scmParamsHistory}
              />
            </div>
            <div className="space-y-6 bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl backdrop-blur-md border border-gray-700">
              <CollapseMeter calculatedValues={calculatedValues} />
              <SCMVisualizer variables={scmVariablesForVisualizer} calculatedValues={calculatedValues} />
            </div>
          </div>
        </Section>

        <Section title="SCM Neural Network Playground" initiallyOpen={false}>
          <SCMNNPlayground computeSCM={computeSCMInternal} />
        </Section>

        <Section title="SCM Definitions & Formulae" initiallyOpen={false}>
          <InfoPanel calculatedValues={calculatedValues} />
        </Section>

        <Section title="Gemini AI Playground & SCM Contextual Analysis" initiallyOpen={false}>
          <GeminiInteraction scmParams={scmParams} geminiModel={SCM_MODEL_TEXT} />
        </Section>
        
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
                    <li>Incorporate multi-agent divergence and symbolic faith drift.</li>
                    <li>Expand into quantum symbolic encoding and symbolic memory restoration.</li>
                    <li>Extend into symbolic integrity engineering as a new scientific discipline.</li>
                </ul>
            </div>
        </Section>

      </main>
      <Footer />
    </div>
  );
};

export default App;
