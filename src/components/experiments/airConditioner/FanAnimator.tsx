import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";

export function FanAnimator({ indoorFanRef, outdoorFanRef }: { indoorFanRef: RefObject<Group | null>; outdoorFanRef: RefObject<Group | null> }) {
  const speed = useExperimentStore((state) => state.speed);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);

  useFrame((_, delta) => {
    if (!isPlaying || variant === 3) return;
    const animationSpeed = 0.75 + speed / 55;
    if (indoorFanRef.current) indoorFanRef.current.rotation.x += delta * animationSpeed * 2.4;
    if (outdoorFanRef.current) outdoorFanRef.current.rotation.z -= delta * animationSpeed * 2.05;
  });

  return null;
}
