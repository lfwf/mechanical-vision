import type { RefObject } from "react";
import type { Group } from "three";
import { ExplodablePart } from "../ExplodablePart";
import { CrossFlowFan } from "./AirflowGeometry";
import { IndoorFrontPanelCutaway, IndoorRearChassisCutaway } from "./CutawayShellGeometry";
import { WallPlate } from "./DetailGeometry";
import { IndoorHeatExchanger } from "./HeatExchangers";
import {
  IndoorControlAssembly,
  IndoorDrainPan,
  IndoorFanMotor,
  IndoorFilterCassettes,
  IndoorFineFilterModules,
  IndoorHorizontalLouver,
  IndoorIntakeGrille,
  IndoorPipeTerminals,
  IndoorSensorHarness,
  IndoorVerticalVanes,
} from "./IndoorUnitGeometry";
import { IndoorSectionFrame } from "./SectionViewGeometry";

/**
 * 室内机总装组件。
 *
 * 这里不负责绘制零件的细节，而是负责三件事：
 * 1. 给每个零件分配正常安装位置 home；
 * 2. 给每个零件分配爆炸展示位置 exploded；
 * 3. 根据当前演示模式决定哪些遮挡件应该显示。
 *
 * 坐标系约定：X 为机身左右方向，Y 为上下方向，Z 为前后方向；Z 越大越靠近观察者。
 */
interface IndoorUnitProps {
  assemblyEnabled: boolean;
  shellOpacity: number;
  fanRef: RefObject<Group | null>;
  variant: number;
}

export function IndoorUnit({ assemblyEnabled, shellOpacity, fanRef, variant }: IndoorUnitProps) {
  const operatingMode = variant < 3;
  const drainageMode = variant === 2;

  // 过滤件只对“空气流动”和“零件拆装”有直接教学价值。
  // 制冷和排水模式隐藏过滤件，避免遮挡换热器、贯流风轮与接水盘。
  const showAirPathParts = variant === 1 || assemblyEnabled;

  // 运行演示时后壳只保留淡淡的结构边界；拆装模式则响应用户设置的剖视程度。
  const rearOpacity = operatingMode
    ? Math.min(shellOpacity, variant === 0 ? 0.38 : variant === 1 ? 0.24 : 0.18)
    : shellOpacity;

  return (
    <group position={[-4.2, 1, 0]}>
      {/* 运行模式使用剖视框保留室内机轮廓，而不是用完整前面板挡住内部结构。 */}
      {operatingMode && <IndoorSectionFrame intensity={drainageMode ? 0.72 : 0.48} />}

      {/* 承载层：墙板和后壳是所有室内零件的安装基础。 */}
      <ExplodablePart id="ac-indoor-wall-plate" home={[0, 0, -1.02]} exploded={[0, 3.8, -2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={2.65}>
        <WallPlate />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-rear-chassis" home={[0, 0, -0.72]} exploded={[0, 3.35, -1.55]} assemblyEnabled={assemblyEnabled} selectionRadius={2.85}>
        <IndoorRearChassisCutaway opacity={rearOpacity} />
      </ExplodablePart>

      {/* 换热与送风层：蒸发器包覆在贯流风轮上方，风轮沿机身宽度横向布置。 */}
      <ExplodablePart id="ac-indoor-heat-exchanger" home={[0, 0.25, -0.1]} exploded={[0, 3.15, -0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={2.65}>
        <IndoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-crossflow-fan" home={[0, -0.48, 0.02]} exploded={[0, -3.05, 0.08]} assemblyEnabled={assemblyEnabled} selectionRadius={1.45}>
        <CrossFlowFan fanRef={fanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-fan-motor" home={[2.58, -0.48, 0.02]} exploded={[3.82, -2.05, 1.02]} assemblyEnabled={assemblyEnabled} selectionRadius={0.64}>
        <IndoorFanMotor />
      </ExplodablePart>

      {/* 排水层：接水盘位于蒸发器下方，并通过右侧排水口连接排水软管。 */}
      <ExplodablePart id="ac-indoor-drain-pan" home={[0, -0.68, 0.17]} exploded={[0, -2.75, 1.3]} assemblyEnabled={assemblyEnabled} selectionRadius={2.38}>
        <IndoorDrainPan />
      </ExplodablePart>

      {/* 导风层：垂直叶片控制左右方向，水平导风板控制上下送风角度。 */}
      <ExplodablePart id="ac-indoor-vertical-vanes" home={[0, -0.76, 0.62]} exploded={[0, -2.25, 2.3]} assemblyEnabled={assemblyEnabled} selectionRadius={2.3}>
        <IndoorVerticalVanes />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-horizontal-louver" home={[0, -0.96, 0.88]} exploded={[0, -2.85, 3.42]} assemblyEnabled={assemblyEnabled} selectionRadius={2.2} rotation={[0.16, 0, 0]}>
        <IndoorHorizontalLouver />
      </ExplodablePart>

      {/* 电控与检测层集中在室内机右侧，减少与主风道的相互干扰。 */}
      <ExplodablePart id="ac-indoor-control-box" home={[2.24, 0.26, 0.04]} exploded={[3.82, 1.78, 1.45]} assemblyEnabled={assemblyEnabled} selectionRadius={0.88}>
        <IndoorControlAssembly />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-sensor-harness" home={[0.92, 0.56, 0.22]} exploded={[3.05, 3.02, 1.68]} assemblyEnabled={assemblyEnabled} selectionRadius={0.74}>
        <IndoorSensorHarness />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-refrigerant-connections" home={[2.72, -0.08, -0.48]} exploded={[4.22, -0.18, -1.92]} assemblyEnabled={assemblyEnabled} selectionRadius={0.85}>
        <IndoorPipeTerminals />
      </ExplodablePart>

      {/* 进风过滤层只在空气路径和拆装模式中出现。 */}
      <ExplodablePart id="ac-indoor-fine-filter" home={[0, 0.64, 0.57]} exploded={[0, 2.72, 1.52]} assemblyEnabled={assemblyEnabled} selectionRadius={1.38}>
        <group visible={showAirPathParts}><IndoorFineFilterModules /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-filter" home={[0, 0.54, 0.7]} exploded={[0, 2.32, 2.08]} assemblyEnabled={assemblyEnabled} selectionRadius={2.55}>
        <group visible={showAirPathParts}><IndoorFilterCassettes /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-intake-grille" home={[0, 0.82, 0.82]} exploded={[0, 3.35, 2.82]} assemblyEnabled={assemblyEnabled} selectionRadius={2.68} rotation={[-0.14, 0, 0]}>
        <group visible={showAirPathParts}><IndoorIntakeGrille /></group>
      </ExplodablePart>

      {/*
       * 完整前面板只在拆装模式显示。
       * 运行模式直接隐藏前面板，避免出现“面板悬浮在机器上方”的视觉干扰。
       */}
      <ExplodablePart id="ac-indoor-front-panel" home={[0, 0.03, 1.02]} exploded={[0, 0.78, 4.18]} assemblyEnabled={assemblyEnabled} selectionRadius={2.9}>
        <group visible={assemblyEnabled}>
          <IndoorFrontPanelCutaway opacity={shellOpacity} />
        </group>
      </ExplodablePart>
    </group>
  );
}
