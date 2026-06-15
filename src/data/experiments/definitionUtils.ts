export const number = (value: number, digits = 1): string =>
  new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);

export const directionText = (direction: 1 | -1): string =>
  direction === 1 ? "逆时针" : "顺时针";

export const rackPitch = Math.PI * 0.145;
