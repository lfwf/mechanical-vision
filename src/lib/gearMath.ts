export const GEAR_MODULE = 0.145;
export const PRESSURE_ANGLE_DEGREES = 20;
export const PRESSURE_ANGLE_RADIANS =
  (PRESSURE_ANGLE_DEGREES * Math.PI) / 180;
export const STANDARD_ADDENDUM_COEFFICIENT = 1;
export const STANDARD_DEDENDUM_COEFFICIENT = 1.25;
export const MIN_STANDARD_TEETH = Math.ceil(
  2 / Math.sin(PRESSURE_ANGLE_RADIANS) ** 2,
);
export const MAX_DEMO_TEETH = 48;

export function assertValidTeeth(teeth: number): void {
  if (!Number.isInteger(teeth)) {
    throw new Error("齿数必须是整数");
  }
  if (teeth < MIN_STANDARD_TEETH || teeth > MAX_DEMO_TEETH) {
    throw new Error(
      `当前无变位教学模型仅允许 ${MIN_STANDARD_TEETH}–${MAX_DEMO_TEETH} 齿`,
    );
  }
}

export function getPitchRadius(teeth: number): number {
  return (GEAR_MODULE * teeth) / 2;
}

export function getBaseRadius(teeth: number): number {
  return getPitchRadius(teeth) * Math.cos(PRESSURE_ANGLE_RADIANS);
}

export function getOuterRadius(teeth: number): number {
  return (
    getPitchRadius(teeth) + GEAR_MODULE * STANDARD_ADDENDUM_COEFFICIENT
  );
}

export function getRootRadius(teeth: number): number {
  return Math.max(
    getPitchRadius(teeth) - GEAR_MODULE * STANDARD_DEDENDUM_COEFFICIENT,
    GEAR_MODULE * 1.8,
  );
}

export function getCircularPitch(): number {
  return Math.PI * GEAR_MODULE;
}

export function getBasePitch(): number {
  return getCircularPitch() * Math.cos(PRESSURE_ANGLE_RADIANS);
}

export function getCenterDistance(driverTeeth: number, drivenTeeth: number): number {
  return getPitchRadius(driverTeeth) + getPitchRadius(drivenTeeth);
}

/**
 * 当前几何以 0 弧度方向的齿中心作为主动轮初始相位。
 * 从动轮在两轴连线方向必须以齿槽中心迎向主动轮。
 * Three.js 绕 Y 轴正旋转与齿廓在 XZ 平面中的可见角度方向相反，
 * 因此这里返回的是组 rotation.y 使用的相位，而不是二维齿廓角度。
 */
export function getExternalMeshPhaseOffset(drivenTeeth: number): number {
  return Math.PI / drivenTeeth - Math.PI;
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

export interface ContactGeometry {
  approachLength: number;
  recessLength: number;
  pathOfContact: number;
  basePitch: number;
  contactRatio: number;
}

/**
 * 标准、无变位外啮合直齿轮在端面内的理论接触路径。
 * 该结果只用于几何教学，不包含齿宽重合度、弹性变形和制造误差。
 */
export function getContactGeometry(
  driverTeeth: number,
  drivenTeeth: number,
): ContactGeometry {
  const driverPitchRadius = getPitchRadius(driverTeeth);
  const drivenPitchRadius = getPitchRadius(drivenTeeth);
  const driverBaseRadius = getBaseRadius(driverTeeth);
  const drivenBaseRadius = getBaseRadius(drivenTeeth);
  const driverOuterRadius = getOuterRadius(driverTeeth);
  const drivenOuterRadius = getOuterRadius(drivenTeeth);
  const pressureProjection = Math.sin(PRESSURE_ANGLE_RADIANS);

  const approachLength =
    Math.sqrt(drivenOuterRadius ** 2 - drivenBaseRadius ** 2) -
    drivenPitchRadius * pressureProjection;
  const recessLength =
    Math.sqrt(driverOuterRadius ** 2 - driverBaseRadius ** 2) -
    driverPitchRadius * pressureProjection;
  const pathOfContact = approachLength + recessLength;
  const basePitch = getBasePitch();

  return {
    approachLength,
    recessLength,
    pathOfContact,
    basePitch,
    contactRatio: pathOfContact / basePitch,
  };
}

export function normalizeCycle(value: number): number {
  return ((value % 1) + 1) % 1;
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
  contactRatio: number;
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
  const contactRatio = getContactGeometry(driverTeeth, drivenTeeth).contactRatio;

  let conclusion: string;
  if (ratio > 1.001) {
    conclusion = "从动轮齿数更多，因此系统减速并提高理想输出转矩比例。";
  } else if (ratio < 0.999) {
    conclusion = "从动轮齿数更少，因此系统增速，理想输出转矩比例相应降低。";
  } else {
    conclusion = "两个齿轮齿数相同，因此转速大小保持一致，仅旋转方向相反。";
  }

  return {
    ratio,
    drivenRpm,
    drivenDirection: getDirectionLabel(drivenRpm),
    driverDirection: getDirectionLabel(inputDirection),
    speedFactor,
    torqueFactor: ratio,
    speedChangePercent,
    contactRatio,
    conclusion,
  };
}
