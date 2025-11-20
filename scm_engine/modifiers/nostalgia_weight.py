
"""Applies the Nostalgia Weight (NW) modifier to a symbol's E attribute."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier

@register_modifier("nostalgia_weight")
def nostalgia_weight(symbol: Symbol, nostalgia_weight: float) -> Symbol:
    """Applies the Nostalgia Weight (NW) modifier to a symbol's E attribute.

    Nostalgia boosts emotional energy only when the symbol is structurally weak.

    Args:
        symbol: The symbol to modify.
        nostalgia_weight: The nostalgia weight to apply.

    Returns:
        The modified symbol.
    """
    symbol.E += nostalgia_weight * (1 - symbol.S)
    return symbol
