export interface MarketCategory {
  id: string;
  name: string;
  marketCap: number;
  marketCapChange24h: number | null;
  content: string;
  top3Coins: string[];
  volume24h: number;
  updatedAt: string;
}

export interface MarketGlobal {
  activeCryptocurrencies: number;
  markets: number;
  totalMarketCap: Record<string, number>;
  totalVolume: Record<string, number>;
  marketCapPercentage: Record<string, number>;
  marketCapChangePercentage24hUsd: number;
  updatedAt: number;
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number | null;
  thumb: string;
  large: string;
}

export interface PaginationParams {
  page: number;
  perPage: number;
}

export type SortField =
  | "market_cap_desc"
  | "market_cap_asc"
  | "volume_desc"
  | "volume_asc"
  | "id_asc"
  | "id_desc";
