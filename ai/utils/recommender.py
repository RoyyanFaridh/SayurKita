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
    
    def recommend(self, user_ingredients, expired=None, top_k=10):
        """
        Rekomendasi resep berdasarkan bahan yang dimiliki.
        - expired: list of int (opsional), panjang harus sama dengan user_ingredients.
        - Jika rata-rata expired < 30 hari, resep dengan bahan tersebut akan mendapat prioritas lebih tinggi.
        - Jika rata-rata expired >= 30 hari, similarity tidak diubah.
        """
        if not user_ingredients:
            return []

        user_text = ' '.join(user_ingredients).lower()
        user_vector = self.vectorizer.transform([user_text])
        similarities = cosine_similarity(user_vector, self.recipe_vectors)[0]

 
        if expired and len(expired) == len(user_ingredients):
            avg_expired = sum(expired) / len(expired)
            if avg_expired < 30:
                urgency_boost = 1 + (30 - avg_expired) / 30  
                similarities = similarities * urgency_boost


        valid_similarities = [(i, similarities[i]) for i in self.valid_indices if similarities[i] > 0]
        valid_similarities.sort(key=lambda x: x[1], reverse=True)
        top_recipes = valid_similarities[:top_k]
        
        results = []
        for original_idx, score in top_recipes:
            recipe = self.recipes[original_idx]
            results.append({
                "id": original_idx,
                "name": recipe.get('Title Cleaned', recipe.get('Title', 'Resep')),
                "ingredients": recipe.get('Ingredients Cleaned', recipe.get('Ingredients', '')),
                "ingredients_raw": recipe.get('Ingredients', ''),
                "steps_raw": recipe.get('Steps', ''),
                "category": recipe.get('Category', ''),
                "url": recipe.get('URL', ''),
                "match_score": round(float(score), 4)
            })
        return results

recommender = RecipeRecommender()