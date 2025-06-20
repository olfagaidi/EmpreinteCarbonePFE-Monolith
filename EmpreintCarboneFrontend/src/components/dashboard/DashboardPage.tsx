import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/context/DataContext";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";

const DashboardPage = () => {
  const { savedReports, currentFootprint } = useData();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for the dashboard
  const totalEmissions = 248.5;
  const transportEmissions = 104.4;
  const energyEmissions = 69.6;
  const otherEmissions = 74.5;
  
  const percentChange = 12.5;
  const transportPercentChange = 15.2;
  const energyPercentChange = -7.5;
  const otherPercentChange = 16.2;

  // Chart data
  const emissionsByCategory = [
    { name: "Transport", value: transportEmissions, color: "#3b82f6" },
    { name: "Énergie", value: energyEmissions, color: "#ef4444" },
    { name: "Entrepôt", value: 45.3, color: "#10b981" },
    { name: "Consommables", value: 29.2, color: "#f59e0b" },
  ];

  const emissionsByTransportType = [
    { name: "Routier", value: 70, color: "#0000ff" },
    { name: "Maritime", value: 20, color: "#0000ff" },
    { name: "Aérien", value: 10, color: "#0000ff" },
  ];

  const monthlyData = [
    { name: "Jan", total: 120.5 },
    { name: "Fév", total: 135.8 },
    { name: "Mar", total: 142.3 },
    { name: "Avr", total: 125.7 },
    { name: "Mai", total: 138.4 },
    { name: "Jun", total: 145.9 },
    { name: "Jul", total: 140.2 },
    { name: "Aoû", total: 132.6 },
    { name: "Sep", total: 136.8 },
    { name: "Oct", total: 144.3 },
    { name: "Nov", total: 152.7 },
    { name: "Déc", total: 148.5 },
  ];

  const yearlyData = monthlyData.map(item => ({
    ...item,
    total: parseFloat((item.total * (1 + Math.random() * 0.4 - 0.2)).toFixed(1))
  }));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, utilisateur ! Voici l'ensemble de votre empreinte carbone
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
    
        <TabsContent value="overview" className="space-y-6">
          {/* Key metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total des émissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{totalEmissions} tCO₂e</div>
                  <div className={`flex items-center space-x-1 text-sm ${percentChange > 0 ? 'text-destructive' : 'text-green-500'}`}>
                    {percentChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(percentChange)}% par rapport à l'année précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Émissions Transport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{transportEmissions} tCO₂e</div>
                  <div className={`flex items-center space-x-1 text-sm ${transportPercentChange > 0 ? 'text-destructive' : 'text-green-500'}`}>
                    {transportPercentChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(transportPercentChange)}% par rapport à l'année précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Émissions Énergie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{energyEmissions} tCO₂e</div>
                  <div className={`flex items-center space-x-1 text-sm ${energyPercentChange > 0 ? 'text-destructive' : 'text-green-500'}`}>
                    {energyPercentChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(energyPercentChange)}% par rapport à l'année précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Autres émissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{otherEmissions} tCO₂e</div>
                  <div className={`flex items-center space-x-1 text-sm ${otherPercentChange > 0 ? 'text-destructive' : 'text-green-500'}`}>
                    {otherPercentChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(otherPercentChange)}% par rapport à l'année précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des émissions */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Évolution des émissions</CardTitle>
                <CardDescription>Émissions totales sur la période</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={{ data: {} }}>
                  <AreaChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" name="total" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Répartition par catégorie */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>Répartition des émissions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emissionsByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emissionsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tCO₂e`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Types de transport */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Types de transport</CardTitle>
                <CardDescription>Répartition des émissions par mode de transport</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emissionsByTransportType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Bar dataKey="value" name="valeur">
                      {emissionsByTransportType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Évolution mensuelle */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
                <CardDescription>Évolution sur les 12 derniers mois</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} tCO₂e`, ""]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#10b981" 
                      activeDot={{ r: 8 }} 
                      name="total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="text-center p-8">
            <h3 className="text-xl font-medium">Détails par catégorie</h3>
            <p className="text-muted-foreground">
              Vue détaillée des émissions par catégorie à implémenter
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center p-8">
            <h3 className="text-xl font-medium">Rapports disponibles</h3>
            <p className="text-muted-foreground">
              Liste des rapports générés à implémenter
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;