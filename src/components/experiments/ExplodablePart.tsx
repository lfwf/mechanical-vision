import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type PropsWithChildren } from "react";
import { MathUtils, type Group } from "three";
import { useExperimentStore } from "../../store/useExperimentStore";

/**
 * 可拆装零件的通用包装组件。
 *
 * 每个零件都有两个坐标：
 * - home：正常安装位置；
 * - exploded：拆开后的展示位置。
 *
 * 当零件被标记为 detached 时，组件通过 MathUtils.damp 在每一帧中平滑移动，
 * 避免直接跳到目标位置。这个组件本身不创建具体零件，只负责位置动画、点击选择和选中标记。
 */
interface ExplodablePartProps extends PropsWithChildren {
  id: string;
  home: [number, number, number];
  exploded: [number, number, number];
  assemblyEnabled: boolean;
  selectionRadius?: number;
  rotation?: [number, number, number];
}

export function ExplodablePart({
  id,
  home,
  exploded,
  assemblyEnabled,
  selectionRadius = 0.55,
  rotation = [0, 0, 0],
  children,
}: ExplodablePartProps) {
  const groupRef = useRef<Group>(null);
  const selectedPartId = useExperimentStore((state) => state.selectedPartId);
  const detached = useExperimentStore((state) => state.detachedPartIds.includes(id));
  const selectPart = useExperimentStore((state) => state.selectPart);

  // 只有进入“零件拆装”模式后，零件才允许移动到 exploded 坐标。
  const target = assemblyEnabled && detached ? exploded : home;
  const selected = selectedPartId === id;

  // 选择环只用于拆装模式。运行演示中隐藏它，避免圆环遮住气流、管路和内部结构。
  const showSelectionIndicator = assemblyEnabled && selected;
  const indicatorRadius = Math.min(Math.max(selectionRadius * 0.58, 0.24), 1.15);
  const indicatorTube = Math.min(Math.max(indicatorRadius * 0.018, 0.01), 0.024);

  // 首次挂载时直接设置初始坐标，防止模型从世界原点滑入画面。
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.position.set(...target);
  }, []);

  // 每帧向目标坐标阻尼插值，形成平滑拆装动画。
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const step = Math.min(delta, 0.05);
    group.position.x = MathUtils.damp(group.position.x, target[0], 10, step);
    group.position.y = MathUtils.damp(group.position.y, target[1], 10, step);
    group.position.z = MathUtils.damp(group.position.z, target[2], 10, step);
  });

  return (
    <group
      ref={groupRef}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        selectPart(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {children}
      {showSelectionIndicator && (
        <group renderOrder={30}>
          <mesh>
            <torusGeometry args={[indicatorRadius, indicatorTube, 10, 64]} />
            <meshBasicMaterial color="#55c2cd" transparent opacity={0.72} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[indicatorRadius, indicatorTube, 10, 64]} />
            <meshBasicMaterial color="#55c2cd" transparent opacity={0.42} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[indicatorRadius * 0.06, 16, 12]} />
            <meshBasicMaterial color="#b9f1f5" transparent opacity={0.9} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}
