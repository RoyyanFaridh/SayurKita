
import json
import os

def _load_faktor_dari_master():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'ingredients_master_final.json')
    faktor = {}
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                nama = item.get('nama_id', '').lower()
                if nama and 'karbon_co2e' in item:
                    faktor[nama] = item['karbon_co2e']
    return faktor

def _load_faktor_dari_karbon():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'data_karbon_sayurkita_id.json')
    faktor = {}
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            for nama, info in data.items():
                if isinstance(info, dict) and 'co2e_per_kg' in info:
                    faktor[nama.lower()] = info['co2e_per_kg']
    return faktor

faktor_karbon = _load_faktor_dari_master()
fallback = _load_faktor_dari_karbon()

for k, v in fallback.items():
    if k not in faktor_karbon:
        faktor_karbon[k] = v

def get_faktor(nama_bahan):
    return faktor_karbon.get(nama_bahan.lower(), 0.5)  
def hitung_co2e(nama_bahan, berat_gram):
    faktor = get_faktor(nama_bahan)
    return (berat_gram / 1000.0) * faktor