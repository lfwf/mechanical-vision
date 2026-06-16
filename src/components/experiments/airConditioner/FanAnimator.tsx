import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Group } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";

/**
 * 室内贯流风轮和室外轴流风扇的统一旋转控制器。
 *
 * 风扇模型通过 ref 传入，useFrame 每一帧直接累加旋转角度。
 * 这种方式不会触发 React 组件重新渲染，适合持续动画。
 */
export function FanAnimator({
  indoorFanRef,
  outdoorFanRef,
}: {
  indoorFanRef: RefObject<Group | null>;
  outdoorFanRef: RefObject<Group | null>;
}) {
  const speed = useExperimentStore((state) => state.speed);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);

  useFrame((_, delta) => {
    // 排水模式不需要风扇转动；拆装模式停转，便于选择和观察零件。
    if (!isPlaying || variant === 2 || variant === 3) return;

    // speed 为界面中的百分比，转换为适合场景尺度的角速度。
    const animationSpeed = 0.75 + speed / 55;

    // 贯流风轮轴线沿 X 方向，因此绕自身局部 X 轴旋转。
    if (indoorFanRef.current) indoorFanRef.current.rotation.x += delta * animationSpeed * 2.4;

    // 室外轴流风扇朝向观察者，因此绕局部 Z 轴旋转。
    if (outdoorFanRef.current) outdoorFanRef.current.rotation.z -= delta * animationSpeed * 2.05;
  });

  // 该组件只执行逐帧逻辑，不输出任何几何体。
  return null;
}
