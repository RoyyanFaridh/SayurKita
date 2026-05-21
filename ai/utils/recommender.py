import json
import os
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
                self.recipe_texts.append('')  
        
        # TF-IDF Vectorizer
        self.vectorizer = TfidfVectorizer(max_features=5000, min_df=1, stop_words=None)
        self.recipe_vectors = self.vectorizer.fit_transform(self.recipe_texts)
        
        print(f"TF-IDF Recommender siap. {len(self.valid_indices)} resep valid, "
              f"dimensi vektor: {self.recipe_vectors.shape[1]}")
    
    def recommend(self, user_ingredients, expired=None, top_k=5):
        """
        Rekomendasi resep berdasarkan bahan yang dimiliki.
        
        Args:
            user_ingredients: list of str, contoh ['string']
            expired: optional list of int, panjang harus sama dengan user_ingredients,
                     sisa hari expired (belum digunakan untuk similarity, 
                     tapi disediakan untuk pengembangan prioritas bahan)
            top_k: int, jumlah rekomendasi yang diminta
        
        Returns:
            list of dict: setiap dict berisi id, name, ingredients, match_score
        """
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
        
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] <= 0:
                continue
            
            original_idx = self.valid_indices[idx] if idx < len(self.valid_indices) else idx
            recipe = self.recipes[original_idx]
            
            results.append({
                "id": original_idx,
                "name": recipe.get('Title Cleaned', recipe.get('Title', 'Resep')),
                "ingredients": recipe.get('Ingredients Cleaned', recipe.get('Ingredients', '')),
                "match_score": round(float(similarities[idx]), 4)   
            })
        
        return results

recommender = RecipeRecommender()