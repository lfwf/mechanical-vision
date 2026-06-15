export const GEAR_MODULE = 0.145;

export function getPitchRadius(teeth: number): number {
  return (GEAR_MODULE * teeth) / 2;
}

export function getOuterRadius(teeth: number): number {
  return getPitchRadius(teeth) + GEAR_MODULE;
}

export function getRootRadius(teeth: number): number {
  return Math.max(getPitchRadius(teeth) - GEAR_MODULE * 1.18, GEAR_MODULE * 1.8);
}

export function getCenterDistance(driverTeeth: number, drivenTeeth: number): number {
  return getPitchRadius(driverTeeth) + getPitchRadius(drivenTeeth);
}

export function getTransmissionRatio(driverTeeth: number, drivenTeeth: number): number {
  return drivenTeeth / driverTeeth;
}

export function getDrivenRpm(
  inputRpm: number,
  inputDirection: 1 | -1,
  driverTeeth: number,
  drivenTeeth: number,
): number {
  return -inputRpm * inputDirection * (driverTeeth / drivenTeeth);
}

export function rpmToRadiansPerSecond(rpm: number): number {
  return (rpm * Math.PI * 2) / 60;
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function getDirectionLabel(direction: number): "顺时针" | "逆时针" {
  return direction >= 0 ? "逆时针" : "顺时针";
}

export interface GearAnalysis {
  ratio: number;
  drivenRpm: number;
  drivenDirection: "顺时针" | "逆时针";
  driverDirection: "顺时针" | "逆时针";
  speedFactor: number;
  torqueFactor: number;
  speedChangePercent: number;
  conclusion: string;
}

export function analyzeGearPair(
  inputRpm: number,
  inputDirection: 1 | -1,
  driverTeeth: number,
  drivenTeeth: number,
): GearAnalysis {
  const ratio = getTransmissionRatio(driverTeeth, drivenTeeth);
  const drivenRpm = getDrivenRpm(
    inputRpm,
    inputDirection,
    driverTeeth,
    drivenTeeth,
  );
  const speedFactor = Math.abs(drivenRpm) / inputRpm;
  const speedChangePercent = (speedFactor - 1) * 100;

  let conclusion: string;
  if (ratio > 1.001) {
    conclusion = `从动轮齿数更多，因此系统减速并增大理想输出扭矩。`;
  } else if (ratio < 0.999) {
    conclusion = `从动轮齿数更少，因此系统增速，但理想输出扭矩相应降低。`;
  } else {
    conclusion = `两个齿轮齿数相同，因此转速大小保持一致，仅旋转方向相反。`;
  }

  return {
    ratio,
    drivenRpm,
    drivenDirection: getDirectionLabel(drivenRpm),
    driverDirection: getDirectionLabel(inputDirection),
    speedFactor,
    torqueFactor: ratio,
    speedChangePercent,
    conclusion,
  };
}
