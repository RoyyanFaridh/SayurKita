import json
import os
import traceback
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RecipeRecommender:
    def __init__(self, data_path: str = None):
        if data_path is None:
            data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'clean_recipes_5000.json')
        
        with open(data_path, 'r', encoding='utf-8') as f:
            self.recipes = json.load(f)
        

        self.recipe_texts = []
        self.valid_indices = []
        for i, r in enumerate(self.recipes):
            ingredients = r.get('Ingredients Cleaned', r.get('Ingredients', ''))
            if ingredients and isinstance(ingredients, str) and ingredients.strip():
                self.recipe_texts.append(ingredients.lower())
                self.valid_indices.append(i)
            else:
                self.recipe_texts.append('')   # fallback kosong
        
        # TF-IDF Vectorizer
        self.vectorizer = TfidfVectorizer(max_features=5000, min_df=1, stop_words=None)
        self.recipe_vectors = self.vectorizer.fit_transform(self.recipe_texts)
        
        print(f"TF-IDF Recommender siap. {len(self.valid_indices)} resep valid, "
              f"dimensi vektor: {self.recipe_vectors.shape[1]}")
    
    def recommend(self, user_ingredients, expired=None, top_k=5):
        """
        Rekomendasi resep berdasarkan bahan yang dimiliki.
        
        Args:
<<<<<<< Updated upstream
            user_ingredients: list of str, contoh ['string']
            expired: optional list of int, panjang harus sama dengan user_ingredients,
                     sisa hari expired (belum digunakan untuk similarity, 
                     tapi disediakan untuk pengembangan prioritas bahan)
=======
            ingredients: list of str, contoh ['ayam', 'tahu']
            expired: optional list of int/float, panjang HARUS sama dengan ingredients.
                     (belum digunakan untuk similarity, hanya disediakan untuk validasi)
>>>>>>> Stashed changes
            top_k: int, jumlah rekomendasi yang diminta
        
        Returns:
            list of dict: setiap dict berisi id, name, ingredients, match_score
        """
<<<<<<< Updated upstream
        if not user_ingredients:
            return []

        user_text = ' '.join(user_ingredients).lower()
        user_vector = self.vectorizer.transform([user_text])
        

        similarities = cosine_similarity(user_vector, self.recipe_vectors)[0]

        # prioritas bahan hampir expired
        if expired and len(expired) > 0:
            avg_expired = sum(expired) / len(expired)
            urgency_boost = 1 + ((30 - avg_expired) / 30)
            similarities = similarities * urgency_boost
=======

        if not ingredients:
            return []
        

        if expired is not None:
            if len(expired) != len(ingredients):
                raise ValueError(f"Panjang expired ({len(expired)}) harus sama dengan jumlah ingredients ({len(ingredients)})")

            expired = [float(x) for x in expired]
>>>>>>> Stashed changes
        

        try:
            user_text = ' '.join(ingredients).lower()
            user_vector = self.vectorizer.transform([user_text])
            similarities = cosine_similarity(user_vector, self.recipe_vectors)[0]
        except Exception as e:
            print("Gagal menghitung similarity:", e)
            traceback.print_exc()
            raise
        

        top_indices = similarities.argsort()[-top_k:][::-1]
        results = []
        for idx in top_indices:
            if similarities[idx] <= 0:
                continue
            
            recipe = self.recipes[idx]
            
            name = recipe.get('Title Cleaned') or recipe.get('Title', 'Resep')
            ingredients_str = recipe.get('Ingredients Cleaned') or recipe.get('Ingredients', '')
            
            results.append({
<<<<<<< Updated upstream
                "id": original_idx,
                "name": recipe.get('Title Cleaned', recipe.get('Title', 'Resep')),
                "ingredients": recipe.get('Ingredients Cleaned', recipe.get('Ingredients', '')),
                "match_score": round(float(similarities[idx]), 4)   
=======
                "id": int(idx),
                "name": name,
                "ingredients": ingredients_str,
                "match_score": float(similarities[idx])
>>>>>>> Stashed changes
            })
        
        return results


recommender = RecipeRecommender()