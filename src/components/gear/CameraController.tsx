import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getCenterDistance } from "../../lib/gearMath";

interface CameraControllerProps {
  driverTeeth: number;
  drivenTeeth: number;
  resetToken: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export function CameraController({
  driverTeeth,
  drivenTeeth,
  resetToken,
  controlsRef,
}: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    const centerDistance = getCenterDistance(driverTeeth, drivenTeeth);
    const distance = Math.max(8.8, centerDistance * 1.85 + 5.2);

    camera.position.set(0, distance * 0.68, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [camera, controlsRef, driverTeeth, drivenTeeth, resetToken]);

  return null;
}
