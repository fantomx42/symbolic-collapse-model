
"""Tests for the SCM v3.1 telemetry module."""

import unittest
from scm_engine.core.symbol import Symbol
from scm_engine.telemetry.packet import encode_packet, decode_packet, validate_packet

class TestTelemetry(unittest.TestCase):
    """Unit tests for the SCM v3.1 telemetry module."""

    def test_packet_encoding_decoding(self):
        """Test that a symbol can be encoded and decoded correctly."""
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        packet = encode_packet(symbol)
        decoded_symbol = decode_packet(packet)
        self.assertAlmostEqual(decoded_symbol.T, symbol.T, places=4)
        self.assertAlmostEqual(decoded_symbol.E, symbol.E, places=4)
        self.assertAlmostEqual(decoded_symbol.S, symbol.S, places=4)
        self.assertAlmostEqual(decoded_symbol.I, symbol.I, places=4)
        self.assertAlmostEqual(decoded_symbol.P, symbol.P, places=4)

    def test_validate_packet(self):
        """Test the validate_packet function."""
        symbol = Symbol(T=0.8, E=0.7, S=0.9, I=0.6, P=0.1)
        packet = encode_packet(symbol)
        self.assertTrue(validate_packet(packet))
        self.assertFalse(validate_packet(packet[1:]))

if __name__ == '__main__':
    unittest.main()
