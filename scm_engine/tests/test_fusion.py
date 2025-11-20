
"""Tests for the SCM v3.1 fusion engine."""

import unittest
from scm_engine.core.symbol import Symbol
from scm_engine.fusion.fusion import fuse_symbols

class TestFusion(unittest.TestCase):
    """Unit tests for the SCM v3.1 fusion engine."""

    def test_fuse_symbols(self):
        """Test the fuse_symbols function."""
        symbol_a = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        symbol_b = Symbol(T=0.6, E=0.5, S=0.7, I=0.4, P=0.2)
        fused_symbol = fuse_symbols(symbol_a, symbol_b, nostalgia_weight_f=0.1, erf_f=0.2)

        expected_T = (0.8 + 0.6) / 2
        expected_S = (0.9 + 0.7) / 2
        expected_E = (0.7 + 0.5) / 2
        expected_E = expected_E + 0.1 * (1 - expected_S)
        expected_E = expected_E * (1 + 0.2)
        expected_I = (0.6 + 0.4) / 2
        expected_P = 1 - (1 - 0.1) * (1 - 0.2)

        self.assertAlmostEqual(fused_symbol.T, expected_T)
        self.assertAlmostEqual(fused_symbol.E, expected_E)
        self.assertAlmostEqual(fused_symbol.S, expected_S)
        self.assertAlmostEqual(fused_symbol.I, expected_I)
        self.assertAlmostEqual(fused_symbol.P, expected_P)

if __name__ == '__main__':
    unittest.main()
