const coingeckoToBinance: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  tether: "USDTUSDT",
  "binancecoin": "BNBUSDT",
  solana: "SOLUSDT",
  "usd-coin": "USDCUSDT",
  ripple: "XRPUSDT",
  cardano: "ADAUSDT",
  avalanche: "AVAXUSDT",
  dogecoin: "DOGEUSDT",
  polkadot: "DOTUSDT",
  chainlink: "LINKUSDT",
  "matic-network": "MATICUSDT",
  litecoin: "LTCUSDT",
  "shiba-inu": "SHIBUSDT",
  uniswap: "UNIUSDT",
  cosmos: "ATOMUSDT",
  "near-protocol": "NEARUSDT",
  aptos: "APTUSDT",
  arbitrum: "ARBUSDT",
  optimism: "OPUSDT",
  sui: "SUIUSDT",
  "injective-protocol": "INJUSDT",
  celestia: "TIAUSDT",
  "sei-network": "SEIUSDT",
  "stacks": "STXUSDT",
  filecoin: "FILUSDT",
  "the-graph": "GRTUSDT",
  aave: "AAVEUSDT",
  "lido-dao": "LDOUSDT",
};

export function toBinancePair(coingeckoId: string): string | null {
  return coingeckoToBinance[coingeckoId] ?? null;
}

export function toBinanceStream(coingeckoId: string, streamType: "ticker" | "kline" | "trade", interval?: string): string | null {
  const pair = toBinancePair(coingeckoId);
  if (!pair) return null;

  const symbol = pair.toLowerCase();

  if (streamType === "ticker") return `${symbol}@ticker`;
  if (streamType === "trade") return `${symbol}@trade`;
  if (streamType === "kline" && interval) return `${symbol}@kline_${interval}`;

  return null;
}

export function isSupportedOnBinance(coingeckoId: string): boolean {
  return coingeckoId in coingeckoToBinance;
}
