export enum WashingMachineMode {
  WashWaterPath = 0,
  DriveCutaway = 1,
  SpinSuspension = 2,
  DrainPath = 3,
  Assembly = 4,
}

export const washingMachineModeLabels = [
  "洗涤进水与水循环",
  "滚筒驱动系统",
  "脱水与减震",
  "排水路径",
  "零件拆装",
] as const;

export function isWashingMachineAssemblyMode(mode: number) {
  return mode === WashingMachineMode.Assembly;
}
