import numpy as np
import tensorflow as tf
from kerastuner.engine.hyperparameters import HyperParameters
from kerastuner.tuners import RandomSearch

from app.ai.training_data import TrainingData
from app.file_paths import MODEL_PATH

training_data = TrainingData()


def build_model(hp):
    training_x, training_y = training_data.processed_training_data()

    model = tf.keras.models.Sequential()
    model.add(
        tf.keras.layers.Dense(
            units=hp.Int("input_units", min_value=32, max_value=512, step=32),
            input_shape=(len(training_x[0]),),
            activation="relu",
        )
    )
    model.add(
        tf.keras.layers.Dropout(
            hp.Float("dropout_1", min_value=0.2, max_value=0.5, step=0.1)
        )
    )
    model.add(
        tf.keras.layers.Dense(
            units=hp.Int("hidden_units", min_value=32, max_value=512, step=32),
            activation="relu",
        )
    )
    model.add(
        tf.keras.layers.Dropout(
            hp.Float("dropout_2", min_value=0.2, max_value=0.5, step=0.1)
        )
    )
    model.add(tf.keras.layers.Dense(len(training_y[0]), activation="softmax"))

    model.compile(
        optimizer=tf.keras.optimizers.SGD(
            learning_rate=hp.Choice("learning_rate", values=[1e-2, 1e-3, 1e-4])
        ),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


def train():
    training_x, training_y = training_data.processed_training_data()

    tuner = RandomSearch(
        build_model,
        objective="val_accuracy",
        max_trials=50,
        executions_per_trial=1,
        directory="./app/ai/data",
        project_name="hyperparameter_search",
    )

    tuner.search_space_summary()

    tuner.search(
        x=np.array(training_x), y=np.array(training_y), epochs=100, validation_split=0.2
    )

    best_model = tuner.get_best_models(num_models=1)[0]

    best_model.save(MODEL_PATH)
