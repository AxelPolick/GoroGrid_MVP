# app.py — robusto para LinearRegression o Pipeline + validaciones claras + weights opcional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import os, json, joblib
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

MODEL_PATH = os.getenv("MODEL_PATH", "modelo_rlm.pkl")
SCHEMA_PATH = os.getenv("SCHEMA_PATH", "modelo_rlm_schema.json")
MEDIANS_PATH = os.getenv("MEDIANS_PATH", "feature_medians.json")  # opcional, para imputar
FEATURE_LIST_ENV = os.getenv("FEATURE_LIST")  # fallback: "col1,col2,..."

app = FastAPI(title="GoroGrid Floor7 API", version="1.3")

# =========================
# Carga de recursos
# =========================
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")
    return joblib.load(MODEL_PATH)

def expected_columns_from_everywhere(model) -> List[str]:
    # 1) schema JSON explícito
    if os.path.exists(SCHEMA_PATH):
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        cols = data.get("expected_feature_columns") or data.get("features")
        if cols and isinstance(cols, list):
            return list(cols)

    # 2) FEATURE_LIST (env)
    if FEATURE_LIST_ENV:
        cols = [c.strip() for c in FEATURE_LIST_ENV.split(",") if c.strip()]
        if cols:
            return cols

    # 3) feature_names_in_ (si tu modelo lo guarda)
    if hasattr(model, "feature_names_in_"):
        return list(model.feature_names_in_)

    # 4) Si es Pipeline, intentar ColumnTransformer
    if isinstance(model, Pipeline):
        pre = None
        for key in ["preprocesamiento", "preprocess", "preprocessing"]:
            if key in model.named_steps:
                pre = model.named_steps[key]
                break
        if pre is None:
            for _, step in model.named_steps.items():
                if isinstance(step, ColumnTransformer):
                    pre = step
                    break
        if pre is not None:
            cols: List[str] = []
            for _, _, c in pre.transformers_:
                if isinstance(c, (list, tuple)):
                    cols += list(c)
                else:
                    cols.append(c)
            if cols:
                return cols

    raise RuntimeError(
        "No pude determinar las columnas de entrada. "
        "Provee SCHEMA_PATH con expected_feature_columns, "
        "o define FEATURE_LIST='col1,col2,...', "
        "o re-entrena guardando feature_names_in_."
    )

MODEL = load_model()
EXPECTED_COLS = expected_columns_from_everywhere(MODEL)

MEDIANS = None
if os.path.exists(MEDIANS_PATH):
    with open(MEDIANS_PATH, "r", encoding="utf-8") as f:
        MEDIANS = json.load(f)

# =========================
# Utilidades
# =========================
def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    """Si se proporciona Date, añade hour/dayofweek/month si faltan."""
    if "Date" in df.columns and not pd.api.types.is_datetime64_any_dtype(df["Date"]):
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    if "Date" in df.columns and pd.api.types.is_datetime64_any_dtype(df["Date"]):
        if "hour" not in df.columns: df["hour"] = df["Date"].dt.hour
        if "dayofweek" not in df.columns: df["dayofweek"] = df["Date"].dt.dayofweek
        if "month" not in df.columns: df["month"] = df["Date"].dt.month
    return df

def ensure_order(df: pd.DataFrame, expected: List[str]) -> pd.DataFrame:
    """Reindex para forzar orden y agregar columnas faltantes como NaN."""
    return df.reindex(columns=expected)

def try_impute_with_medians(X: pd.DataFrame) -> pd.DataFrame:
    """Imputa NaN usando feature_medians.json si está disponible."""
    if MEDIANS is None:
        return X
    for c in X.columns:
        if X[c].isna().any() and c in MEDIANS and pd.api.types.is_numeric_dtype(X[c]):
            X[c] = X[c].fillna(MEDIANS[c])
    return X

# =========================
# Modelos de entrada
# =========================
class PredictPayload(BaseModel):
    features: Dict[str, Any]

# =========================
# Endpoints
# =========================
@app.get("/health")
def health():
    return {
        "ok": True,
        "model": os.path.basename(MODEL_PATH),
        "n_expected": len(EXPECTED_COLS),
        "expects_sample": EXPECTED_COLS[:8] + (["..."] if len(EXPECTED_COLS) > 8 else [])
    }

@app.get("/schema")
def schema():
    return {"expected_feature_columns": EXPECTED_COLS}

