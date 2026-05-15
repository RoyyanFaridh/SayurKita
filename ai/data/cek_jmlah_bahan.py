import json
import os

base_dir = os.path.dirname(__file__)
dataset_path = os.path.join(base_dir, 'clean_recipes_5000.json')

# akses file 
with open(dataset_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Jumlah resep: {len(data)}")

unique_ingredients = set()

for item in data:
    ingredients = item.get('Ingredients Cleaned', '')
    if ingredients:
        for ing in ingredients.split(','):
            cleaned_ing = ing.strip().lower()
            if cleaned_ing:
                unique_ingredients.add(cleaned_ing)

print(f"Jumlah bahan unik: {len(unique_ingredients)}")