
"""Applies symbolic damping to a symbol's attributes."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier

@register_modifier("symbolic_damping")
def symbolic_damping(symbol: Symbol, delta_X: float) -> Symbol:
    """Applies symbolic damping to a symbol's attributes.

    Args:
        symbol: The symbol to modify.
        delta_X: The change in the attribute.

    Returns:
        The modified symbol.
    """
    symbol.T += delta_X * (1 - abs(symbol.T))
    symbol.E += delta_X * (1 - abs(symbol.E))
    symbol.S += delta_X * (1 - abs(symbol.S))
    symbol.I += delta_X * (1 - abs(symbol.I))
    symbol.P += delta_X * (1 - abs(symbol.P))
    return symbol
