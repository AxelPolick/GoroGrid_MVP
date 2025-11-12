import { motion } from "motion/react";
import { useState } from "react";
import { EnergyCard } from "./EnergyCard";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import {
  Zap,
  Leaf,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Calculator,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const mockData = [
  { time: "Lun", kwh: 2.1 },
  { time: "Mar", kwh: 1.8 },
  { time: "Mié", kwh: 3.5 },
  { time: "Jue", kwh: 4.2 },
  { time: "Vie", kwh: 3.8 },
  { time: "Sáb", kwh: 5.1 },
  { time: "Dom", kwh: 3.2 },
];

interface DashboardProps {
  userName?: string;
}

interface SensorData {
  datetime: string;
  z1_temp: string;
  z1_rh: string;
  z1_lux: string;
  z2_temp: string;
  z2_rh: string;
  z2_lux: string;
  z4_temp: string;
  z4_rh: string;
  z4_lux: string;
  z5_temp: string;
  z5_rh: string;
  z5_lux: string;
}

export function Dashboard({ userName = "Usuario" }: DashboardProps) {
  const [sensorData, setSensorData] = useState<SensorData>({
    datetime: "",
    z1_temp: "",
    z1_rh: "",
    z1_lux: "",
    z2_temp: "",
    z2_rh: "",
    z2_lux: "",
    z4_temp: "",
    z4_rh: "",
    z4_lux: "",
    z5_temp: "",
    z5_rh: "",
    z5_lux: "",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Obtener preferencias del usuario
  const getPreferences = () => {
    const prefs = localStorage.getItem("gorogrid_preferences");
    if (prefs) {
      return JSON.parse(prefs);
    }
    return { tarifa_kwh: 0.25, co2_factor: 0.233 };
  };

  const { tarifa_kwh, co2_factor } = getPreferences();

  const handleInputChange = (field: keyof SensorData, value: string) => {
    setSensorData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return Object.values(sensorData).every((value) => value.trim() !== "");
  };

  const calculatePrediction = async () => {
    if (!validateForm()) {
      toast.error("Error de validación", {
        description: "Por favor completa todos los campos",
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Parsear fecha y hora
      const date = new Date(sensorData.datetime);
      const hour = date.getHours();
      const dayofweek = date.getDay();
      const month = date.getMonth() + 1;

      const requestData = {
        features: {
          hour,
          dayofweek,
          month,
          "z1_S1(degC)": parseFloat(sensorData.z1_temp),
          "z1_S1(RH%)": parseFloat(sensorData.z1_rh),
          "z1_S1(lux)": parseFloat(sensorData.z1_lux),
          "z2_S1(degC)": parseFloat(sensorData.z2_temp),
          "z2_S1(RH%)": parseFloat(sensorData.z2_rh),
          "z2_S1(lux)": parseFloat(sensorData.z2_lux),
          "z4_S1(degC)": parseFloat(sensorData.z4_temp),
          "z4_S1(RH%)": parseFloat(sensorData.z4_rh),
          "z4_S1(lux)": parseFloat(sensorData.z4_lux),
          "z5_S1(degC)": parseFloat(sensorData.z5_temp),
          "z5_S1(RH%)": parseFloat(sensorData.z5_rh),
          "z5_S1(lux)": parseFloat(sensorData.z5_lux),
        },
      };

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Error al comunicarse con la API");
      }

      const data = await response.json();
      setPrediction(data.prediction);

      toast.success("Predicción calculada", {
        description: `Consumo estimado: ${data.prediction.toFixed(2)} kWh`,
      });
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo conectar con el servidor de predicción",
      });
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Calcular valores con la predicción
  const consumoActual = prediction !== null ? prediction.toFixed(2) : "3.2";
  const emisionesCO2 = prediction !== null ? (prediction * co2_factor).toFixed(2) : "0.75";
  const costoEstimado = prediction !== null ? (prediction * tarifa_kwh).toFixed(2) : "0.80";

  return (
    <div className="space-y-6">
      {/* Header con saludo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="mb-1">¡Hola, {userName}! 👋</h1>
          <p className="text-muted-foreground">
            Monitoreo de consumo energético en tiempo real
          </p>
        </div>
        <Badge className="bg-[#7C4DFF] hover:bg-[#7C4DFF]">
          <Leaf className="w-4 h-4 mr-1" />
          Modo Eco
        </Badge>
      </motion.div>

      {/* Panel de Predicción de Consumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 border-[#7C4DFF]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[#7C4DFF]">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h3 className="mb-0 text-[#7C4DFF]">Predicción de Consumo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Fecha y hora */}
            <div className="col-span-full">
              <Label htmlFor="datetime">Fecha y hora</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={sensorData.datetime}
                onChange={(e) => handleInputChange("datetime", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Zona 1 */}
            <div>
              <Label htmlFor="z1_temp">z1_S1(degC)</Label>
              <Input
                id="z1_temp"
                type="number"
                step="0.1"
                placeholder="28.6"
                value={sensorData.z1_temp}
                onChange={(e) => handleInputChange("z1_temp", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z1_rh">z1_S1(RH%)</Label>
              <Input
                id="z1_rh"
                type="number"
                step="0.1"
                placeholder="64.8"
                value={sensorData.z1_rh}
                onChange={(e) => handleInputChange("z1_rh", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z1_lux">z1_S1(lux)</Label>
              <Input
                id="z1_lux"
                type="number"
                step="1"
                placeholder="120"
                value={sensorData.z1_lux}
                onChange={(e) => handleInputChange("z1_lux", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Zona 2 */}
            <div>
              <Label htmlFor="z2_temp">z2_S1(degC)</Label>
              <Input
                id="z2_temp"
                type="number"
                step="0.1"
                placeholder="28.7"
                value={sensorData.z2_temp}
                onChange={(e) => handleInputChange("z2_temp", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z2_rh">z2_S1(RH%)</Label>
              <Input
                id="z2_rh"
                type="number"
                step="0.1"
                placeholder="66.2"
                value={sensorData.z2_rh}
                onChange={(e) => handleInputChange("z2_rh", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z2_lux">z2_S1(lux)</Label>
              <Input
                id="z2_lux"
                type="number"
                step="1"
                placeholder="110"
                value={sensorData.z2_lux}
                onChange={(e) => handleInputChange("z2_lux", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Zona 4 */}
            <div>
              <Label htmlFor="z4_temp">z4_S1(degC)</Label>
              <Input
                id="z4_temp"
                type="number"
                step="0.1"
                placeholder="29.0"
                value={sensorData.z4_temp}
                onChange={(e) => handleInputChange("z4_temp", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z4_rh">z4_S1(RH%)</Label>
              <Input
                id="z4_rh"
                type="number"
                step="0.1"
                placeholder="65.4"
                value={sensorData.z4_rh}
                onChange={(e) => handleInputChange("z4_rh", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z4_lux">z4_S1(lux)</Label>
              <Input
                id="z4_lux"
                type="number"
                step="1"
                placeholder="95"
                value={sensorData.z4_lux}
                onChange={(e) => handleInputChange("z4_lux", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Zona 5 */}
            <div>
              <Label htmlFor="z5_temp">z5_S1(degC)</Label>
              <Input
                id="z5_temp"
                type="number"
                step="0.1"
                placeholder="28.9"
                value={sensorData.z5_temp}
                onChange={(e) => handleInputChange("z5_temp", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z5_rh">z5_S1(RH%)</Label>
              <Input
                id="z5_rh"
                type="number"
                step="0.1"
                placeholder="66.0"
                value={sensorData.z5_rh}
                onChange={(e) => handleInputChange("z5_rh", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="z5_lux">z5_S1(lux)</Label>
              <Input
                id="z5_lux"
                type="number"
                step="1"
                placeholder="100"
                value={sensorData.z5_lux}
                onChange={(e) => handleInputChange("z5_lux", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={calculatePrediction}
            disabled={!validateForm() || isCalculating}
            className="w-full md:w-auto bg-[#7C4DFF] hover:bg-[#6A3DE8]"
          >
            {isCalculating ? "Calculando..." : "Calcular consumo"}
          </Button>
        </Card>
      </motion.div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnergyCard
          title="Consumo actual"
          value={consumoActual}
          unit="kWh"
          icon={Zap}
          trend={-15}
          color="#7C4DFF"
          delay={0.2}
        />
        <EnergyCard
          title="Emisiones CO₂"
          value={emisionesCO2}
          unit="kg"
          icon={Leaf}
          trend={-23}
          color="#9575CD"
          delay={0.3}
        />
        <EnergyCard
          title="Costo estimado"
          value={`$${costoEstimado}`}
          unit="MXN"
          icon={DollarSign}
          trend={-18}
          color="#B39DDB"
          delay={0.4}
        />
      </div>

      {/* Gráfico de consumo semanal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Uso de electricidad semanal</h3>
              <p className="text-muted-foreground">
                Últimos 7 días
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Area
                type="monotone"
                dataKey="kwh"
                stroke="#7C4DFF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorKwh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Resumen rápido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#7C4DFF]">
            $42.50
          </div>
          <p className="text-muted-foreground">Costo electricidad</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#7C4DFF]">
            18.2
          </div>
          <p className="text-muted-foreground">kWh promedio</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#7C4DFF]">
            23%
          </div>
          <p className="text-muted-foreground">Ahorro mensual</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#7C4DFF]">
            Sala
          </div>
          <p className="text-muted-foreground">Mayor consumo</p>
        </Card>
      </motion.div>
    </div>
  );
}
