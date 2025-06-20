
import React, { useState } from "react";
import { useEffect } from "react";
import { energyService } from "@/services/energyService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EnergyData} from "@/models";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";

const EnergyForm = () => {
const { currentData,  updateEnergyData } = useData();
const [energy, setEnergy] = useState<EnergyData[]>(currentData.energy);
const [selectedEnergy, setSelectedEnergy] = useState<EnergyData | null>(null);
const [isEditEnergyModalOpen, setIsEditEnergyModalOpen] = useState(false);
 const [newEnergy, setNewEnergy] = useState<EnergyData>({
    electricityConsumption: null,heatingConsumption: null,energyType: "",unit: "kWh",
  });
 useEffect(() => {
      const fetchEnergy = async () => {
      const data = await energyService.getAll();
      const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
      setEnergy(data.filter(item => item.UserId === myId));
};
fetchEnergy();
}, []);
const handleAddEnergy = async () => {
  if (!newEnergy.energyType || newEnergy.electricityConsumption === null || newEnergy.electricityConsumption <= 0) {
    toast.error("Veuillez remplir tous les champs obligatoires");
    return;
  }

  try {
    await energyService.create(newEnergy);

    const refreshed = await energyService.getAll();
    setEnergy(refreshed);
    updateEnergyData(refreshed);

    setNewEnergy({
      electricityConsumption: null,
      heatingConsumption: null,
      energyType: "",
      unit: "kWh",
    });

    toast.success("Données d'énergie ajoutées");
  } catch (error: any) {
    console.error("Erreur ajout énergie :", error);
    toast.error(`Erreur ajout : ${error.response?.data?.message || error.message}`);
  }
};

  const handleEditEnergy = async () => {
    if (!selectedEnergy ||!selectedEnergy.energyType ||selectedEnergy.electricityConsumption === null ||selectedEnergy.electricityConsumption <= 0) {
      toast.error("Champs obligatoires manquants");
      return;
    }
    try {
      const updated = await energyService.update(selectedEnergy); 
      const refreshed = await energyService.getAll(); 
      setEnergy(refreshed);
      updateEnergyData(refreshed);
      setSelectedEnergy(null);
      setIsEditEnergyModalOpen(false);
      toast.success("Énergie modifiée");
    } catch (error: any) {
      console.error("Erreur modification énergie :", error);
      toast.error(`Erreur modification : ${error.response?.data?.message || error.message}`);
    }
  };
  const handleRemoveEnergy = async (id: string) => {
    try {
      await energyService.remove(id); 
      const updated = energy.filter((item) => item.id !== id);
      setEnergy(updated);
      updateEnergyData(updated);
      toast.info("Donnée d'énergie supprimée");
    } catch (error: any) {
      console.error("Erreur suppression énergie :", error);
      toast.error(`Erreur suppression : ${error.response?.data?.message || error.message}`);
    }
  };
return(
  <TabsContent value="energy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Données d'énergie</CardTitle>
                <CardDescription>
                  Enregistrez les informations sur votre consommation d'énergie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="energyType">Type d'énergie *</Label>
                    <Select
                      value={newEnergy.energyType}
                      onValueChange={(value) => setNewEnergy({ ...newEnergy, energyType: value })}
                    >
                      <SelectTrigger id="energyType">
                        <SelectValue placeholder="Sélectionnez un type d'énergie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity">Électricité</SelectItem>
                        <SelectItem value="Gas">Gaz naturel</SelectItem>
                        <SelectItem value="Oil">Fioul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="electricityConsumption">Consommation électrique (kWh) *</Label>
                    <Input
                      id="electricityConsumption"
                      type="number"
                      min="0"
                      value={newEnergy.electricityConsumption?? ""}
                      onChange={(e) => setNewEnergy({ ...newEnergy, electricityConsumption: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="heatingConsumption">Consommation chauffage (kWh)</Label>
                    <Input
                      id="heatingConsumption"
                      type="number"
                      min="0"
                      value={newEnergy.heatingConsumption?? ""}
                      onChange={(e) => setNewEnergy({ ...newEnergy, heatingConsumption: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="energyUnit">Unité</Label>
                    <Select
                      value={newEnergy.unit}
                      onValueChange={(value) => setNewEnergy({ ...newEnergy, unit: value })}
                    >
                      <SelectTrigger id="energyUnit">
                        <SelectValue placeholder="Sélectionnez une unité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kWh">kWh</SelectItem>
                        <SelectItem value="MWh">MWh</SelectItem>
                        <SelectItem value="GJ">GJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
  
                <Button onClick={handleAddEnergy} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Ajouter l'énergie
                </Button>
              </CardContent>
            </Card>
  
            {energy.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Énergies enregistrées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 font-medium p-3 border-b bg-muted text-sm">
                      <div>Type</div>
                      <div>Électricité</div>
                      <div>Chauffage</div>
                      <div>Unité</div>
                      <div>Actions</div>
                    </div>
                    {energy.map((item) => (
                      <div key={item.id} className="grid grid-cols-5 p-3 border-b text-sm">
                        <div>{item.energyType}</div>
                        <div>{item.electricityConsumption}</div>
                        <div>{item.heatingConsumption}</div>
                        <div>{item.unit}</div>
                        <div>
                        <Button
    variant="ghost"
    size="sm"
    onClick={() => {
      setSelectedEnergy(item);
      setIsEditEnergyModalOpen(true);
    }}
  >
    ✏️
  </Button>
  
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveEnergy(item.id!)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        {isEditEnergyModalOpen && selectedEnergy && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Modifier les données d'énergie</h2>
  
        <div className="grid gap-4">
          <Label htmlFor="energyType">Type d'énergie </Label>
          <Select
            value={selectedEnergy.energyType}
            onValueChange={(value) =>
              setSelectedEnergy({ ...selectedEnergy, energyType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type d'énergie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">Électricité</SelectItem>
              <SelectItem value="Gas">Gaz naturel</SelectItem>
              <SelectItem value="Oil">Fioul</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="electricityConsumption">Consommation électrique (kWh) </Label>
          <Input
            type="number"
            placeholder="Consommation électrique (kWh)"
            value={selectedEnergy.electricityConsumption ?? ""}
            onChange={(e) =>
              setSelectedEnergy({
                ...selectedEnergy,
                electricityConsumption: parseFloat(e.target.value) || 0,
              })
            }
          />
          <Label htmlFor="heatingConsumption">Consommation chauffage (kWh)</Label>
          <Input
            type="number"
            placeholder="Consommation chauffage (kWh)"
            value={selectedEnergy.heatingConsumption ?? ""}
            onChange={(e) =>
              setSelectedEnergy({
                ...selectedEnergy,
                heatingConsumption: parseFloat(e.target.value) || 0,
              })
            }
          />
          <Label htmlFor="energyUnit">Unité</Label>
          <Select
            value={selectedEnergy.unit}
            onValueChange={(value) =>
              setSelectedEnergy({ ...selectedEnergy, unit: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Unité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kWh">kWh</SelectItem>
              <SelectItem value="MWh">MWh</SelectItem>
              <SelectItem value="GJ">GJ</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditEnergyModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleEditEnergy}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
);
};
export default EnergyForm;
