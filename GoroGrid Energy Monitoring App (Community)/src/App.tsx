import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";
import { DevicesScreen } from "./components/DevicesScreen";
import { RoomScreen } from "./components/RoomScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import {
  Home,
  Cpu,
  Grid3x3,
  User,
  Menu,
  X,
  Zap,
  Moon,
  Sun,
} from "lucide-react";

type Screen = "login" | "dashboard" | "devices" | "rooms" | "profile";

interface UserData {
  name: string;
  email: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "Usuario",
    email: "usuario@gorogrid.com",
  });

  // Verificar si hay una sesión activa
  useEffect(() => {
    const currentUser = localStorage.getItem("gorogrid_current_user");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserData({ name: user.name, email: user.email });
      setIsAuthenticated(true);
      setCurrentScreen("dashboard");
    }
  }, []);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    setIsAuthenticated(true);
    setCurrentScreen("dashboard");
    toast.success(`¡Bienvenido, ${user.name}!`, {
      description: "Has iniciado sesión correctamente",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("gorogrid_current_user");
    setIsAuthenticated(false);
    setCurrentScreen("login");
    toast.info("Sesión cerrada", {
      description: "Hasta pronto, esperamos verte de nuevo",
    });
  };

  // Auto dark mode based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 7) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const navItems = [
    { id: "dashboard" as Screen, label: "Dashboard", icon: Home },
    { id: "devices" as Screen, label: "Dispositivos", icon: Cpu },
    { id: "rooms" as Screen, label: "Habitaciones", icon: Grid3x3 },
    { id: "profile" as Screen, label: "Perfil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-[#4CAF50] p-2 rounded-xl"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="mb-0 text-[#4CAF50]">GoroGrid</h2>
                <p className="text-muted-foreground hidden md:block">
                  Energía Inteligente
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => setCurrentScreen(item.id)}
                    className={
                      isActive
                        ? "bg-[#4CAF50] hover:bg-[#45a049]"
                        : "hover:bg-[#4CAF50]/10"
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* User Info, Dark Mode Toggle & Mobile Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 mr-2 px-3 py-1 rounded-lg bg-[#4CAF50]/10">
                <User className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-[#4CAF50]">{userData.name}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hover:bg-[#4CAF50]/10"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-[#4CAF50]/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-card"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-[#4CAF50] hover:bg-[#45a049]"
                        : "hover:bg-[#4CAF50]/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreen === "dashboard" && <Dashboard userName={userData.name} />}
            {currentScreen === "devices" && <DevicesScreen />}
            {currentScreen === "rooms" && <RoomScreen />}
            {currentScreen === "profile" && (
              <ProfileScreen 
                userName={userData.name} 
                userEmail={userData.email}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#4CAF50] p-2 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="mb-0">GoroGrid © 2025</p>
                <p className="text-muted-foreground">
                  Optimización energética inteligente
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <button className="hover:text-[#4CAF50] transition-colors">
                Ayuda
              </button>
              <button className="hover:text-[#4CAF50] transition-colors">
                Privacidad
              </button>
              <button className="hover:text-[#4CAF50] transition-colors">
                Términos
              </button>
              <button className="hover:text-[#4CAF50] transition-colors">
                Soporte
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
