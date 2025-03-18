import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "@/services/authService"; // Ensure this function is defined in your authService

export default function RegisterAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  console.log("RegisterAdmin Component Rendered");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin(email, password, role);
      alert(`${role} registered successfully!`);
      navigate("/login"); // Redirect after registration
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-8 p-6 rounded-xl border border-gray-800 bg-black shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Register Admin</h1>
          <p className="text-sm text-gray-400">
            Enter details to register a new admin
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Email input */}
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
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
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
                required
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

          {/* Role selector */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">
              Role
            </Label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-black text-white border-gray-800 rounded border pl-3 pr-10 py-2"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Register button */}
          <Button
            type="submit"
            className="w-full bg-white text-black rounded border hover:bg-gray-200"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
