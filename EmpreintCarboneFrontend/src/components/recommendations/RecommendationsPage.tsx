
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";
import { AlertCircle, Leaf, TrendingDown, Clock, BarChart2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RecommendationItem } from "@/models";

const difficultyColors = {
  "Low": "bg-green-100 text-green-800 hover:bg-green-100",
  "Medium": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "High": "bg-red-100 text-red-800 hover:bg-red-100",
};

const timeFrameColors = {
  "Short-term": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "Medium-term": "bg-purple-100 text-purple-800 hover:bg-purple-100",
  "Long-term": "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

const RecommendationsPage = () => {
  const { currentFootprint, recommendations } = useData();

  const getRecommendationsByCategory = (category: string): RecommendationItem[] => {
    return recommendations.filter(
      (recommendation) => recommendation.category === category
    );
  };

  if (!currentFootprint) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Recommandations</h1>
          <p className="text-muted-foreground">
            Suggestions personnalisées pour réduire votre empreinte carbone
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aucun calcul disponible</AlertTitle>
          <AlertDescription>
            Pour obtenir des recommandations personnalisées, veuillez d'abord effectuer un calcul d'empreinte carbone.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculer les recommandations prioritaires basées sur la répartition des émissions
  const transportRecommendations = getRecommendationsByCategory("Transport");
  const energyRecommendations = getRecommendationsByCategory("Énergie");
  const packagingRecommendations = getRecommendationsByCategory("Emballage");
  const wasteRecommendations = getRecommendationsByCategory("Déchets");

  // Trier les recommandations par potentiel de réduction
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => b.potentialReduction - a.potentialReduction
  );

  // Sélectionner les 3 recommandations les plus impactantes
  const topRecommendations = sortedRecommendations.slice(0, 3);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Recommandations</h1>
        <p className="text-muted-foreground">
          Suggestions personnalisées pour réduire votre empreinte carbone
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <CardTitle>Recommandations prioritaires</CardTitle>
            </div>
            <CardDescription>
              Actions recommandées avec le plus fort potentiel de réduction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                          <TrendingDown className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{recommendation.description}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className={difficultyColors[recommendation.difficulty]}>
                              {recommendation.difficulty === "Low" ? "Facile" : 
                               recommendation.difficulty === "Medium" ? "Modéré" : "Difficile"}
                            </Badge>
                            <Badge className={timeFrameColors[recommendation.timeFrame]}>
                              {recommendation.timeFrame === "Short-term" ? "Court terme" : 
                               recommendation.timeFrame === "Medium-term" ? "Moyen terme" : "Long terme"}
                            </Badge>
                            <Badge variant="outline" className="border-primary/50 text-primary">
                              {recommendation.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:text-right">
                      <div className="text-sm text-muted-foreground mb-1">Potentiel de réduction</div>
                      <div className="text-2xl font-bold text-primary">{recommendation.potentialReduction}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <CardTitle>Impact potentiel</CardTitle>
            </div>
            <CardDescription>
              Réduction d'émissions possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Total des émissions actuelles</h3>
                <p className="text-2xl font-bold text-primary mb-1">
                  {currentFootprint.totalEmission.toFixed(2)} <span className="text-sm font-normal">kg CO2e</span>
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="font-medium mb-2 text-green-800">Réduction potentielle</h3>
                <p className="text-2xl font-bold text-green-700 mb-1">
                  {(currentFootprint.totalEmission * 0.25).toFixed(2)} <span className="text-sm font-normal">kg CO2e</span>
                </p>
                <p className="text-sm text-green-600">Jusqu'à 25% de réduction possible</p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>En appliquant toutes les recommandations, vous pourriez réduire significativement votre empreinte carbone et réaliser des économies opérationnelles.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Recommandations par catégorie</h2>

      <div className="space-y-8">
        {/* Transport */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-700">Transport</CardTitle>
            <CardDescription>
              Optimisation de votre logistique et vos modes de transport
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transportRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{recommendation.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-blue-700 border-blue-200">
                        Potentiel: {recommendation.potentialReduction}%
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {recommendation.timeFrame === "Short-term" ? "Court terme" : 
                         recommendation.timeFrame === "Medium-term" ? "Moyen terme" : "Long terme"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Énergie */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="text-amber-700">Énergie</CardTitle>
            <CardDescription>
              Amélioration de votre efficacité énergétique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {energyRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{recommendation.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-amber-700 border-amber-200">
                        Potentiel: {recommendation.potentialReduction}%
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {recommendation.timeFrame === "Short-term" ? "Court terme" : 
                         recommendation.timeFrame === "Medium-term" ? "Moyen terme" : "Long terme"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emballage */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-emerald-700">Emballage</CardTitle>
            <CardDescription>
              Optimisation de vos matériaux et processus d'emballage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packagingRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">{recommendation.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                        Potentiel: {recommendation.potentialReduction}%
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {recommendation.timeFrame === "Short-term" ? "Court terme" : 
                         recommendation.timeFrame === "Medium-term" ? "Moyen terme" : "Long terme"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Déchets */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-purple-700">Déchets</CardTitle>
            <CardDescription>
              Amélioration de la gestion et valorisation des déchets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wasteRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-purple-50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{recommendation.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-purple-700 border-purple-200">
                        Potentiel: {recommendation.potentialReduction}%
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {recommendation.timeFrame === "Short-term" ? "Court terme" : 
                         recommendation.timeFrame === "Medium-term" ? "Moyen terme" : "Long terme"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsPage;