import { BitcoinMarketData, ApiResponse } from '@/types/bitcoin';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// 비트코인 시장 정보 조회
export async function getBitcoinMarketData(): Promise<ApiResponse<BitcoinMarketData>> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/bitcoin?localization=false&market_data=true&community_data=false&developer_data=false`
    );

    if (!response.ok) {
      throw new Error('비트코인 데이터를 가져올 수 없습니다');
    }

    const data = await response.json();

    return {
      success: true,
      data: data as BitcoinMarketData,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString(),
    };
  }
}

// 비트코인 가격 조회 (여러 통화)
export async function getBitcoinPrice(currencies: string[] = ['usd', 'krw']) {
  try {
    const ids = 'bitcoin';
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=${currencies.join(',')}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error('가격 정보를 가져올 수 없습니다');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 비트코인 변동률 조회 (일간)
export async function getBitcoinPriceChange() {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly`
    );

    if (!response.ok) {
      throw new Error('변동률 정보를 가져올 수 없습니다');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 통화 형식으로 변환
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const currencyMap: Record<string, string> = {
    USD: 'USD',
    KRW: 'KRW',
    EUR: 'EUR',
    GBP: 'GBP',
    JPY: 'JPY',
  };

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyMap[currency] || currency,
    minimumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(value);
}

// 비트코인 단위 변환
export function satoshisToBTC(satoshis: number): number {
  return satoshis / 100000000;
}

export function btcToSatoshis(btc: number): number {
  return btc * 100000000;
}
