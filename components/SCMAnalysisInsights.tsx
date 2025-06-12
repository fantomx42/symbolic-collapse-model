import React from 'react';
import { SCMParameters, SCMCalculatedValues, CollapseZone } from '../types';
import { VARIABLE_DETAILS } from '../constants';

interface SCMAnalysisInsightsProps {
  scmParams: SCMParameters | null;
  scmResult: SCMCalculatedValues | null;
}

interface FactorImpact {
  key: keyof SCMParameters;
  value: number;
  impactScore: number; // Higher is more impactful (negative or positive)
  label: string;
  advice: string;
  isRisk: boolean; // True if this parameter value contributes to higher collapse risk
}

// Define thresholds for "risky" values (approximate)
const PARAM_RISK_THRESHOLDS: Record<keyof SCMParameters, { highRiskIfAbove?: number; lowRiskIfBelow?: number; ideal?: number }> = {
  I: { highRiskIfAbove: 7, ideal: 4 },
  S: { highRiskIfAbove: 7, ideal: 4 },
  P: { highRiskIfAbove: 6, ideal: 3 },
  T: { lowRiskIfBelow: 4, ideal: 8 },
  E: { lowRiskIfBelow: 4, ideal: 8 },
  lambda: { highRiskIfAbove: 2.5, ideal: 0.5 }, // High lambda accelerates collapse
  time: { highRiskIfAbove: 50, ideal: 10 }, // Longer time under pressure
  R_memory: { lowRiskIfBelow: 3, ideal: 7 }, // Low resilience is bad
  R_redundancy: { lowRiskIfBelow: 3, ideal: 7 },
  R_anchoring: { lowRiskIfBelow: 3, ideal: 7 },
};

const getMitigationAdvice = (key: keyof SCMParameters, value: number, isRisk: boolean): string => {
  if (!isRisk) return "Parameter is currently in a good range.";

  switch (key) {
    case 'I': return "Reduce information density, simplify, or break down content into smaller chunks.";
    case 'S': return "Use more concrete language, provide specific examples, and reduce layers of abstraction.";
    case 'P': return "Frame content more neutrally, find common ground, or clearly define differing perspectives.";
    case 'T': return "Improve clarity, remove jargon, ensure directness, or use a more reliable medium.";
    case 'E': return "Strengthen internal consistency, connect ideas logically, and provide better contextual grounding.";
    case 'lambda': return "Address factors causing rapid symbolic decay or overload in the environment.";
    case 'time': return "For time-sensitive systems, ensure rapid updates or resets if pressure is sustained.";
    case 'R_memory': return "Bolster system memory, historical context, or learning from past states.";
    case 'R_redundancy': return "Increase backup information channels or diverse perspectives to counter single points of failure.";
    case 'R_anchoring': return "Reinforce core definitions, foundational principles, or shared understanding of key symbols.";
    default: return "Review this parameter's role in the system's stability.";
  }
};


export const SCMAnalysisInsights: React.FC<SCMAnalysisInsightsProps> = ({ scmParams, scmResult }) => {
  if (!scmParams || !scmResult) {
    return (
      <div className="mt-4 p-4 bg-gray-700 bg-opacity-30 rounded-lg border border-gray-600">
        <p className="text-sm text-gray-400 italic">Process text to see SCM analysis and insights.</p>
      </div>
    );
  }

  const factors: FactorImpact[] = [];

  (Object.keys(scmParams) as Array<keyof SCMParameters>).forEach(key => {
    const value = scmParams[key];
    const thresholds = PARAM_RISK_THRESHOLDS[key];
    const detail = VARIABLE_DETAILS[key];
    let isRisk = false;
    let impactScore = 0; // Simple deviation from ideal

    if (thresholds) {
      if (thresholds.highRiskIfAbove !== undefined && value > thresholds.highRiskIfAbove) {
        isRisk = true;
        impactScore = Math.abs(value - (thresholds.ideal ?? thresholds.highRiskIfAbove));
      } else if (thresholds.lowRiskIfBelow !== undefined && value < thresholds.lowRiskIfBelow) {
        isRisk = true;
        impactScore = Math.abs((thresholds.ideal ?? thresholds.lowRiskIfBelow) - value);
      }
       // For resilience factors, low is bad, so impact increases as value decreases from ideal
      if (key.startsWith('R_') && thresholds.ideal && value < thresholds.ideal) {
        impactScore = thresholds.ideal - value;
      } else if (!key.startsWith('R_') && thresholds.ideal && value > thresholds.ideal){
         impactScore = value - thresholds.ideal;
      }


    }
    
    if (isRisk || key.startsWith('R_')) { // Always show resilience factors or if risky
        factors.push({
            key,
            value,
            impactScore,
            label: detail.label,
            advice: getMitigationAdvice(key, value, isRisk),
            isRisk // explicitly track if it's currently a risk contributor
        });
    }
  });

  // Sort factors by impact score (descending), but primarily by isRisk true
  factors.sort((a, b) => {
    if (a.isRisk && !b.isRisk) return -1;
    if (!a.isRisk && b.isRisk) return 1;
    return b.impactScore - a.impactScore;
  });

  const topFactors = factors.slice(0, 5); // Show top N factors

  return (
    <div className="mt-6 p-4 bg-gray-700 bg-opacity-60 rounded-lg border border-gray-600 shadow-lg">
      <h3 className="text-lg font-semibold text-purple-300 mb-3">SCM Analysis & Mitigation Insights</h3>
      
      {topFactors.length > 0 ? (
        <>
          <div className="mb-4">
            <h4 className="text-md font-medium text-purple-400 mb-2">Key Influencing Factors:</h4>
            <ul className="space-y-2 text-sm">
              {topFactors.map(factor => (
                <li key={factor.key} className={`p-2 rounded-md ${factor.isRisk ? 'bg-red-800 bg-opacity-40 border border-red-700' : 'bg-green-800 bg-opacity-30 border border-green-700'}`}>
                  <span className="font-semibold text-indigo-300">{factor.label}: {factor.value.toFixed(1)}</span> - 
                  <span className="text-gray-300 ml-1">{factor.isRisk ? "Contributing to risk." : "Supporting stability."}</span>
                  <p className="text-xs text-gray-400 mt-1">{factor.advice}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-400">SCM parameters appear to be in a generally stable range.</p>
      )}

      {scmResult.zone === CollapseZone.Critical && (
        <div className="mt-4 p-3 bg-red-700 bg-opacity-70 border border-red-500 rounded-md">
          <p className="text-red-200 font-semibold">
            Effective collapse risk is 'Collapse (Extreme Risk)'. Output has been suppressed.
            Review the factors above and consider adjusting parameters to mitigate risk.
          </p>
        </div>
      )}
       {scmResult.zone === CollapseZone.High && (
        <div className="mt-4 p-3 bg-orange-600 bg-opacity-70 border border-orange-500 rounded-md">
          <p className="text-orange-200 font-semibold">
            Effective collapse risk is 'Critical (High Risk)'. Consider adjustments to improve stability.
          </p>
        </div>
      )}
    </div>
  );
};
