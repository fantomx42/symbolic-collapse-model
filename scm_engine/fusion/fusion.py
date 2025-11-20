
"""Implements the SCM v3.1 fusion engine."""

from scm_engine.core.symbol import Symbol
from scm_engine.modifiers.nostalgia_weight import nostalgia_weight
from scm_engine.modifiers.emotional_resonance_field import emotional_resonance_field

def fuse_symbols(symbol_a: Symbol, symbol_b: Symbol, nostalgia_weight_f: float, erf_f: float) -> Symbol:
    """Fuses two symbols according to the SCM v3.1 specification.

    Args:
        symbol_a: The first symbol to fuse.
        symbol_b: The second symbol to fuse.
        nostalgia_weight_f: The nostalgia weight of the fused symbol.
        erf_f: The emotional resonance field of the fused symbol.

    Returns:
        The fused symbol.
    """
    # Base attribute merge
    fused_symbol = Symbol(
        T=(symbol_a.T + symbol_b.T) / 2,
        E=(symbol_a.E + symbol_b.E) / 2,
        S=(symbol_a.S + symbol_b.S) / 2,
        I=(symbol_a.I + symbol_b.I) / 2,
        P=1 - (1 - symbol_a.P) * (1 - symbol_b.P),
    )

    # Apply nostalgia and resonance after fusion
    fused_symbol = nostalgia_weight(fused_symbol, nostalgia_weight_f)
    fused_symbol = emotional_resonance_field(fused_symbol, erf_f)

    return fused_symbol
