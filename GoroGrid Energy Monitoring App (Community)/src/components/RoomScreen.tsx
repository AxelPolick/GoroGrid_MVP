import { motion } from "motion/react";
import { useState } from "react";
import { RoomCard } from "./RoomCard";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Home,
  Bed,
  Utensils,
  Monitor,
  Sofa,
  TrendingDown,
  Award,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  temperature: number;
  targetTemp: number;
  consumption: string;
  icon: any;
}

export function RoomScreen() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Sala de estar",
      temperature: 22,
      targetTemp: 24,
      consumption: "1.4 kWh/día",
      icon: Sofa,
    },
    {
      id: "2",
      name: "Habitación principal",
      temperature: 21,
      targetTemp: 22,
      consumption: "0.8 kWh/día",
      icon: Bed,
    },
    {
      id: "3",
      name: "Cocina",
      temperature: 24,
      targetTemp: 23,
      consumption: "2.1 kWh/día",
      icon: Utensils,
    },
    {
      id: "4",
      name: "Oficina",
      temperature: 23,
      targetTemp: 24,
      consumption: "1.2 kWh/día",
      icon: Monitor,
    },
  ]);

  const updateRoomTemp = (id: string, newTemp: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === id ? { ...room, targetTemp: newTemp } : room
      )
    );
  };

  const totalConsumption = rooms.reduce((acc, room) => {
    return acc + parseFloat(room.consumption.replace(/[^\d.]/g, ""));
  }, 0);

  const avgTemp =
    rooms.reduce((acc, room) => acc + room.temperature, 0) / rooms.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2">Control por habitación</h1>
        <p className="text-muted-foreground">
          Ajusta temperatura y monitorea consumo individual
        </p>
      </motion.div>

      {/* Resumen general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-[#4CAF50]/10 to-[#66BB6A]/10 border-[#4CAF50]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5 text-[#4CAF50]" />
                <h3 className="mb-0">Resumen del hogar</h3>
              </div>
              <p className="text-muted-foreground">
                {rooms.length} habitaciones monitoreadas
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">
                Temperatura promedio
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[2rem] leading-none text-[#4CAF50]">
                  {avgTemp.toFixed(1)}°
                </span>
                <span className="text-muted-foreground">C</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Consumo total/día</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[2rem] leading-none text-[#4CAF50]">
                  {totalConsumption.toFixed(1)}
                </span>
                <span className="text-muted-foreground">kWh</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Objetivos de confort */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-[#4CAF50]" />
              <h4 className="mb-0">Objetivo de ahorro</h4>
            </div>
            <Badge className="bg-[#4CAF50]">En progreso</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Progreso mensual</span>
              <span className="text-[#4CAF50]">67%</span>
            </div>
            <Progress value={67} className="h-2" />
            <p className="text-muted-foreground">
              Faltan 2.4 kWh para alcanzar tu meta de ahorro
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#66BB6A]" />
              <h4 className="mb-0">Habitación destacada</h4>
            </div>
            <Badge variant="outline" className="border-[#66BB6A] text-[#66BB6A]">
              ⭐ TOP
            </Badge>
          </div>
          <div className="space-y-2">
            <p>
              <span className="text-[#66BB6A]">Oficina</span> ha reducido
              su consumo un 32% este mes
            </p>
            <p className="text-muted-foreground">
              Mantén la temperatura entre 23-24°C para continuar ahorrando
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Tarjetas de habitaciones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <RoomCard
              name={room.name}
              temperature={room.temperature}
              targetTemp={room.targetTemp}
              consumption={room.consumption}
              icon={room.icon}
              onTempChange={(temp) => updateRoomTemp(room.id, temp)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Acciones rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3"
      >
        <Button
          variant="outline"
          onClick={() =>
            setRooms(rooms.map((r) => ({ ...r, targetTemp: 24 })))
          }
        >
          Ajustar todas a 24°C
        </Button>
        <Button
          variant="outline"
          className="border-[#4CAF50] text-[#4CAF50]"
        >
          Modo Noche (22°C)
        </Button>
        <Button
          variant="outline"
          className="border-[#4CAF50] text-[#4CAF50]"
        >
          Modo Ahorro (26°C)
        </Button>
      </motion.div>
    </div>
  );
}
