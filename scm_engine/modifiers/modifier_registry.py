
"""A central registry for all SCM v3.1 modifiers."""

MODIFIER_REGISTRY = {}

def register_modifier(name):
    """A decorator to register a modifier function in the central registry.

    Args:
        name (str): The name to register the modifier under.

    Returns:
        A decorator function.
    """
    def decorator(func):
        """The actual decorator that performs the registration."""
        MODIFIER_REGISTRY[name] = func
        return func
    return decorator
