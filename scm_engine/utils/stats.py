
"""Statistical utility functions."""

def variance(data: list[float]) -> float:
    """Calculates the variance of a list of numbers.

    Args:
        data: A list of numbers.

    Returns:
        The variance of the list of numbers.
    """
    n = len(data)
    if n < 2:
        return 0
    mean = sum(data) / n
    return sum((x - mean) ** 2 for x in data) / n
