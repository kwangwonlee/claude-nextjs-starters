'use client';

import { useState, useEffect } from 'react';
import { BitcoinMarketData } from '@/types/bitcoin';
import { getBitcoinMarketData } from '@/utils/bitcoin-api';

interface UseBitcoinPriceReturn {
  data: BitcoinMarketData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// 비트코인 가격 정보를 가져오는 커스텀 훅
export function useBitcoinPrice(): UseBitcoinPriceReturn {
  const [data, setData] = useState<BitcoinMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBitcoinMarketData();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || '데이터를 가져올 수 없습니다');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 30초마다 자동 갱신
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
}
