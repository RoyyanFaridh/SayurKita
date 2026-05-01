import json
import numpy as np
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelBinarizer

print("Load data resep...")
with open('../data/clean_recipes_800.json', 'r', encoding='utf-8') as f:
    resep_data = json.load(f)

print(f"Jumlah resep: {len(resep_data)}")

daftar_bahan = []
for item in resep_data:
    bahan = item.get('Ingredients Cleaned', item.get('Ingredients', ''))
    daftar_bahan.append(str(bahan))
vectorizer = TfidfVectorizer(max_features=500)
X = vectorizer.fit_transform(daftar_bahan).toarray()
print(f"Bentuk X (input): {X.shape}")



lb = LabelBinarizer()
y = lb.fit_transform([str(i) for i in range(len(resep_data))])
print(f"Bentuk y (output): {y.shape}")

inputs = tf.keras.Input(shape=(X.shape[1],))
x = tf.keras.layers.Dense(128, activation='relu')(inputs)
x = tf.keras.layers.Dropout(0.2)(x)
x = tf.keras.layers.Dense(64, activation='relu')(x)
outputs = tf.keras.layers.Dense(y.shape[1], activation='softmax')(x)

model = tf.keras.Model(inputs=inputs, outputs=outputs)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])


print("\nMulai training...")
history = model.fit(X, y, epochs=20, batch_size=16, validation_split=0.2, verbose=1)
model.save('../models/sayurkita_mlp_model.keras')
print("\nModel selesai dilatih dan disimpan!")