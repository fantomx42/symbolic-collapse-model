
"""Applies the baseline lock modifier to a symbol's attributes."""

from scm_engine.core.symbol import Symbol
from .modifier_registry import register_modifier

@register_modifier("baseline_lock")
def baseline_lock(symbol: Symbol, baseline: Symbol, lambda_lock: float = 0.1) -> Symbol:
    """Applies the baseline lock modifier to a symbol's attributes.

    Args:
        symbol: The symbol to modify.
        baseline: The baseline symbol to lock to.
        lambda_lock: The locking factor.

    Returns:
        The modified symbol.
    """
    symbol.T = symbol.T * (1 - lambda_lock) + baseline.T * lambda_lock
    symbol.E = symbol.E * (1 - lambda_lock) + baseline.E * lambda_lock
    symbol.S = symbol.S * (1 - lambda_lock) + baseline.S * lambda_lock
    symbol.I = symbol.I * (1 - lambda_lock) + baseline.I * lambda_lock
    symbol.P = symbol.P * (1 - lambda_lock) + baseline.P * lambda_lock
    return symbol
