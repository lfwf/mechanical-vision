import type { RefObject } from "react";
import type { Group } from "three";
import { ExplodablePart } from "../ExplodablePart";
import { TubePath } from "../ScenePrimitives";
import { OutdoorCabinetPanelsCutaway } from "./CutawayShellGeometry";
import { Accumulator, FourWayValve, ServiceValves } from "./DetailGeometry";
import { OutdoorHeatExchanger } from "./HeatExchangers";
import { RealisticAxialFan, RealisticFrontGrille } from "./OutdoorAirflowGeometry";
import {
  OutdoorBasePan,
  OutdoorCompressor,
  OutdoorControlAssembly,
  OutdoorFanMotorAssembly,
  OutdoorMountingFeet,
  OutdoorValvePiping,
} from "./OutdoorUnitGeometry";
import { OutdoorFanSectionRing, OutdoorOperatingFrame } from "./SectionViewGeometry";

/**
 * 室外机总装组件。
 *
 * 空间布局分为两个区域：
 * - 左侧风机舱：冷凝器、轴流风扇、风机电机；
 * - 右侧服务舱：压缩机、四通阀、膨胀阀、服务阀和逆变电控。
 *
 * 运行模式采用“保留骨架、移除外板”的技术剖视表达；
 * 零件拆装模式恢复完整外壳、前格栅和逐件爆炸动画。
 */
interface OutdoorUnitProps {
  assemblyEnabled: boolean;
  shellOpacity: number;
  fanRef: RefObject<Group | null>;
  variant: number;
}

export function OutdoorUnit({ assemblyEnabled, shellOpacity, fanRef, variant }: OutdoorUnitProps) {
  const operatingMode = variant < 3;
  const airflowMode = variant === 1;

  // 送风模式只保留与空气路径直接相关的冷凝器、风扇和电机。
  // 制冷循环和拆装模式则显示压缩机、阀件和电控组件。
  const showRefrigerantComponents = !airflowMode || assemblyEnabled;

  return (
    <group position={[4.4, 0, 0]}>
      {/* 运行演示用中性骨架代替整块透明钣金外壳，减少玻璃盒式遮挡。 */}
      {operatingMode && (
        <>
          <OutdoorOperatingFrame />
          <OutdoorFanSectionRing opacity={airflowMode ? 0.42 : 0.25} />
        </>
      )}

      {/* 承载层：安装脚和底盘承受整台室外机重量。 */}
      <ExplodablePart id="ac-outdoor-mounting-feet" home={[0, -1.82, 0]} exploded={[0, -4.15, 1.1]} assemblyEnabled={assemblyEnabled} selectionRadius={1.9}>
        <OutdoorMountingFeet />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-base-frame" home={[0, -1.56, 0]} exploded={[0, -3.2, -0.4]} assemblyEnabled={assemblyEnabled} selectionRadius={2.4}>
        <OutdoorBasePan />
      </ExplodablePart>

      {/* 换热层：L 形室外换热器从后侧和左侧吸入空气。 */}
      <ExplodablePart id="ac-outdoor-condenser" home={[0, 0.04, -0.08]} exploded={[-0.15, 2.75, -2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={2.5}>
        <OutdoorHeatExchanger />
      </ExplodablePart>

      {/* 制冷剂回路核心集中在右侧服务舱。 */}
      <ExplodablePart id="ac-outdoor-compressor" home={[1.38, -0.58, -0.12]} exploded={[3.55, -1.45, -0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.95}>
        <group visible={showRefrigerantComponents}><OutdoorCompressor /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-four-way-valve" home={[1.08, 0.34, -0.22]} exploded={[3.18, 0.8, -1.65]} assemblyEnabled={assemblyEnabled} selectionRadius={0.9}>
        <group scale={0.88} visible={showRefrigerantComponents}>
          <FourWayValve />
          <group position={[-0.78, -0.52, -0.08]} scale={0.84}><Accumulator /></group>
          <OutdoorValvePiping />
        </group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-expansion-valve" home={[0.92, -0.64, -0.58]} exploded={[2.98, -0.55, -2.2]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
        <group scale={0.86} visible={showRefrigerantComponents}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.19, 0.48, 28]} />
            <meshStandardMaterial color="#b47a35" metalness={0.76} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
            <meshStandardMaterial color="#34494d" metalness={0.55} roughness={0.27} />
          </mesh>
          <TubePath points={[[0, -0.25, 0], [0.2, -0.44, 0.03], [0.48, -0.54, 0.02]]} color="#b66f2f" radius={0.038} />
        </group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-service-valves" home={[2.25, -0.78, 0.28]} exploded={[3.72, -1.35, 1.72]} assemblyEnabled={assemblyEnabled} selectionRadius={0.75}>
        <group scale={0.62} rotation={[0, 0, Math.PI / 2]} visible={showRefrigerantComponents}><ServiceValves /></group>
      </ExplodablePart>

      {/* 风机层：电机位于叶轮后方，三叶风扇向正面排风。 */}
      <ExplodablePart id="ac-outdoor-fan-motor" home={[-0.72, 0.02, -0.02]} exploded={[-2.12, 1.7, 1.72]} assemblyEnabled={assemblyEnabled} selectionRadius={1.45}>
        <OutdoorFanMotorAssembly />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-axial-fan" home={[-0.72, 0.02, 0.55]} exploded={[-2.75, 0.15, 2.72]} assemblyEnabled={assemblyEnabled} selectionRadius={1.35}>
        <RealisticAxialFan fanRef={fanRef} />
      </ExplodablePart>

      {/* 完整前格栅仅在拆装模式显示；运行模式只保留导风圈边界。 */}
      <ExplodablePart id="ac-outdoor-front-grille" home={[-0.72, 0.02, 0.93]} exploded={[-3.65, 0.02, 3.82]} assemblyEnabled={assemblyEnabled} selectionRadius={1.7}>
        <group visible={assemblyEnabled}><RealisticFrontGrille opacity={1} /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-control-box" home={[1.4, 0.93, -0.05]} exploded={[3.42, 2.72, 1.28]} assemblyEnabled={assemblyEnabled} selectionRadius={1.0}>
        <group visible={showRefrigerantComponents}><OutdoorControlAssembly /></group>
      </ExplodablePart>

      {/* 完整钣金外壳只参与零件拆装；运行模式由 OutdoorOperatingFrame 代替。 */}
      <ExplodablePart id="ac-outdoor-cabinet-panels" home={[0, 0.02, 0]} exploded={[2.72, 3.62, 2.62]} assemblyEnabled={assemblyEnabled} selectionRadius={2.8}>
        <group visible={assemblyEnabled}>
          <OutdoorCabinetPanelsCutaway opacity={shellOpacity} />
        </group>
      </ExplodablePart>
    </group>
  );
}
