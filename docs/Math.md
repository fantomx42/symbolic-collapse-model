# Symbolic-Collapse Model — Mathematical Appendix  
*Version 1.3 · May 2025*

This page formalises the collapse-pressure metric **𝒞**, lists risk zones
and records every mathematical extension needed for an academically
defensible, predictive, multi-agent collapse monitor.

---

## 1 Core Formula

$$
\boxed{\;
\mathcal{C}= \dfrac{I\,S\,P}{T\,E}\;}
$$

| Symbol | Meaning                          | Normalised range \[0,1] |
|--------|----------------------------------|-------------------------|
| *I*    | Information load                 | tokens s⁻¹ → percentile clip |
| *S*    | Symbolic abstraction             | syntactic / semantic depth |
| *P*    | Polarisation                     | JS-divergence or sentiment spread |
| *T*    | Transmission fidelity            | copy-loss, ROUGE, checksum pass-rate |
| *E*    | Epistemic coherence              | fact-check or citation agreement |

---

## 2 Risk Thresholds

| 𝒞 value              | Zone                | Interpretation                |
|----------------------|---------------------|-------------------------------|
| `𝒞 < 1.5`            | **Stable**          | Healthy symbolic exchange     |
| `1.5 ≤ 𝒞 < 2.5`      | **Symbolic Stress** | Early strain, watchful status |
| `2.5 ≤ 𝒞 < 3.5`      | **Narrative Fracture** | Coherence breaking, high risk |
| `𝒞 ≥ 3.5`            | **Collapse Zone**   | Meaning failure, crisis mode  |

---

## 3 Units & Scaling

Raw measures are mapped to \[0,1] using percentile winsorisation
($p_5$, $p_{95}$) and clipping:

$$
x_\text{norm} \;=\; \operatorname{clip}
\!\Bigl(\tfrac{x-p_{5}}{p_{95}-p_{5}},\,0,\,1\Bigr)
$$

### 3.1 Weighted Sensitivity

$$
\mathcal{C}_\text{weighted}= 
\frac{I^{\lambda_I}\,S^{\lambda_S}\,P^{\lambda_P}}
     {T^{\lambda_T}\,E^{\lambda_E}}
$$

Default $\lambda=1$.  Calibrated weights live in
`config/weights.yml`.

---

## 4 Non-Equilibrium Dynamics

Because media streams are *driven*, model 𝒞 with a stochastic
differential equation (SDE):

$$
d\mathcal{C}\;=\;f(\mathbf X,\lambda)\,dt \;+\; 
\sigma(\mathbf X)\,dW_t,
\quad\mathbf X=(I,S,P,T,E).
$$

Early-warning signs: rising $\operatorname{Var}(\mathcal{C})$,
lag-1 autocorrelation, critical slowing down.

---

## 5 Empirical Calibration

1. Build a labelled corpus (Stable / Fracture / Collapse).  
2. Optimise $\lambda$ and zone cut-offs via logistic regression or Bayesian GLM.  
3. Report ROC-AUC & Brier score on a held-out week.  

Notebooks: `notebooks/calibration/`.

---

## 6 Symbolic Entropy Proxy *(optional)*

$$
H_\text{symbol}= -\sum_i p(i)\,\log p(i)
$$

High $H$ ⇒ higher expected 𝒞 (good when *P* or *E* are hard to measure).

---

## 7 Agent Heterogeneity

Each agent $a$ has its own sensitivity vector

$$
\lambda^{(a)}=
\bigl(\lambda_I,\lambda_S,\lambda_P,\lambda_T,\lambda_E\bigr)^{(a)}
$$

> Enables phase-diagram sweeps of mixed communities  
> (`experiments/mesa_multiactor/`).

---

## 8 Collapse Footprint (Cumulative Strain)

$$
\text{Footprint}(t_0,t_1)=\int_{t_0}^{t_1}\!\mathcal{C}(t)\,dt
$$

Ranks conversations or epochs by total symbolic load.

---

## 9 Inverse Loss for Alignment Optimisation

For LLM fine-tuning:

$$
\text{Loss}= \frac{1}{1+\mathcal{C}}
\quad\Longrightarrow\quad
\text{minimising Loss } \Leftrightarrow \text{ minimising 𝒞}.
$$

---

## 10 Anomaly-Detection Rules (Early Warning)

### 10.1 Rolling z-score (point anomaly)

Window $W$ (default 100):

$$
\mu_t=\tfrac{1}{W}\!\sum_{i=t-W+1}^{t}\!\mathcal{C}_i,\quad
\sigma_t=\sqrt{\tfrac{1}{W}\!\sum_{i=t-W+1}^{t}
      (\mathcal{C}_i-\mu_t)^2}
$$

Flag if $\mathcal{C}_t > \mu_t + k\sigma_t$ (k = 3).

### 10.2 Exponential Footprint (collective anomaly)

$$
F_t = \alpha\,F_{t-1} + \mathcal{C}_t,
\qquad \alpha\in[0.90,\,0.98]
$$

Alarm when $F_t > F_\text{crit}$ (platform-specific).

---

## 11 Probabilistic Forecasting

### 11.1 Continuous OU process

$$
d\mathcal{C}= \theta(\mu-\mathcal{C})\,dt + \sigma\,dW_t
$$

Closed-form transition ⇒ maximum-likelihood fit; yields  
$P\bigl(\mathcal{C}_{t+h} \ge C_\text{crit}\bigr)$.

### 11.2 Discrete 4-state Markov chain

States S = {Stable, Stress, Fracture, Collapse}.  
Transition matrix $T_{ij}=P(S_{t+1}=j\mid S_t=i)$.  
n-step collapse risk = first row of $T^n$.

---

## 12 References

* Shannon (1948) — *A Mathematical Theory of Communication*  
* van Kampen (1992) — *Stochastic Processes in Physics and Chemistry*  
* Scheffer et al. (2009) — *Early-warning Signals for Critical Transitions*  
* Lakshmanan et al. (2023) — *Markov Chains for Information Cascades*  

---

> **Maintainer:** Symbolic Systems Science Lab · CC BY-NC-SA 4.0
