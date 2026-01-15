// 비트코인 관련 상수

// 비트코인 네트워크
export const BITCOIN_NETWORKS = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  REGTEST: 'regtest',
} as const;

// 지원하는 통화
export const SUPPORTED_CURRENCIES = ['USD', 'KRW', 'EUR', 'GBP', 'JPY'] as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  BLOCKCHAIN: 'https://blockchain.info',
  MEMPOOL: 'https://mempool.space/api',
} as const;

// 비트코인 상수
export const BITCOIN_CONSTANTS = {
  MAX_SUPPLY: 21_000_000,
  SATOSHI_IN_BTC: 100_000_000,
  MIN_TX_FEE: 1, // satoshi/vB
  BLOCK_TIME: 10 * 60 * 1000, // 10분 (ms)
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  BITCOIN_PRICE: 'bitcoin_price',
  WATCHLIST: 'bitcoin_watchlist',
  SETTINGS: 'bitcoin_settings',
} as const;

// 캐시 설정
export const CACHE_CONFIG = {
  PRICE_DATA: 5 * 60 * 1000, // 5분
  MARKET_DATA: 10 * 60 * 1000, // 10분
  NETWORK_DATA: 1 * 60 * 1000, // 1분
} as const;
