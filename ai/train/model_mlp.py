import tensorflow as tf
from tensorflow.keras.layers import (Dense, Dropout, Input, Layer)
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import Callback

# CUSTOM LAYER
class IngredientsImportanceLayer(Layer):
    def __init__(self, factor=1.2):
        super().__init__()
        self.factor = factor
    def call(self, inputs):
        return inputs * self.factor

# CUSTOM LOSS FUNCTION
def custom_recipe_loss(y_true, y_pred):
    bce = tf.keras.losses.binary_crossentropy(y_true, y_pred)
    penalty = 0.01 * tf.reduce_mean(y_pred)
    return bce + penalty

# CUSTOM CALLBACK
class TrainingLogger(Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(
            f"\nEpoch {epoch+1} selesai | "
            f"Loss: {logs['loss']:.4f} | "
            f"Accuracy: {logs['accuracy']:.4f}"
        )

# function build model mlp
def build_mlp_model(input_dim=5000):
    input_layer = Input(shape=(input_dim,))
    x = IngredientsImportanceLayer()(input_layer)

    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)

    x = Dense(128, activation='relu')(x)
    x = Dropout(0.2)(x)

    x = Dense(64, activation='relu')(x)

    output_layer = Dense(1, activation='sigmoid')(x)

    # buat model
    model = Model(inputs=input_layer, outputs=output_layer)
    model.compile(optimizer='adam', loss=custom_recipe_loss, metrics=['accuracy'])
    
    return model