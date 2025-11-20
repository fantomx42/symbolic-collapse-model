
"""Applies variable influence caps to a symbol's attributes."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier

@register_modifier("variable_influence_caps")
def variable_influence_caps(symbol: Symbol, T_max: float = 1.0, E_max: float = 1.0, S_max: float = 1.0, I_max: float = 1.0, P_max: float = 1.0) -> Symbol:
    """Applies variable influence caps to a symbol's attributes.

    Args:
        symbol: The symbol to modify.
        T_max: The maximum value for Timelessness.
        E_max: The maximum value for Emotional Energy.
        S_max: The maximum value for Structural Coherence.
        I_max: The maximum value for Interpretive Flexibility.
        P_max: The maximum value for Parasitic Load.

    Returns:
        The modified symbol.
    """
    symbol.T = min(symbol.T, T_max)
    symbol.E = min(symbol.E, E_max)
    symbol.S = min(symbol.S, S_max)
    symbol.I = min(symbol.I, I_max)
    symbol.P = min(symbol.P, P_max)
    return symbol
