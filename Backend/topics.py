import json
import pickle
import random
from typing import Literal

import nltk

nltk.download("punkt")
nltk.download("wordnet")
nltk.download("omw-1.4")


_IGNORE = ["?", "!", "¿", ".", ","]

IN = 0
OUT = 1


training_pair = tuple[list[str], str]


class Topics:

    def __init__(self) -> None:
        self._topics_list = _load_topic_list()

        self._lemmatizer = nltk.stem.WordNetLemmatizer()

        self._topic_types: list[str] = []
        self._words: list[str] = []
        self._training_pairs: list[training_pair] = []

        self._populate_categories()

    def _populate_categories(self) -> None:

        for topic in self._topics_list:
            self._topic_types.append(topic["type"])

            for pattern in topic["patterns"]:
                self._append_pattern(pattern, topic["type"])

        self._cleanup_words()

    def _append_pattern(self, pattern: str, topic_type: str) -> None:
        word_list = nltk.word_tokenize(pattern)
        self._words.extend(word_list)

        self._training_pairs.append((word_list, topic_type))

    def _cleanup_words(self):
        words = [
            self._lemmatizer.lemmatize(word)
            for word in self._words
            if word not in _IGNORE
        ]
        words = sorted(set(words))

    def save_words(self):
        with open("topic_types.pkl", "wb") as types_file:
            pickle.dump(self._topic_types, types_file)

        with open("words.pkl", "wb") as words_file:
            pickle.dump(self._words, words_file)

    def processed_training_data(
        self,
    ) -> tuple[
        list[list[Literal[0] | Literal[1]]], list[list[Literal[0] | Literal[1]]]
    ]:
        """
        Returns a tuple of input and output data.
        For each element of the input data, its corresponding expected output will be on the other list at the same index.
        """

        training = []

        for training_pair in self._training_pairs:
            occurrence_list = self._create_word_occurrence_list(training_pair[IN])
            output_row = self._create_output_row(training_pair[OUT])

            training.append([occurrence_list, output_row])
        random.shuffle(training)

        inputs_list, outputs_list = (list(column) for column in zip(*training))

        return inputs_list, outputs_list

    def _create_word_occurrence_list(
        self, word_patterns: list[str]
    ) -> list[Literal[0] | Literal[1]]:
        """
        Creates a list of word occurrence for the given training pair.

        The elements of the list will contain 1 if its `self._words` matching element appears in the
        word patterns of the given training pair, otherwise it'll be 0.

        This list can be used as input for the training of our AI.
        """

        occurrence_list = []

        words = [self._lemmatizer.lemmatize(word.lower()) for word in word_patterns]

        for word in self._words:
            if word in words:
                occurrence_list.append(1)
            else:
                occurrence_list.append(0)

        return occurrence_list

    def _create_output_row(self, topic_type: str) -> list[Literal[0] | Literal[1]]:
        """
        Creates a list that represents the desired output that our AI will give for a given topic_type.
        """
        type_index = self._topic_types.index(topic_type)

        output_row = [0] * len(self._topic_types)

        output_row[type_index] = 1

        return output_row

    def get_topic(self, index: int) -> str:
        return self._topic_types[index]

    def get_topic_response(self, topic_name: str) -> str:
        for topic in self._topics_list:
            if topic["type"] == topic_name:
                return topic["responses"][0]


def _load_topic_list():
    with open("topics.json") as topics_document:
        topic_list = json.loads(topics_document.read())

    return topic_list["topics"]


if __name__ == "__main__":
    print(Topics().processed_training_data()[1])
