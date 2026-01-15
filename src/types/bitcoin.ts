// 비트코인 가격 정보
export interface BitcoinPrice {
  usd: number;
  krw: number;
  eur: number;
  gbp: number;
  jpy: number;
}

// 비트코인 시장 정보
export interface BitcoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: BitcoinPrice;
  market_cap: Record<string, number>;
  market_cap_rank: number;
  total_volume: Record<string, number>;
  high_24h: BitcoinPrice;
  low_24h: BitcoinPrice;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: BitcoinPrice;
  atl: BitcoinPrice;
  last_updated: string;
}

// 비트코인 지갑 정보
export interface WalletInfo {
  address: string;
  balance: number;
  balanceBTC: string;
  transactions: number;
  totalReceived: number;
  totalSent: number;
}

// API 응답 제네릭
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
