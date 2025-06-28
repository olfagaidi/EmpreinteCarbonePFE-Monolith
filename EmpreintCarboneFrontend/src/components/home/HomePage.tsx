
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, LayoutDashboard, Leaf, User, Cog,Lightbulb, BarChart2, NotebookText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { isAdmin } = useAuth();

  const features = isAdmin()
  ? [
      {
        icon: LayoutDashboard,
        title: "Tableau de bord",
        description: "Visualisez un aperçu global de votre empreinte carbone",
        link: "/dashboard-admin",
      },
      {
        icon: User,
        title: "Gérer comptes",
        description: "Création et gestion des comptes utilisateur",
        link: "/user-management",
      },
      {
        icon: Cog,
        title: "Configuration des émissions",
        description: "Modifier les facteurs d’émission et paramètres administratifs",
        link: "/emission-config",
      },
    ]
  : [
      {
        icon: LayoutDashboard,
        title: "Tableau de bord",
        description: "Visualisez un aperçu global de votre empreinte carbone",
        link: "/dashboard",
      },
      {
        icon: ClipboardList,
        title: "Saisie des données",
        description: "Saisissez manuellement les données de transport, énergie et emballages",
        link: "/data-entry",
      },
      {
        icon: BarChart2,
        title: "Visualisation",
        description: "Analysez vos émissions avec des graphiques détaillés",
        link: "/visualization",
      },
      {
        icon: NotebookText,
        title: "Rapports",
        description: "Générez des rapports PDF complets de votre empreinte carbone",
        link: "/reports",
      },
      {
        icon: Lightbulb,
        title: "Recommandations",
        description: "Obtenez des suggestions personnalisées pour réduire votre impact",
        link: "/recommendations",
      },
    ];
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <section className="mb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            TraLIS Carbon-Footprint
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mesurez, analysez et réduisez l'empreinte carbone de votre chaîne logistique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Pourquoi mesurer votre empreinte carbone ?</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <span>Répondez aux exigences réglementaires et aux attentes des clients</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <span>Identifiez les opportunités de réduction des coûts opérationnels</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <span>Améliorez votre image de marque et votre compétitivité</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-1 rounded-full mr-2 mt-1">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <span>Prenez des décisions éclairées pour une logistique plus durable</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button asChild>
  <Link to={isAdmin() ? "/dashboard-admin" : "/dashboard"} className="flex items-center gap-2">
    Consulter le tableau de bord<ArrowRight className="h-4 w-4" />
  </Link>
</Button>

            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-6 flex items-center justify-center">
            <img 
              src="public/images/dev.png" 
              alt="Schéma d'empreinte carbone" 
              className="max-w-full rounded-md"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to={feature.link} className="flex items-center gap-2">
                    Accéder <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
