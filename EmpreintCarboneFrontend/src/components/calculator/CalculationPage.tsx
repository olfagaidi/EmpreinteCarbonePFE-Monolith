import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";
import { BarChart, FileText, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CarbonFootprint } from "@/models";

const CalculationPage = () => {
  const { currentData, calculateFootprint, currentFootprint } = useData();
  const navigate = useNavigate();

  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [calculationDone, setCalculationDone] = useState(false);
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(currentFootprint);

  const hasData = () => {
    return (
      currentData.transport.length > 0 ||
      currentData.warehouse.length > 0 ||
      currentData.packaging.length > 0 ||
      currentData.waste.length > 0 ||
      currentData.energy.length > 0 ||
      currentData.printing.length > 0
    );
  };

  const handleStartCalculation = async () => {
    if (!hasData()) {
      toast.error("Aucune donnée disponible pour le calcul");
      return;
    }

    setIsCalculating(true);
    setProgress(0);
    setCalculationDone(false);

    // Simulation de progression
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    try {
      // Appel de la fonction de calcul
      const result = await calculateFootprint();
      setFootprint(result);
      setCalculationDone(true);
      clearInterval(progressInterval);
      setProgress(100);
      toast.success("Calcul de l'empreinte carbone terminé avec succès");
    } catch (error) {
      console.error("Erreur lors du calcul:", error);
      toast.error("Une erreur est survenue lors du calcul");
      clearInterval(progressInterval);
      setIsCalculating(false);
    }
  };

  const handleViewResults = () => {
    navigate("/visualization");
  };

  const handleGenerateReport = () => {
    navigate("/reports");
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Calcul de l'empreinte carbone</h1>
        <p className="text-muted-foreground">
          Lancez le calcul de votre empreinte carbone basé sur les données fournies
        </p>
      </div>

      {!hasData() && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            Aucune donnée n'a été saisie. Veuillez d'abord saisir ou importer des données avant de lancer le calcul.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>État des données</CardTitle>
          <CardDescription>
            Vérifiez les données disponibles pour le calcul
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Données de transport</span>
              <span className="text-sm font-medium">
                {currentData.transport.length} entrée(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Données d'entrepôt</span>
              <span className="text-sm font-medium">
                {currentData.warehouse.length} entrée(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Données d'emballage</span>
              <span className="text-sm font-medium">
                {currentData.packaging.length} entrée(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Données de déchets</span>
              <span className="text-sm font-medium">
                {currentData.waste.length} entrée(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Données d'énergie</span>
              <span className="text-sm font-medium">
                {currentData.energy.length} entrée(s)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Données d'impression</span>
              <span className="text-sm font-medium">
                {currentData.printing.length} entrée(s)
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStartCalculation}
            disabled={isCalculating || !hasData()}
            className="w-full"
          >
            {isCalculating ? "Calcul en cours..." : "Lancer le calcul"}
          </Button>
        </CardFooter>
      </Card>

      {isCalculating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progression du calcul</CardTitle>
            <CardDescription>
              Veuillez patienter pendant que nous calculons votre empreinte carbone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Initialisation</span>
                <span>Traitement des données</span>
                <span>Finalisation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {calculationDone && footprint && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>Calcul terminé</CardTitle>
            </div>
            <CardDescription>
              Le calcul de votre empreinte carbone est terminé. Voici un résumé des résultats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-2">Empreinte carbone totale</h3>
                <p className="text-3xl font-bold text-primary">
                  {footprint.totalEmission.toFixed(2)} <span className="text-base font-normal">kg CO2e</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Transport</h4>
                  <p className="text-lg font-semibold">
                    {footprint.transportEmissions.toFixed(2)} <span className="text-xs">kg CO2e</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Entrepôt</h4>
                  <p className="text-lg font-semibold">
                    {footprint.warehouseEmissions.toFixed(2)} <span className="text-xs">kg CO2e</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Emballage</h4>
                  <p className="text-lg font-semibold">
                    {footprint.packagingEmissions.toFixed(2)} <span className="text-xs">kg CO2e</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Déchets</h4>
                  <p className="text-lg font-semibold">
                    {footprint.wasteEmissions.toFixed(2)} <span className="text-xs">kg CO2e</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Énergie</h4>
                  <p className="text-lg font-semibold">
                    {footprint.energyEmissions.toFixed(2)} <span className="text-xs">kg CO2e</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Impression</h4>
                  <p className="text-lg font-semibold">
                    {footprint.printingEmissions.toFixed(2)} <span className="text-xs">kg CO2e</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="text-sm font-medium mb-1">Date du calcul</h4>
                  <p className="text-sm">
                    {new Date(footprint.calculationDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleViewResults} 
              className="w-full sm:w-auto flex items-center gap-2"
              variant="default"
            >
              <BarChart className="h-4 w-4" /> Visualiser les résultats
            </Button>
            <Button 
              onClick={handleGenerateReport} 
              className="w-full sm:w-auto flex items-center gap-2"
              variant="outline"
            >
              <FileText className="h-4 w-4" /> Générer un rapport
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-2">Méthodologie de calcul</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Le calcul de l'empreinte carbone est réalisé selon les normes du GHG Protocol :
        </p>
        <ul className="text-xs list-disc list-inside space-y-1">
          <li>Scope 1 : Émissions directes (transport, chauffage)</li>
          <li>Scope 2 : Émissions indirectes liées à l'énergie</li>
          <li>Scope 3 : Autres émissions indirectes (emballages, déchets)</li>
        </ul>
      </div>
    </div>
  );
};

export default CalculationPage;