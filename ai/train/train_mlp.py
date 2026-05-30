import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import json
import pickle
import numpy as np
import tensorflow as tf

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

from model_mlp import (
    build_mlp_model,
    custom_recipe_loss
)


base_dir = os.path.dirname(__file__)

dataset_path = os.path.join(
    base_dir,
    '..',
    'data',
    'clean_recipes_5000.json'
)

with open(dataset_path, 'r', encoding='utf-8') as f:
    recipes = json.load(f)

print(f"Jumlah dataset loaded: {len(recipes)}")

recipe_texts = []
categories = []

for recipe in recipes:
    ingredients = recipe.get('Ingredients Cleaned', '')
    category = recipe.get('Category', 'unknown')

    if (
        ingredients and
        isinstance(ingredients, str) and
        ingredients.strip()
    ):
        recipe_texts.append(ingredients.lower())
        categories.append(category.lower())

print(
    f"Jumlah resep valid: {len(recipe_texts)}"
)


vectorizer = TfidfVectorizer(
    max_features=5000,
    min_df=2
)

X = vectorizer.fit_transform(recipe_texts)
X = X.toarray().astype(np.float32)
print(f"Bentuk TF-IDF Matrix: {X.shape}")

# encode label kategori
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(categories)

print(f"Jumlah kelas kategori: {len(label_encoder.classes_)}")
print(label_encoder.classes_)

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Jumlah data training: {len(X_train)}")
print(f"Jumlah data testing: {len(X_test)}")

# model
model = build_mlp_model(
    input_dim=X.shape[1],
    num_classes=len(label_encoder.classes_)
)
optimizer = tf.keras.optimizers.Adam()


batch_size = 32
train_dataset = tf.data.Dataset.from_tensor_slices(
    (X_train, y_train)
)

train_dataset = (
    train_dataset
    .shuffle(1000)
    .batch(batch_size)
)

# tensorboard logging
log_dir = os.path.join(
    base_dir,
    '..',
    'logs'
)
writer = tf.summary.create_file_writer(log_dir)

# custom training loop
epochs = 10
for epoch in range(epochs):
    epoch_losses = []
    epoch_accs = []

    for batch_x, batch_y in train_dataset:
        with tf.GradientTape() as tape:

            predictions = model(
                batch_x,
                training=True
            )

            loss = custom_recipe_loss(
                batch_y,
                predictions
            )

        grads = tape.gradient(
            loss,
            model.trainable_variables
        )

        optimizer.apply_gradients(
            zip(
                grads,
                model.trainable_variables
            )
        )

        pred_class = tf.argmax(
            predictions,
            axis=1
        )

        acc = tf.reduce_mean(
            tf.cast(
                pred_class == batch_y,
                tf.float32
            )
        )

        epoch_losses.append(loss.numpy())
        epoch_accs.append(acc.numpy())

    avg_loss = np.mean(epoch_losses)
    avg_acc = np.mean(epoch_accs)

    print(
        f"Epoch {epoch+1}/{epochs}"
        f" | Loss={avg_loss:.4f}"
        f" | Accuracy={avg_acc:.4f}"
    )

    with writer.as_default():

        tf.summary.scalar(
            "loss",
            avg_loss,
            step=epoch
        )

        tf.summary.scalar(
            "accuracy",
            avg_acc,
            step=epoch
        )

# evaluasi model
test_predictions = model(
    X_test,
    training=False
)

test_pred_class = np.argmax(
    test_predictions,
    axis=1
)

test_accuracy = accuracy_score(
    y_test,
    test_pred_class
)

test_loss = custom_recipe_loss(
    y_test,
    test_predictions
).numpy()

print("\nHASIL EVALUASI")
print(f"Loss: {test_loss:.4f}")
print(f"Accuracy: {test_accuracy:.4f}")

# save model
models_dir = os.path.join(
    base_dir,
    '..',
    'models'
)

os.makedirs(
    models_dir,
    exist_ok=True
)

model_path = os.path.join(
    models_dir,
    'mlp_recipe_model.keras'
)

model.save(
    model_path
)

print(
    f"Model disimpan: {model_path}"
)


vectorizer_path = os.path.join(
    models_dir,
    'tfidf_vectorizer.pkl'
)

with open(
    vectorizer_path,
    'wb'
) as f:

    pickle.dump(
        vectorizer,
        f
    )

print(
    f"Vectorizer disimpan: {vectorizer_path}"
)

label_encoder_path = os.path.join(
    models_dir,
    'label_encoder.pkl'
)

with open(
    label_encoder_path,
    'wb'
) as f:

    pickle.dump(
        label_encoder,
        f
    )

print(
    f"Label Encoder disimpan: {label_encoder_path}"
)

writer.flush()
writer.close()
print(
    f"TensorBoard logs: {log_dir}"
)