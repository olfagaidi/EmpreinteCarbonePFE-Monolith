
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-muted p-4 text-center text-muted-foreground text-sm mt-auto">
      <p>© {new Date().getFullYear()} TraLIS Eco-Insights - Module d'empreinte carbone</p>
    </footer>
  );
};

export default Footer;