@app.post("/predict")
def predict(payload: PredictPayload):
    row = payload.features
    df = pd.DataFrame([row])
    df = add_time_features(df)

    # 1) columnas faltantes respecto al schema
    missing = [c for c in EXPECTED_COLS if c not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail={"msg": "Faltan columnas en el payload.", "missing": missing}
        )

    # 2) orden y NaN
    X = ensure_order(df, EXPECTED_COLS)
    if X.isna().any().any():
        X = try_impute_with_medians(X)  # imputación opcional si hay archivo de medianas
        if X.isna().any().any():
            nan_cols = [c for c in X.columns if X[c].isna().any()]
            raise HTTPException(
                status_code=400,
                detail={"msg": "Hay NaN en la fila de entrada.", "nan_columns": nan_cols}
            )

    # 3) predecir
    try:
        yhat = float(MODEL.predict(X)[0])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error en predicción: {e}")
    return {"prediction": yhat}

# ------------ Opcional: /weights y /export-weights ------------
def _find_final_estimator(model):
    if isinstance(model, Pipeline):
        return list(model.named_steps.values())[-1]
    return model

def _find_scaler_params(model, expected_cols):
    """Busca StandardScaler y devuelve (mean_, scale_) si mapea 1:1 con expected_cols."""
    scaler = None
    if isinstance(model, Pipeline):
        for _, step in model.named_steps.items():
            if isinstance(step, StandardScaler):
                scaler = step
                break
        if scaler is None:
            for _, step in model.named_steps.items():
                if isinstance(step, ColumnTransformer):
                    ct: ColumnTransformer = step
                    for _, trans, cols in ct.transformers_:
                        if isinstance(trans, Pipeline):
                            for _, inner in trans.steps:
                                if isinstance(inner, StandardScaler):
                                    scaler = inner; break
                        elif isinstance(trans, StandardScaler):
                            scaler = trans
                        if scaler is not None: break
                if scaler is not None: break
    if scaler is None: return None, None
    mean_, scale_ = getattr(scaler, "mean_", None), getattr(scaler, "scale_", None)
    if mean_ is None or scale_ is None: return None, None
    if len(mean_) != len(expected_cols) or len(scale_) != len(expected_cols): return None, None
    return np.array(mean_, float), np.array(scale_, float)

@app.get("/export-weights")
def export_weights():
    """Genera weights.json (desescalado si hay StandardScaler) y weights_scaled.json."""
    est = _find_final_estimator(MODEL)
    if not hasattr(est, "coef_") or not hasattr(est, "intercept_"):
        raise HTTPException(status_code=400, detail="El estimador no expone coef_ / intercept_.")
    coef = np.ravel(est.coef_).astype(float)
    intercept = float(est.intercept_)

    # scaled
    scaled_payload = {"features": EXPECTED_COLS, "coef": coef.tolist(), "intercept": intercept}
    with open("weights_scaled.json", "w", encoding="utf-8") as f:
        json.dump(scaled_payload, f, ensure_ascii=False, indent=2)

    # try unscale
    mean_, scale_ = _find_scaler_params(MODEL, EXPECTED_COLS)
    if mean_ is not None and scale_ is not None:
        unscaled_coef = coef / scale_
        unscaled_intercept = float(intercept - np.sum(coef * (mean_ / scale_)))
        payload = {"features": EXPECTED_COLS, "coef": unscaled_coef.tolist(), "intercept": unscaled_intercept}
    else:
        payload = scaled_payload

    with open("weights.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    return {"saved": ["weights.json", "weights_scaled.json"], "n_features": len(EXPECTED_COLS)}

@app.get("/weights")
def get_weights(scaled: bool = False):
    path = "weights_scaled.json" if scaled else "weights.json"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"No existe {path}. Llama primero a /export-weights.")
    return json.load(open(path, "r", encoding="utf-8"))

# =========================
# Página raíz (para Vercel)
# =========================
@app.get("/", response_class=HTMLResponse)
def root():
    return """
    <html>
      <head><title>GoroGrid API</title></head>
      <body style='font-family: Arial; text-align:center; padding-top:50px;'>
        <h1>⚡ GoroGrid API en Vercel</h1>
        <p>La API está activa y lista para recibir solicitudes.</p>
        <p>👉 <a href="/docs">Abrir documentación interactiva</a></p>
      </body>
    </html>
    """

# =============