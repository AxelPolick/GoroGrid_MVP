import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { LucideIcon } from "lucide-react";

interface DeviceCardProps {
  name: string;
  room: string;
  status: boolean;
  consumption: string;
  icon: LucideIcon;
  onToggle: () => void;
  color?: string;
}

export function DeviceCard({
  name,
  room,
  status,
  consumption,
  icon: Icon,
  onToggle,
  color = "#4CAF50",
}: DeviceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 ${status ? "border-[#4CAF50]" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: status ? `${color}20` : "#e0e0e0",
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: status ? color : "#9e9e9e" }}
              />
            </div>
            <div>
              <h4 className="mb-0">{name}</h4>
              <p className="text-muted-foreground">{room}</p>
            </div>
          </div>
          <Switch checked={status} onCheckedChange={onToggle} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Consumo</span>
          <span style={{ color: status ? color : "#9e9e9e" }}>
            {consumption}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
