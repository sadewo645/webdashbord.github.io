from flask import Flask, request, jsonify
import pandas as pd, os, json, random
from generate_afdeling import generate_afdeling  # fungsi yang kamu punya

app = Flask(__name__)

AFDELING_FILE = "afdeling_list.xlsx"

@app.route("/add_afdeling", methods=["POST"])
def add_afdeling():
    data = request.json
    kode = data["kode"]
    nama = data["nama"]
    deskripsi = data["deskripsi"]
    jumlah_blok = random.randint(5, 10)
    luas = random.randint(200, 300)

    # Tambah ke daftar afdeling utama
    if not os.path.exists(AFDELING_FILE):
        df = pd.DataFrame(columns=["Kode", "Nama", "Deskripsi", "Blok", "Luas"])
    else:
        df = pd.read_excel(AFDELING_FILE)

    if kode in df["Kode"].astype(str).values:
        return jsonify({"error": "Kode sudah ada!"}), 400

    new_row = {"Kode": kode, "Nama": nama, "Deskripsi": deskripsi, "Blok": jumlah_blok, "Luas": luas}
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_excel(AFDELING_FILE, index=False)

    # Buat file data afdeling
    generate_afdeling(kode, jumlah_blok, luas)
    return jsonify({"message": f"Afdeling {nama} dibuat!", "kode": kode}), 200

@app.route("/get_afdelings")
def get_afdelings():
    if not os.path.exists(AFDELING_FILE):
        return jsonify([])
    df = pd.read_excel(AFDELING_FILE)
    return df.to_dict(orient="records")

@app.route("/get_data/<kode>")
def get_data(kode):
    json_path = f"afdeling_{kode}.json"
    if not os.path.exists(json_path):
        return jsonify([])
    with open(json_path) as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
