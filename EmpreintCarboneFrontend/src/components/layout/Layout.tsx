import React from "react";
import Navbar from "./Navbar"; // Assure-toi que le chemin est correct
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barre de navigation horizontale en haut */}
      <Navbar />

      {/* Contenu principal centré */}
      <main className="px-6 py-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
