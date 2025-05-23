# Contributing Guidelines

We welcome thoughtful contributions to the **Symbolic-Collapse Model (SCM)** from anyone interested in systems thinking, communication theory, sociology, information science, or related fields. Whether you have empirical data, theoretical tweaks, or a bug fix—thank you for helping keep the project rigorous and useful.

---

## 1 How to contribute

1. **Fork → branch → pull request**  
   • Name your branch descriptively, e.g. `fix/entropy-typo` or `feat/weighted-lambda`.  
   • Keep PRs focused; separate unrelated changes.

2. **Open an Issue** for:  
   • Bug reports (repro steps + expected vs. actual).  
   • Feature proposals (short rationale + suggested approach).  
   • Data-set offers or real-world case studies.

3. **Join the discussion**  
   Comment on existing Issues/PRs if you can supply data, citations, or experience.

---

## 2 Ground rules

| Rule | Why it exists |
|------|---------------|
| **Respect CC BY-NC-SA 4.0 license** | Keeps the model open & non-commercial. |
| **Cite your sources** | Claims without references may be removed. |
| **Describe equation changes** | Explain intended effect on 𝒞 or risk zones. |
| **Stay civil** | No harassment or flame-wars. See Code of Conduct. |

---

## 3 Project layout

```text
/src/          core TypeScript library
/docs/         math appendix, design notes
/notebooks/    calibration & data analysis
/examples/     minimal “hello SCM” demos
