import React, { useState, useEffect } from "react";
import { printingService } from "@/services/printingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { PrintingData } from "@/models";
import { PlusCircle, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "@/components/ui/sonner";

const PrintingForm = () => {
  const { currentData, updatePrintingData } = useData();
  const [printing, setPrinting] = useState<PrintingData[]>(currentData.printing);
  const [selectedPrinting, setSelectedPrinting] = useState<PrintingData | null>(null);
  const [isEditPrintingModalOpen, setIsEditPrintingModalOpen] = useState(false);
  const [newPrinting, setNewPrinting] = useState<PrintingData>({
    printType: "",
    paperType: "",
    quantity: null,
  });

  useEffect(() => {
    const fetchPrinting = async () => {
      const data = await printingService.getAll();
      const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
      setPrinting(data.filter((item) => item.UserId === myId));
    };
    fetchPrinting();
  }, []);

  const handleAddPrinting = async () => {
    if (
      !newPrinting.printType ||
      !newPrinting.paperType ||
      newPrinting.quantity === null ||
      newPrinting.quantity <= 0
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await printingService.create(newPrinting);
      const refreshed = await printingService.getAll();
      setPrinting(refreshed);
      updatePrintingData(refreshed);
      setNewPrinting({
        printType: "",
        paperType: "",
        quantity: null,
      });
      toast.success("Données d'impression ajoutées");
    } catch (error: any) {
      console.error("Erreur ajout impression :", error);
      toast.error(`Erreur ajout : ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditPrinting = async () => {
    if (
      !selectedPrinting ||
      !selectedPrinting.printType ||
      !selectedPrinting.paperType ||
      selectedPrinting.quantity === null ||
      selectedPrinting.quantity <= 0
    ) {
      toast.error("Champs obligatoires manquants");
      return;
    }

    try {
      const updated = await printingService.update(selectedPrinting);
      const refreshed = await printingService.getAll();
      setPrinting(refreshed);
      updatePrintingData(refreshed);
      setIsEditPrintingModalOpen(false);
      setSelectedPrinting(null);
      toast.success("Impression modifiée");
    } catch (error: any) {
      console.error("Erreur modification impression :", error);
      toast.error(`Erreur modification : ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRemovePrinting = async (id: string) => {
    try {
      await printingService.remove(id);
      const updatedPrinting = printing.filter((item) => item.id !== id);
      setPrinting(updatedPrinting);
      updatePrintingData(updatedPrinting);
      toast.success("Impression supprimée");
    } catch (error: any) {
      console.error("Erreur suppression impression :", error);
      toast.error(`Erreur suppression : ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <TabsContent value="printing" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Données d'impression</CardTitle>
          <CardDescription>
            Enregistrez les informations sur vos impressions papier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="printType">Type d'impression *</Label>
              <Select
                value={newPrinting.printType}
                onValueChange={(value) =>
                  setNewPrinting({ ...newPrinting, printType: value })
                }
              >
                <SelectTrigger id="printType">
                  <SelectValue placeholder="Sélectionnez un type d'impression" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noir-blanc">Noir et blanc</SelectItem>
                  <SelectItem value="couleur">Couleur</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paperType">Type de papier *</Label>
              <Select
                value={newPrinting.paperType}
                onValueChange={(value) =>
                  setNewPrinting({ ...newPrinting, paperType: value })
                }
              >
                <SelectTrigger id="paperType">
                  <SelectValue placeholder="Sélectionnez un type de papier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (80g)</SelectItem>
                  <SelectItem value="recycled">Recyclé</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="printQuantity">Nombre de pages *</Label>
              <Input
                id="printQuantity"
                type="number"
                min="0"
                value={newPrinting.quantity ?? ""}
                onChange={(e) =>
                  setNewPrinting({
                    ...newPrinting,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <Button onClick={handleAddPrinting} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Ajouter l'impression
          </Button>
        </CardContent>
      </Card>

      {printing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Impressions enregistrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <div className="grid grid-cols-4 font-medium p-3 border-b bg-muted text-sm">
                <div>Type d'impression</div>
                <div>Type de papier</div>
                <div>Nombre de pages</div>
                <div>Actions</div>
              </div>
              {printing.map((item) => (
                <div key={item.id} className="grid grid-cols-4 p-3 border-b text-sm">
                  <div>{item.printType}</div>
                  <div>{item.paperType}</div>
                  <div>{item.quantity}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPrinting(item);
                        setIsEditPrintingModalOpen(true);
                      }}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePrinting(item.id!)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {isEditPrintingModalOpen &&
                    selectedPrinting &&
                    selectedPrinting.id === item.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                          <h2 className="text-xl font-bold mb-4">
                            Modifier l'impression
                          </h2>
                          <div className="grid gap-4">
                            <Label>Type d'impression</Label>
                            <Select
                              value={selectedPrinting.printType}
                              onValueChange={(value) =>
                                setSelectedPrinting({
                                  ...selectedPrinting,
                                  printType: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Type d'impression" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="noir-blanc">Noir et blanc</SelectItem>
                                <SelectItem value="couleur">Couleur</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                              </SelectContent>
                            </Select>

                            <Label>Type de papier</Label>
                            <Select
                              value={selectedPrinting.paperType}
                              onValueChange={(value) =>
                                setSelectedPrinting({
                                  ...selectedPrinting,
                                  paperType: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Type de papier" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard (80g)</SelectItem>
                                <SelectItem value="recycled">Recyclé</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                              </SelectContent>
                            </Select>

                            <Label>Nombre de pages</Label>
                            <Input
                              type="number"
                              placeholder="Nombre de pages"
                              value={selectedPrinting.quantity ?? ""}
                              onChange={(e) =>
                                setSelectedPrinting({
                                  ...selectedPrinting,
                                  quantity: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditPrintingModalOpen(false);
                                setSelectedPrinting(null);
                              }}
                            >
                              Annuler
                            </Button>
                            <Button onClick={handleEditPrinting}>Enregistrer</Button>
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

export default PrintingForm;
