import type { Brand } from "../../schemas/home.schema";

const logo = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`;

/** Flagship brands shown in the homepage brand rail (品牌旗艦館). */
export const brands: Brand[] = [
  { id: "samsung", name: "SAMSUNG", logo: logo("Samsung") },
  { id: "dyson", name: "dyson", logo: logo("Dyson") },
  { id: "lego", name: "樂高", logo: logo("LEGO") },
  { id: "philips", name: "飛利浦", logo: logo("Philips") },
  { id: "3m", name: "3M", logo: logo("3M") },
  { id: "uni", name: "統一", logo: logo("Uni") },
  { id: "pigeon", name: "貝親", logo: logo("Pigeon") },
  { id: "adidas", name: "adidas", logo: logo("adidas") },
];
