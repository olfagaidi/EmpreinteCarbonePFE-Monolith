import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "../ui/sonner";

const LoginPage = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const success = await login(email, password);
  
      const storedUser = localStorage.getItem("user");
      console.log("Donnée brute depuis localStorage :", storedUser);
      let user = null;
  
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
          console.log("Utilisateur connecté :", user);
          console.log("Rôle :", user.role);
          console.log(" Is_Verified =", user.Is_Verified);
        } catch (error) {
          console.error("Erreur lors du parsing de l'utilisateur :", error);
          localStorage.removeItem("user");
        }
      }
  
      if (user) {
        const isVerified =
             user?.Is_Verified === true ||
             user?.isVerified === true ||
             user?.Is_Verified === 1 ||
             user?.isVerified === 1;
        if ( !user.Is_Verified) {
          toast.info("Première connexion détectée. Veuillez changer votre mot de passe.");
          navigate("/password-change");
          return;
        }
  
        if (user.role === "admin") {
          navigate("/home");
          return;
        } else {
          navigate("/home");
          return;
        }
      }
  
      
    } finally {
      setIsLoading(false);
    }
  };
  
  

   return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Carbon Footprint-TraLIS</h1>
          <p className="text-muted-foreground">Module de calcul d'empreinte carbone</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder au module d'empreinte carbone
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
