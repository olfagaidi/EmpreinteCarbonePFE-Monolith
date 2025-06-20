# Module Empreinte Carbone – TraLIS ERP

Ce projet est une application web développée dans le cadre de mon Projet de Fin d'Études (PFE), visant à intégrer un module de **calcul et visualisation de l’empreinte carbone** dans la solution ERP logistique **TraLIS**.

## 🎯 Objectifs

- Collecte de données liées aux transports, entrepôts, énergies, déchets, emballages, etc.
- Calcul des émissions de CO₂ selon le GHG Protocol & normes ISO 14064
- Visualisation des résultats par activité (graphique + tableau)
- Génération de rapports PDF
- Interface administrateur pour la configuration des facteurs d’émission
- Gestion des utilisateurs

---

## 🔧 Technologies utilisées

| Frontend          | Stack                            |
|------------------|----------------------------------|
| Framework         | [React](https://reactjs.org/) + [Vite](https://vitejs.dev) |
| UI                | [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS |
| Formulaires       | react-hook-form + zod |
| Graphiques        | Recharts |
| State / Data      | React context + TanStack Query |

---

## 🚀 Lancer le projet en local

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/olfagaidi/EmprientCarbone.git
cd EmprientCarbone

# 2. Installer les dépendances
npm install

# 3. Lancer l’environnement de développement
npm run dev
