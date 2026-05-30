import os
import pickle
import numpy as np
import tensorflow as tf
from model_mlp import (IngredientsImportanceLayer, custom_recipe_loss, TrainingLogger, build_mlp_model)

base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, '..', 'models', 'mlp_recipe_model.keras')

vectorizer_path = os.path.join(base_dir, '..', 'models', 'tfidf_vectorizer.pkl')

label_encoder_path = os.path.join(base_dir, '..', 'models', 'label_encoder.pkl')

# load model
model = tf.keras.models.load_model(
    model_path,
    custom_objects={
        'IngredientsImportanceLayer': IngredientsImportanceLayer,
        'custom_recipe_loss': custom_recipe_loss
    }
)

# load vectorizer
with open(vectorizer_path, 'rb') as f:
    vectorizer = pickle.load(f)

# load label encoder
with open(label_encoder_path, 'rb') as f:
    label_encoder = pickle.load(f)

print(f"Model berhasil di load dari: {model_path}")

user_input = input("Masukkan bahan (pisahkan dengan koma): ")
user_text = user_input.lower()

X_input = vectorizer.transform([user_text])
X_input = X_input.toarray().astype(np.float32)
prediction = model.predict(X_input, verbose=0)
predicted_index = np.argmax(prediction[0])
predicted_category = label_encoder.inverse_transform([predicted_index])[0]

prediction_score = np.max(prediction[0]) * 100

print("\nHASIL PREDIKSI:")
print(f"Kategori: {predicted_category}")
print(f"Skor Prediksi: {prediction_score:.2f}%")