import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import json
import pickle
import numpy as np
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import EarlyStopping
from model_mlp import build_mlp_model, TrainingLogger

base_dir = os.path.dirname(__file__)
dataset_path = os.path.join(
    base_dir, '..', 'data', 'clean_recipes_5000.json'
)

with open(dataset_path, 'r', encoding='utf-8') as f:
    recipes = json.load(f)
print(f"Jumlah dataset loaded: {len(recipes)}")

# ambil data text resep
recipe_texts = []
for recipe in recipes:
    ingredients = recipe.get('Ingredients Cleaned', '')
    if ingredients and isinstance(ingredients, str):
        recipe_texts.append(ingredients.lower())
print(f"Jumlah resep dengan ingredients valid: {len(recipe_texts)}")

# TF-IDF VECTORIZATION
vectorizer = TfidfVectorizer(max_features=5000, min_df=1)
X = vectorizer.fit_transform(recipe_texts)
X = X.toarray()
print(f"Bentuk TF-IDF Matrix: {X.shape}")

# buat label dummy
"""
Karena dataset belum punya label supervised,
sementara semua diberi label 1.

MLP digunakan untuk memenuhi
deep learning requirement.
"""

y = np.ones(len(recipes))

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"Jumlah data training: {len(X_train)}")
print(f"Jumlah data testing: {len(X_test)}")

# buat model
model = build_mlp_model(input_dim=X.shape[1])

# early stopping
early_stopping = EarlyStopping(
    monitor='val_loss', patience=5, restore_best_weights=True
)

# training model
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=100,
    batch_size=32,
    callbacks=[early_stopping, TrainingLogger()]
)

# evaluasi model
loss, accuracy = model.evaluate(X_test, y_test)
print("\nHasil Evaluasi Model")
print(f"Loss: {loss:.4f}")
print(f"Accuracy: {accuracy:.4f}")

# save model .keras
models_dir = os.path.join(base_dir, '..', 'models')

model_path = os.path.join(models_dir, 'mlp_recipe_model.keras')
model.save(model_path)

print(f"Model MLP berhasil disimpan di: {model_path}")

# simpan tf-idf vectorizer
vectorizer_path = os.path.join(models_dir, 'tfidf_vectorizer.pkl')
with open(vectorizer_path, 'wb') as f:
    pickle.dump(vectorizer, f)

print(f"TF-IDF Vectorizer berhasil disimpan di: {vectorizer_path}")
