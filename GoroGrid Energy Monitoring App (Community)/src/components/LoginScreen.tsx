import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Zap, Mail, Fingerprint, Chrome, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { toast } from "sonner@2.0.3";

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");

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

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    mode: "onSubmit",
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    watch: watchRegister,
    reset: resetRegister,
  } = useForm<RegisterFormData>({
    mode: "onSubmit",
  });

  // Manejo del login
  const onSubmitLogin = (data: LoginFormData) => {
    setError("");
    
    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem("gorogrid_users") || "[]");
    
    // Buscar usuario
    const user = users.find(
      (u: any) => u.email === data.email && u.password === data.password
    );

    if (user) {
      // Login exitoso
      localStorage.setItem("gorogrid_current_user", JSON.stringify(user));
      onLogin({ name: user.name, email: user.email });
    } else {
      setError("Email o contraseña incorrectos");
    }
  };

  // Manejo del registro
  const onSubmitRegister = (data: RegisterFormData) => {
    setError("");

    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem("gorogrid_users") || "[]");

    // Verificar si el email ya existe
    const existingUser = users.find((u: any) => u.email === data.email);

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
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date().toISOString(),
    };

    // Guardar en localStorage
    users.push(newUser);
    localStorage.setItem("gorogrid_users", JSON.stringify(users));
    localStorage.setItem("gorogrid_current_user", JSON.stringify(newUser));

    toast.success("¡Cuenta creada exitosamente!", {
      description: `Bienvenido a GoroGrid, ${data.name}`,
    });

    // Login automático
    onLogin({ name: newUser.name, email: newUser.email });
  };

  // Login rápido con biometría o social (simula login con usuario demo)
  const handleQuickLogin = () => {
    const demoUser = {
      id: "demo",
      name: "Miguel Rodríguez",
      email: "miguel.rodriguez@gorogrid.com",
    };
    localStorage.setItem("gorogrid_current_user", JSON.stringify(demoUser));
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50]/10 via-background to-[#4CAF50]/5 flex items-center justify-center p-4">
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
            <div className="bg-[#4CAF50] p-4 rounded-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="mb-2 text-[#4CAF50]">GoroGrid</h1>
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

          {/* Autenticación Biométrica y Social */}
          {mode === "login" && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleQuickLogin}
                  variant="outline"
                  className="w-full mb-4 h-12 border-[#4CAF50] hover:bg-[#4CAF50]/10"
                >
                  <Fingerprint className="w-5 h-5 mr-2 text-[#4CAF50]" />
                  Iniciar con biometría
                </Button>
              </motion.div>

              <div className="flex items-center gap-4 my-6">
                <Separator className="flex-1" />
                <span className="text-muted-foreground">o continúa con</span>
                <Separator className="flex-1" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 mb-6"
              >
                <Button
                  onClick={handleQuickLogin}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Google
                </Button>
                <Button
                  onClick={handleQuickLogin}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </Button>
              </motion.div>
            </>
          )}

          {/* Formulario de Login */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLoginSubmit(onSubmitLogin)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    className={`h-12 mt-1 ${loginErrors.email ? "border-destructive" : ""}`}
                    {...loginRegister("email", {
                      required: "El email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {loginErrors.email && (
                    <p className="text-destructive mt-1">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className={`h-12 mt-1 ${loginErrors.password ? "border-destructive" : ""}`}
                    {...loginRegister("password", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 6,
                        message: "Mínimo 6 caracteres",
                      },
                    })}
                  />
                  {loginErrors.password && (
                    <p className="text-destructive mt-1">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4CAF50] hover:bg-[#45a049]"
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
                onSubmit={handleRegisterSubmit(onSubmitRegister)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="register-name">Nombre completo</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Juan Pérez"
                    className={`h-12 mt-1 ${registerErrors.name ? "border-destructive" : ""}`}
                    {...registerRegister("name", {
                      required: "El nombre es requerido",
                      minLength: {
                        value: 3,
                        message: "Mínimo 3 caracteres",
                      },
                    })}
                  />
                  {registerErrors.name && (
                    <p className="text-destructive mt-1">
                      {registerErrors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    className={`h-12 mt-1 ${registerErrors.email ? "border-destructive" : ""}`}
                    {...registerRegister("email", {
                      required: "El email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {registerErrors.email && (
                    <p className="text-destructive mt-1">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    className={`h-12 mt-1 ${registerErrors.password ? "border-destructive" : ""}`}
                    {...registerRegister("password", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 6,
                        message: "Mínimo 6 caracteres",
                      },
                    })}
                  />
                  {registerErrors.password && (
                    <p className="text-destructive mt-1">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="register-confirm-password">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className={`h-12 mt-1 ${registerErrors.confirmPassword ? "border-destructive" : ""}`}
                    {...registerRegister("confirmPassword", {
                      required: "Confirma tu contraseña",
                      validate: (value) =>
                        value === watchRegister("password") || "Las contraseñas no coinciden",
                    })}
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-destructive mt-1">
                      {registerErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4CAF50] hover:bg-[#45a049]"
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
                  onClick={() => {
                    setMode("register");
                    setError("");
                    resetLogin();
                  }}
                  className="text-[#4CAF50] hover:underline"
                  type="button"
                >
                  Regístrate ahora
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                    resetRegister();
                  }}
                  className="text-[#4CAF50] hover:underline"
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
            className="mt-6 p-4 rounded-lg bg-[#4CAF50]/10 border border-[#4CAF50]/20"
          >
            <p className="text-center mb-2">🔑 Credenciales de prueba:</p>
            <div className="text-center text-muted-foreground space-y-1">
              <p>Email: <span className="text-[#4CAF50]">miguel@demo.com</span></p>
              <p>Contraseña: <span className="text-[#4CAF50]">123456</span></p>
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-muted-foreground mt-6"
        >
          🌿 Empieza a ahorrar energía hoy
        </motion.p>
      </motion.div>
    </div>
  );
}
