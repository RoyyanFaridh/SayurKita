import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import json
import pickle
import random
import numpy as np
import tensorflow as tf

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.preprocessing import StandardScaler


SEED = 42
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

base_dir = os.path.dirname(__file__)

dataset_path = os.path.join(
    base_dir,
    "..",
    "data",
    "clean_recipes_5000.json"
)

with open(dataset_path, "r", encoding="utf-8") as f:
    recipes = json.load(f)

print(f"Jumlah dataset loaded: {len(recipes)}")

text_features = []
numeric_features = []
quality_scores = []

for recipe in recipes:
    title = recipe.get("Title Cleaned", "")
    ingredients = recipe.get("Ingredients Cleaned", "")
    raw_ingredients = recipe.get("Ingredients", "")
    steps = recipe.get("Steps", "")
    category = recipe.get("Category", "")
    quality_score = recipe.get("Quality Score", None)

    if (
        ingredients
        and isinstance(ingredients, str)
        and ingredients.strip()
        and quality_score is not None
    ):
        combined_text = f"{title} {ingredients} {category}"

        loves = float(recipe.get("Loves", 0))
        total_ingredients = float(recipe.get("Total Ingredients", 0))
        total_steps = float(recipe.get("Total Steps", 0))

        title_length = len(title)
        ingredients_length = len(ingredients)
        raw_ingredients_length = len(raw_ingredients)
        steps_length = len(steps)

        ingredients_word_count = len(ingredients.split())
        steps_word_count = len(steps.split())

        numeric_features.append([
            np.log1p(loves),
            total_ingredients,
            total_steps,
            title_length,
            ingredients_length,
            raw_ingredients_length,
            steps_length,
            ingredients_word_count,
            steps_word_count
        ])

        text_features.append(combined_text.lower())
        quality_scores.append(float(quality_score))

print(f"Jumlah data valid: {len(text_features)}")

vectorizer = TfidfVectorizer(
    max_features=7000,
    min_df=1,
    ngram_range=(1, 2)
)

X_text = vectorizer.fit_transform(text_features)
X_text = X_text.toarray().astype(np.float32)

scaler = StandardScaler()
X_numeric = scaler.fit_transform(numeric_features).astype(np.float32)

X = np.concatenate(
    [X_text, X_numeric],
    axis=1
)

y = np.array(
    quality_scores,
    dtype=np.float32
)

print(f"Bentuk TF-IDF Matrix: {X_text.shape}")
print(f"Bentuk fitur numerik: {X_numeric.shape}")
print(f"Bentuk fitur gabungan: {X.shape}")
print(f"Bentuk target Quality Score: {y.shape}")

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.3,
    random_state=SEED
)

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.5,
    random_state=SEED
)

print(f"Jumlah data training: {len(X_train)}")
print(f"Jumlah data validation: {len(X_val)}")
print(f"Jumlah data testing: {len(X_test)}")

input_layer = tf.keras.layers.Input(shape=(X.shape[1],))

x = tf.keras.layers.Dense(
    256,
    activation="relu",
    kernel_regularizer=tf.keras.regularizers.l2(0.00001)
)(input_layer)

x = tf.keras.layers.Dropout(0.1)(x)

x = tf.keras.layers.Dense(
    128,
    activation="relu",
    kernel_regularizer=tf.keras.regularizers.l2(0.00001)
)(x)

x = tf.keras.layers.Dropout(0.1)(x)

x = tf.keras.layers.Dense(
    64,
    activation="relu"
)(x)

output_layer = tf.keras.layers.Dense(
    1,
    activation="linear"
)(x)

model = tf.keras.Model(
    inputs=input_layer,
    outputs=output_layer
)

optimizer = tf.keras.optimizers.Adam(
    learning_rate=0.0005
)

loss_fn = tf.keras.losses.MeanAbsoluteError()

batch_size = 32
epochs = 30

train_dataset = tf.data.Dataset.from_tensor_slices(
    (X_train, y_train)
)

