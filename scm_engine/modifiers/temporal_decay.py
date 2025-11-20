
"""Applies temporal decay to a symbol's T and S attributes."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier
import math

@register_modifier("temporal_decay")
def temporal_decay(symbol: Symbol, time_since_reinforcement: float, k_T: float = 0.01, k_S: float = 0.02) -> Symbol:
    """Applies temporal decay to a symbol's T and S attributes.

    Args:
        symbol: The symbol to modify.
        time_since_reinforcement: The time since the symbol was last reinforced.
        k_T: The decay rate for Timelessness.
        k_S: The decay rate for Structural Coherence.

    Returns:
        The modified symbol.
    """
    symbol.T *= math.exp(-k_T * time_since_reinforcement)
    symbol.S *= math.exp(-k_S * time_since_reinforcement)
    return symbol
