import numpy as np
import tensorflow as tf

from app.ai.input_processor import InputProcessor
from app.ai.topics import Topics
from app.file_paths import MODEL_PATH

LOW_CONFIDENCE = 0.2119
LOW_CONFIDENCE_RESPONSE = "desconocido"


class Skynet:

    def __init__(self, topics: Topics | None) -> None:
        self._model = tf.keras.models.load_model(MODEL_PATH)
        self._processor = InputProcessor()

        self._topics = topics

    def predict_topic(self, sentence: str) -> int:
        processed_sentence = self._processor.process_natural_input(sentence)
        res = self._model.predict(np.array([processed_sentence]))[0]

        confidence = np.max(res)
        print(f"Confidence: {confidence}")

        if confidence <= LOW_CONFIDENCE:
            return -1

        return np.where(res == np.max(res))[0][0]

    def answer(self, sentence: str) -> str:
        topic_index = self.predict_topic(sentence)

        if topic_index == -1:
            return self._topics.get_topic_response(LOW_CONFIDENCE_RESPONSE)

        return self._topics.get_topic_response(self._topics.get_topic(topic_index))


if __name__ == "__main__":
    skynet = Skynet(None)

    while True:
        topics = Topics()
        message = input("")
        topic_index = skynet.predict_topic(message)
        print(topics.get_topic_response(topics.get_topic(topic_index)))
