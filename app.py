# app.py (versión ligera para Vercel)
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import json
import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # puedes restringirlo luego
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carga de pesos
HERE = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_PATH = os.path.join(HERE, "weights.json")
try:
    with open(WEIGHTS_PATH, "r", encoding="utf-8") as f:
        W = json.load(f)
    FEATURES = W["features"]
    COEF = W["coef"]
    INTERCEPT = W["intercept"]
except Exception as e:
    raise RuntimeError(f"No pude leer weights.json: {e}")

app = FastAPI(title="GoroGrid — API ligera")

class DatosEntrada(BaseModel):
    Temperatura_Interior: float = Field(..., example=22.99)
    Temperatura_Exterior: float = Field(..., example=32.63)
    Humedad: float = Field(..., example=63.99)
    Nivel_Iluminacion: float = Field(..., example=377.84)
    Ocupacion: float = Field(..., example=29)
    Consumo_Energetico_HVAC: float = Field(..., example=4.662)
    Consumo_Energetico_Iluminacion: float = Field(..., example=2.097)
    Uso_Electrodomesticos: float = Field(..., example=1.654)
    Presencia_Movimiento: float = Field(..., example=0)
    Hora_Del_Dia: int = Field(..., ge=0, le=23, example=15)
    Dia_De_Semana: int = Field(..., ge=0, le=6, example=4)

def dot(xs, ws):
    s = 0.0
    for x, w in zip(xs, ws):
        s += x * w
    return s

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predecir")
def predecir(d: DatosEntrada):
    # Ordenar las entradas según FEATURES
    try:
        x = [getattr(d, name) for name in FEATURES]
    except AttributeError as e:
        raise HTTPException(status_code=422, detail=f"Falta campo: {e}")
    if len(x) != len(COF):
        raise HTTPException(status_code=400, detail="Dimensiones de entrada no coinciden con los pesos.")
    y = dot(x, COEF) + INTERCEPT
    return {"consumo_estimated": y}

# Servir tu UI si la usas como estático
static_dir = os.path.join(HERE, "static")
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def index():
    index_html = os.path.join(static_dir, "index.html")
    if os.path.exists(index_html):
        return FileResponse(index_html)
    return {"msg": "API GoroGrid. Usa /docs para probar."}