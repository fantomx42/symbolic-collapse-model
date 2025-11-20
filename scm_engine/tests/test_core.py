
"""Tests for the core SCM v3.1 logic."""

import unittest
from scm_engine.core.symbol import Symbol
from scm_engine.core.scoring import calculate_stability

class TestCore(unittest.TestCase):
    """Unit tests for the core SCM v3.1 logic."""

    def test_symbol_clamping(self):
        """Test that symbol attributes are clamped to the range [0, 1]."""
        symbol = Symbol(T=1.5, E=-0.5, S=0.5, I=1.0, P=0.0)
        self.assertEqual(symbol.T, 1.0)
        self.assertEqual(symbol.E, 0.0)
        self.assertEqual(symbol.S, 0.5)
        self.assertEqual(symbol.I, 1.0)
        self.assertEqual(symbol.P, 0.0)

    def test_calculate_stability(self):
        """Test the calculate_stability function."""
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        expected_stability = (0.8 + 0.7 + 0.9 + 0.6) / 4 - 0.1
        self.assertAlmostEqual(calculate_stability(symbol), expected_stability)

if __name__ == '__main__':
    unittest.main()
