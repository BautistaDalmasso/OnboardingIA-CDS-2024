import pickle
from typing import Literal

import nltk
import numpy as np

from app.file_paths import TOPIC_TYPES_FILE, WORDS_FILE


class InputProcessor:

    def __init__(self) -> None:
        self._lemmatizer = nltk.stem.WordNetLemmatizer()

        with open(WORDS_FILE, "rb") as words_file:
            self._words = pickle.load(words_file)

        with open(TOPIC_TYPES_FILE, "rb") as topics_file:
            self._topic_types = pickle.load(topics_file)

    def process_natural_input(
        self, input_sentence: str
    ) -> list[Literal[0] | Literal[1]]:
        "Processes the words from a natural sentence into a sequence of 1s and 0s that our AI can interpret."
        clean_sentence = self._cleanup_sentence(input_sentence)

        ret = [0] * len(self._words)
        for input_word in clean_sentence:
            for i, trained_word in enumerate(self._words):
                if input_word == trained_word:
                    ret[i] = 1

        return np.array(ret)

    def _cleanup_sentence(self, sentence: str) -> np.ndarray:
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [self._lemmatizer.lemmatize(word) for word in sentence_words]
        return sentence_words
