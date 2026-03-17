# CryptoFlow

Terminal d'analyse crypto en temps réel, construit pour le portfolio.

## Stack

| Technologie | Usage |
|---|---|
| Next.js 16.1 (App Router) | Framework principal |
| TypeScript 5 (strict) | Typage |
| Tailwind CSS v4 + SCSS Modules | Styling (zéro classe Tailwind dans le JSX) |
| shadcn/ui | Composants UI primitifs |
| Recharts | Graphiques candlestick |
| CoinGecko REST API | Données froides (tokens, OHLC, trending) |
| Binance WebSocket | Données temps réel (ticker, klines, trades) |
| pnpm | Package manager |

## Pages

- **`/`** — Discovery : tokens trending + catégories performantes (bento grid)
- **`/markets`** — Screener : tableau paginé de toutes les cryptos
- **`/token/[id]`** — Token Detail : graphique candlestick live + flux de trades
- **Command Palette (⌘K)** — Recherche globale avec debounce

## Setup

```bash
# Cloner le repo
git clone https://github.com/TON_USERNAME/cryptoflow.git
cd cryptoflow

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# → Renseigner COINGECKO_API_KEY

# Lancer le serveur de développement
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Description |
|---|---|
| `COINGECKO_API_KEY` | Clé API CoinGecko Demo (gratuite) |

Obtenir une clé sur [coingecko.com/en/developers/dashboard](https://www.coingecko.com/en/developers/dashboard).
