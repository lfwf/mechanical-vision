import { ExtrudeGeometry, Path, Shape, Vector2 } from "three";
import {
  GEAR_MODULE,
  PRESSURE_ANGLE_RADIANS,
  getBaseRadius,
  getOuterRadius,
  getPitchRadius,
  getRootRadius,
} from "../../lib/gearMath";

const INVOLUTE_SEGMENTS = 10;
const TIP_ARC_SEGMENTS = 4;
const ROOT_ARC_SEGMENTS = 5;

function involuteAngle(parameter: number): number {
  return parameter - Math.atan(parameter);
}

function pointOnCircle(radius: number, angle: number): Vector2 {
  return new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

function appendArc(
  points: Vector2[],
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
 * 生成标准 20° 压力角、全齿高制的渐开线直齿圆柱齿轮。
 *
 * 齿廓采用真实渐开线 flank：
 * - 节圆处齿厚 = 圆周齿距的一半；
 * - 齿顶高 = 1m；
 * - 齿根高 = 1.25m；
 * - 两个同模数齿轮按标准中心距放置后不会发生几何穿透。
 *
 * 齿根过渡圆角仍采用简化的径向连接，教学展示足够，
 * 但不是用于加工出图的刀具包络曲线。
 */
export function createGearGeometry(teeth: number, thickness = 0.42): ExtrudeGeometry {
  if (!Number.isInteger(teeth) || teeth < 12) {
    throw new Error("齿数必须是大于等于 12 的整数");
  }

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
    halfToothAngleAtPitch +
    pitchInvoluteAngle -
    involuteAngle(parameter);

  const rootFlankAngle = halfThicknessAngleAtRadius(flankStartParameter);
  const tipFlankAngle = halfThicknessAngleAtRadius(flankEndParameter);
  const outline: Vector2[] = [];

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
      const angle =
        toothCenterAngle - halfThicknessAngleAtRadius(parameter);
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
      const angle =
        toothCenterAngle + halfThicknessAngleAtRadius(parameter);
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

  const shape = new Shape();
  outline.forEach((point, index) => {
    if (index === 0) shape.moveTo(point.x, point.y);
    else shape.lineTo(point.x, point.y);
  });
  shape.closePath();

  const boreRadius = Math.max(0.18, rootRadius * 0.2);
  const hole = new Path();
  hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const bevelSize = Math.min(GEAR_MODULE * 0.08, thickness * 0.05);
  const geometry = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize,
    bevelThickness: bevelSize,
    curveSegments: 32,
    steps: 1,
  });

  geometry.center();
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  geometry.userData = {
    teeth,
    module: GEAR_MODULE,
    pressureAngle: PRESSURE_ANGLE_RADIANS,
    pitchRadius,
    baseRadius,
    outerRadius,
    rootRadius,
  };

  return geometry;
}
