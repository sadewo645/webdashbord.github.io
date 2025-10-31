import pandas as pd
import random, json, time, os

def ffb_yield(age):
    if age < 3:
        return 0
    elif age <= 7:
        return 5 + (age - 3) * 6.5
    elif age <= 13:
        return 30 + (age - 7) * 0.8
    elif age <= 25:
        return 35 - (age - 13) * 1.0
    else:
        return 20

def generate_afdeling(kode, jumlah_blok, luas_total):
    luas_per_blok = luas_total / jumlah_blok
    blok_data = []
    for i in range(1, jumlah_blok + 1):
        usia = random.randint(3, 25)
        f_hujan = round(random.uniform(0.9, 1.1), 2)
        f_pupuk = round(random.uniform(0.85, 1.15), 2)
        f_ef = round(random.uniform(0.9, 1.0), 2)
        hasil = ffb_yield(usia) * f_hujan * f_pupuk * f_ef
        blok_data.append({
            "Blok": i,
            "Usia": usia,
            "Luas (ha)": round(luas_per_blok, 2),
            "Hujan": f_hujan,
            "Pupuk": f_pupuk,
            "Efisiensi": f_ef,
            "Hasil (ton/ha/thn)": round(hasil, 2)
        })
    df = pd.DataFrame(blok_data)
    fname = f"afdeling_{kode}.xlsx"
    df.to_excel(fname, index=False)
    df.to_json(f"afdeling_{kode}.json", orient="records", indent=2)
    print(f"✅ {fname} dibuat.")

def auto_update(kode):
    fname = f"afdeling_{kode}.xlsx"
    while True:
        df = pd.read_excel(fname)
        df["Hasil (ton/ha/thn)"] = df.apply(
            lambda r: round(ffb_yield(r["Usia"]) *
                            random.uniform(0.95, 1.05), 2), axis=1)
        df.to_excel(fname, index=False)
        df.to_json(f"afdeling_{kode}.json", orient="records", indent=2)
        print(f"🔁 Update data afdeling {kode}")
        time.sleep(10)  # 10 detik = 2 minggu simulasi

# contoh:
# generate_afdeling("10001", 10, 250)
# auto_update("10001")
