import React, { useState } from "react";
import { useEffect } from "react";
import { warehouseService } from "@/services/warehouseService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WarehouseData} from "@/models";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";


const WarehouseForm = () => {
  const { currentData, updateWarehouseData } = useData();
  const [warehouse, setWarehouse] = useState<WarehouseData[]>(currentData.warehouse);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null);
  const [isEditWarehouseModalOpen, setIsEditWarehouseModalOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState<WarehouseData>({
      area: null,energyType: "",energyConsumption: null,heatingConsumption: null,
    });
  useEffect(() => {
    const fetchWarehouses = async () => {
          const data = await warehouseService.getAll();
          const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
          setWarehouse(data.filter(item => item.UserId === myId));
        };
        fetchWarehouses();
}, []);

const handleAddWarehouse = async () => {
    if (!newWarehouse.energyType || !newWarehouse.area || newWarehouse.area <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
  
    try {
      await warehouseService.create(newWarehouse);
  
      const refreshed = await warehouseService.getAll();
      setWarehouse(refreshed);
      updateWarehouseData(refreshed);
  
      setNewWarehouse({
        area: null,
        energyType: "",
        energyConsumption: null,
        heatingConsumption: null,
      });
  
      toast.success("Données d'entrepôt ajoutées avec succès");
    } catch (error: any) {
      console.error("Erreur ajout entrepôt :", error);
      toast.error(`Erreur lors de l'ajout : ${error.response?.data?.message || error.message}`);
    }
  };
  
  
  const handleEditWarehouse = async () => {
    if (!selectedWarehouse || !selectedWarehouse.energyType || selectedWarehouse.area! <= 0) {
      toast.error("Champs obligatoires manquants");
      return;
    }
  
    try {
      const updated = await warehouseService.update(selectedWarehouse);
      const refreshed = await warehouseService.getAll();
      setWarehouse(refreshed);
      updateWarehouseData(refreshed);
      toast.success("Entrepôt modifié");
      setIsEditWarehouseModalOpen(false);
      setSelectedWarehouse(null);
    } catch (error: any) {
      console.error("Erreur modification entrepôt :", error);
      toast.error(`Erreur modification : ${error.response?.data?.message || error.message}`);
    }
  };
  const handleRemoveWarehouse = async (id: string) => {
    try {
      await warehouseService.remove(id); 
      const updated = warehouse.filter(item => item.id !== id);
      setWarehouse(updated);
      updateWarehouseData(updated);
      toast.success("Entrepôt supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };
  return(
<TabsContent value="warehouse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données d'entrepôt</CardTitle>
              <CardDescription>
                Enregistrez les informations sur vos entrepôts et leur consommation d'énergie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouseArea">Surface de l'entrepôt (m²) *</Label>
                  <Input
                    id="warehouseArea"
                    type="number"
                    min="0"
                    value={newWarehouse.area?? ""}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, area: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseEnergyType">Type d'énergie *</Label>
                  <Select
                    value={newWarehouse.energyType}
                    onValueChange={(value) => setNewWarehouse({ ...newWarehouse, energyType: value })}
                  >
                    <SelectTrigger id="warehouseEnergyType">
                      <SelectValue placeholder="Sélectionnez un type d'énergie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electricity">Électricité</SelectItem>
                      <SelectItem value="Gas">Gaz naturel</SelectItem>
                      <SelectItem value="Oil">Fioul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseEnergyConsumption">Consommation annuelle (kWh)</Label>
                  <Input
                    id="warehouseEnergyConsumption"
                    type="number"
                    min="0"
                    value={newWarehouse.energyConsumption?? ""}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, energyConsumption: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseHeatingConsumption">Consommation chauffage (kWh)</Label>
                  <Input
                    id="warehouseHeatingConsumption"
                    type="number"
                    min="0"
                    value={newWarehouse.heatingConsumption?? ""}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, heatingConsumption: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <Button onClick={handleAddWarehouse} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Ajouter l'entrepôt
              </Button>
            </CardContent>
          </Card>

          {warehouse.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Entrepôts enregistrés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-5 font-medium p-3 border-b bg-muted text-sm">
                    <div>Surface (m²)</div>
                    <div>Type d'énergie</div>
                    <div>Conso. annuelle</div>
                    <div>Conso. chauffage</div>
                    <div>Actions</div>
                  </div>
                  {warehouse.map((item) => (
                    <div key={item.id} className="grid grid-cols-5 p-3 border-b text-sm">
                      <div>{item.area}</div>
                      <div>{item.energyType}</div>
                      <div>{item.energyConsumption} kWh</div>
                      <div>{item.heatingConsumption} kWh</div>
                      <div>
                      <Button variant="ghost" size="sm"  onClick={() => {
  setSelectedWarehouse(item);
  setIsEditWarehouseModalOpen(true);
}}
>
                                      ✏️
                      </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveWarehouse(item.id!)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {isEditWarehouseModalOpen && selectedWarehouse && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Modifier l'entrepôt</h2>
      <div className="grid gap-4">
        <Label htmlFor="warehouseArea">Surface de l'entrepôt (m²) </Label>
        <Input
          type="number"
          placeholder="Surface (m²)"
          value={selectedWarehouse.area ?? ""}
          onChange={(e) =>
            setSelectedWarehouse({ ...selectedWarehouse, area: parseFloat(e.target.value) || 0 })
          }
        />
         <Label htmlFor="warehouseEnergyType">Type d'énergie </Label>
        <Select
          value={selectedWarehouse.energyType}
          onValueChange={(value) =>
            setSelectedWarehouse({ ...selectedWarehouse, energyType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Type d'énergie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Electricity">Electricité</SelectItem>
            <SelectItem value="Gas">Gaz naturel</SelectItem>
            <SelectItem value="Oil">Fioul</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="warehouseEnergyConsumption">Consommation annuelle (kWh)</Label>
        <Input
          type="number"
          placeholder="Consommation annuelle (kWh)"
          value={selectedWarehouse.energyConsumption ?? ""}
          onChange={(e) =>
            setSelectedWarehouse({ ...selectedWarehouse, energyConsumption: parseFloat(e.target.value) || 0 })
          }
        />
        <Label htmlFor="warehouseHeatingConsumption">Consommation chauffage (kWh)</Label>
        <Input
          type="number"
          placeholder="Consommation chauffage (kWh)"
          value={selectedWarehouse.heatingConsumption ?? ""}
          onChange={(e) =>
            setSelectedWarehouse({ ...selectedWarehouse, heatingConsumption: parseFloat(e.target.value) || 0 })
          }
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsEditWarehouseModalOpen(false)}>Annuler</Button>
        <Button onClick={handleEditWarehouse}>Enregistrer</Button>
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
}
export default WarehouseForm;
