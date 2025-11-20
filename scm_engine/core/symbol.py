
"""Core data structure for a symbol in the SCM v3.1."""

from dataclasses import dataclass

@dataclass
class Symbol:
    """Represents a symbol with its five core attributes.

    Attributes:
        T (float): Timelessness (0 to 1).
        E (float): Emotional Energy (0 to 1).
        S (float): Structural Coherence (0 to 1).
        I (float): Interpretive Flexibility (0 to 1).
        P (float): Parasitic Load (0 to 1).
    """
    T: float
    E: float
    S: float
    I: float
    P: float

    def __post_init__(self):
        """Clamps the attributes to the range [0, 1]."""
        self.T = max(0, min(1, self.T))
        self.E = max(0, min(1, self.E))
        self.S = max(0, min(1, self.S))
        self.I = max(0, min(1, self.I))
        self.P = max(0, min(1, self.P))
