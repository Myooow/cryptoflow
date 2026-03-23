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

export const PERIOD_BUTTONS: { label: string; days: number }[] = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
];

export const CHART_COLORS = {
  background: "#0b1116",
  text: "#8f9fb1",
  grid: "#1a2332",
  border: "#1a2332",
  crosshairV: "#ffffff40",
  crosshairH: "#ffffff20",
  candleUp: "#158A6E",
  candleDown: "#EB1C36",
} as const;

export const WEBSOCKET_RECONNECT_DELAY = 3000;
export const WEBSOCKET_MAX_RETRIES = 5;
export const WEBSOCKET_PING_INTERVAL = 30000;

export const LIVE_TRADES_MAX_ITEMS = 50;

