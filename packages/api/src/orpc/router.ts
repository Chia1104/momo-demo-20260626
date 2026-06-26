import * as catalogRoutes from "./routes/catalog.route";
import * as categoryRoutes from "./routes/category.route";
import * as dealRoutes from "./routes/deal.route";
import * as discoverRoutes from "./routes/discover.route";
import * as healthRoutes from "./routes/health.route";
import * as liveRoutes from "./routes/live.route";
import { contractOS } from "./utils";

export const router = contractOS.router({
  health: {
    server: healthRoutes.healthRoute,
  },
  catalog: {
    home: catalogRoutes.home,
    search: catalogRoutes.search,
    getProduct: catalogRoutes.getProduct,
  },
  category: {
    list: categoryRoutes.list,
  },
  deal: {
    list: dealRoutes.list,
  },
  discover: {
    feed: discoverRoutes.feed,
  },
  live: {
    list: liveRoutes.list,
  },
});
