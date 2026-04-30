import json

# akses file 
with open('clean_recipes_800.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Jumlah resep: {len(data)}")

unique_ingredients = set()
for item in data:
    ingredients = item.get('Ingredients Cleaned', '')
    if ingredients:
        for ing in ingredients.split(', '):
            unique_ingredients.add(ing.strip())

print(f"Jumlah bahan: {len(unique_ingredients)}")
