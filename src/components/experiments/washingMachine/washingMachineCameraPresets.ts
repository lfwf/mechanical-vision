import { WashingMachineMode } from "../../../data/experiments/washingMachineModes";

export interface WashingMachineCameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  minDistance: number;
  maxDistance: number;
}

/**
 * 每个模式使用独立观察方向：
 * - 进水从前上方查看分配器和筒体；
 * - 驱动从后侧查看直驱电机和轴系；
 * - 脱水从前侧同时看到弹簧、减震器和配重；
 * - 排水降低相机，强调外筒最低点和泵；
 * - 拆装拉远，为真实拆卸方向留出空间。
 */
export const washingMachineCameraPresets: Record<WashingMachineMode, WashingMachineCameraPreset> = {
  [WashingMachineMode.WashWaterPath]: {
    position: [8.8, 6.4, 11.8],
    target: [0, 0.25, 0.35],
    minDistance: 7,
    maxDistance: 22,
  },
  [WashingMachineMode.DriveCutaway]: {
    position: [-8.8, 5.4, -11.5],
    target: [0, 0.15, -0.9],
    minDistance: 6.5,
    maxDistance: 22,
  },
  [WashingMachineMode.SpinSuspension]: {
    position: [9.4, 6.8, 10.5],
    target: [0, 0.1, 0],
    minDistance: 7,
    maxDistance: 23,
  },
  [WashingMachineMode.DrainPath]: {
    position: [8.2, 1.7, 10.8],
    target: [0, -1.25, 0.35],
    minDistance: 6.5,
    maxDistance: 22,
  },
  [WashingMachineMode.Assembly]: {
    position: [13.8, 9.2, 17.5],
    target: [0, 0, 0],
    minDistance: 9,
    maxDistance: 31,
  },
};
