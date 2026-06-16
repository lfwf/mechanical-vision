import { useRef } from "react";
import type { Group } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "../ExperimentCanvas";
import { AirConditionerModeGuide } from "./AirConditionerModeGuide";
import { AirflowVisualization } from "./AirflowVisualization";
import { ConnectionBundle } from "./ConnectionBundle";
import { CoolingCycle } from "./CoolingCycle";
import { DrainageVisualization } from "./DrainageVisualization";
import { FanAnimator } from "./FanAnimator";
import { IndoorUnit } from "./IndoorUnit";
import { OutdoorUnit } from "./OutdoorUnit";

/**
 * 空调场景入口。
 *
 * 这个文件负责“编排”，不负责绘制具体零件：
 * - IndoorUnit / OutdoorUnit：室内外机装配结构；
 * - ConnectionBundle：气管、液管、排水管和通信线；
 * - CoolingCycle / AirflowVisualization / DrainageVisualization：三种运行原理动画；
 * - AirConditionerModeGuide：固定在画面左上角的阅读说明。
 */

/**
 * 四个模式使用不同镜头，避免所有内容都挤在同一个正视全景中。
 * position 是相机位置，target 是相机注视点。
 */
const CAMERA_PRESETS: Array<{
  position: [number, number, number];
  target: [number, number, number];
}> = [
  // 制冷循环：同时看到室内机、室外机和两根连接铜管。
  { position: [12.6, 6.8, 15.2], target: [0, 0.42, 0.05] },
  // 空气流动：稍微降低视角，突出两个风道的前后关系。
  { position: [11.2, 5.6, 14.2], target: [-0.2, 0.55, 0.45] },
  // 排水路径：镜头靠近室内机，重点观察蒸发器、接水盘和排水口。
  { position: [6.8, 4.4, 10.6], target: [-3.95, 0.75, 0.35] },
  // 零件拆装：拉远镜头，为全部爆炸展开预留空间。
  { position: [14.2, 8.8, 17.5], target: [0, 0.45, 0] },
];

function AirConditionerAssembly() {
  // 风扇引用交给 FanAnimator，每一帧直接修改旋转角度，避免触发 React 重渲染。
  const indoorFanRef = useRef<Group>(null);
  const outdoorFanRef = useRef<Group>(null);

  const cutawayPercent = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const assemblyEnabled = variant === 3;
  const drainageMode = variant === 2;

  // 控制面板给出 0～100，先归一化为 0～1，再转换成外壳不透明度。
  // 指数 0.68 让中低档位变化更明显，不需要拖到 100% 才能看清内部。
  const cutaway = Math.min(1, Math.max(0, cutawayPercent / 100));
  const shellOpacity = 1 - 0.86 * Math.pow(cutaway, 0.68);

  return (
    <group>
      <FanAnimator indoorFanRef={indoorFanRef} outdoorFanRef={outdoorFanRef} />

      {/* 室内机始终显示；排水模式会进一步隐藏过滤件和前面板。 */}
      <IndoorUnit
        assemblyEnabled={assemblyEnabled}
        shellOpacity={shellOpacity}
        fanRef={indoorFanRef}
        variant={variant}
      />

      {/* 排水完全发生在室内机侧，因此该模式隐藏室外机，减少无关信息。 */}
      <group visible={!drainageMode}>
        <OutdoorUnit
          assemblyEnabled={assemblyEnabled}
          shellOpacity={shellOpacity}
          fanRef={outdoorFanRef}
          variant={variant}
        />
      </group>

      {/* 室内外连接通道会根据模式自动突出相关管路。 */}
      <ConnectionBundle variant={variant} />

      {/* 三种动画组件内部会检查 variant，只有当前模式对应的组件真正渲染。 */}
      <CoolingCycle />
      <AirflowVisualization />
      <DrainageVisualization />

      {/* 画面内的短标签用于标识设备；完整说明放在左上角模式引导卡。 */}
      {assemblyEnabled ? (
        <>
          <SceneLabel position={[-4.2, 5.55, 0]}>室内机 · 15 个主要组件</SceneLabel>
          <SceneLabel position={[4.4, 4.65, 0]}>室外机 · 12 个主要组件</SceneLabel>
        </>
      ) : drainageMode ? (
        <SceneLabel position={[-4.2, 3.95, 0.2]}>室内机排水剖视</SceneLabel>
      ) : (
        <>
          <SceneLabel position={[-4.2, 3.35, 0]}>FTXM35R 室内机剖视</SceneLabel>
          <SceneLabel position={[4.4, 2.9, 0]}>RXM35R 室外机剖视</SceneLabel>
        </>
      )}

      {/* 中性展示台只接收阴影，不代表真实安装地面。 */}
      <mesh position={[0, -2.8, 0]} receiveShadow>
        <boxGeometry args={[15.8, 0.16, 7.8]} />
        <meshStandardMaterial color="#d9deda" metalness={0.03} roughness={0.82} />
      </mesh>
    </group>
  );
}

export default function AirConditionerScene() {
  const variant = useExperimentStore((state) => state.variant);
  const preset = CAMERA_PRESETS[variant] ?? CAMERA_PRESETS[0];

  return (
    <ExperimentCanvas
      camera={preset.position}
      target={preset.target}
      cameraKey={`air-conditioner-mode-${variant}`}
      gridY={-2.95}
      shadowY={-2.91}
      background="#e8ece9"
      minDistance={variant === 2 ? 6 : 9}
      maxDistance={variant === 2 ? 18 : 31}
    >
      <AirConditionerAssembly />
      <AirConditionerModeGuide />
    </ExperimentCanvas>
  );
}
