import React, { useState } from "react";
import { useEffect } from "react";
import { packagingService } from "@/services/packagingService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PackagingData} from "@/models";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";

const PackagingForm = () => {
  const { currentData,  updatePackagingData } = useData();
  const [packaging, setPackaging] = useState<PackagingData[]>(currentData.packaging);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingData | null>(null);
  const [isEditPackagingModalOpen, setIsEditPackagingModalOpen] = useState(false);
  const [newPackaging, setNewPackaging] = useState<PackagingData>({
      packagingType: "",quantity: null,weight: null,palletCount: null,palletType: "",palletWeight: null,
    });
useEffect(() => {
  const fetchPackaging = async () => {
  const data = await packagingService.getAll();
  const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
  setPackaging(data.filter(item => item.UserId === myId));
};
fetchPackaging();
}, []);

const handleAddPackaging = async () => {
  if (!newPackaging.packagingType || newPackaging.quantity! <= 0) {
    toast.error("Veuillez remplir tous les champs obligatoires");
    return;
  }

  try {
    await packagingService.create(newPackaging);

    const refreshed = await packagingService.getAll();
    setPackaging(refreshed);
    updatePackagingData(refreshed);

    setNewPackaging({
      packagingType: "",
      quantity: null,
      weight: null,
      palletCount: null,
      palletType: "",
      palletWeight: null,
    });

    toast.success("Données d'emballage ajoutées");
  } catch (error: any) {
    console.error("Erreur ajout emballage :", error);
    toast.error(`Erreur ajout : ${error.response?.data?.message || error.message}`);
  }
};

  const handleEditPackaging = async () => {
  if (
    !selectedPackaging ||
    !selectedPackaging.id ||
    !selectedPackaging.packagingType ||
    selectedPackaging.quantity === null ||
    selectedPackaging.quantity <= 0
  ) {
    toast.error("Veuillez remplir les champs obligatoires");
    return;
  }

  
  const cleanedData = {
    ...selectedPackaging,
    };

  try {
    console.log("Data envoyée au backend:", cleanedData);
    await packagingService.update(cleanedData);
    const refreshed = await packagingService.getAll();
    setPackaging(refreshed);
    updatePackagingData(refreshed);
    toast.success("Emballage modifié");
    setIsEditPackagingModalOpen(false);
    setSelectedPackaging(null);
  } catch (error: any) {
    console.error("Erreur modification emballage :", error);
    toast.error(`Erreur : ${error.response?.data?.message || error.message}`);
  }
};



  const handleRemovePackaging = async (id: string) => {
    try {
      await packagingService.remove(id);
      const updatedPackaging = packaging.filter(item => item.id !== id);
  
      setPackaging(updatedPackaging);
      updatePackagingData(updatedPackaging);
  
      toast.info("Emballage supprimé");
    } catch (error: any) {
      console.error("Erreur suppression emballage :", error);
      toast.error(`Erreur suppression : ${error.response?.data?.message || error.message}`);
    }
  };
  return(
  <TabsContent value="packaging" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Données d'emballage</CardTitle>
                <CardDescription>
                  Enregistrez les informations sur vos emballages et matériaux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packagingType">Type d'emballage *</Label>
                    <Select
                      value={newPackaging.packagingType}
                      onValueChange={(value) => setNewPackaging({ ...newPackaging, packagingType: value })}
                    >
                      <SelectTrigger id="packagingType">
                        <SelectValue placeholder="Sélectionnez un type d'emballage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carton">Carton</SelectItem>
                        <SelectItem value="plastique">Plastique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="packagingQuantity">Quantité *</Label>
                    <Input
                      id="packagingQuantity"
                      type="number"
                      min="0"
                      value={newPackaging.quantity?? ""}
                      onChange={(e) => setNewPackaging({ ...newPackaging, quantity: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="packagingUnitWeight">Poids unitaire (kg)</Label>
                    <Input
                      id="packagingUnitWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={newPackaging.weight?? ""}
                      onChange={(e) => setNewPackaging({ ...newPackaging, weight: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="palletCount">Nombre de palettes</Label>
                    <Input
                      id="palletCount"
                      type="number"
                      min="0"
                      value={newPackaging.palletCount ?? ""}
                      onChange={(e) => setNewPackaging({ ...newPackaging, palletCount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="palletType">Type de palette</Label>
                    <Select
                      value={newPackaging.palletType}
                      onValueChange={(value) => setNewPackaging({ ...newPackaging, palletType: value })}
                    >
                      <SelectTrigger id="palletType">
                        <SelectValue placeholder="Sélectionnez un type de palette" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wood">Bois</SelectItem>
                        <SelectItem value="plastic">Plastique</SelectItem>
                        <SelectItem value="metal">Métal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="palletWeight">Poids de palette (kg)</Label>
                    <Input
                      id="palletWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={newPackaging.palletWeight?? ""}
                      onChange={(e) => setNewPackaging({ ...newPackaging, palletWeight: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
  
                <Button onClick={handleAddPackaging} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Ajouter l'emballage
                </Button>
              </CardContent>
            </Card>
  
            {packaging.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Emballages enregistrés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-6 font-medium p-3 border-b bg-muted text-sm">
                      <div>Type</div>
                      <div>Quantité</div>
                      <div>Poids unitaire</div>
                      <div>Nbr palettes</div>
                      <div>Type palette</div>
                      <div>Actions</div>
                    </div>
                    {packaging.map((item) => (
                      <div key={item.id} className="grid grid-cols-6 p-3 border-b text-sm">
                        <div>{item.packagingType}</div>
                        <div>{item.quantity}</div>
                        <div>{item.weight} kg</div>
                        <div>{item.palletCount}</div>
                        <div>{item.palletType}</div>
                        <div>
                        <Button variant="ghost" size="sm" onClick={() => {
    setSelectedPackaging(item);
    setIsEditPackagingModalOpen(true);
  }}>
    ✏️
  </Button>
  
                          <Button variant="ghost" size="sm" onClick={() => handleRemovePackaging(item.id!)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        {isEditPackagingModalOpen && selectedPackaging && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Modifier l'emballage</h2>
        <div className="grid gap-4">
          <Label htmlFor="packagingType">Type d'emballage </Label>
          <Select
            value={selectedPackaging.packagingType}
            onValueChange={(value) =>
              setSelectedPackaging({ ...selectedPackaging, packagingType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type d'emballage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carton">Carton</SelectItem>
              <SelectItem value="plastique">Plastique</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="packagingQuantity">Quantité </Label>
          <Input
            type="number"
            placeholder="Quantité"
            value={selectedPackaging.quantity ?? ""}
            onChange={(e) =>
              setSelectedPackaging({ ...selectedPackaging, quantity: parseFloat(e.target.value) || 0 })
            }
          />
          <Label htmlFor="packagingUnitWeight">Poids unitaire (kg)</Label>
          <Input
            type="number"
            placeholder="Poids unitaire (kg)"
            value={selectedPackaging.weight ?? ""}
            onChange={(e) =>
              setSelectedPackaging({ ...selectedPackaging, weight: parseFloat(e.target.value) || 0 })
            }
          />
          <Label htmlFor="palletCount">Nombre de palettes</Label>
          <Input
            type="number"
            placeholder="Nombre de palettes"
            value={selectedPackaging.palletCount ?? ""}
            onChange={(e) =>
              setSelectedPackaging({ ...selectedPackaging, palletCount: parseFloat(e.target.value) || 0 })
            }
          />
           <Label htmlFor="palletType">Type de palette</Label>
          <Select
            value={selectedPackaging.palletType}
            onValueChange={(value) =>
              setSelectedPackaging({ ...selectedPackaging, palletType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de palette" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wood">Bois</SelectItem>
              <SelectItem value="plastic">Plastique</SelectItem>
              <SelectItem value="metal">Métal</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="palletWeight">Poids de palette (kg)</Label>
          <Input
            type="number"
            placeholder="Poids de palette (kg)"
            value={selectedPackaging.palletWeight ?? ""}
            onChange={(e) =>
              setSelectedPackaging({ ...selectedPackaging, palletWeight: parseFloat(e.target.value) || 0 })
            }
          />
  
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditPackagingModalOpen(false)}>Annuler</Button>
          <Button onClick={handleEditPackaging}>Enregistrer</Button>
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
export default PackagingForm;
