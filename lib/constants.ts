import type { KlineInterval } from "@/types/websocket";
import type { SortField } from "@/types/market";

export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
export const BINANCE_WS_BASE_URL = "wss://stream.binance.com:9443/ws";

export const COINGECKO_MARKETS_PER_PAGE = 50;
export const COINGECKO_TRENDING_LIMIT = 7;
export const COINGECKO_CATEGORIES_LIMIT = 10;

export const DEFAULT_CURRENCY = "usd";
export const DEFAULT_SORT: SortField = "market_cap_desc";
export const DEFAULT_KLINE_INTERVAL: KlineInterval = "1h";

export const KLINE_INTERVALS: { label: string; value: KlineInterval }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1d", value: "1d" },
  { label: "1w", value: "1w" },
];

export const WEBSOCKET_RECONNECT_DELAY = 3000;
export const WEBSOCKET_MAX_RETRIES = 5;
export const WEBSOCKET_PING_INTERVAL = 30000;

export const LIVE_TRADES_MAX_ITEMS = 50;

export const CACHE_PROFILES = {
  trending: 300,
  markets: 60,
  tokenDetail: 300,
  categories: 600,
  ohlc: 300,
} as const;
