
"""Tests for the SCM v3.1 modifiers."""

import unittest
import math
from scm_engine.core.symbol import Symbol
from scm_engine.modifiers.temporal_decay import temporal_decay

class TestModifiers(unittest.TestCase):
    """Unit tests for the SCM v3.1 modifiers."""

    def test_temporal_decay(self):
        """Test the temporal_decay modifier."""
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        modified_symbol = temporal_decay(symbol, time_since_reinforcement=10)
        self.assertAlmostEqual(modified_symbol.T, 0.8 * math.exp(-0.01 * 10))
        self.assertAlmostEqual(modified_symbol.S, 0.9 * math.exp(-0.02 * 10))

    def test_nostalgia_weight(self):
        """Test the nostalgia_weight modifier."""
        from scm_engine.modifiers.nostalgia_weight import nostalgia_weight
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        modified_symbol = nostalgia_weight(symbol, nostalgia_weight=0.2)
        self.assertAlmostEqual(modified_symbol.E, 0.7 + 0.2 * (1 - 0.9))

    def test_emotional_resonance_field(self):
        """Test the emotional_resonance_field modifier."""
        from scm_engine.modifiers.emotional_resonance_field import emotional_resonance_field
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        modified_symbol = emotional_resonance_field(symbol, erf=0.1)
        self.assertAlmostEqual(modified_symbol.E, 0.7 * (1 + 0.1))

    def test_symbolic_damping(self):
        """Test the symbolic_damping modifier."""
        from scm_engine.modifiers.symbolic_damping import symbolic_damping
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        modified_symbol = symbolic_damping(symbol, delta_X=0.1)
        self.assertAlmostEqual(modified_symbol.T, 0.8 + 0.1 * (1 - abs(0.8)))
        self.assertAlmostEqual(modified_symbol.E, 0.7 + 0.1 * (1 - abs(0.7)))
        self.assertAlmostEqual(modified_symbol.S, 0.9 + 0.1 * (1 - abs(0.9)))
        self.assertAlmostEqual(modified_symbol.I, 0.6 + 0.1 * (1 - abs(0.6)))
        self.assertAlmostEqual(modified_symbol.P, 0.1 + 0.1 * (1 - abs(0.1)))

    def test_variable_influence_caps(self):
        """Test the variable_influence_caps modifier."""
        from scm_engine.modifiers.variable_influence_caps import variable_influence_caps
        symbol = Symbol(T=1.2, E=0.7, S=0.9, I=0.6, P=0.1)
        modified_symbol = variable_influence_caps(symbol, T_max=1.0)
        self.assertEqual(modified_symbol.T, 1.0)

    def test_baseline_lock(self):
        """Test the baseline_lock modifier."""
        from scm_engine.modifiers.baseline_lock import baseline_lock
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        baseline = Symbol(T=0.5, E=0.5, S=0.5, I=0.5, P=0.5)
        modified_symbol = baseline_lock(symbol, baseline, lambda_lock=0.1)
        self.assertAlmostEqual(modified_symbol.T, 0.8 * 0.9 + 0.5 * 0.1)

    def test_confidence_metric(self):
        """Test the confidence_metric modifier."""
        from scm_engine.modifiers.confidence_metric import confidence_metric
        from scm_engine.utils.stats import variance
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        expected_confidence = 1 - variance([0.8, 0.7, 0.9, 0.6, 0.1])
        self.assertAlmostEqual(confidence_metric(symbol), expected_confidence)

if __name__ == '__main__':
    unittest.main()
