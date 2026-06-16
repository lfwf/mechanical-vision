/**
 * 滚筒洗衣机五种互斥教学模式。
 *
 * 模式索引同时被实验定义、相机预设、场景可见性和动画逻辑使用，
 * 必须通过枚举引用，禁止在组件中继续散落 0、1、2、3、4 等魔法数字。
 */
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

/** 运行原理模式和拆装模式必须分离，拆装模式不播放水流和高速旋转。 */
export function isWashingMachineAssemblyMode(mode: number) {
  return mode === WashingMachineMode.Assembly;
}
