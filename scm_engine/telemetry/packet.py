
"""Encodes and decodes SCM data into telemetry packets."""

from scm_engine.core.symbol import Symbol
import struct

def encode_packet(symbol: Symbol) -> bytes:
    """Encodes a symbol into a 128-bit telemetry packet.

    The packet structure is as follows:
    - T: 16 bits (unsigned short)
    - E: 16 bits (unsigned short)
    - S: 16 bits (unsigned short)
    - I: 16 bits (unsigned short)
    - P: 16 bits (unsigned short)
    - Reserved: 32 bits

    Args:
        symbol: The symbol to encode.

    Returns:
        The encoded telemetry packet.
    """
    # Scale the float values to 16-bit integers
    t = int(symbol.T * 65535)
    e = int(symbol.E * 65535)
    s = int(symbol.S * 65535)
    i = int(symbol.I * 65535)
    p = int(symbol.P * 65535)

    # Pack the values into a 128-bit packet
    return struct.pack("!HHHHHI", t, e, s, i, p, 0)

def decode_packet(packet: bytes) -> Symbol:
    """Decodes a 128-bit telemetry packet into a symbol.

    Args:
        packet: The telemetry packet to decode.

    Returns:
        The decoded symbol.
    """
    # Unpack the 128-bit packet
    t, e, s, i, p, _ = struct.unpack("!HHHHHI", packet)

    # Scale the integer values back to floats
    return Symbol(
        T=t / 65535,
        E=e / 65535,
        S=s / 65535,
        I=i / 65535,
        P=p / 65535,
    )

def validate_packet(packet: bytes) -> bool:
    """Validates a telemetry packet.

    Args:
        packet: The telemetry packet to validate.

    Returns:
        True if the packet is valid, False otherwise.
    """
    return len(packet) == 14
