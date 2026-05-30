import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def generate_cooking_tip(ingredients: list) -> str:
    """
    Menghasilkan tips memasak kreatif menggunakan API Gemini berdasarkan daftar bahan.
    """
    # Pastikan API Key di-set di environment variables (bisa via file .env nantinya)
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Tips memasak: Gunakan kreativitas Anda! (Catatan: GEMINI_API_KEY belum dikonfigurasi)"
        
    genai.configure(api_key=api_key)
    
    # Memilih model Gemini yang cepat dan efisien
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    bahan_str = ", ".join(ingredients)
    prompt = f"Berikan satu tips memasak yang sangat singkat, kreatif, dan berguna (maksimal 2 kalimat) menggunakan bahan-bahan berikut: {bahan_str}."
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Gagal mendapatkan tips dari AI: {str(e)}"
