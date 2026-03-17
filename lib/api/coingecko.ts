"use cache";

import { config } from "@/lib/config";
import {
  COINGECKO_BASE_URL,
  COINGECKO_MARKETS_PER_PAGE,
  CACHE_PROFILES,
  DEFAULT_CURRENCY,
} from "@/lib/constants";
import type { Token, TokenDetail, TrendingToken, OhlcCandle } from "@/types/token";
import type { MarketCategory, MarketGlobal, SearchResult, PaginationParams, SortField } from "@/types/market";

async function fetchCoinGecko<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${COINGECKO_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const response = await fetch(url.toString(), {
    headers: {
      "x-cg-demo-api-key": config.coingecko.apiKey,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText} — ${url.pathname}`);
  }

  return response.json() as Promise<T>;
}

export async function getMarkets(
  { page, perPage }: PaginationParams = { page: 1, perPage: COINGECKO_MARKETS_PER_PAGE },
  sort: SortField = "market_cap_desc",
  currency: string = DEFAULT_CURRENCY
): Promise<Token[]> {
  const raw = await fetchCoinGecko<RawMarketItem[]>("/coins/markets", {
    vs_currency: currency,
    order: sort,
    per_page: String(perPage),
    page: String(page),
    sparkline: "false",
    price_change_percentage: "24h,7d",
  });

  return raw.map(mapMarketItem);
}

export async function getTokenDetail(id: string, currency: string = DEFAULT_CURRENCY): Promise<TokenDetail> {
  const raw = await fetchCoinGecko<RawTokenDetail>(`/coins/${id}`, {
    localization: "false",
    tickers: "false",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
    sparkline: "false",
  });

  return mapTokenDetail(raw, currency);
}

export async function getTrending(): Promise<TrendingToken[]> {
  const raw = await fetchCoinGecko<{ coins: { item: RawTrendingItem }[] }>("/search/trending");
  return raw.coins.map(({ item }) => mapTrendingItem(item));
}

export async function getCategories(): Promise<MarketCategory[]> {
  const raw = await fetchCoinGecko<RawCategory[]>("/coins/categories", {
    order: "market_cap_desc",
  });

  return raw.map(mapCategory);
}

export async function getGlobalMarket(): Promise<MarketGlobal> {
  const raw = await fetchCoinGecko<{ data: RawGlobalMarket }>("/global");
  return mapGlobalMarket(raw.data);
}

export async function getOhlc(
  id: string,
  days: number = 7,
  currency: string = DEFAULT_CURRENCY
): Promise<OhlcCandle[]> {
  const raw = await fetchCoinGecko<[number, number, number, number, number][]>(`/coins/${id}/ohlc`, {
    vs_currency: currency,
    days: String(days),
  });

  return raw.map(([timestamp, open, high, low, close]) => ({
    timestamp,
    open,
    high,
    low,
    close,
  }));
}

export async function searchTokens(query: string): Promise<SearchResult[]> {
  const raw = await fetchCoinGecko<{ coins: RawSearchResult[] }>("/search", { query });
  return raw.coins.map(mapSearchResult);
}

interface RawMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number | null;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface RawTokenDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  description: { en: string };
  categories: string[];
  links: {
    homepage: string[];
    whitepaper: string;
    subreddit_url: string;
    repos_url: { github: string[] };
    twitter_screen_name: string;
  };
  genesis_date: string | null;
  sentiment_votes_up_percentage: number | null;
  sentiment_votes_down_percentage: number | null;
  watchlist_portfolio_users: number;
  public_interest_score: number | null;
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    fully_diluted_valuation: Record<string, number>;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    ath_date: Record<string, string>;
    atl: Record<string, number>;
    atl_change_percentage: Record<string, number>;
    atl_date: Record<string, string>;
    last_updated: string;
  };
}

interface RawTrendingItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_change_percentage_24h: { usd: number };
    market_cap: string;
    total_volume: string;
    sparkline: string;
  };
}

interface RawCategory {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number | null;
  content: string;
  top_3_coins: string[];
  volume_24h: number;
  updated_at: string;
}

interface RawGlobalMarket {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

interface RawSearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

function mapMarketItem(raw: RawMarketItem): Token {
  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    image: raw.image,
    currentPrice: raw.current_price,
    marketCap: raw.market_cap,
    marketCapRank: raw.market_cap_rank,
    fullyDilutedValuation: raw.fully_diluted_valuation,
    totalVolume: raw.total_volume,
    high24h: raw.high_24h,
    low24h: raw.low_24h,
    priceChange24h: raw.price_change_24h,
    priceChangePercentage24h: raw.price_change_percentage_24h,
    priceChangePercentage7d: raw.price_change_percentage_7d_in_currency,
    marketCapChange24h: raw.market_cap_change_24h,
    marketCapChangePercentage24h: raw.market_cap_change_percentage_24h,
    circulatingSupply: raw.circulating_supply,
    totalSupply: raw.total_supply,
    maxSupply: raw.max_supply,
    ath: raw.ath,
    athChangePercentage: raw.ath_change_percentage,
    athDate: raw.ath_date,
    atl: raw.atl,
    atlChangePercentage: raw.atl_change_percentage,
    atlDate: raw.atl_date,
    lastUpdated: raw.last_updated,
  };
}

function mapTokenDetail(raw: RawTokenDetail, currency: string): TokenDetail {
  const md = raw.market_data;
  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    image: raw.image.large,
    currentPrice: md.current_price[currency] ?? 0,
    marketCap: md.market_cap[currency] ?? 0,
    marketCapRank: raw.market_cap_rank,
    fullyDilutedValuation: md.fully_diluted_valuation[currency] ?? null,
    totalVolume: md.total_volume[currency] ?? 0,
    high24h: md.high_24h[currency] ?? 0,
    low24h: md.low_24h[currency] ?? 0,
    priceChange24h: md.price_change_24h,
    priceChangePercentage24h: md.price_change_percentage_24h,
    priceChangePercentage7d: md.price_change_percentage_7d,
    marketCapChange24h: md.market_cap_change_24h,
    marketCapChangePercentage24h: md.market_cap_change_percentage_24h,
    circulatingSupply: md.circulating_supply,
    totalSupply: md.total_supply,
    maxSupply: md.max_supply,
    ath: md.ath[currency] ?? 0,
    athChangePercentage: md.ath_change_percentage[currency] ?? 0,
    athDate: md.ath_date[currency] ?? "",
    atl: md.atl[currency] ?? 0,
    atlChangePercentage: md.atl_change_percentage[currency] ?? 0,
    atlDate: md.atl_date[currency] ?? "",
    lastUpdated: md.last_updated,
    description: raw.description.en,
    categories: raw.categories,
    links: {
      homepage: raw.links.homepage,
      whitepaper: raw.links.whitepaper,
      subredditUrl: raw.links.subreddit_url,
      githubRepos: raw.links.repos_url.github,
      twitterScreenName: raw.links.twitter_screen_name,
    },
    genesisDate: raw.genesis_date,
    sentimentVotesUpPercentage: raw.sentiment_votes_up_percentage,
    sentimentVotesDownPercentage: raw.sentiment_votes_down_percentage,
    watchlistPortfolioUsers: raw.watchlist_portfolio_users,
    publicInterestScore: raw.public_interest_score,
  };
}

function mapTrendingItem(raw: RawTrendingItem): TrendingToken {
  return {
    id: raw.id,
    coinId: raw.coin_id,
    name: raw.name,
    symbol: raw.symbol,
    marketCapRank: raw.market_cap_rank,
    thumb: raw.thumb,
    small: raw.small,
    large: raw.large,
    slug: raw.slug,
    priceBtc: raw.price_btc,
    score: raw.score,
    data: {
      price: raw.data.price,
      priceChangePercentage24h: raw.data.price_change_percentage_24h.usd,
      marketCap: raw.data.market_cap,
      totalVolume: raw.data.total_volume,
      sparkline: raw.data.sparkline,
    },
  };
}

function mapCategory(raw: RawCategory): MarketCategory {
  return {
    id: raw.id,
    name: raw.name,
    marketCap: raw.market_cap,
    marketCapChange24h: raw.market_cap_change_24h,
    content: raw.content,
    top3Coins: raw.top_3_coins,
    volume24h: raw.volume_24h,
    updatedAt: raw.updated_at,
  };
}

function mapGlobalMarket(raw: RawGlobalMarket): MarketGlobal {
  return {
    activeCryptocurrencies: raw.active_cryptocurrencies,
    markets: raw.markets,
    totalMarketCap: raw.total_market_cap,
    totalVolume: raw.total_volume,
    marketCapPercentage: raw.market_cap_percentage,
    marketCapChangePercentage24hUsd: raw.market_cap_change_percentage_24h_usd,
    updatedAt: raw.updated_at,
  };
}

function mapSearchResult(raw: RawSearchResult): SearchResult {
  return {
    id: raw.id,
    name: raw.name,
    symbol: raw.symbol,
    marketCapRank: raw.market_cap_rank,
    thumb: raw.thumb,
    large: raw.large,
  };
}
