
from datetime import datetime, date

aksi_user = {}   # {user_id: {"count": int, "last": datetime, "hari": date}}

def cek_aksi(user_id, aksi):
    now = datetime.now()
    hari_ini = date.today()
    
    if user_id not in aksi_user:
        aksi_user[user_id] = {"count": 0, "last": now, "hari": hari_ini}
    
    data = aksi_user[user_id]
    
    # reset jika hari berganti
    if data["hari"] != hari_ini:
        data["count"] = 0
        data["hari"] = hari_ini
    
    # aturan 1: maks 30 aksi per hari
    if data["count"] >= 30:
        return False, "Batas aksi harian 30, coba lagi besok."
    
    # aturan 2: minimal jarak 60 detik antar aksi
    if data["count"] > 0:
        selisih = (now - data["last"]).total_seconds()
        if selisih < 60:
            tunggu = round(60 - selisih)
            return False, f"Tunggu {tunggu} detik lagi."
    
    # lolos
    data["count"] += 1
    data["last"] = now
    return True, "Aksi diperbolehkan"