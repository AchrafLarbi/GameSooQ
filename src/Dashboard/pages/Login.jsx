import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAdmin } from "@/services/authService";
import { loginSuccess } from "@/features/authSlice";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/operation");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        uid,
        email: firebaseEmail,
        role,
      } = await loginAdmin(email, password);

      dispatch(loginSuccess({ user: { uid, email: firebaseEmail }, role }));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", role);
      localStorage.setItem("email", firebaseEmail);

      navigate("/operation");
    } catch (error) {
      setErrorMessage("Échec de connexion. Vérifiez vos identifiants.");
      console.error("Login failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-8 p-6 rounded-xl border border-gray-800 bg-black shadow-lg">
        {/* Error Message Popup */}
        {errorMessage && (
          <div className="flex items-center justify-between p-3 mb-4 bg-red-600 text-white rounded">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage("")}>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Connexion Admin</h1>
          <p className="text-sm text-gray-400">
            Entrez vos identifiants pour accéder au tableau de bord
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black border-gray-800 text-white rounded border placeholder:text-gray-500 focus-visible:ring-gray-700"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Mot de passe
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-black border-gray-800 rounded border text-white placeholder:text-gray-500 focus-visible:ring-gray-700"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black rounded border hover:bg-gray-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
