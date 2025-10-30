import pickle, json

# Cargar modelo original
with open('modelo_rlm.pkl','rb') as f:
    model = pickle.load(f)

# Crear diccionario con los coeficientes e intercepto
params = {
  "features": [
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
    "Dia_De_Semana"
  ],
  "coef": [float(c) for c in getattr(model, "coef_", [])],
  "intercept": float(getattr(model, "intercept_", 0.0))
}

# Guardar como JSON
with open('modelo_params.json','w') as f:
    json.dump(params, f, indent=2)

print("Archivo modelo_params.json creado correctamente.")