import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Zap, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Crear usuarios demo si no existen
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("gorogrid_users") || "[]");
    if (users.length === 0) {
      const demoUsers = [
        {
          id: "1",
          name: "Miguel Rodríguez",
          email: "miguel@demo.com",
          password: "123456",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Ana García",
          email: "ana@demo.com",
          password: "123456",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("gorogrid_users", JSON.stringify(demoUsers));
    }
  }, []);

  // Manejo del login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!loginEmail || !loginPassword) {
      setError("Por favor completa todos los campos");
      return;
    }
    
    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem("gorogrid_users") || "[]");
    
    // Buscar usuario
    const user = users.find(
      (u: any) => u.email === loginEmail && u.password === loginPassword
    );

    if (user) {
      // Login exitoso
      localStorage.setItem("gorogrid_current_user", JSON.stringify(user));
      onLogin({ name: user.name, email: user.email });
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  // Manejo del registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (registerPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem("gorogrid_users") || "[]");

    // Verificar si el email ya existe
    const existingUser = users.find((u: any) => u.email === registerEmail);

    if (existingUser) {
      setError("Este correo ya está registrado");
      toast.error("Error", {
        description: "Este correo ya está registrado",
      });
      return;
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      createdAt: new Date().toISOString(),
    };

    // Guardar en localStorage
    users.push(newUser);
    localStorage.setItem("gorogrid_users", JSON.stringify(users));
    localStorage.setItem("gorogrid_current_user", JSON.stringify(newUser));

    toast.success("¡Cuenta creada exitosamente!", {
      description: `Bienvenido a GoroGrid, ${registerName}`,
    });

    // Login automático
    onLogin({ name: newUser.name, email: newUser.email });
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setError("");
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C4DFF]/10 via-background to-[#7C4DFF]/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl">
          {/* Logo y Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-[#7C4DFF] p-4 rounded-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="mb-2 text-[#7C4DFF]">GoroGrid</h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Optimiza tu consumo energético de forma inteligente"
                : "Crea tu cuenta y empieza a ahorrar"}
            </p>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formularios */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="login-email">Usuario</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#7C4DFF] hover:bg-[#6A3DE8]"
                >
                  Iniciar sesión
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="register-name">Nombre completo</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="register-confirm-password">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#7C4DFF] hover:bg-[#6A3DE8]"
                >
                  Crear cuenta
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Toggle entre Login y Registro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-muted-foreground mt-6"
          >
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => switchMode("register")}
                  className="text-[#7C4DFF] hover:underline"
                  type="button"
                >
                  Regístrate ahora
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-[#7C4DFF] hover:underline"
                  type="button"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </motion.p>
        </Card>

        {/* Credenciales de prueba */}
        {mode === "login" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 rounded-lg bg-[#7C4DFF]/10 border border-[#7C4DFF]/20"
          >
            <p className="text-center mb-2">🔑 Credenciales de prueba:</p>
            <div className="text-center text-muted-foreground space-y-1">
              <p>Email: <span className="text-[#7C4DFF]">miguel@demo.com</span></p>
              <p>Contraseña: <span className="text-[#7C4DFF]">123456</span></p>
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-muted-foreground mt-6"
        >
          ⚡ Empieza a ahorrar energía hoy
        </motion.p>
      </motion.div>
    </div>
  );
}
