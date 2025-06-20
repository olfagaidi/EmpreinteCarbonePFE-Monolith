

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, ComposedChart, Bar, Cell, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from "recharts";
import { FileText, AlertCircle, BarChart2, PieChart as PieChartIcon, LineChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useData } from "@/context/DataContext";
import { CarbonFootprint } from "@/models";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

const formatValue = (value: any): string => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return String(value);
};

const VisualizationPage = () => {
  const { currentFootprint } = useData();
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(currentFootprint);
  const navigate = useNavigate();

  // Créer des données pour les graphiques
  const pieData = footprint?.details.map((detail, index) => ({
    name: detail.category,
    value: detail.value,
    color: COLORS[index % COLORS.length],
  })) || [];

  const barData = footprint?.details.map((detail) => ({
    name: detail.category,
    value: detail.value,
  })) || [];

  // Données pour le graphique tendance (simulées pour la démo)
  const trendData = [
    { name: "Janvier", transport: 1200, emballage: 800, energie: 900, entrepot: 1100, dechets: 400 },
    { name: "Février", transport: 1100, emballage: 780, energie: 880, entrepot: 1050, dechets: 380 },
    { name: "Mars", transport: 1300, emballage: 850, energie: 950, entrepot: 1200, dechets: 450 },
    { name: "Avril", transport: 1240, emballage: 830, energie: 920, entrepot: 1150, dechets: 420 },
    { name: "Mai", transport: 1150, emballage: 795, energie: 890, entrepot: 1080, dechets: 390 },
    { name: "Actuel", transport: footprint?.transportEmissions || 0, emballage: footprint?.packagingEmissions || 0, energie: footprint?.energyEmissions || 0, entrepot: footprint?.warehouseEmissions || 0, dechets: footprint?.wasteEmissions || 0 },
  ];

  const handleGenerateReport = () => {
    navigate("/reports");
  };

  if (!footprint) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Visualisation des résultats</h1>
          <p className="text-muted-foreground">
            Visualisez les résultats de votre calcul d'empreinte carbone
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aucune donnée disponible</AlertTitle>
          <AlertDescription>
            Aucun calcul d'empreinte carbone n'a été effectué. Veuillez d'abord saisir des données et lancer un calcul.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/calculation")}>
            Retour au calcul
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Visualisation des résultats</h1>
        <p className="text-muted-foreground">
          Explorez en détail les résultats de votre calcul d'empreinte carbone
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Résumé de l'empreinte carbone</CardTitle>
          <CardDescription>
            Calcul effectué le {new Date(footprint.calculationDate).toLocaleDateString('fr-FR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Empreinte totale</h3>
              <p className="text-4xl font-bold text-primary">
                {formatValue(footprint.totalEmission)} <span className="text-base font-normal">kg CO2e</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Équivalent à environ {Number(footprint.totalEmission / 100).toFixed(1)} trajets Paris-Marseille en voiture
              </p>

              <div className="mt-4 space-y-3">
                {footprint.details.map((detail) => (
                  <div key={detail.category} className="flex justify-between items-center">
                    <span>{detail.category}</span>
                    <span className="font-medium">{formatValue(detail.value)} kg CO2e</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => {
                    if (typeof value === 'number') {
                      return [`${value.toFixed(2)} kg CO2e`, "Émissions"];
                    }
                    return [`${value} kg CO2e`, "Émissions"];
                  }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Par catégorie
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" /> Tendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble des émissions</CardTitle>
              <CardDescription>
                Répartition des émissions par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'kg CO2e', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => {
                      if (typeof value === 'number') {
                        return [`${value.toFixed(2)} kg CO2e`, "Émissions"];
                      }
                      return [`${value} kg CO2e`, "Émissions"];
                    }} />
                    <Legend />
                    <Bar dataKey="value" name="Émissions" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Détail par catégorie</CardTitle>
              <CardDescription>
                Analyse détaillée des émissions par source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pieData.map((category) => (
                  <div key={category.name} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <span className="text-sm font-semibold" style={{ color: category.color }}>
                        {formatValue(category.value)} kg CO2e
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full" style={{ width: `${(category.value / footprint.totalEmission) * 100}%`, backgroundColor: category.color }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {((category.value / footprint.totalEmission) * 100).toFixed(1)}% du total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Évolution sur 6 mois</CardTitle>
              <CardDescription>
                Tendance des émissions par catégorie (données simulées pour la démonstration)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={trendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'kg CO2e', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => {
                      if (typeof value === 'number') {
                        return [`${value.toFixed(2)} kg CO2e`, ""];
                      }
                      return [`${value} kg CO2e`, ""];
                    }} />
                    <Legend />
                    <Bar dataKey="transport" name="Transport" fill="#10B981" stackId="a" />
                    <Bar dataKey="emballage" name="Emballage" fill="#3B82F6" stackId="a" />
                    <Bar dataKey="energie" name="Énergie" fill="#8B5CF6" stackId="a" />
                    <Bar dataKey="entrepot" name="Entrepôt" fill="#F59E0B" stackId="a" />
                    <Bar dataKey="dechets" name="Déchets" fill="#EF4444" stackId="a" />
                    <Line type="monotone" dataKey="total" name="Total" stroke="#000" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mb-8">
        <Button onClick={handleGenerateReport} className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Générer un rapport détaillé
        </Button>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-2">Interprétation des résultats</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Les graphiques ci-dessus vous aident à identifier les principales sources d'émissions de votre activité logistique. Ces informations vous permettent de prioriser vos actions de réduction des émissions.
        </p>
        <p className="text-sm text-muted-foreground">
          Pour des recommandations personnalisées sur la réduction de votre empreinte carbone, consultez la section Recommandations.
        </p>
      </div>
    </div>
  );
};

export default VisualizationPage;