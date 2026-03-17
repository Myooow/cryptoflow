export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  fullyDilutedValuation: number | null;
  totalVolume: number;
  high24h: number;
  low24h: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChangePercentage7d: number | null;
  marketCapChange24h: number;
  marketCapChangePercentage24h: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number;
  athChangePercentage: number;
  athDate: string;
  atl: number;
  atlChangePercentage: number;
  atlDate: string;
  lastUpdated: string;
}

export interface TokenDetail extends Token {
  description: string;
  categories: string[];
  links: {
    homepage: string[];
    whitepaper: string;
    subredditUrl: string;
    githubRepos: string[];
    twitterScreenName: string;
  };
  genesisDate: string | null;
  sentimentVotesUpPercentage: number | null;
  sentimentVotesDownPercentage: number | null;
  watchlistPortfolioUsers: number;
  publicInterestScore: number | null;
}

export interface TrendingToken {
  id: string;
  coinId: number;
  name: string;
  symbol: string;
  marketCapRank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  priceBtc: number;
  score: number;
  data: {
    price: number;
    priceChangePercentage24h: number;
    marketCap: string;
    totalVolume: string;
    sparkline: string;
  };
}

export interface OhlcCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
