# Symbolic Collapse Model (SCM) v3.1

## Overview

The Symbolic Collapse Model (SCM) is a framework for understanding how symbolic systems degrade under stress. SCM v3.1 introduces a more modular architecture, a revised set of core variables, and a new stability score formula.

## SCM v3.1 Architecture

The `scm_engine` is now organized into the following modules:

```
scm_engine/
├── core/
├── modifiers/
├── fusion/
├── telemetry/
├── io/
├── math/
└── utils/
```

*   **core/**: Contains the core data structure for a symbol and the main stability score calculation.
*   **modifiers/**: Contains all the SCM v3.1 modifiers, each in its own file.
*   **fusion/**: Contains the fusion engine for combining symbols.
*   **telemetry/**: Contains the real-time telemetry encoder/decoder for SCM data packets.
*   **io/**: Contains file loading, saving, and schema validation tools.
*   **math/**: Contains resonance fields, damping, and temporal decay functions.
*   **utils/**: Contains lightweight helper functions.

## SCM v3.1 Core Variables

Each symbol has five core attributes, each in the range [0, 1]:

| Symbol | Meaning                  |
| ------ | ------------------------ |
| **T**  | Timelessness             |
| **E**  | Emotional Energy         |
| **S**  | Structural Coherence     |
| **I**  | Interpretive Flexibility |
| **P**  | Parasitic Load           |

## SCM v3.1 Stability Score (Σ)

The stability score of a symbol is calculated as follows:

Σ = (T + E + S + I) / 4 - P

## SCM v3.1 Modifiers

SCM v3.1 includes the following modifiers:

*   **Temporal Decay**: Symbols drift over time unless refreshed.
*   **Nostalgia Weight (NW)**: Nostalgia boosts emotional energy only when the symbol is structurally weak.
*   **Emotional Resonance Field (ERF)**: The emotional context in which the symbol is interacting.
*   **Symbolic Damping**: Prevents runaway swings in symbol attributes.
*   **Variable Influence Caps**: Caps the influence of each variable on the stability score.
*   **Baseline Lock**: Prevents symbols from drifting arbitrarily far from their identity.
*   **Confidence Metric**: A measure of how well-stabilized a symbol is.

## SCM v3.1 Fusion

The fusion engine combines two symbols into a single fused symbol. The base attributes are averaged, and the parasitic load accumulates.

## SCM v3.1 Telemetry

The telemetry module provides tools for encoding and decoding SCM data into IPv6-like 128-bit packets.

## Interactive Explorer

This repository contains an interactive explorer for the SCM. The explorer is a web application that allows you to:

*   **Adjust SCM parameters:** Use sliders to adjust the values of the five core SCM parameters and see the effect on the system's stability.
*   **Visualize the SCM:** See a real-time visualization of the SCM, with nodes representing the SCM variables and particles representing the flow of information through the system.
*   **Experiment with a mock neural network:** Enter text and see how a mock neural network would derive SCM parameters from it.
*   **Interact with the Gemini AI:** Enter a prompt and see how the Gemini AI would respond, with the SCM parameters taken into account.

## Getting Started

To run the interactive explorer locally, follow these steps:

1.  **Clone the repository:**
    ```
    git clone https://github.com/fantomx42/symbolic-collapse-model.git
    ```
2.  **Install the dependencies:**
    ```
    npm install
    ```
3.  **Run the application:**
    ```
    npm run dev
    ```
4.  **Open the application in your browser:**
    The application will be available at http://localhost:3000.

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
