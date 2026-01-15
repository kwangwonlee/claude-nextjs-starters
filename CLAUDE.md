# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code에 지침을 제공합니다.

## 프로젝트 개요

Next.js 16 기반의 비트코인 가격 정보 조회 애플리케이션입니다. React 19와 TypeScript를 사용하며, Tailwind CSS v4로 스타일링합니다.

## 개발 환경 설정

### 필수 명령어

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm start

# ESLint 린팅
npm run lint
```

## 프로젝트 구조

### 디렉토리 레이아웃

```
src/
├── components/     # 재사용 가능한 React 컴포넌트
├── constants/      # 애플리케이션 상수 (bitcoin.ts)
├── hooks/          # 커스텀 React 훅 (useBitcoinPrice)
├── types/          # TypeScript 타입 정의 (bitcoin.ts)
└── utils/          # 유틸리티 함수 (bitcoin-api.ts)

app/
├── layout.tsx      # 루트 레이아웃
├── page.tsx        # 메인 페이지
└── globals.css     # 글로벌 스타일
```

## 핵심 아키텍처

### 비트코인 데이터 흐름

1. **API 계층** (`src/utils/bitcoin-api.ts`)
   - CoinGecko API를 통해 비트코인 시장 데이터 조회
   - 주요 함수: `getBitcoinMarketData()`, `getBitcoinPrice()`, `getBitcoinPriceChange()`
   - 통화 변환 및 단위 변환 유틸리티 포함

2. **타입 정의** (`src/types/bitcoin.ts`)
   - `BitcoinPrice`: 여러 통화의 가격 데이터 (USD, KRW, EUR, GBP, JPY)
   - `BitcoinMarketData`: 시가, 시가총액, 변동률 등 종합 시장 정보
   - `WalletInfo`: 지갑 주소 및 거래 정보
   - `ApiResponse<T>`: 일관된 API 응답 형식

3. **커스텀 훅** (`src/hooks/useBitcoinPrice.ts`)
   - 클라이언트 컴포넌트에서 비트코인 데이터 관리
   - 30초마다 자동 갱신
   - Loading, error, refetch 상태 제공

4. **상수 관리** (`src/constants/bitcoin.ts`)
   - 비트코인 네트워크 설정
   - API 엔드포인트 정의
   - 캐시 TTL 설정 (가격 5분, 시장 데이터 10분)
   - 로컬 스토리지 키 정의

### 기술 스택

- **Framework**: Next.js 16.1.1 (App Router)
- **Runtime**: React 19.2.3
- **Styling**: Tailwind CSS 4 + Lucide React 아이콘
- **Type System**: TypeScript 5
- **Linting**: ESLint 9 with Next.js config
- **External APIs**: CoinGecko API (비트코인 시장 데이터)

## 주요 개발 패턴

### 경로 별칭
TypeScript 경로 별칭이 설정되어 있습니다:
- `@/*` → `./*` (프로젝트 루트)

예: `import { getBitcoinMarketData } from '@/utils/bitcoin-api'`

### 클라이언트/서버 컴포넌트
- 훅과 상호작용이 필요한 컴포넌트는 `'use client'` 디렉티브 사용
- 예: `useBitcoinPrice` 훅을 사용하는 컴포넌트는 클라이언트 컴포넌트

### 에러 처리
API 호출 시 명확한 한국어 에러 메시지 제공 (bitcoin-api.ts:13, 26, 57, 66 참조)

## 통화 및 형식

- **지원 통화**: USD, KRW, EUR, GBP, JPY (`src/constants/bitcoin.ts:11`)
- **통화 포맷팅**: `formatCurrency()` 함수 사용 (USD/EUR 등은 소수점 2자리, KRW는 소수점 없음)
- **비트코인 단위**: `satoshisToBTC()`, `btcToSatoshis()` 변환 함수 제공

## MCP 통합

Playwright MCP 서버가 `.mcp.json`에 설정되어 있어 E2E 테스트 작성 지원

## 코드 컨벤션

- **들여쓰기**: 2칸
- **주석**: 한국어
- **변수/함수명**: 영어
- **커밋 메시지**: 한국어
- **타입 안정성**: `strict: true` 설정 활성화

