import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";

import TransportForm from "@/components/dataEntry/TransportForm";
import WarehouseForm from "@/components/dataEntry/WarehouseForm";
import PackagingForm from "@/components/dataEntry/PackagingForm";
import WasteForm from "@/components/dataEntry/WasteForm";
import EnergyForm from "@/components/dataEntry/EnergyForm";
import PrintingForm from "@/components/dataEntry/PrintingForm";

const DataEntryForm = () => {
  const navigate = useNavigate();
  const {currentData,
    updateTransportData,
    updateWarehouseData,
    updatePackagingData,
    updateWasteData,
    updateEnergyData,
    updatePrintingData,
  } = useData();

  const handleSaveAll = () => {
    updateTransportData(currentData.transport);
    updateWarehouseData(currentData.warehouse);
    updatePackagingData(currentData.packaging);
    updateWasteData(currentData.waste);
    updateEnergyData(currentData.energy);
    updatePrintingData(currentData.printing);
  };

 


  const handleProceedToCalculation = () => {
    handleSaveAll();
    navigate("/calculation");
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Saisie des données</h1>
        <p className="text-muted-foreground">
          Remplissez les formulaires ci-dessous pour saisir vos données d'émission de CO2
        </p>
      </div>

      <Tabs defaultValue="transport" className="mb-8">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="warehouse">Entrepôt</TabsTrigger>
          <TabsTrigger value="packaging">Emballage</TabsTrigger>
          <TabsTrigger value="waste">Déchets</TabsTrigger>
          <TabsTrigger value="energy">Énergie</TabsTrigger>
          <TabsTrigger value="printing">Impression</TabsTrigger>
        </TabsList>

        <TransportForm />
        <WarehouseForm />
        <PackagingForm />
        <WasteForm />
        <EnergyForm />
        <PrintingForm />
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleSaveAll} className="flex items-center gap-2">
          <Save className="h-4 w-4" /> Enregistrer toutes les données
        </Button>
        <Button onClick={handleProceedToCalculation} className="flex items-center gap-2">
          Lancer le calcul <ArrowRight className="h-4 w-4" />
        </Button>
        
 
      </div>
    </div>
  );
};

export default DataEntryForm;
