import json
import pickle

from app.ai.input_cleaner import InputCleaner
from app.file_paths import TOPICS_FILE

training_pair = tuple[list[str], str]


class Topics:

    def __init__(self) -> None:
        self._topics_list = _load_topic_list()

        self._input_cleaner = InputCleaner()

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
        word_list = self._input_cleaner.cleanup_sentence(pattern)
        self._words.extend(word_list)

        self._training_pairs.append((word_list, topic_type))

    def _cleanup_words(self):
        words = [self._input_cleaner.cleanup_word(word) for word in self._words]
        words = sorted(set(words))

        self._words = words

    def get_topic(self, index: int) -> str:
        return self._topic_types[index]

    def get_topic_response(self, topic_name: str) -> str:
        for topic in self._topics_list:
            if topic["type"] == topic_name:
                return topic["responses"][0]

    def get_topic_types(self):
        return self._topic_types

    def get_words(self):
        return self._words

    def get_training_pairs(self):
        return self._training_pairs


def _load_topic_list():
    with open(TOPICS_FILE, encoding="utf-8") as topics_document:
        topic_list = json.loads(topics_document.read())

    return topic_list["topics"]
