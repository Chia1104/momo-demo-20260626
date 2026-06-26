import type { Banner } from "../../schemas/home.schema";

const cover = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/420`;

/** Hero carousel banners. Links point to in-app routes (no real momo URLs). */
export const banners: Banner[] = [
  {
    id: "b1",
    title: "今日限定 限時秒殺超低價",
    image: cover("momo-flash"),
    link: "/search?sort=sales",
    type: "event",
  },
  {
    id: "b2",
    title: "SK-II 品牌旗艦館盛大開幕",
    image: cover("momo-skii"),
    link: "/search?categoryId=beauty",
    type: "brand",
  },
  {
    id: "b3",
    title: "2026 年 3C 換新季",
    image: cover("momo-3c"),
    link: "/search?categoryId=3c",
    type: "edm",
  },
  {
    id: "b4",
    title: "家電黑色購物節",
    image: cover("momo-appliance"),
    link: "/search?categoryId=appliance",
    type: "edm",
  },
];
