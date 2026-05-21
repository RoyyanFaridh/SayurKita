
from datetime import datetime, date

aksi_user = {}  

HARGA_POIN = {
    "input_bahan": 10,
    "bagi_surplus": 50,
    "klaim_surplus": 20
}

def cek_aksi(user_id, aksi):
    now = datetime.now()
    hari_ini = date.today()
    
    if user_id not in aksi_user:
        aksi_user[user_id] = {"count": 0, "last": now, "hari": hari_ini}
    
    data = aksi_user[user_id]
    
    if data["hari"] != hari_ini:
        data["count"] = 0
        data["hari"] = hari_ini
    
    if data["count"] >= 30:
        return False, "Batas aksi harian 30, coba lagi besok.", 0
    
    if data["count"] > 0:
        selisih = (now - data["last"]).total_seconds()
        if selisih < 60:
            tunggu = round(60 - selisih)
            return False, f"Tunggu {tunggu} detik lagi.", 0
    

    data["count"] += 1
    data["last"] = now
    
    poin_didapat = HARGA_POIN.get(aksi, 0)
    return True, "Aksi diperbolehkan", poin_didapat