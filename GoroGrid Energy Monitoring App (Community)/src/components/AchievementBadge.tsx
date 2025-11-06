import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { LucideIcon } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  delay?: number;
}

export function AchievementBadge({
  title,
  description,
  icon: Icon,
  unlocked,
  delay = 0,
}: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      className={`p-4 rounded-xl border-2 ${
        unlocked
          ? "bg-[#4CAF50]/10 border-[#4CAF50]"
          : "bg-muted/50 border-border opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            unlocked ? "bg-[#4CAF50]/20" : "bg-muted"
          }`}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: unlocked ? "#4CAF50" : "#9e9e9e" }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="mb-0">{title}</h4>
            {unlocked && (
              <Badge variant="outline" className="bg-[#4CAF50] text-white border-0">
                ✓
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
