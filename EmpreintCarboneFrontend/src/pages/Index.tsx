
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page de connexion
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Footprint-TraLIS</h1>
        <p className="text-xl text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
};

export default Index;
