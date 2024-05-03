from enum import Enum


class LicenceLevel:
    NONE = 0  # Hasn't requested a licence yet.
    REGULAR = 1  # Is the default requiremente unless specified otherwise.
    TRUSTED = 2
    RESEARCHER = 3


def default_licence():
    return LicenceLevel.REGULAR