train_dataset = (
    train_dataset
    .shuffle(1000, seed=SEED)
    .batch(batch_size)
)

log_dir = os.path.join(
    base_dir,
    "..",
    "logs_quality_score"
)

writer = tf.summary.create_file_writer(log_dir)

best_val_mae = float("inf")
best_weights = None
patience = 8
wait = 0

for epoch in range(epochs):
    epoch_losses = []
    epoch_maes = []

    for batch_x, batch_y in train_dataset:
        batch_y = tf.reshape(batch_y, (-1, 1))

        with tf.GradientTape() as tape:
            predictions = model(
                batch_x,
                training=True
            )

            loss = loss_fn(
                batch_y,
                predictions
            )

        gradients = tape.gradient(
            loss,
            model.trainable_variables
        )

        optimizer.apply_gradients(
            zip(
                gradients,
                model.trainable_variables
            )
        )

        batch_mae = mean_absolute_error(
            batch_y.numpy().reshape(-1),
            predictions.numpy().reshape(-1)
        )

        epoch_losses.append(loss.numpy())
        epoch_maes.append(batch_mae)

    train_loss = np.mean(epoch_losses)
    train_mae = np.mean(epoch_maes)

    val_predictions = model(
        X_val,
        training=False
    ).numpy().reshape(-1)

    val_mae = mean_absolute_error(
        y_val,
        val_predictions
    )

    val_loss = val_mae

    print(f"Epoch {epoch + 1}/{epochs}")
    print(
        f"{len(train_dataset)}/{len(train_dataset)} "
        f"- loss: {train_loss:.4f} "
        f"- mae: {train_mae:.4f} "
        f"- val_loss: {val_loss:.4f} "
        f"- val_mae: {val_mae:.4f}"
    )

    with writer.as_default():
        tf.summary.scalar("loss", train_loss, step=epoch)
        tf.summary.scalar("mae", train_mae, step=epoch)
        tf.summary.scalar("val_loss", val_loss, step=epoch)
        tf.summary.scalar("val_mae", val_mae, step=epoch)

    if val_mae < best_val_mae:
        best_val_mae = val_mae
        best_weights = model.get_weights()
        wait = 0
    else:
        wait += 1

    if wait >= patience:
        print("Early stopping aktif")
        break

if best_weights is not None:
    model.set_weights(best_weights)

test_predictions = model(
    X_test,
    training=False
).numpy().reshape(-1)

test_mae = mean_absolute_error(
    y_test,
    test_predictions
)

test_loss = test_mae

print("\nHASIL EVALUASI QUALITY SCORE")
print(f"Test Loss: {test_loss:.4f}")
print(f"Test MAE: {test_mae:.4f}")

if test_mae <= 0.02:
    print("Status MAE: MEMENUHI syarat MAE maksimal 0.02")
else:
    print("Status MAE: BELUM MEMENUHI syarat MAE maksimal 0.02")

models_dir = os.path.join(
    base_dir,
    "..",
    "models"
)

os.makedirs(
    models_dir,
    exist_ok=True
)

quality_model_path = os.path.join(
    models_dir,
    "quality_score_model.keras"
)

model.save(
    quality_model_path
)

quality_vectorizer_path = os.path.join(
    models_dir,
    "quality_score_vectorizer.pkl"
)

with open(quality_vectorizer_path, "wb") as f:
    pickle.dump(vectorizer, f)

quality_scaler_path = os.path.join(
    models_dir,
    "quality_score_scaler.pkl"
)

with open(quality_scaler_path, "wb") as f:
    pickle.dump(scaler, f)

print(f"Model Quality Score disimpan: {quality_model_path}")
print(f"Vectorizer Quality Score disimpan: {quality_vectorizer_path}")
print(f"Scaler Quality Score disimpan: {quality_scaler_path}")

writer.flush()
writer.close()

print(f"TensorBoard logs Quality Score: {log_dir}")