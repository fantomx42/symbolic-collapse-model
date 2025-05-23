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

Because media streams are *driven*, model 𝒞 with a stoc
