import json
import os
import numpy as np

base_dir = os.path.dirname(__file__)
dataset_path = os.path.join(base_dir, "clean_recipes_5000.json")

with open(dataset_path, "r", encoding="utf-8") as f:
    data = json.load(f)

scores = []

for item in data:
    score = item.get("Quality Score", None)

    if score is not None:
        scores.append(float(score))

scores = np.array(scores)

print(f"Jumlah data Quality Score: {len(scores)}")
print(f"Min: {scores.min():.4f}")
print(f"Max: {scores.max():.4f}")
print(f"Mean: {scores.mean():.4f}")
print(f"Median: {np.median(scores):.4f}")
print(f"Std: {scores.std():.4f}")

print("\nContoh 20 score pertama:")
print(scores[:20])

baseline_pred = np.full_like(scores, scores.mean())
baseline_mae = np.mean(np.abs(scores - baseline_pred))

print(f"\nBaseline MAE kalau selalu prediksi rata-rata: {baseline_mae:.4f}")