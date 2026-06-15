import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { ExtrudeGeometry, Shape, type Group } from "three";
import { getPitchRadius, rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { createGearGeometry } from "../gear/createGearGeometry";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";

function createRackGeometry(toothCount = 38, module = 0.145, depth = 0.5) {
  const pitch = Math.PI * module;
  const length = toothCount * pitch;
  const root = -module * 1.25;
  const tip = module;
  const bottom = root - 0.42;
  const pressureAngle = (20 * Math.PI) / 180;
  const rootHalf = pitch / 4 + module * 1.25 * Math.tan(pressureAngle);
  const tipHalf = Math.max(pitch * 0.08, pitch / 4 - module * Math.tan(pressureAngle));
  const shape = new Shape();

  shape.moveTo(-length / 2, bottom);
  shape.lineTo(length / 2, bottom);
  shape.lineTo(length / 2, root);

  for (let index = toothCount - 1; index >= 0; index -= 1) {
    const center = -length / 2 + (index + 0.5) * pitch;
    shape.lineTo(center + rootHalf, root);
    shape.lineTo(center + tipHalf, tip);
    shape.lineTo(center - tipHalf, tip);
    shape.lineTo(center - rootHalf, root);
  }

  shape.lineTo(-length / 2, root);
  shape.closePath();

  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    bevelSegments: 2,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function RackPinionMechanism() {
  const pinionRef = useRef<Group>(null);
  const rackRef = useRef<Group>(null);
  const angle = useRef(0);
  const teeth = useExperimentStore((state) => Math.round(state.primary));
  const speed = useExperimentStore((state) => state.speed);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const pinionGeometry = useMemo(() => createGearGeometry(teeth, 0.48), [teeth]);
  const rackGeometry = useMemo(() => createRackGeometry(), []);
  const pitchRadius = getPitchRadius(teeth);
  const circularPitch = Math.PI * 0.145;

  useEffect(() => () => pinionGeometry.dispose(), [pinionGeometry]);
  useEffect(() => () => rackGeometry.dispose(), [rackGeometry]);

  useFrame((_, delta) => {
    if (isPlaying) {
      angle.current += rpmToRadiansPerSecond(speed * direction) * delta;
    }
    if (pinionRef.current) pinionRef.current.rotation.y = angle.current;
    if (rackRef.current) {
      const raw = -pitchRadius * angle.current;
      rackRef.current.position.x =
        ((raw + circularPitch / 2) % circularPitch + circularPitch) % circularPitch -
        circularPitch / 2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={pinionRef} position={[0, 0.25, pitchRadius]}>
        <mesh geometry={pinionGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#c58c3b" metalness={0.7} roughness={0.22} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 1.1, 40]} />
          <meshStandardMaterial color="#44555a" metalness={0.82} roughness={0.2} />
        </mesh>
      </group>

      <group ref={rackRef} position={[0, 0, 0]}>
        <mesh geometry={rackGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#5e8fa0" metalness={0.62} roughness={0.27} />
        </mesh>
      </group>

      <mesh position={[0, -0.5, -0.08]} receiveShadow>
        <boxGeometry args={[12, 0.28, 0.85]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0, -0.2, -0.5]}>
        <boxGeometry args={[12.5, 0.12, 0.1]} />
        <meshStandardMaterial color="#788785" metalness={0.4} roughness={0.35} />
      </mesh>

      <SceneLabel position={[0, 1.45, pitchRadius + 0.3]}>小齿轮 · {teeth} 齿</SceneLabel>
      <SceneLabel position={[-4, 0.8, -0.2]}>齿条 · 直线运动</SceneLabel>
    </group>
  );
}

export default function RackPinionScene() {
  return (
    <ExperimentCanvas camera={[7.5, 6.5, 11]} target={[0, 0.2, 0]} gridY={-0.72} shadowY={-0.68}>
      <RackPinionMechanism />
    </ExperimentCanvas>
  );
}
