
// TransportForm.tsx
import React, { useState } from "react";
import { useEffect } from "react";
import { transportService } from "@/services/transportService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TransportData} from "@/models";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";

const TransportForm = () => {
  
  const { currentData, updateTransportData } = useData();
  
  const [transport, setTransport] = useState<TransportData[]>(currentData.transport);
  const [selectedTransport, setSelectedTransport] = useState<TransportData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTransport, setNewTransport] = useState<TransportData>({
      distance: null,vehicleType: "",fuelType: "",consumption: null,loadFactor: null,departureLocation: "",arrivalLocation: "",
    });
    useEffect(() => {
        const fetchTransports = async () => {
          const data = await transportService.getAll();
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const myId = currentUser.id;
          const myData = data.filter(item => item.UserId== myId );
          setTransport(data);
        };
        fetchTransports();
        }, []);
  const handleAddTransport = async () => {
      if (!newTransport.vehicleType || !newTransport.fuelType || newTransport.distance! <= 0) {
        toast.error("Veuillez remplir tous les champs obligatoires");
          return;
          }
          try {
            await transportService.create(newTransport);
            const refreshed = await transportService.getAll();
            setTransport(refreshed);
            updateTransportData(refreshed);
            setNewTransport({distance: null,vehicleType: "",fuelType: "",consumption: null,loadFactor: null,departureLocation: "",arrivalLocation: "", });
            toast.success("Données de transport ajoutées");
          } catch (error) {
            toast.error("Erreur lors de l'ajout");
          }
        };
        
  const handleEditTransport = async () => {
    if (!selectedTransport || !selectedTransport.vehicleType || !selectedTransport.fuelType || selectedTransport.distance! <= 0) {
      toast.error("Champs obligatoires manquants");
        return;
            }
            try {
              console.log("Transport envoyé pour modification :", selectedTransport);
              const updated = await transportService.update(selectedTransport);
              const refreshed = await transportService.getAll(); 
              setTransport(refreshed);
              updateTransportData(refreshed);
              toast.success("Transport modifié");
              setIsEditModalOpen(false);
              setSelectedTransport(null);
            } catch (error: any) {
              console.error("Erreur lors de la modification :", error);
              toast.error(`Erreur modification : ${error.response?.data?.message || error.message}`);
            }
          };      
  const handleRemoveTransport = async (id: string) => {
      try {
        await transportService.remove(id);
        const updated = transport.filter((t) => t.id !== id);
        setTransport(updated);
        updateTransportData(updated);
        toast.info("Données de transport supprimées");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    };
return(
  <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Données de transport</CardTitle>
                <CardDescription>
                  Enregistrez vos données de transport pour calculer les émissions associées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Type de véhicule *</Label>
                    <Select
                      value={newTransport.vehicleType}
                      onValueChange={(value) => setNewTransport({ ...newTransport, vehicleType: value })}
                    >
                      <SelectTrigger id="vehicleType">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camion">Camion</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="bateau">Bateau</SelectItem>
                        <SelectItem value="avion">Avion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Type de carburant *</Label>
                    <Select
                      value={newTransport.fuelType}
                      onValueChange={(value) => setNewTransport({ ...newTransport, fuelType: value })}
                    >
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Sélectionnez un carburant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="essence">Essence</SelectItem>
                        <SelectItem value="electric">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km) *</Label>
                    <Input
                      id="distance"
                      type="number"
                      min="0"
                      value={newTransport.distance ?? ""}
                      onChange={(e) => setNewTransport({ ...newTransport, distance: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="consumption">Consommation (L/100km ou kWh/100km)</Label>
                    <Input
                      id="consumption"
                      type="number"
                      min="0"
                      step="0.1"
                      value={newTransport.consumption}
                      onChange={(e) => setNewTransport({ ...newTransport, consumption: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="loadFactor">Taux de remplissage (%)</Label>
                    <Input
                      id="loadFactor"
                      type="number"
                      min="0"
                      max="100"
                      value={newTransport.loadFactor?? ""}
                      onChange={(e) => setNewTransport({ ...newTransport, loadFactor: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="departureLocation">Lieu de départ</Label>
                    <Input
                      id="departureLocation"
                      value={newTransport.departureLocation}
                      onChange={(e) => setNewTransport({ ...newTransport, departureLocation: e.target.value })}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label htmlFor="arrivalLocation">Lieu d'arrivée</Label>
                    <Input
                      id="arrivalLocation"
                      value={newTransport.arrivalLocation}
                      onChange={(e) => setNewTransport({ ...newTransport, arrivalLocation: e.target.value })}
                    />
                  </div>
                </div>
  
                <Button onClick={handleAddTransport} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Ajouter le transport
                </Button>
              </CardContent>
            </Card>
  
            {transport.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transports enregistrés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-7 font-medium p-3 border-b bg-muted text-sm">
                      <div>Véhicule</div>
                      <div>Carburant</div>
                      <div>Distance (km)</div>
                      <div>Consommation</div>
                      <div>Taux rempl.</div>
                      <div>Départ</div>
                      
                      <div>Actions</div>
                      
                    </div>
                    {transport.map((item) => (
                      <div key={item.id} className="grid grid-cols-7 p-3 border-b text-sm">
                        <div>{item.vehicleType}</div>
                        <div>{item.fuelType}</div>
                        <div>{item.distance}</div>
                        <div>{item.consumption}</div>
                        <div>{item.loadFactor}%</div>
                        <div>{item.departureLocation}</div>
                        <div>
                        <div className="flex gap-2">
    <Button variant="ghost" size="sm" onClick={() => { setSelectedTransport(item); setIsEditModalOpen(true); }}>
      ✏️
    </Button>
    <Button variant="ghost" size="sm" onClick={() => handleRemoveTransport(item.id!)}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </div>
  {isEditModalOpen && selectedTransport && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Modifier le transport</h2>
        <div className="grid gap-4">
          <Label htmlFor="fuelType">Type de carburant</Label>
    <Select
      value={selectedTransport.fuelType}
      onValueChange={(value) => setSelectedTransport({ ...selectedTransport!, fuelType: value })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Type de carburant" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="diesel">Diesel</SelectItem>
        <SelectItem value="petrol">Essence</SelectItem>
        <SelectItem value="electric">Électrique</SelectItem>
      </SelectContent>
    </Select>
    <Label htmlFor="distance">Distance (km)</Label>
    <Input
      type="number"
      placeholder="Distance (km)"
      value={selectedTransport.distance ?? ""}
      onChange={(e) => setSelectedTransport({ ...selectedTransport!, distance: parseFloat(e.target.value) || 0 })}
    />
    <Label htmlFor="consumption">Consommation (L/100km ou kWh/100km)</Label>
    <Input
      type="number"
      placeholder="Consommation (L/100km ou kWh/100km)"
      value={selectedTransport.consumption ?? ""}
      onChange={(e) => setSelectedTransport({ ...selectedTransport!, consumption: parseFloat(e.target.value) || 0 })}
    />
    <Label htmlFor="loadFactor">Taux de remplissage (%)</Label>
    <Input
      type="number"
      placeholder="Taux de remplissage (%)"
      value={selectedTransport.loadFactor ?? ""}
      onChange={(e) => setSelectedTransport({ ...selectedTransport!, loadFactor: parseFloat(e.target.value) || 0 })}
    />
  </div>
  
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Annuler</Button>
          <Button onClick={handleEditTransport}>Enregistrer</Button>
        </div>
      </div>
    </div>
  )}
  
  
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
);
};
export default TransportForm;