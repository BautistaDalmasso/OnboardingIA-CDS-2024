import numpy as np
import tensorflow as tf

from app.input_processor import InputProcessor
from app.topics import Topics


class Skynet:

    def __init__(self, topics: Topics | None) -> None:
        self._model = tf.keras.models.load_model("./app/skynet.h5")
        self._processor = InputProcessor()

        self._topics = topics

    def predict_topic(self, sentence: str) -> int:
        processed_sentence = self._processor.process_natural_input(sentence)
        res = self._model.predict(np.array([processed_sentence]))[0]
        return np.where(res == np.max(res))[0][0]

    def answer(self, sentence: str) -> str:
        topic_index = self.predict_topic(sentence)

        return self._topics.get_topic_response(self._topics.get_topic(topic_index))


if __name__ == "__main__":
    skynet = Skynet(None)

    while True:
        topics = Topics()
        message = input("")
        topic_index = skynet.predict_topic(message)
        print(topics.get_topic_response(topics.get_topic(topic_index)))
