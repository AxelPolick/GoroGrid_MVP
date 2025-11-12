import { motion } from "motion/react";
import { AchievementBadge } from "./AchievementBadge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import {
  User,
  Leaf,
  Trophy,
  TrendingDown,
  Zap,
  Heart,
  Target,
  Star,
  Moon,
  Bell,
  Shield,
  Settings,
  DollarSign,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";

const consumptionData = [
  { name: "Climatización", value: 45, color: "#7C4DFF" },
  { name: "Iluminación", value: 20, color: "#9575CD" },
  { name: "Electrodomésticos", value: 25, color: "#B39DDB" },
  { name: "Entretenimiento", value: 10, color: "#D1C4E9" },
];

interface ProfileScreenProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function ProfileScreen({ userName = "Usuario", userEmail = "usuario@gorogrid.com", onLogout }: ProfileScreenProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Preferencias del modelo
  const [tarifaKwh, setTarifaKwh] = useState("0.25");
  const [co2Factor, setCo2Factor] = useState("0.233");

  // Cargar preferencias al montar el componente
  useEffect(() => {
    const prefs = localStorage.getItem("gorogrid_preferences");
    if (prefs) {
      const { tarifa_kwh, co2_factor } = JSON.parse(prefs);
      setTarifaKwh(tarifa_kwh.toString());
      setCo2Factor(co2_factor.toString());
    }
  }, []);

  // Guardar preferencias
  const handleSavePreferences = () => {
    const preferences = {
      tarifa_kwh: parseFloat(tarifaKwh),
      co2_factor: parseFloat(co2Factor),
    };
    localStorage.setItem("gorogrid_preferences", JSON.stringify(preferences));
    toast.success("Preferencias guardadas", {
      description: "Tus preferencias han sido actualizadas correctamente",
    });
  };
  
  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header del perfil */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-[#7C4DFF] text-white text-[2rem]">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="mb-0">{userName}</h2>
                <Badge className="bg-[#7C4DFF]">
                  <Star className="w-3 h-3 mr-1" />
                  Eco Master
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">
                {userEmail}
              </p>
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-muted-foreground">Miembro desde</p>
                  <p>Enero 2024</p>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div>
                  <p className="text-muted-foreground">Edificio</p>
                  <p>Torre Verde, Piso 12</p>
                </div>
              </div>
            </div>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Editar perfil
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Métricas de impacto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="mb-4">Tu impacto ambiental</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 text-center bg-gradient-to-br from-[#7C4DFF]/10 to-transparent">
            <Leaf className="w-8 h-8 text-[#7C4DFF] mx-auto mb-3" />
            <div className="text-[2rem] leading-none mb-2 text-[#7C4DFF]">
              342
            </div>
            <p className="text-muted-foreground">kg CO₂ evitados</p>
          </Card>

          <Card className="p-5 text-center bg-gradient-to-br from-[#9575CD]/10 to-transparent">
            <TrendingDown className="w-8 h-8 text-[#9575CD] mx-auto mb-3" />
            <div className="text-[2rem] leading-none mb-2 text-[#9575CD]">
              23%
            </div>
            <p className="text-muted-foreground">Reducción mensual</p>
          </Card>

          <Card className="p-5 text-center bg-gradient-to-br from-[#B39DDB]/10 to-transparent">
            <Zap className="w-8 h-8 text-[#B39DDB] mx-auto mb-3" />
            <div className="text-[2rem] leading-none mb-2 text-[#B39DDB]">
              1,234
            </div>
            <p className="text-muted-foreground">kWh ahorrados</p>
          </Card>

          <Card className="p-5 text-center bg-gradient-to-br from-[#D1C4E9]/10 to-transparent">
            <Heart className="w-8 h-8 text-[#D1C4E9] mx-auto mb-3" />
            <div className="text-[2rem] leading-none mb-2 text-[#D1C4E9]">
              8
            </div>
            <p className="text-muted-foreground">Árboles equivalentes</p>
          </Card>
        </div>
      </motion.div>

      {/* Distribución de consumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="p-6">
          <h3 className="mb-4">Distribución de consumo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={consumptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {consumptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="mb-0">Objetivos mensuales</h3>
            <Badge className="bg-[#7C4DFF]">
              <Target className="w-3 h-3 mr-1" />
              2/3 completados
            </Badge>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Reducir consumo 20%</span>
                <span className="text-[#7C4DFF]">23%</span>
              </div>
              <Progress value={100} className="h-2 bg-[#7C4DFF]/20" />
              <p className="text-muted-foreground mt-1">✓ Completado</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Ahorrar 100 kWh</span>
                <span className="text-[#7C4DFF]">78 kWh</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-muted-foreground mt-1">
                Faltan 22 kWh para completar
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>5 días sin alertas</span>
                <span className="text-[#7C4DFF]">3/5 días</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-muted-foreground mt-1">
                2 días más sin alertas
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Logros gamificados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="mb-0">Logros desbloqueados</h3>
          <Badge variant="outline">12/24 logros</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AchievementBadge
            title="Primer Ahorro"
            description="Reducir el consumo por primera vez"
            icon={Trophy}
            unlocked={true}
            delay={0.4}
          />
          <AchievementBadge
            title="Eco Guerrero"
            description="20% de reducción en un mes"
            icon={Leaf}
            unlocked={true}
            delay={0.45}
          />
          <AchievementBadge
            title="Maestro de la Eficiencia"
            description="30 días sin alertas de alto consumo"
            icon={Star}
            unlocked={false}
            delay={0.5}
          />
          <AchievementBadge
            title="Guardián Nocturno"
            description="Optimizar consumo nocturno 15 días"
            icon={Moon}
            unlocked={false}
            delay={0.55}
          />
        </div>
      </motion.div>

      {/* Preferencias de modelo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="mb-4">Preferencias de modelo</h3>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="tarifa_kwh">Tarifa kWh (MXN)</Label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-5 h-5 text-[#7C4DFF]" />
                <Input
                  id="tarifa_kwh"
                  type="number"
                  step="0.01"
                  value={tarifaKwh}
                  onChange={(e) => setTarifaKwh(e.target.value)}
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground mt-1">
                Costo por kWh en tu localidad
              </p>
            </div>

            <div>
              <Label htmlFor="co2_factor">Factor CO₂ (kg/kWh)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Leaf className="w-5 h-5 text-[#7C4DFF]" />
                <Input
                  id="co2_factor"
                  type="number"
                  step="0.001"
                  value={co2Factor}
                  onChange={(e) => setCo2Factor(e.target.value)}
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground mt-1">
                kg de CO₂ por kWh consumido
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSavePreferences}
            className="bg-[#7C4DFF] hover:bg-[#6A3DE8]"
          >
            Guardar preferencias
          </Button>
        </Card>
      </motion.div>

      {/* Preferencias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="mb-4">Preferencias</h3>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#7C4DFF]" />
                <div>
                  <p className="mb-0">Modo oscuro automático</p>
                  <p className="text-muted-foreground">
                    Activar según horario solar
                  </p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#7C4DFF]" />
                <div>
                  <p className="mb-0">Notificaciones push</p>
                  <p className="text-muted-foreground">
                    Alertas y tips de ahorro
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#7C4DFF]" />
                <div>
                  <p className="mb-0">Seguridad</p>
                  <p className="text-muted-foreground">Protección de datos habilitada</p>
                </div>
              </div>
              <Badge className="bg-[#7C4DFF]">Activo</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Acciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3"
      >
        <Button variant="outline">Compartir progreso</Button>
        <Button variant="outline">Descargar reporte</Button>
        <Button 
          variant="outline" 
          className="text-destructive border-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          Salir
        </Button>
      </motion.div>
    </div>
  );
}