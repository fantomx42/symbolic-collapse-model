# Symbolic-Collapse Model — Mathematical Appendix  
*Version 1.3 · May 2025*

This document formalises the collapse-pressure metric **𝒞**, lists risk
zones, and records every mathematical extension needed for an **academically
defensible, predictive, multi-agent collapse monitor**.  Copy this file into
`docs/math.md` (or similar) in your repository.

---

## 1 Core Formula

\[
\boxed{\;
\mathcal{C}= \frac{I\,S\,P}{T\,E}\;}
\]

| Symbol | Meaning                          | Normalised range \[0,1] |
|--------|----------------------------------|-------------------------|
| *I*    | Information load                 | tokens s⁻¹ → percentile clip |
| *S*    | Symbolic abstraction             | syntactic/semantic depth |
| *P*    | Polarisation                     | JS-divergence or sentiment spread |
| *T*    | Transmission fidelity            | copy-loss, ROUGE, checksum pass-rate |
| *E*    | Epistemic coherence              | fact-check or citation agreement |

---

## 2 Risk Thresholds

| 𝒞                     | Zone                     | Interpretation                |
|-----------------------|--------------------------|-------------------------------|
| 𝒞 &lt; 1.5            | **Stable**               | Healthy symbolic exchange     |
| 1.5 ≤ 𝒞 &lt; 2.5      | **Symbolic Stress**      | Early strain, watchful status |
| 2.5 ≤ 𝒞 &lt; 3.5      | **Narrative Fracture**   | Coherence breaking, high risk |
| 𝒞 ≥ 3.5               | **Collapse Zone**        | Meaning failure, crisis mode  |

---

## 3 Units & Scaling

Raw metrics are mapped to \[0,1] with percentile winsorisation  
(p₅ & p₉₅) then clipped:

\[
x_\text{norm}= \operatorname{clip}\!\Bigl(\tfrac{x-p_5}{p_{95}-p_5},0,1\Bigr)
\]

### 3.1 Weighted Sensitivity

\[
\mathcal{C}_\text{weighted}= 
\frac{I^{\lambda_I} S^{\lambda_S} P^{\lambda_P}}
     {T^{\lambda_T} E^{\lambda_E}}
\]

Default λ = 1.  Calibrated values live in `config/weights.yml`.

---

## 4 Non-Equilibrium Dynamics

Because news and social-media streams are *driven*, model 𝒞 as a stochastic
differential equation (SDE):

\[
d\mathcal{C}=f(\mathbf X,\lambda)\,dt + \sigma(\mathbf X)\,dW_t,
\quad\mathbf X=(I,S,P,T,E).
\]

Early-warning indicators  
• rising Var(𝒞) • lag-1 autocorrelation • critical slowing down.

---

## 5 Empirical Calibration

1. Build a labelled corpus (Stable / Fracture / Collapse).  
2. Optimise λ and zone cut-offs via logistic regression or Bayesian GLM.  
3. Report ROC-AUC and Brier score on held-out week.

Notebooks in `notebooks/calibration/`.

---

## 6 Symbolic Entropy Proxy (optional)

\[
H_\text{symbol}= -\sum_i p(i)\,\log p(i)
\]

High H ⇒ high expected 𝒞; useful when *P* or *E* are hard to measure.

---

## 7 Agent Heterogeneity

Each agent a carries its own sensitivity vector

\[
\lambda^{(a)}=
\bigl(\lambda_I,\lambda_S,\lambda_P,\lambda_T,\lambda_E\bigr)^{(a)}
\]

→ enables phase-diagram sweeps of mixed communities  
(`experiments/mesa_multiactor/`).

---

## 8 Collapse Footprint (Cumulative Strain)

\[
\mathrm{Footprint}(t_0,t_1)=\int_{t_0}^{t_1} \mathcal{C}(t)\;dt
\]

Ranks conversations, channels, or epochs by total symbolic load.

---

## 9 Inverse Loss for Alignment Optimisation

For LLM fine-tuning:

\[
\mathrm{Loss}= \frac{1}{1+\mathcal{C}}\;,
\qquad
\text{minimise} \;\mathrm{Loss}\;\Leftrightarrow\; minimise 𝒞.
\]

---

## 10 Anomaly-Detection Rules (Early Warning)

### 10.1 Rolling z-score (point anomaly)

Window W (default 100):

\[
\mu_t=\frac1W\!\sum_{i=t-W+1}^{t}\!\mathcal{C}_i,\;
\sigma_t=\sqrt{\tfrac1W\!\sum_{i=t-W+1}^{t}\!(\mathcal{C}_i-\mu_t)^2}
\]

Flag if \(\mathcal{C}_t > \mu_t + k\sigma_t\) (k = 3).

### 10.2 Exponential Footprint (collective anomaly)

\[
F_t = \alpha F_{t-1} + \mathcal{C}_t,
\quad \alpha\!(0{.}9\!–\!0{.}98)
\]

Alarm when \(F_t > F_\text{crit}\) (platform-specific).

---

## 11 Probabilistic Forecasting

### 11.1 Continuous OU process

\[
d\mathcal{C}= \theta(\mu-\mathcal{C})\,dt + \sigma\,dW_t
\]

Closed-form transition ⇒ maximum-likelihood fit; gives  
\(P\bigl(\mathcal{C}_{t+h} \ge C_\text{crit}\bigr)\).

### 11.2 Discrete 4-state Markov chain

States S = {Stable, Stress, Fracture, Collapse}.  
Transition matrix \(T_{ij}=P(S_{t+1}=j\mid S_t=i)\).  
n-step collapse risk = first row of \(T^n\).

---

## 12 References

* C. E. Shannon (1948) *A Mathematical Theory of Communication*  
* N. G. van Kampen (1992) *Stochastic Processes in Physics and Chemistry*  
* M. Scheffer et al. (2009) *Early-warning Signals for Critical Transitions*  
* S. Lakshmanan et al. (2023) *Markov Chains for Information Cascades*  

---

> Maintainer: **Symbolic Systems Science Lab**  
> License: CC BY-NC-SA 4.0
