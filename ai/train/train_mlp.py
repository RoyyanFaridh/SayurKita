import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import json
import pickle
import numpy as np
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.callbacks import EarlyStopping
from model_mlp import build_mlp_model, TrainingLogger

base_dir = os.path.dirname(__file__)
dataset_path = os.path.join(
    base_dir, '..', 'data', 'clean_recipes_5000.json'
)

with open(dataset_path, 'r', encoding='utf-8') as f:
    recipes = json.load(f)
print(f"Jumlah dataset loaded: {len(recipes)}")

# ambil data text resep & category
recipe_texts = []
categories = []

for recipe in recipes:
    ingredients = recipe.get('Ingredients Cleaned', '')
    category = recipe.get('Category', 'unknown')

    if(
        ingredients and isinstance(ingredients, str) and ingredients.strip()
    ):
        recipe_texts.append(ingredients.lower())
        categories.append(category.lower())

print(f"Jumlah resep valid: {len(recipe_texts)}")

# TF-IDF VECTORIZATION
vectorizer = TfidfVectorizer(max_features=5000, min_df=2)
X = vectorizer.fit_transform(recipe_texts)
X = X.toarray()
print(f"Bentuk TF-IDF Matrix: {X.shape}")

# encode label kategori
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(categories)
print(f"Jumlah kelas kategori: {len(label_encoder.classes_)}")
print(f"Daftar Kategori:")
print(label_encoder.classes_)

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"Jumlah data training: {len(X_train)}")
print(f"Jumlah data testing: {len(X_test)}")

# buat model
model = build_mlp_model(input_dim=X.shape[1], num_classes=len(label_encoder.classes_))

# early stopping
early_stopping = EarlyStopping(
    monitor='val_loss', patience=3, min_delta=0.001, restore_best_weights=True, verbose=1
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
os.makedirs(models_dir, exist_ok=True)
model_path = os.path.join(models_dir, 'mlp_recipe_model.keras')
model.save(model_path)

print(f"Model MLP berhasil disimpan di: {model_path}")

# simpan tf-idf vectorizer
vectorizer_path = os.path.join(models_dir, 'tfidf_vectorizer.pkl')
with open(vectorizer_path, 'wb') as f:
    pickle.dump(vectorizer, f)

print(f"TF-IDF Vectorizer berhasil disimpan di: {vectorizer_path}")

# simpan label encoder
label_encoder_path = os.path.join(models_dir, 'label_encoder.pkl')
with open(label_encoder_path, 'wb') as f:
    pickle.dump(label_encoder, f)

print(f"Label Encoder berhasil disimpan di: {label_encoder_path}")