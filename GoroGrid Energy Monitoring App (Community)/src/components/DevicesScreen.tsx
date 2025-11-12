import { motion } from "motion/react";
import { useState } from "react";
import { DeviceCard } from "./DeviceCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Lightbulb,
  AirVent,
  Tv,
  Refrigerator,
  WashingMachine,
  Coffee,
  Fan,
  Monitor,
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  room: string;
  status: boolean;
  consumption: string;
  icon: any;
}

export function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Luces Sala",
      room: "Sala de estar",
      status: true,
      consumption: "45W",
      icon: Lightbulb,
    },
    {
      id: "2",
      name: "Aire Acondicionado",
      room: "Sala de estar",
      status: true,
      consumption: "1.2 kW",
      icon: AirVent,
    },
    {
      id: "3",
      name: "TV 55''",
      room: "Sala de estar",
      status: true,
      consumption: "120W",
      icon: Tv,
    },
    {
      id: "4",
      name: "Refrigerador",
      room: "Cocina",
      status: true,
      consumption: "150W",
      icon: Refrigerator,
    },
    {
      id: "5",
      name: "Cafetera",
      room: "Cocina",
      status: false,
      consumption: "0W",
      icon: Coffee,
    },
    {
      id: "6",
      name: "Lavadora",
      room: "Lavandería",
      status: false,
      consumption: "0W",
      icon: WashingMachine,
    },
    {
      id: "7",
      name: "Ventilador",
      room: "Habitación principal",
      status: true,
      consumption: "60W",
      icon: Fan,
    },
    {
      id: "8",
      name: "PC Escritorio",
      room: "Oficina",
      status: true,
      consumption: "200W",
      icon: Monitor,
    },
  ]);

  const [filter, setFilter] = useState<string>("all");

  const toggleDevice = (id: string) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, status: !device.status } : device
      )
    );
  };

  const activeDevices = devices.filter((d) => d.status).length;
  const totalConsumption = devices.reduce((acc, device) => {
    if (!device.status) return acc;
    const value = parseFloat(device.consumption.replace(/[^\d.]/g, ""));
    const unit = device.consumption.includes("kW") ? 1000 : 1;
    return acc + value * unit;
  }, 0);

  const filteredDevices =
    filter === "all"
      ? devices
      : filter === "active"
        ? devices.filter((d) => d.status)
        : devices.filter((d) => !d.status);

  const rooms = Array.from(new Set(devices.map((d) => d.room)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2">Dispositivos conectados</h1>
        <p className="text-muted-foreground">
          Controla y monitorea todos tus dispositivos
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl bg-[#7C4DFF]/10 border border-[#7C4DFF]">
          <div className="text-[2rem] leading-none mb-1 text-[#7C4DFF]">
            {activeDevices}
          </div>
          <p className="text-muted-foreground">Dispositivos activos</p>
        </div>
        <div className="p-4 rounded-xl bg-card border">
          <div className="text-[2rem] leading-none mb-1">
            {devices.length}
          </div>
          <p className="text-muted-foreground">Total dispositivos</p>
        </div>
        <div className="p-4 rounded-xl bg-card border">
          <div className="text-[2rem] leading-none mb-1">
            {(totalConsumption / 1000).toFixed(2)}
          </div>
          <p className="text-muted-foreground">kW en uso ahora</p>
        </div>
        <div className="p-4 rounded-xl bg-card border">
          <div className="text-[2rem] leading-none mb-1">{rooms.length}</div>
          <p className="text-muted-foreground">Habitaciones</p>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={
            filter === "all" ? "bg-[#7C4DFF] hover:bg-[#6A3DE8]" : ""
          }
        >
          Todos
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
          className={
            filter === "active" ? "bg-[#7C4DFF] hover:bg-[#6A3DE8]" : ""
          }
        >
          Activos
          <Badge className="ml-2 bg-white text-[#7C4DFF]">
            {activeDevices}
          </Badge>
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          onClick={() => setFilter("inactive")}
          className={
            filter === "inactive" ? "bg-[#7C4DFF] hover:bg-[#6A3DE8]" : ""
          }
        >
          Inactivos
          <Badge className="ml-2 bg-white text-[#7C4DFF]">
            {devices.length - activeDevices}
          </Badge>
        </Button>
      </motion.div>

      {/* Lista de dispositivos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <DeviceCard
              name={device.name}
              room={device.room}
              status={device.status}
              consumption={device.consumption}
              icon={device.icon}
              onToggle={() => toggleDevice(device.id)}
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
            setDevices(devices.map((d) => ({ ...d, status: false })))
          }
        >
          Apagar todos
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setDevices(devices.map((d) => ({ ...d, status: true })))
          }
        >
          Encender todos
        </Button>
        <Button variant="outline" className="border-[#7C4DFF] text-[#7C4DFF]">
          Modo Eco activado ✓
        </Button>
      </motion.div>
    </div>
  );
}