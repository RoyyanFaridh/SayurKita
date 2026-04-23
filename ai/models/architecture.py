
import tensorflow as tf

def buat_model():
    # Input: 10 bahan makanan
    input_layer = tf.keras.layers.Input(shape=(10,))
    
    # 1 lapisan tersembunyi dengan 8 neuron
    x = tf.keras.layers.Dense(8, activation='relu')(input_layer)
    
    # Output: 5 resep
    output_layer = tf.keras.layers.Dense(5, activation='sigmoid')(x)
    
    # Buat model
    model = tf.keras.Model(inputs=input_layer, outputs=output_layer)
    
    return model


if __name__ == "__main__":
    model = buat_model()
    model.summary()
    print("Model siap!")