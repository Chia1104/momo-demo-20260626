---
name: momo mock commerce
overview: 在 @repo/api 內建立 momo 商城的 mock data 與 oRPC API（沿用現有 contract/route/router 慣例），apps/service 自動掛載，apps/www 透過 oRPC + TanStack Query 呼叫並渲染首頁、搜尋、商品詳情、探索、直播等畫面。
todos:
  - id: schemas
    content: 在 @repo/api 新增 src/orpc/schemas/ (common, product, category, deal) zod schema
    status: pending
  - id: mocks
    content: "在 @repo/api 新增 src/orpc/mocks/ (data: categories/brands/banners/products + index 查詢層 + withDelay)"
    status: pending
  - id: contracts
    content: 新增 catalog/category/deal/discover/live contracts (oc.input/output)
    status: pending
  - id: routes
    content: 新增對應 routes/*.route.ts，handler 由 mocks 取數
    status: pending
  - id: register-router
    content: 更新 router.contract.ts 與 router.ts 註冊新 namespace
    status: pending
  - id: fe-layout
    content: 建立 __root layout、site-header、site-footer 與 commerce 共用元件 (product-card, price, section-header)
    status: pending
  - id: fe-home
    content: 實作首頁 routes/index.tsx 串 orpc.catalog.home (banner/ranking/newArrivals)
    status: pending
  - id: fe-search
    content: 實作 routes/search 串 orpc.catalog.search (validateSearch + 分頁/排序)
    status: pending
  - id: fe-goods
    content: 實作 routes/goods/$productId 串 orpc.catalog.getProduct
    status: pending
  - id: fe-p1
    content: "P1: deal-card 倒數、discover/live 畫面、Zustand 購物車"
    status: pending
  - id: observability
    content: 加 latency/log interceptor 與 mocks 查詢層 Vitest
    status: pending
  - id: readme
    content: 撰寫 README：架構/Tradeoff/Human-Agent 迭代/演進方向
    status: pending
isProject: false
---

## 目標與範圍

維持現有架構：`www` 透過 `RPCLink`(HTTP) → `apps/service`(Hono `RPCHandler`) → `@repo/api` oRPC router → mock data。所有 mock data 與 API 實作放在 `@repo/api`，前端一律用 oRPC + TanStack Query 呼叫。

優先級（呼應題目「說明哪些優先 / 刻意不做」）：

- P0（核心架構 + 主畫面）：mock data/schema、`catalog`(home/search/getProduct)、`category.list`；前端 `/`、`/search`、`/goods/$id` + 共用 layout 與 ProductCard。
- P1（加值）：`deal.list`(限時秒殺倒數)、`discover.feed`、`live.list`、Zustand 購物車。
- 刻意不做：真實結帳/金流、會員/登入、i18n、真實圖片資產(用 placeholder 服務)、SSR。

## API 設計（@repo/api）

新增目錄，沿用現有 `contractOS` 慣例（參考 [utils/index.ts](packages/api/src/orpc/utils/index.ts)、[health.route.ts](packages/api/src/orpc/routes/health.route.ts)）：

- `src/orpc/schemas/`：可重用 zod entity schema
  - `common.schema.ts`：`PaginationInput`(page/pageSize)、`PaginatedOutput<T>` helper、`SortEnum`(price_asc/price_desc/sales/newest)、`PromoTagEnum`(一日秒殺價/領券折/贈mo幣/破盤下殺/熱銷一空…)
  - `product.schema.ts`：`Product`(id, name, brand, image, price, originalPrice, discountRate, tags[], soldOut, rating, sales, categoryId)、`ProductDetail`(+ images[], description, specs, relatedIds)
  - `category.schema.ts`：`Category`(id, name, level, parentId, children[])
  - `deal.schema.ts`：`Deal`(product + dealPrice, endsAt, soldQty, totalQty)
- `src/orpc/mocks/`：mock data 與查詢邏輯
  - `data/categories.ts`、`data/brands.ts`、`data/banners.ts`、`data/products.ts`(~40-60 筆跨分類，參考 momo 真實品名/價格風格：手機/家電/母嬰/美妝/食品…)
  - `index.ts`：純函式查詢層 `searchProducts`、`paginate`、`getProductById`、`getProductsByCategory`、`getRankingsByCategory`、`getActiveDeals`、`withDelay`(模擬延遲，供 observability)
- `src/orpc/contracts/`：`catalog.contract.ts`、`category.contract.ts`、`deal.contract.ts`、`discover.contract.ts`、`live.contract.ts`
- `src/orpc/routes/`：對應 `*.route.ts`，handler 從 mocks 取數
- 更新 [router.contract.ts](packages/api/src/orpc/router.contract.ts) 與 [router.ts](packages/api/src/orpc/router.ts) 註冊新 namespace

Procedure 一覽：

- `catalog.home` → 首頁聚合：banners、flagshipBrands、dailyDeals(preview)、rankings(by category top5)、newArrivals(by category)
- `catalog.search` (input: keyword?, categoryId?, sort, page, pageSize) → 分頁結果 + facets
- `catalog.getProduct` (input: id) → ProductDetail
- `category.list` → 分類樹
- `deal.list` (input: page?) → 限時秒殺（含 endsAt / 庫存進度）
- `discover.feed` (input: cursor?) → 策展 feed
- `live.list` → 直播列表 + 主打商品

## 前端畫面（apps/www）

TanStack Router file-based 路由（參考現有 [index.tsx](apps/www/src/routes/index.tsx)）：

- `routes/__root.tsx`：套用站台 layout（header + footer）
- `routes/index.tsx`：首頁 → `orpc.catalog.home`
- `routes/search/index.tsx`：搜尋結果，`validateSearch`(zod) 管理 keyword/sort/page URL state → `orpc.catalog.search`
- `routes/goods/$productId.tsx`：商品詳情 → `orpc.catalog.getProduct`
- `routes/discover/index.tsx`：`orpc.discover.feed`（P1）
- `routes/live/index.tsx`：`orpc.live.list`（P1）

共用元件 `src/components/commerce/`（HeroUI v3 優先，缺的用輕量自製）：

- `site-header.tsx`(logo/搜尋列/購物車/會員)、`site-footer.tsx`
- `product-card.tsx`(品牌/品名/價格/原價/折扣/促銷標籤/熱銷一空) — 對齊 momo 卡片
- `banner-carousel.tsx`(CSS scroll-snap)、`ranking-list.tsx`(分類 top5)、`deal-card.tsx`(倒數 + 庫存進度條)、`section-header.tsx`、`price.tsx`(用既有 `bignumber.js` 格式化)

State / Rendering 策略：

- Server state：TanStack Query via `orpc.*.queryOptions()`；route `loader` 用 `queryClient.ensureQueryData` 預取（搭配既有 [query-client.ts](apps/www/src/lib/query-client.ts) staleTime）
- URL state：搜尋/排序/分頁走 router search params
- Client state：Zustand 購物車(persist localStorage)（P1）
- Loading：skeleton；error：route `errorComponent`

## Bonus（Validation / Observability / Human-Agent）

- Validation：contract input/output 皆 zod，邊界即驗證
- Observability：service 既有 `onError` interceptor（[rpc.route.ts](apps/service/src/routes/rpc.route.ts)）外，加一個 latency/log interceptor；mocks `withDelay` 模擬真實延遲
- README：記錄架構、Tradeoff、Human-Agent 迭代流程與後續演進方向（含 commit 中的 Agent co-author）

## 驗證

- `pnpm type:check`、`pnpm lint`、`pnpm test`
- `pnpm dev` 同時起 www + service，手動驗證 `/`、`/search`、`/goods/$id`
- 為 mocks 查詢層補小型 Vitest（search/paginate）作為 validation 範例
