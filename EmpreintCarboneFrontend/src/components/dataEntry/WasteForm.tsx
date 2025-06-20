import React, { useState } from "react";
import { useEffect } from "react";
import { wasteService } from "@/services/wasteService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WasteData} from "@/models";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";


const WasteForm = () => {
const { currentData,  updateWasteData } = useData();
const [waste, setWaste] = useState<WasteData[]>(currentData.waste);
const [selectedWaste, setSelectedWaste] = useState<WasteData | null>(null);
const [isEditWasteModalOpen, setIsEditWasteModalOpen] = useState(false);
const [newWaste, setNewWaste] = useState<WasteData>({
    wasteType: "",quantity: null,treatmentMethod: "",
  });
useEffect(() => {
  const fetchWaste = async () => {
    try {
      const data = await wasteService.getAllByUser(); 
      setWaste(data);
    } catch (error: any) {
      console.error("Erreur chargement des déchets :", error);
      toast.error("Erreur lors du chargement des déchets.");
    }
  };
  fetchWaste();
}, []);

const handleAddWaste = async () => {
  if (!newWaste.wasteType || newWaste.quantity === null || newWaste.quantity <= 0 || !newWaste.treatmentMethod) {
    toast.error("Veuillez remplir tous les champs obligatoires");
    return;
  }

  try {
    await wasteService.create(newWaste);

    const refreshed = await wasteService.getAll();
    setWaste(refreshed);
    updateWasteData(refreshed);

    setNewWaste({
      wasteType: "",
      quantity: null,
      treatmentMethod: "",
    });

    toast.success("Données de déchets ajoutées");
  } catch (error: any) {
    console.error("Erreur ajout déchets :", error);
    toast.error(`Erreur ajout : ${error.response?.data?.message || error.message}`);
  }
};
  const handleEditWaste = async () => {
  if (!selectedWaste || !selectedWaste.wasteType || selectedWaste.quantity === null || selectedWaste.quantity <= 0 || !selectedWaste.treatmentMethod) {
    toast.error("Veuillez remplir les champs obligatoires");
    return;
  }
  try {
    await wasteService.update(selectedWaste);
    const updated = await wasteService.getAll();
    setWaste(updated);
    updateWasteData(updated);
    toast.success("Déchet modifié");
    setIsEditWasteModalOpen(false);
    setSelectedWaste(null);
  } catch (error: any) {
    console.error("Erreur modification déchet :", error);
    toast.error(`Erreur : ${error.response?.data?.message || error.message}`);
  }
};
  const handleRemoveWaste = async (id: string) => {
        try {
          await wasteService.remove(id);
          const updated = waste.filter((t) => t.id !== id);
          setWaste(updated);
          updateWasteData(updated);
          toast.info("Données de déchets supprimées");
        } catch (error) {
          toast.error("Erreur lors de la suppression");
        }
      };
return(
<TabsContent value="waste" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données de déchets</CardTitle>
              <CardDescription>
                Enregistrez les informations sur vos déchets et leur traitement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wasteType">Type de déchet *</Label>
                  <Select
                    value={newWaste.wasteType}
                    onValueChange={(value) => setNewWaste({ ...newWaste, wasteType: value })}
                  >
                    <SelectTrigger id="wasteType">
                      <SelectValue placeholder="Sélectionnez un type de déchet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper">Papier/Carton</SelectItem>
                      <SelectItem value="plastic">Plastique</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                      <SelectItem value="organic">Organique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteQuantity">Quantité (kg) *</Label>
                  <Input
                    id="wasteQuantity"
                    type="number"
                    min="0"
                    value={newWaste.quantity?? ""}
                    onChange={(e) => setNewWaste({ ...newWaste, quantity: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteTreatment">Méthode de traitement *</Label>
                  <Select
                    value={newWaste.treatmentMethod}
                    onValueChange={(value) => setNewWaste({ ...newWaste, treatmentMethod: value })}
                  >
                    <SelectTrigger id="wasteTreatment">
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landfill">Enfouissement</SelectItem>
                      <SelectItem value="recycling">Recyclage</SelectItem>
                      <SelectItem value="incineration">Incinération</SelectItem>
                      <SelectItem value="compost">Compostage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddWaste} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Ajouter le déchet
              </Button>
            </CardContent>
          </Card>

          {waste.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Déchets enregistrés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-4 font-medium p-3 border-b bg-muted text-sm">
                    <div>Type</div>
                    <div>Quantité (kg)</div>
                    <div>Traitement</div>
                    <div>Actions</div>
                  </div>
                  {waste.map((item) => (
                    <div key={item.id} className="grid grid-cols-4 p-3 border-b text-sm">
                      <div>{item.wasteType}</div>
                      <div>{item.quantity} kg</div>
                      <div>{item.treatmentMethod}</div>
                      <div>
                      <Button variant="ghost" size="sm" onClick={() => {
      setSelectedWaste(item);
      setIsEditWasteModalOpen(true);
    }}>
      ✏️
    </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveWaste(item.id!)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {isEditWasteModalOpen && selectedWaste && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Modifier le déchet</h2>
      <div className="grid gap-4">
        <Label htmlFor="wasteType">Type de déchet </Label>
        <Select
          value={selectedWaste.wasteType}
          onValueChange={(value) => setSelectedWaste({ ...selectedWaste, wasteType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type de déchet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paper">Papier/Carton</SelectItem>
            <SelectItem value="plastic">Plastique</SelectItem>
            <SelectItem value="glass">Bois</SelectItem>
            <SelectItem value="organic">Organique</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="wasteQuantity">Quantité (kg) </Label>
        <Input
          type="number"
          placeholder="Quantité (kg)"
          value={selectedWaste.quantity ?? ""}
          onChange={(e) =>
            setSelectedWaste({ ...selectedWaste, quantity: parseFloat(e.target.value) || 0 })
          }
        />
        <Label htmlFor="wasteTreatment">Méthode de traitement </Label>
        <Select
          value={selectedWaste.treatmentMethod}
          onValueChange={(value) =>
            setSelectedWaste({ ...selectedWaste, treatmentMethod: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Méthode de traitement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="landfill">Enfouissement</SelectItem>
            <SelectItem value="recycling">Recyclage</SelectItem>
            <SelectItem value="incineration">Incinération</SelectItem>
            <SelectItem value="compost">Compostage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsEditWasteModalOpen(false)}>Annuler</Button>
        <Button onClick={handleEditWaste}>Enregistrer</Button>
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
export default WasteForm;
