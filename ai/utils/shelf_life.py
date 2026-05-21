import json
import os

# Membaca data json
data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'ingredients_master_final.json')
with open(data_path, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

def get_shelf_life(ingredient_name: str):
    # Mencari bahan di dalam data
    for item in master_data:
        if item["nama_id"].lower() == ingredient_name.lower():
            return {
                "nama": item["nama_id"],
                "umur_kulkas": item["umur_kulkas"],
                "umur_suhu_ruang": item["umur_suhu_ruang"],
                "umur_freezer": item["umur_freezer"]
            }
    # Kalau tidak ketemu
    return None
