
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmissionFactor } from "@/models";
import { toast } from "@/components/ui/sonner";
import { Plus, Trash2, Save } from "lucide-react";

const EmissionConfigPage = () => {
  const [activeTab, setActiveTab] = useState("transport");
  
  const initialFactors: Record<string, EmissionFactor[]> = {
    transport: [
      { id: "1", source: "ADEME", category: "Routier / Diesel", value: 2.58, unit: "kg CO2e/L" },
      { id: "2", source: "ADEME", category: "Routier / Essence", value: 2.31, unit: "kg CO2e/L" },
      { id: "3", source: "ADEME", category: "Routier / Électrique", value: 0.047, unit: "kg CO2e/kWh" },
      { id: "4", source: "ADEME", category: "Maritime / Porte-conteneurs", value: 0.0155, unit: "kg CO2e/t.km" },
      { id: "5", source: "ADEME", category: "Aérien / Fret", value: 1.39, unit: "kg CO2e/t.km" },
    ],
    energy: [
      { id: "6", source: "ADEME", category: "Électricité / Mix FR", value: 0.1, unit: "kg CO2e/kWh" },
      { id: "7", source: "ADEME", category: "Gaz naturel", value: 0.25, unit: "kg CO2e/kWh" },
      { id: "8", source: "ADEME", category: "Fioul", value: 0.35, unit: "kg CO2e/kWh" },
    ],
    packaging: [
      { id: "9", source: "ADEME", category: "Carton", value: 0.94, unit: "kg CO2e/kg" },
      { id: "10", source: "ADEME", category: "Plastique", value: 2.5, unit: "kg CO2e/kg" },
    ],
    waste: [
      { id: "12", source: "ADEME", category: "Plastique", value: 6.0, unit: "kg CO2e/kg" },
      { id: "13", source: "ADEME", category: "Paper", value: 1.8, unit: "kg CO2e/kg" },
      { id: "14", source: "ADEME", category: "Organic", value: 0.5, unit: "kg CO2e/kg" },
      { id: "15", source: "ADEME", category: "Glass", value: 0.2, unit: "kg CO2e/kg" },
    ],
  };
  
  const [emissionFactors, setEmissionFactors] = useState<Record<string, EmissionFactor[]>>(initialFactors);
  const [newFactor, setNewFactor] = useState<Partial<EmissionFactor>>({
    source: "",
    category: "",
    value: 0,
    unit: ""
  });

  const handleSaveChanges = () => {
    // Here we would typically save to an API or database
    toast.success("Facteurs d'émission mis à jour avec succès");
  };

  const handleAddFactor = () => {
    if (!newFactor.source || !newFactor.category || !newFactor.unit) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const newFactorWithId: EmissionFactor = {
      id: Date.now().toString(),
      source: newFactor.source || "",
      category: newFactor.category || "",
      value: newFactor.value || 0,
      unit: newFactor.unit || "",
    };

    setEmissionFactors({
      ...emissionFactors,
      [activeTab]: [...emissionFactors[activeTab], newFactorWithId]
    });

    setNewFactor({
      source: "",
      category: "",
      value: 0,
      unit: ""
    });

    toast.success("Nouveau facteur d'émission ajouté");
  };

  const handleDeleteFactor = (id: string) => {
    setEmissionFactors({
      ...emissionFactors,
      [activeTab]: emissionFactors[activeTab].filter(factor => factor.id !== id)
    });
    toast.success("Facteur d'émission supprimé");
  };

  const handleUpdateFactor = (id: string, field: keyof EmissionFactor, value: string | number) => {
    setEmissionFactors({
      ...emissionFactors,
      [activeTab]: emissionFactors[activeTab].map(factor => 
        factor.id === id ? { ...factor, [field]: value } : factor
      )
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Configuration des émissions</h1>
        <p className="text-muted-foreground">
          Gérez les facteurs d'émission utilisés dans les calculs
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Facteurs d'émission</CardTitle>
          <CardDescription>
            Ces valeurs sont utilisées pour calculer l'empreinte carbone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="energy">Énergie</TabsTrigger>
              <TabsTrigger value="packaging">Emballage</TabsTrigger>
              <TabsTrigger value="waste">Déchets</TabsTrigger>
            </TabsList>

            {Object.keys(emissionFactors).map(category => (
              <TabsContent key={category} value={category}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Unité</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emissionFactors[category].map((factor) => (
                      <TableRow key={factor.id}>
                        <TableCell>
                          <Input 
                            value={factor.source} 
                            onChange={(e) => handleUpdateFactor(factor.id || "", "source", e.target.value)} 
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={factor.category} 
                            onChange={(e) => handleUpdateFactor(factor.id || "", "category", e.target.value)} 
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={factor.value} 
                            onChange={(e) => handleUpdateFactor(factor.id || "", "value", parseFloat(e.target.value))} 
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={factor.unit} 
                            onChange={(e) => handleUpdateFactor(factor.id || "", "unit", e.target.value)} 
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteFactor(factor.id || "")}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Ajouter un nouveau facteur</h4>
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <Input 
                        placeholder="Source" 
                        value={newFactor.source || ''} 
                        onChange={(e) => setNewFactor({...newFactor, source: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="Catégorie" 
                        value={newFactor.category || ''} 
                        onChange={(e) => setNewFactor({...newFactor, category: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Input 
                        type="number" 
                        placeholder="Valeur" 
                        value={newFactor.value || ''} 
                        onChange={(e) => setNewFactor({...newFactor, value: parseFloat(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="Unité" 
                        value={newFactor.unit || ''} 
                        onChange={(e) => setNewFactor({...newFactor, unit: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Button onClick={handleAddFactor} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button onClick={handleSaveChanges} className="flex items-center">
            <Save className="h-4 w-4 mr-2" /> Sauvegarder les modifications
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de calcul</CardTitle>
          <CardDescription>
            Paramètres généraux pour les calculs d'empreinte carbone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="default-year">Année de référence</Label>
                <Select defaultValue="2023">
                  <SelectTrigger id="default-year">
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="calculation-method">Méthode de calcul</Label>
                <Select defaultValue="bilan_carbone">
                  <SelectTrigger id="calculation-method">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bilan_carbone">Bilan Carbone (ADEME)</SelectItem>
                    <SelectItem value="ghg_protocol">GHG Protocol</SelectItem>
                    <SelectItem value="iso_14064">ISO 14064</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="scope-setting">Périmètres à inclure</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="scope-setting">
                    <SelectValue placeholder="Sélectionner les périmètres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scope1">Scope 1 uniquement</SelectItem>
                    <SelectItem value="scope12">Scopes 1 et 2</SelectItem>
                    <SelectItem value="all">Tous les scopes (1, 2 et 3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reporting-frequency">Fréquence de reporting</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger id="reporting-frequency">
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                    <SelectItem value="quarterly">Trimestrielle</SelectItem>
                    <SelectItem value="annually">Annuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button variant="outline" className="mr-2">Réinitialiser</Button>
          <Button>Appliquer</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmissionConfigPage;