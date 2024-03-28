import random
from typing import Literal

from app.ai.input_cleaner import InputCleaner
from app.ai.topics import Topics

IN = 0
OUT = 1


class TrainingData:

    def __init__(self) -> None:
        self._topics = Topics()
        self._input_cleaner = InputCleaner()

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

        for training_pair in self._topics.get_training_pairs():
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

        words = [self._input_cleaner.cleanup_word(word) for word in word_patterns]

        for word in self._topics.get_words():
            if word in words:
                occurrence_list.append(1)
            else:
                occurrence_list.append(0)

        return occurrence_list

    def _create_output_row(self, topic_type: str) -> list[Literal[0] | Literal[1]]:
        """
        Creates a list that represents the desired output that our AI will give for a given topic_type.
        """
        type_index = self._topics.get_topic_types().index(topic_type)

        output_row = [0] * len(self._topics.get_topic_types())

        output_row[type_index] = 1

        return output_row
