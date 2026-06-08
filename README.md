# DES MOTS & DES CHIFFRES

Application web premium mobile-first de jeu de réflexion mêlant lettres et calcul mental.

## Stack

- Next.js 15
- TypeScript strict
- Tailwind CSS
- App Router
- Aucune base de données
- Aucune authentification
- Aucune API externe
- Aucun backend externe

Tout fonctionne localement.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

## Vérifications

```bash
npm run lint
npm run build
```

## Règles V1

- Partie de 12 manches.
- Alternance stricte Lettres / Chiffres.
- 6 manches Lettres.
- 6 manches Chiffres.
- 60 secondes maximum par manche.
- Une réponse validée est définitive.

### Lettres

- Tirage de 8 lettres.
- Répartition V1 : 4 voyelles et 4 consonnes.
- Score : 1 point par lettre.
- Validation des lettres disponibles.
- Validation via dictionnaire local.
- Affichage du meilleur mot possible.
- Le fichier `data/dictionary.json` contient un dictionnaire de test enrichi de plus de 85 000 mots normalisés et peut être remplacé par un dictionnaire français plus large.

### Chiffres

- Tirage de 6 nombres parmi `1,2,3,4,5,6,7,8,9,10,50,75,100`.
- Cible aléatoire entre 100 et 999.
- Opérations autorisées : `+`, `-`, `×`, `÷`.
- Maximum 5 opérations.
- Chaque nombre ne peut être utilisé qu'une seule fois.
- Division autorisée uniquement si le résultat est entier.
- Le calcul est parsé et évalué sans `eval`.
- L'application affiche une solution exacte ou la meilleure approximation trouvée.

Score chiffres :

- Exact : 10 points.
- Écart 1 à 5 : 7 points.
- Écart 6 à 10 : 5 points.
- Écart 11 à 25 : 3 points.
- Écart supérieur à 25 : 1 point si le calcul est valide.
- Calcul invalide : 0 point.

## Architecture

```txt
app/                 Pages App Router et styles globaux
components/          Interface mobile-first réutilisable
core/game/           Moteur de partie, score et progression
core/letters/        Tirage, validation et solveur lettres
core/numbers/        Tirage, parseur, validation et solveur chiffres
data/dictionary.json Mini dictionnaire local V1
```
