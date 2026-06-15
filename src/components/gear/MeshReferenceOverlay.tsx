import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import type { Mesh } from "three";
import {
  PRESSURE_ANGLE_RADIANS,
  getCenterDistance,
  getContactGeometry,
  normalizeCycle,
} from "../../lib/gearMath";

interface MeshReferenceOverlayProps {
  driverTeeth: number;
  drivenTeeth: number;
  driverAngle: MutableRefObject<number>;
  inputDirection: 1 | -1;
}

export function MeshReferenceOverlay({
  driverTeeth,
  drivenTeeth,
  driverAngle,
  inputDirection,
}: MeshReferenceOverlayProps) {
  const contactPointRef = useRef<Mesh>(null);
  const centerDistance = getCenterDistance(driverTeeth, drivenTeeth);
  const contact = useMemo(
    () => getContactGeometry(driverTeeth, drivenTeeth),
    [driverTeeth, drivenTeeth],
  );
  const toothPitchAngle = (Math.PI * 2) / driverTeeth;
  const directionX = Math.sin(PRESSURE_ANGLE_RADIANS);
  const directionZ = inputDirection * Math.cos(PRESSURE_ANGLE_RADIANS);
  const overlayY = 0.31;

  const startPoint: [number, number, number] = [
    -contact.approachLength * directionX,
    overlayY,
    -contact.approachLength * directionZ,
  ];
  const endPoint: [number, number, number] = [
    contact.recessLength * directionX,
    overlayY,
    contact.recessLength * directionZ,
  ];

  useFrame(() => {
    if (!contactPointRef.current) return;

    const progress = normalizeCycle(
      (driverAngle.current * inputDirection) / toothPitchAngle,
    );
    const distanceOnPath =
      -contact.approachLength + contact.pathOfContact * progress;

    contactPointRef.current.position.set(
      distanceOnPath * directionX,
      overlayY + 0.015,
      distanceOnPath * directionZ,
    );
  });

  return (
    <group>
      <Line
        points={[
          [-centerDistance / 2, overlayY, 0],
          [centerDistance / 2, overlayY, 0],
        ]}
        color="#687777"
        lineWidth={1}
        transparent
        opacity={0.42}
        dashed
        dashSize={0.08}
        gapSize={0.05}
      />

      <Line
        points={[startPoint, endPoint]}
        color="#b45757"
        lineWidth={2}
        transparent
        opacity={0.9}
      />

      <mesh position={[0, overlayY + 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.045, 0.065, 48]} />
        <meshBasicMaterial color="#f7f1dc" depthWrite={false} />
      </mesh>

      <mesh ref={contactPointRef}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshBasicMaterial color="#f05a47" depthWrite={false} />
      </mesh>

      <Html
        center
        position={[endPoint[0], overlayY + 0.22, endPoint[2]]}
        distanceFactor={9}
        style={{ pointerEvents: "none" }}
      >
        <div className="mesh-reference-label">作用线 · 代表性接触点</div>
      </Html>
    </group>
  );
}
