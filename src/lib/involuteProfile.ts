import {
  PRESSURE_ANGLE_RADIANS,
  assertValidTeeth,
  getBaseRadius,
  getOuterRadius,
  getPitchRadius,
  getRootRadius,
} from "./gearMath.ts";

export interface Point2 {
  x: number;
  y: number;
}

export interface InvoluteProfileData {
  outline: Point2[];
  pitchRadius: number;
  baseRadius: number;
  outerRadius: number;
  rootRadius: number;
}

const INVOLUTE_SEGMENTS = 14;
const TIP_ARC_SEGMENTS = 5;
const ROOT_ARC_SEGMENTS = 7;

function involuteAngle(parameter: number): number {
  return parameter - Math.atan(parameter);
}

function pointOnCircle(radius: number, angle: number): Point2 {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function appendArc(
  points: Point2[],
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number,
  includeStart = false,
): void {
  const startIndex = includeStart ? 0 : 1;
  for (let index = startIndex; index <= segments; index += 1) {
    const progress = index / segments;
    const angle = startAngle + (endAngle - startAngle) * progress;
    points.push(pointOnCircle(radius, angle));
  }
}

/**
 * 生成标准 20° 压力角、无变位、全齿高制直齿轮的二维端面轮廓。
 * 齿面采用基圆渐开线，齿根连接是教学展示级简化，不代表滚刀包络圆角。
 */
export function createInvoluteGearProfile(teeth: number): InvoluteProfileData {
  assertValidTeeth(teeth);

  const pitchRadius = getPitchRadius(teeth);
  const baseRadius = getBaseRadius(teeth);
  const outerRadius = getOuterRadius(teeth);
  const rootRadius = getRootRadius(teeth);
  const toothPitchAngle = (Math.PI * 2) / teeth;
  const halfToothAngleAtPitch = Math.PI / (2 * teeth);

  const pitchInvoluteParameter = Math.tan(PRESSURE_ANGLE_RADIANS);
  const pitchInvoluteAngle = involuteAngle(pitchInvoluteParameter);
  const flankStartRadius = Math.max(baseRadius, rootRadius);
  const flankStartParameter = Math.sqrt(
    Math.max((flankStartRadius / baseRadius) ** 2 - 1, 0),
  );
  const flankEndParameter = Math.sqrt(
    Math.max((outerRadius / baseRadius) ** 2 - 1, 0),
  );

  const halfThicknessAngleAtRadius = (parameter: number): number =>
    halfToothAngleAtPitch + pitchInvoluteAngle - involuteAngle(parameter);

  const rootFlankAngle = halfThicknessAngleAtRadius(flankStartParameter);
  const tipFlankAngle = halfThicknessAngleAtRadius(flankEndParameter);
  const outline: Point2[] = [];

  for (let toothIndex = 0; toothIndex < teeth; toothIndex += 1) {
    const toothCenterAngle = toothIndex * toothPitchAngle;
    const previousValleyAngle = toothCenterAngle - toothPitchAngle / 2;
    const rightRootAngle = toothCenterAngle - rootFlankAngle;

    appendArc(
      outline,
      rootRadius,
      previousValleyAngle,
      rightRootAngle,
      ROOT_ARC_SEGMENTS,
      toothIndex === 0,
    );

    if (flankStartRadius > rootRadius) {
      outline.push(pointOnCircle(flankStartRadius, rightRootAngle));
    }

    for (let segment = 1; segment <= INVOLUTE_SEGMENTS; segment += 1) {
      const progress = segment / INVOLUTE_SEGMENTS;
      const parameter =
        flankStartParameter +
        (flankEndParameter - flankStartParameter) * progress;
      const radius = baseRadius * Math.sqrt(1 + parameter ** 2);
      const angle = toothCenterAngle - halfThicknessAngleAtRadius(parameter);
      outline.push(pointOnCircle(radius, angle));
    }

    appendArc(
      outline,
      outerRadius,
      toothCenterAngle - tipFlankAngle,
      toothCenterAngle + tipFlankAngle,
      TIP_ARC_SEGMENTS,
    );

    for (let segment = 1; segment <= INVOLUTE_SEGMENTS; segment += 1) {
      const progress = segment / INVOLUTE_SEGMENTS;
      const parameter =
        flankEndParameter -
        (flankEndParameter - flankStartParameter) * progress;
      const radius = baseRadius * Math.sqrt(1 + parameter ** 2);
      const angle = toothCenterAngle + halfThicknessAngleAtRadius(parameter);
      outline.push(pointOnCircle(radius, angle));
    }

    const leftRootAngle = toothCenterAngle + rootFlankAngle;
    if (flankStartRadius > rootRadius) {
      outline.push(pointOnCircle(rootRadius, leftRootAngle));
    }

    appendArc(
      outline,
      rootRadius,
      leftRootAngle,
      toothCenterAngle + toothPitchAngle / 2,
      ROOT_ARC_SEGMENTS,
    );
  }

  return {
    outline,
    pitchRadius,
    baseRadius,
    outerRadius,
    rootRadius,
  };
}
