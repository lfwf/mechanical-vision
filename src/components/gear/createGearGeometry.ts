import { ExtrudeGeometry, Path, Shape } from "three";
import { GEAR_MODULE, PRESSURE_ANGLE_RADIANS } from "../../lib/gearMath";
import { createInvoluteGearProfile } from "../../lib/involuteProfile";

export function createGearGeometry(teeth: number, thickness = 0.42): ExtrudeGeometry {
  const profile = createInvoluteGearProfile(teeth);
  const shape = new Shape();

  profile.outline.forEach((point, index) => {
    if (index === 0) shape.moveTo(point.x, point.y);
    else shape.lineTo(point.x, point.y);
  });
  shape.closePath();

  const boreRadius = Math.max(0.18, profile.rootRadius * 0.2);
  const hole = new Path();
  hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const bevelSize = Math.min(GEAR_MODULE * 0.06, thickness * 0.04);
  const geometry = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
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
    pitchRadius: profile.pitchRadius,
    baseRadius: profile.baseRadius,
    outerRadius: profile.outerRadius,
    rootRadius: profile.rootRadius,
    precisionLevel: "L2",
    limitation: "齿根过渡为教学展示级简化",
  };

  return geometry;
}
