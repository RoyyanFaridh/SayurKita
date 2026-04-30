import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Path ke file JSON
file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'clean_recipes_800.json')

# Load data resep
with open(file_path, 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# Siapkan teks bahan dari kolom "Ingredients Cleaned"
recipe_texts = []
valid_indices = []

for i, r in enumerate(recipes):
    ingredients = r.get('Ingredients Cleaned', r.get('Ingredients', ''))
    if ingredients and isinstance(ingredients, str) and len(ingredients.strip()) > 0:
        recipe_texts.append(ingredients.lower())
        valid_indices.append(i)
    else:
        recipe_texts.append('')  # fallback

print(f" Loaded {len(valid_indices)} valid recipes out of {len(recipes)}")

# Buat TF-IDF vectorizer (tambah min_df=1 untuk hindari empty vocabulary)
vectorizer = TfidfVectorizer(max_features=5000, min_df=1, stop_words=None)
recipe_vectors = vectorizer.fit_transform(recipe_texts)

def recommend(user_ingredients, top_k=5):
    if not user_ingredients:
        return []
    
    user_text = ' '.join(user_ingredients).lower()
    user_vector = vectorizer.transform([user_text])
    similarities = cosine_similarity(user_vector, recipe_vectors)[0]
    
    # Urutkan dan ambil top_k
    top_indices = similarities.argsort()[-top_k:][::-1]
    
    results = []
    for idx in top_indices:
        if similarities[idx] > 0:  # hanya yang punya skor > 0
            original_idx = valid_indices[idx] if idx < len(valid_indices) else idx
            results.append({
                "id": original_idx,
                "name": recipes[original_idx].get('Title Cleaned', recipes[original_idx].get('Title', 'Resep')),
                "ingredients": recipes[original_idx].get('Ingredients Cleaned', recipes[original_idx].get('Ingredients', '')),
                "match_score": float(similarities[idx])
            })
    
    return results

print("TF-IDF Recommender siap!")