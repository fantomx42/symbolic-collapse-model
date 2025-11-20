
"""Applies the Emotional Resonance Field (ERF) modifier to a symbol's E attribute."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier

@register_modifier("emotional_resonance_field")
def emotional_resonance_field(symbol: Symbol, erf: float) -> Symbol:
    """Applies the Emotional Resonance Field (ERF) modifier to a symbol's E attribute.

    Args:
        symbol: The symbol to modify.
        erf: The emotional resonance field value.

    Returns:
        The modified symbol.
    """
    symbol.E *= (1 + erf)
    return symbol
