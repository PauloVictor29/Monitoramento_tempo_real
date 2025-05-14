from flask import Flask, render_template, jsonify, send_file
import psutil  # Biblioteca para coletar dados do sistema
import csv
import os
from datetime import datetime

app = Flask(__name__)

# Nome do arquivo onde os dados serão salvos
LOG_FILE = "dados_monitoramento.csv"

# Se o arquivo CSV ainda não existir, cria e adiciona o cabeçalho
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "cpu", "memoria", "disco"])

# Rota principal - carrega a página HTML
@app.route("/")
def index():
    return render_template("index.html")

# Rota que fornece os dados atuais da máquina em JSON
@app.route("/dados")
def dados():
    cpu = psutil.cpu_percent(interval=0.5)  # Porcentagem da CPU usada
    memoria = psutil.virtual_memory().percent  # Porcentagem de RAM usada
    disco = psutil.disk_usage('/').percent  # Porcentagem do disco principal usada
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Adiciona os dados ao CSV
    with open(LOG_FILE, mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, cpu, memoria, disco])

    # Retorna os dados para o frontend
    return jsonify(cpu=cpu, memoria=memoria, disco=disco)

# Rota para exportar o arquivo CSV
@app.route("/exportar")
def exportar():
    return send_file(LOG_FILE, as_attachment=True)

# Inicia o servidor Flask
if __name__ == "__main__":
    app.run(debug=True)
