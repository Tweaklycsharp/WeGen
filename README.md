# WeGen - Générateur de Comptes Automatique

Un dashboard moderne et élégant pour générer des comptes automatiquement avec une interface utilisateur intuitive et responsive.

## Fonctionnalités

- 🔐 Système d'authentification (connexion/inscription)
- 🚀 Génération automatique de comptes
- 📊 Tableau de bord avec historique des comptes générés
- 🌓 Mode sombre/clair
- 📱 Design responsive (mobile + desktop)
- ✨ Animations et transitions fluides

## Stack Technique

- **Frontend**: React 18 avec Vite, TailwindCSS, React Router, Framer Motion
- **Backend simulé**: JSON Server
- **État global**: React Context API
- **Authentification**: JWT (simulé)

## Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/wegen.git
cd wegen

# Installer les dépendances
npm install

# Lancer le backend simulé
npm run server

# Lancer l'application en mode développement
npm run dev
```

## Structure du Projet

```
wegen/
├── public/           # Assets publics
├── server/           # Backend simulé
├── src/
│   ├── assets/       # Images et ressources statiques
│   ├── components/   # Composants réutilisables
│   ├── contexts/     # Contextes React (auth, thème)
│   ├── layouts/      # Layouts de l'application
│   ├── pages/        # Pages principales
│   ├── services/     # Services API et utilitaires
│   ├── styles/       # Styles globaux
│   ├── utils/        # Fonctions utilitaires
│   ├── App.jsx       # Composant racine
│   └── main.jsx      # Point d'entrée
└── package.json      # Dépendances et scripts
```

## Déploiement

Pour déployer l'application en production:

```bash
# Construire l'application
npm run build

# Le dossier 'dist' contient l'application prête à être déployée
```

Vous pouvez déployer l'application sur des plateformes comme Vercel, Netlify ou GitHub Pages.

## Captures d'écran

[Captures d'écran à venir]
