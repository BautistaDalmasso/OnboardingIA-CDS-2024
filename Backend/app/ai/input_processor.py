from typing import Literal

import numpy as np

from app.ai.input_cleaner import InputCleaner
from app.ai.topics import Topics


class InputProcessor:

    def __init__(self) -> None:
        self._input_cleaner = InputCleaner()
        self._topics = Topics()

    def process_natural_input(
        self, input_sentence: str
    ) -> list[Literal[0] | Literal[1]]:
        "Processes the words from a natural sentence into a sequence of 1s and 0s that our AI can interpret."
        clean_sentence = self._input_cleaner.cleanup_sentence(input_sentence)

        ret = [0] * len(self._topics.get_words())
        for input_word in clean_sentence:
            for i, trained_word in enumerate(self._topics.get_words()):
                if input_word == trained_word:
                    ret[i] = 1

        return np.array(ret)
