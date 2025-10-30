# app.py
from __future__ import annotations

from pathlib import Path
import os
from typing import Any, Dict, List, Optional

import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# -----------------------------------------------------------------------------
# Configuración básica
# -----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "modelo_rlm.pkl"   # ajusta el nombre si fuera distinto

# Orden de features con el que se entrenó el modelo
FEATURES: List[str] = [
    "Temperatura_Interior",           # 0
    "Temperatura_Exterior",           # 1
    "Humedad",                        # 2
    "Nivel_Iluminacion",              # 3
    "Ocupacion",                      # 4
    "Consumo_Energetico_HVAC",        # 5
    "Consumo_Energetico_Iluminacion", # 6
    "Uso_Electrodomesticos",          # 7
    "Presencia_Movimiento",           # 8
    "Hora_Del_Dia",                   # 9
    "Dia_De_Semana",                  # 10
]

# -----------------------------------------------------------------------------
# Carga del modelo (soporta varios formatos de guardado)
# -----------------------------------------------------------------------------
def load_model_bundle(model_path: Path) -> Dict[str, Any]:
    """
    Carga 'modelo_rlm.pkl' y devuelve un bundle con:
      - model: estimador sklearn
      - features: lista de features (si existe en el pkl, se respeta)
    Soporta:
      - guardado directo del estimador (LinearRegression, Pipeline, etc.)
      - dict con claves {"model": ..., "features": ...} o {"pipeline": ...}
    """
    if not model_path.exists():
        raise FileNotFoundError(f"No se encontró el modelo en: {model_path}")

    obj = joblib.load(model_path)

    bundle: Dict[str, Any] = {}

    # Caso 1: guardaste un dict con claves conocidas
    if isinstance(obj, dict):
        model = obj.get("model") or obj.get("pipeline") or obj.get("estimator")
        if model is None:
            # quizá guardaste el modelo con otra clave; intenta detectar el primero sklearn-like
            for v in obj.values():
                if hasattr(v, "predict"):
                    model = v
                    break
        bundle["model"] = model
        # si en el bundle venían features, respétalas
        if "features" in obj and isinstance(obj["features"], (list, tuple)):
            bundle["features"] = list(obj["features"])
        else:
            bundle["features"] = FEATURES

    # Caso 2: guardaste directamente el estimador/pipeline
    else:
        bundle["model"] = obj
        bundle["features"] = FEATURES

    if bundle["model"] is None or not hasattr(bundle["model"], "predict"):
        raise ValueError("No fue posible identificar un estimador sklearn válido dentro del .pkl")

    return bundle


try:
    MODEL_BUNDLE = load_model_bundle(MODEL_PATH)
    MODEL = MODEL_BUNDLE["model"]
    MODEL_FEATURES: List[str] = MODEL_BUNDLE.get("features", FEATURES)
except Exception as e:
    # En producción podrías registrar logs; aquí lanzamos para fallar rápido
    raise RuntimeError(f"Error cargando el modelo: {e}") from e

# -----------------------------------------------------------------------------
# FastAPI
# -----------------------------------------------------------------------------
app = FastAPI(
    title="GoroGrid – API de Predicción",
    description="API de predicción de consumo energético para el MVP de GoroGrid.",
    version="1.0.0",
)

# Habilita CORS (útil si pruebas la UI desde otro origen)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en prod restringe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sirve archivos estáticos (UI)
STATIC_DIR = BASE_DIR / "static"
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


# -----------------------------------------------------------------------------
# Esquema de entrada
# -----------------------------------------------------------------------------
class DatosEntrada(BaseModel):
    Temperatura_Interior: float = Field(..., description="°C")
    Temperatura_Exterior: float = Field(..., description="°C")
    Humedad: float = Field(..., description="%")
    Nivel_Iluminacion: float = Field(..., description="Lux")
    Ocupacion: float = Field(..., description="Personas")
    Consumo_Energetico_HVAC: float
    Consumo_Energetico_Iluminacion: float
    Uso_Electrodomesticos: float
    Presencia_Movimiento: int = Field(..., ge=0, le=1)
    Hora_Del_Dia: int = Field(..., ge=0, le=23)
    Dia_De_Semana: int = Field(..., ge=1, le=7)


# -----------------------------------------------------------------------------
# Rutas
# -----------------------------------------------------------------------------
@app.get("/")
def root() -> FileResponse:
    """Sirve la interfaz del MVP."""
    index_path = STATIC_DIR / "index.html"
    if not index_path.exists():
        # Mensaje de ayuda si falta el archivo
        raise HTTPException(status_code=404, detail="Falta static/index.html")
    return FileResponse(str(index_path))


@app.get("/health")
def health() -> Dict[str, Any]:
    """Salud de la API y metadatos del modelo."""
    return {
        "status": "ok",
        "model_class": MODEL.__class__.__name__,
        "features_order": MODEL_FEATURES,
        "n_features_model": getattr(getattr(MODEL, "n_features_in_", None), "__int__", lambda: None)(),
    }


@app.post("/predecir")
def predecir(payload: DatosEntrada) -> Dict[str, float]:
    """
    Devuelve el consumo estimado usando el orden de FEATURES con el que se entrenó el modelo.
    """
    # Convertimos BaseModel -> dict
    data_dict = payload.model_dump()

    # Asegura el orden de los features
    try:
        row: List[float] = [float(data_dict[name]) for name in MODEL_FEATURES]
    except KeyError as ke:
        raise HTTPException(
            status_code=422,
            detail=f"Falta la característica requerida: {ke}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error preparando datos de entrada: {e}"
        )

    X = np.array([row], dtype=float)

    try:
        y_pred = MODEL.predict(X)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al predecir: {e}")

    # Devuelve número nativo (no numpy types)
    pred_value = float(np.asarray(y_pred).ravel()[0])
    return {"consumo_estimado": pred_value}


# -----------------------------------------------------------------------------
# (Opcional) Arranque local con: uvicorn app:app --reload --port 8000
# -----------------------------------------------------------------------------
