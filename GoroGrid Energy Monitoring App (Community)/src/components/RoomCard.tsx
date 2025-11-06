import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { LucideIcon } from "lucide-react";

interface RoomCardProps {
  name: string;
  temperature: number;
  targetTemp: number;
  consumption: string;
  icon: LucideIcon;
  onTempChange: (temp: number) => void;
}

export function RoomCard({
  name,
  temperature,
  targetTemp,
  consumption,
  icon: Icon,
  onTempChange,
}: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#4CAF50]/20">
              <Icon className="w-6 h-6 text-[#4CAF50]" />
            </div>
            <div>
              <h3 className="mb-1">{name}</h3>
              <p className="text-muted-foreground">{consumption}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[2rem] leading-none text-[#4CAF50]">
              {temperature}°
            </div>
            <p className="text-muted-foreground">Actual</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Temperatura objetivo</span>
            <span className="text-[#4CAF50]">{targetTemp}°C</span>
          </div>
          <Slider
            value={[targetTemp]}
            onValueChange={(value) => onTempChange(value[0])}
            min={16}
            max={30}
            step={0.5}
            className="w-full"
          />
        </div>
      </Card>
    </motion.div>
  );
}
