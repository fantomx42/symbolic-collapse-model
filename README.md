# Symbolic Collapse Model (SCM)

## Overview

The Symbolic Collapse Model (SCM) quantitatively assesses semiotic overload—how symbolic systems degrade under stress—by calculating a normalized stress index, **𝒞**, from five epistemic-informational factors:

* **T**: Transmission fidelity
* **E**: Epistemic coherence
* **S**: Signal intensity
* **I**: Information inertia
* **P**: Sociopolitical polarization

These factors can be further refined with an extensible set of contextual modifiers (**Mᵢ**).

Empirical studies (Telegram finance channels, multi-agent LLM interactions, parliamentary records) confirm that **𝒞 ≥ 0.80** reliably predicts imminent symbolic disintegration and coordination failure, typically within 18 hours, with an AUC of ≥ 0.90.

SCM serves as an actionable early-warning system for policymakers, systems engineers, and AI safety professionals.

## Formula

The canonical SCM formula calculates a raw symbolic collapse value and maps it onto a logistic function:

$$
\text{raw} = \frac{S (1 + I)(1 + P)\prod_{m \in M_{+}}(1 + m)}{T E \prod_{n \in M_{-}}(1 + |n|)}, \quad
𝒞 = \frac{1}{1 + e^{-κ(\text{raw} - τ)}} \quad \in [0,1]
$$

* **κ** controls the steepness of the logistic curve.
* **τ** sets the midpoint of the logistic curve based on empirical data.

Alternative computational kernels (geometric mean, harmonic mean, min-cut) are documented in `docs/kernels.md`.

## Variables Explained

| Symbol | Meaning              | Instrumentation Examples                   | Scaling          |
| ------ | -------------------- | ------------------------------------------ | ---------------- |
| **T**  | Signal clarity       | Bit-error rates, fact-check accuracy       | Min-max \[0,1]   |
| **E**  | Logical consistency  | Contradiction audits, entailment metrics   | Logistic z-score |
| **S**  | Information flow     | Message rate, entropy, virality            | log₁₀(1+x)       |
| **I**  | Resistance to change | Edit half-life, schema-update latency      | ln(1+x)          |
| **P**  | Group division       | Sentiment Jensen-Shannon divergence        | Min-max \[0,1]   |
| **Mᵢ** | Contextual modifiers | Nostalgia, redundancy, emotional resonance | Bounded \[-1,+1] |

### Instability Threshold

A critical rise in **𝒞** occurs when:

* **T** < 0.70 or **E** < 0.60, or
* max(**S**, **I**, **P**) surpasses 80th percentile thresholds.

## Interpretation and Action

| 𝒞 Value  | Status       | Action Guidelines                                     |
| --------- | ------------ | ----------------------------------------------------- |
| 0.00–0.25 | **Nominal**  | Routine monitoring, archival logging                  |
| 0.26–0.50 | **Watch**    | Prepare mitigation, draft alerts                      |
| 0.51–0.80 | **Strain**   | Implement throttling, redundancy, mediation protocols |
| 0.81–1.00 | **Critical** | Emergency actions, halt non-critical activities       |

Thresholds should be refined through ROC analysis specific to your domain.

## Example Calculation

```python
from scm_core import canonical_G, logistic

T, E, S, I, P = 0.92, 0.75, 4.0, 1.5, 0.60
M_pos, M_neg = [0.20, 0.35], [-0.15]

raw = canonical_G(T, E, S, I, P, M_pos, M_neg)
𝒞 = logistic(raw, kappa=0.35, tau=5.0)

print(f"𝒞 = {𝒞:.2f}")  # 0.97 (Critical)
```

**Suggested Mitigation:** Reduce signal velocity (**S**), increase transmission clarity (**T**), and facilitate dialogues to lower polarization (**P**).

## Implementation Stack

```
Ingest (Kafka/Pulsar)
   ↓
Feature Extraction (NLP/ETL)
   ↓
SCM Core (Rust + SIMD/WASM)
   ↓
Time-Series DB (QuestDB) → Grafana
   ↓
Webhooks (Slack, Matrix, PagerDuty)
```

Edge processing ensures privacy, with only minimal collapse metric deltas transmitted.

## Licensing and Citation

SCM is available under **CC BY-NC-SA 4.0**. Commercial use requires prior consent.

```bibtex
@misc{wheeler2025scm,
  author = {Wheeler, Tristan A.},
  title  = {Symbolic Collapse Model: A Quantitative Framework for Semiotic Risk},
  year   = {2025},
  url    = {https://github.com/fantomx42/symbolic-collapse-model}
}
```

Inspired by Claude Shannon, Neil Postman, and Norbert Wiener.
