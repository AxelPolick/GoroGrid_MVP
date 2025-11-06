import { motion } from "motion/react";
import { EnergyCard } from "./EnergyCard";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Zap,
  Leaf,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
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
  { time: "00:00", kwh: 2.1 },
  { time: "04:00", kwh: 1.8 },
  { time: "08:00", kwh: 3.5 },
  { time: "12:00", kwh: 4.2 },
  { time: "16:00", kwh: 3.8 },
  { time: "20:00", kwh: 5.1 },
  { time: "23:59", kwh: 3.2 },
];

interface DashboardProps {
  userName?: string;
}

export function Dashboard({ userName = "Usuario" }: DashboardProps) {
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
            Has ahorrado un 23% de energía este mes
          </p>
        </div>
        <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50]">
          <Leaf className="w-4 h-4 mr-1" />
          Modo Eco
        </Badge>
      </motion.div>

      {/* Alertas */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Alert className="border-[#f44336] bg-[#f44336]/10">
          <AlertTriangle className="h-4 w-4 text-[#f44336]" />
          <AlertDescription>
            <span className="text-[#f44336]">Alto consumo detectado:</span> La
            climatización en sala ha estado activa 12 horas
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnergyCard
          title="Consumo actual"
          value="3.2"
          unit="kWh"
          icon={Zap}
          trend={-15}
          color="#4CAF50"
          delay={0.2}
        />
        <EnergyCard
          title="Emisiones CO₂"
          value="42"
          unit="kg"
          icon={Leaf}
          trend={-23}
          color="#66BB6A"
          delay={0.3}
        />
        <EnergyCard
          title="Costo estimado"
          value="$156"
          unit="MXN"
          icon={DollarSign}
          trend={-18}
          color="#81C784"
          delay={0.4}
        />
      </div>

      {/* Gráfico de consumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Consumo de hoy</h3>
              <p className="text-muted-foreground">
                En tiempo real • Últimas 24 horas
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Día
              </Button>
              <Button variant="ghost" size="sm">
                Semana
              </Button>
              <Button variant="ghost" size="sm">
                Mes
              </Button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
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
                stroke="#4CAF50"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorKwh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Tips personalizados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-br from-[#4CAF50]/10 to-[#66BB6A]/10 border-[#4CAF50]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#4CAF50]">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-[#4CAF50]">Tip de ahorro</h3>
              <p className="text-muted-foreground mb-4">
                Ajustar la temperatura del aire acondicionado a 24°C puede
                ahorrarte hasta $45 MXN al mes. Tu temperatura actual promedio
                es 21°C.
              </p>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]">
                Aplicar ajuste automático
              </Button>
            </div>
          </div>
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
          <div className="text-[2rem] leading-none mb-2">8</div>
          <p className="text-muted-foreground">Dispositivos activos</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#4CAF50]">
            156
          </div>
          <p className="text-muted-foreground">kWh este mes</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#66BB6A]">
            23%
          </div>
          <p className="text-muted-foreground">Ahorro logrado</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[2rem] leading-none mb-2 text-[#81C784]">
            12
          </div>
          <p className="text-muted-foreground">Logros desbloqueados</p>
        </Card>
      </motion.div>
    </div>
  );
}
