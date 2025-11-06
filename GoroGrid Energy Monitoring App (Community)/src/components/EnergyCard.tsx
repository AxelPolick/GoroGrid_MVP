import { motion } from "motion/react";
import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface EnergyCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: number;
  color?: string;
  delay?: number;
}

export function EnergyCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color = "#4CAF50",
  delay = 0,
}: EnergyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[2rem] leading-none" style={{ color }}>
                {value}
              </span>
              <span className="text-muted-foreground">{unit}</span>
            </div>
            {trend !== undefined && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.3 }}
                className={`mt-2 ${
                  trend < 0 ? "text-[#4CAF50]" : "text-[#f44336]"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend}% vs mes anterior
              </motion.p>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
