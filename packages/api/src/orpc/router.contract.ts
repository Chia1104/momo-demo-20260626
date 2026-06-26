import * as catalogContracts from "./contracts/catalog.contract";
import * as categoryContracts from "./contracts/category.contract";
import * as dealContracts from "./contracts/deal.contract";
import * as discoverContracts from "./contracts/discover.contract";
import * as healthContracts from "./contracts/health.contract";
import * as liveContracts from "./contracts/live.contract";

export const routerContract = {
  health: {
    server: healthContracts.HealthContract,
  },
  catalog: {
    home: catalogContracts.HomeContract,
    search: catalogContracts.SearchContract,
    getProduct: catalogContracts.GetProductContract,
  },
  category: {
    list: categoryContracts.ListContract,
  },
  deal: {
    list: dealContracts.ListContract,
  },
  discover: {
    feed: discoverContracts.FeedContract,
  },
  live: {
    list: liveContracts.ListContract,
  },
};
