import BigNumber from "bignumber.js";

/** Formats a TWD amount with thousands separators, e.g. 19990 -> "19,990". */
export const formatPrice = (value: number): string =>
  new BigNumber(value).toFormat(0);

/** Compact view count, e.g. 12830 -> "1.3萬". */
export const formatCount = (value: number): string => {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}萬`;
  return new BigNumber(value).toFormat(0);
};
