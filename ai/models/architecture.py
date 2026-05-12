import tensorflow as tf

def buat_model(num_ingredients=2938, num_recipes=800):
    """
    Model Deep Learning untuk SayurKita
    - Input: 2938 bahan unik (dari dataset)
    - Output: 800 resep
    """
    
    # Input layer
    input_layer = tf.keras.layers.Input(shape=(num_ingredients,), name="input_bahan")
    
    # Hidden layer 1
    
    x = tf.keras.layers.Dense(512, activation='relu', name="hidden_1")(input_layer)
    x = tf.keras.layers.Dropout(0.3, name="dropout_1")(x)
    
    # Hidden layer 2
    x = tf.keras.layers.Dense(256, activation='relu', name="hidden_2")(x)
    x = tf.keras.layers.Dropout(0.2, name="dropout_2")(x)
    
    # Hidden layer 3
    x = tf.keras.layers.Dense(128, activation='relu', name="hidden_3")(x)
    
    # Output layer
    output_layer = tf.keras.layers.Dense(num_recipes, activation='sigmoid', name="output_resep")(x)
    
    # Buat model
    model = tf.keras.Model(inputs=input_layer, outputs=output_layer, name="SayurKita_Model")
    
    return model

if __name__ == "__main__":
    model = buat_model()
    model.summary()
    print(f" Model siap! Input: {model.input_shape}, Output: {model.output_shape}")