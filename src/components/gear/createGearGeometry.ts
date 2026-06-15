import { ExtrudeGeometry, Path, Shape } from "three";
import { getOuterRadius, getRootRadius } from "../../lib/gearMath";

export function createGearGeometry(teeth: number, thickness = 0.42): ExtrudeGeometry {
  const outerRadius = getOuterRadius(teeth);
  const rootRadius = getRootRadius(teeth);
  const pitchRadius = (outerRadius + rootRadius) / 2;
  const toothAngle = (Math.PI * 2) / teeth;
  const shape = new Shape();

  for (let tooth = 0; tooth < teeth; tooth += 1) {
    const base = tooth * toothAngle;
    const profile = [
      { offset: 0, radius: rootRadius },
      { offset: 0.14, radius: rootRadius },
      { offset: 0.24, radius: pitchRadius },
      { offset: 0.31, radius: outerRadius },
      { offset: 0.69, radius: outerRadius },
      { offset: 0.76, radius: pitchRadius },
      { offset: 0.86, radius: rootRadius },
      { offset: 1, radius: rootRadius },
    ];

    profile.forEach(({ offset, radius }, index) => {
      const angle = base + offset * toothAngle;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (tooth === 0 && index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }

  shape.closePath();

  const boreRadius = Math.max(0.18, getRootRadius(teeth) * 0.2);
  const hole = new Path();
  hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: Math.min(0.045, thickness * 0.12),
    bevelThickness: Math.min(0.045, thickness * 0.12),
    curveSegments: 24,
    steps: 1,
  });

  geometry.center();
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}
