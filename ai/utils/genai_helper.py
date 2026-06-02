import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def generate_cooking_tip(ingredients: list) -> str:
    """
    Menghasilkan tips memasak kreatif menggunakan API Gemini berdasarkan daftar bahan.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Tips memasak: Gunakan kreativitas Anda! (Catatan: GEMINI_API_KEY belum dikonfigurasi)"

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')  # model stabil

    bahan_str = ", ".join(ingredients)
    prompt = f"""
    Anda seorang koki profesional. Berikan SATU tips memasak yang sangat praktis, kreatif, dan berguna (maksimal 2 kalimat) 
    menggunakan bahan-bahan berikut: {bahan_str}.
    Tips harus berisi trik konkret (misal: cara mengolah, mengawetkan, atau memadukan rasa). 
    Hindari saran umum seperti 'coba masak dengan api kecil'.
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": 100,
            }
        )
        if response and response.text:
            return response.text.strip()
        return "Tips memasak tidak tersedia untuk bahan-bahan ini."
    except Exception as e:
        print(f"[Gemini Error] {e}")  # untuk debugging
        return "Maaf, tips sedang tidak tersedia. Coba lagi nanti."