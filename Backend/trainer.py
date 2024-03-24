import numpy as np
import tensorflow as tf

import topics

topics_ = topics.Topics()
topics_.save_words()

training_x, training_y = topics_.processed_training_data()

model = tf.keras.models.Sequential()
# Input layer.
model.add(
    tf.keras.layers.Dense(128, input_shape=(len(training_x[0]),), activation="relu")
)
# "Processing" layer.
model.add(tf.keras.layers.Dropout(0.5))
model.add(tf.keras.layers.Dense(64, activation="relu"))
model.add(tf.keras.layers.Dropout(0.5))
# Output layer.
model.add(tf.keras.layers.Dense(len(training_y[0]), activation="softmax"))

sgd = tf.keras.optimizers.SGD(
    learning_rate=0.001, decay=1e-6, momentum=0.9, nesterov=True
)
model.compile(loss="categorical_crossentropy", optimizer=sgd, metrics=["accuracy"])

train_process = model.fit(
    np.array(training_x), np.array(training_y), epochs=100, batch_size=5, verbose=1
)
model.save("skynet.h5", train_process)
