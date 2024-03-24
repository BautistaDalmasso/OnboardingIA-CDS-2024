import numpy as np
import tensorflow as tf

import input_processor
from topics import Topics


class Skynet:

    def __init__(self) -> None:
        self._model = tf.keras.models.load_model("skynet.h5")
        self._processor = input_processor.InputProcessor()

    def predict_topic(self, sentence: str) -> int:
        processed_sentence = self._processor.process_natural_input(sentence)
        res = self._model.predict(np.array([processed_sentence]))[0]
        return np.where(res == np.max(res))[0][0]


if __name__ == "__main__":
    skynet = Skynet()

    while True:
        topics = Topics()
        message = input("")
        topic_index = skynet.predict_topic(message)
        print(topics.get_topic_response(topics.get_topic(topic_index)))
