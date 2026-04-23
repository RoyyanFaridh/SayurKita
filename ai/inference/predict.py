import sys
import os
import numpy as np
import tensorflow as tf

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class SayurKitaPredictor:
    """Kode inference sederhana"""
    
    def __init__(self, model_path='models/sayurkita_model.keras'):
        try:
            self.model = tf.keras.models.load_model(model_path)
            print(f"✅ Model loaded from {model_path}")
        except Exception as e:
            print(f"⚠️ Model not found: {e}")
            self.model = None
    
    def predict(self, input_vector):
        if self.model is None:
            return []
        return self.model.predict(input_vector)
    
    def get_top_k(self, input_vector, top_k=5):
        if self.model is None:
            return []
        predictions = self.predict(input_vector)[0]
        top_indices = np.argsort(predictions)[-top_k:][::-1]
        return top_indices, predictions[top_indices]

def simple_inference_example():
    """Contoh penggunaan sederhana"""
    predictor = SayurKitaPredictor()
    
    if predictor.model:
        dummy_input = np.random.random((1, 10)).astype(np.float32)
        predictions = predictor.predict(dummy_input)
        print(f"Sample predictions shape: {predictions.shape}")

if __name__ == "__main__":
    simple_inference_example()
    print("✅ Inference code siap!")