
"""Core scoring logic for SCM v3.1."""

from .symbol import Symbol

def calculate_stability(symbol: Symbol) -> float:
    """Calculates the SCM v3.1 stability score (Σ) for a symbol.

    Args:
        symbol: The symbol to score.

    Returns:
        The stability score (Σ).
    """
    return ((symbol.T + symbol.E + symbol.S + symbol.I) / 4) - symbol.P
