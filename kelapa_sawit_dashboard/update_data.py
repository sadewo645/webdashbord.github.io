import os, time, pandas as pd, random

# Fungsi hasil FFB berdasarkan umur tanaman
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

# Looping update semua afdeling
def update_all_afdelings():
    while True:
        files = [f for f in os.listdir() if f.startswith("afdeling_") and f.endswith(".xlsx")]
        for file in files:
            df = pd.read_excel(file, engine="openpyxl")

            # Update faktor dinamis (fluktuasi tiap periode panen)
            df["Hujan"] = df["Hujan"].apply(lambda x: round(x * random.uniform(0.95, 1.05), 2))
            df["Pupuk"] = df["Pupuk"].apply(lambda x: round(x * random.uniform(0.9, 1.1), 2))
            df["Efisiensi"] = df["Efisiensi"].apply(lambda x: round(x * random.uniform(0.95, 1.05), 2))

            # Hitung ulang hasil
            df["Hasil (ton/ha/thn)"] = df.apply(
                lambda r: round(ffb_yield(r["Usia"]) * r["Hujan"] * r["Pupuk"] * r["Efisiensi"], 2),
                axis=1
            )

            # Simpan ke Excel & JSON
            df.to_excel(file, index=False)
            json_name = file.replace(".xlsx", ".json")
            df.to_json(json_name, orient="records", indent=2)
            print(f"🔁 Update {file} -> {json_name}")

        print("⏳ Menunggu 10 detik untuk update berikutnya...\n")
        time.sleep(10)  # 10 detik = 2 minggu simulasi

if __name__ == "__main__":
    update_all_afdelings()
