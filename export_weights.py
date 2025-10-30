# export_weights.py
import json

FEATURES = [
    "Temperatura_Interior",
    "Temperatura_Exterior",
    "Humedad",
    "Nivel_Iluminacion",
    "Ocupacion",
    "Consumo_Energetico_HVAC",
    "Consumo_Energetico_Iluminacion",
    "Uso_Electrodomesticos",
    "Presencia_Movimiento",
    "Hora_Del_Dia",
    "Dia_De_Semana",
]

def try_load_model():
    """Intenta cargar con pickle y, si falla, con joblib."""
    import pickle
    try:
        with open("modelo_rlm.pkl", "rb") as f:
            return pickle.load(f)
    except Exception as e1:
        try:
            from joblib import load as joblib_load
            return joblib_load("modelo_rlm.pkl")
        except Exception as e2:
            raise RuntimeError(
                f"No pude cargar modelo_rlm.pkl.\n"
                f"pickle dijo: {e1}\njoblib dijo: {e2}\n"
                "Verifica que el .pkl sea el mismo que usaste localmente."
            )

model = try_load_model()

# Asegura que es una regresión lineal o compatible (tiene coef_ e intercept_)
if not hasattr(model, "coef_") or not hasattr(model, "intercept_"):
    raise RuntimeError("El modelo cargado no expone coef_ / intercept_. ¿Es la regresión entrenada?")

data = {
    "features": FEATURES,                # orden esperado de entrada
    "coef": list(map(float, model.coef_)),
    "intercept": float(model.intercept_),
}

with open("weights.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Pesos exportados a weights.json")