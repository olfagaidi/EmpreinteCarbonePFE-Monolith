import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useData } from '@/context/DataContext';
import { reportService } from '@/services/reportService';

const ReportPage = () => {
  const { currentData } = useData();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const pdfBlob = await reportService.downloadReport(); // utilise Auth/download-report
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-emissions.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Rapport téléchargé avec succès !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement du rapport');
    } finally {
      setIsDownloading(false);
    }
  };

  // Fonctions de calcul conservées pour affichage local
  const calculateTransportEmission = (item: any) => {
    const factors = { diesel: 2.58, petrol: 2.31, electric: 0.047 };
    const factor = factors[item.fuelType as keyof typeof factors] || 2.58;
    return (item.distance * item.consumption * factor) / 100;
  };

  const calculateWarehouseEmission = (item: any) => {
    const factors = { electricity: 0.1 , Gas: 0.25 , Oil:0.35 };
    const factor = factors[item.energyType as keyof typeof factors] || 0.1;
    return item.area * item.energyConsumption * factor;
  };

  const calculatePackagingEmission = (item: any) => {
    const factors = { carton: 0.94, plastic: 2.5, paper: 0.96, wood: 0.68 };
    const factor = factors[item.packagingType as keyof typeof factors] || 0.94;
    return item.quantity * (item.unitWeight || item.weight || 1) * factor;
  };

  const calculateWasteEmission = (item: any) => {
    const factors = { plactic: 6.0, paper: 1.8, organic:0.5, glass: 0.2 };
    const factor = factors[item.treatmentMethod as keyof typeof factors] || 0.6;
    return item.quantity * factor;
  };

  const calculateEnergyEmission = (item: any) => {
    const factors = { electricity: 0.1, naturalGas: 0.25, oil: 0.35 };
    const factor = factors[item.energyType as keyof typeof factors] || 0.057;
    return item.electricityConsumption * factor + item.heatingConsumption * 0.1;
  };

  const calculatePrintingEmission = (item: any) => {
    const factors = { standard: 0.005, recycled: 0.003, photo: 0.01 };
    const factor = factors[item.paperType as keyof typeof factors] || 0.005;
    return item.quantity * factor;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports d'émissions</h1>
          <p className="text-gray-600 mt-2">
            Cliquez pour télécharger le dernier rapport généré .
          </p>
        </div>
        <Button
          onClick={handleDownloadReport}
          disabled={isDownloading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Téléchargement...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Télécharger rapport
            </>
          )}
        </Button>
      </div>

      <Separator className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Aperçu des données locales
          </CardTitle>
          <CardDescription>
            Données actuelles saisies dans l'application (non liées au PDF).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.transport.length}
              </div>
              <div className="text-sm text-gray-600">Données transport</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentData.energy.length}
              </div>
              <div className="text-sm text-gray-600">Données énergie</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {currentData.packaging.length + currentData.waste.length + currentData.printing.length}
              </div>
              <div className="text-sm text-gray-600">Autres données</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
