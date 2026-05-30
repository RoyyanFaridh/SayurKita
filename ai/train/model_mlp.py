import tensorflow as tf
from tensorflow.keras.layers import (Dense, Dropout, Input, Layer)
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import Callback
from tensorflow.keras.utils import register_keras_serializable

# CUSTOM LAYER
@register_keras_serializable()
class IngredientsImportanceLayer(Layer):

    def __init__(self, factor=1.2, **kwargs):
        super().__init__(**kwargs)
        self.factor = factor

    def call(self, inputs):
        return inputs * self.factor

    def get_config(self):
        config = super().get_config()
        config.update({
            "factor": self.factor
        })
        return config

# CUSTOM LOSS FUNCTION
@register_keras_serializable()
def custom_recipe_loss(y_true, y_pred):
    loss = tf.keras.losses.sparse_categorical_crossentropy(y_true, y_pred)
    return tf.reduce_mean(loss)

# CUSTOM CALLBACK
class TrainingLogger(Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(
            f"\nEpoch {epoch+1} selesai | "
            f"Loss: {logs.get('loss', 0):.4f} | "
            f"Accuracy: {logs.get('accuracy', 0):.4f}"
        )

# function build model mlp
def build_mlp_model(input_dim=5000, num_classes=8):
    input_layer = Input(shape=(input_dim,))
    x = IngredientsImportanceLayer()(input_layer)

    x = Dense(128, activation='relu')(x)
    x = Dropout(0.4)(x)

    x = Dense(64, activation='relu')(x)
    x = Dropout(0.3)(x)

    output_layer = Dense(num_classes, activation='softmax')(x)

    # buat model
    model = Model(inputs=input_layer, outputs=output_layer)
    model.compile(optimizer='adam', loss=custom_recipe_loss, metrics=['accuracy'])
    
    return model