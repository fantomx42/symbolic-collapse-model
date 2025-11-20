
"""Calculates the confidence metric for a symbol."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier
from scm_engine.utils.stats import variance

@register_modifier("confidence_metric")
def confidence_metric(symbol: Symbol) -> float:
    """Calculates the confidence metric for a symbol.

    The confidence metric is a measure of how well-stabilized a symbol is.
    It is calculated as 1 - Var(T, E, S, I, P).

    Args:
        symbol: The symbol to calculate the confidence metric for.

    Returns:
        The confidence metric.
    """
    return 1 - variance([symbol.T, symbol.E, symbol.S, symbol.I, symbol.P])
