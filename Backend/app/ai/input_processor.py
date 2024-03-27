import pickle
from typing import Literal

import nltk
import numpy as np

from app.file_paths import TOPIC_TYPES_FILE, WORDS_FILE

nltk.download("punkt")
nltk.download("wordnet")
nltk.download("omw-1.4")


ACCENT_TRANSLATION = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u"}
IGNORE = ["?", "!", "¿", ".", ","]


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
        clean_sentence = self.cleanup_sentence(input_sentence)

        ret = [0] * len(self._words)
        for input_word in clean_sentence:
            for i, trained_word in enumerate(self._words):
                if input_word == trained_word:
                    ret[i] = 1

        return np.array(ret)

    def cleanup_sentence(self, sentence: str) -> list[str]:
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [
            self.cleanup_word(word) for word in sentence_words if word not in IGNORE
        ]
        return sentence_words

    def cleanup_word(self, word: str) -> str:
        lowercase_word = word.lower()
        lemmatized_word = self._lemmatizer.lemmatize(lowercase_word)
        no_accent_word = ""

        for letter in lemmatized_word:
            if letter in ACCENT_TRANSLATION:
                no_accent_word += ACCENT_TRANSLATION[letter]
            else:
                no_accent_word += letter

        return no_accent_word
