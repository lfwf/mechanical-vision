# 空调 3D 演示代码说明

本目录实现 Daikin Perfera FTXM35R / RXM35R 分体式空调的结构、运行原理和零件拆装演示。

## 一、整体调用关系

```text
AirConditionerScene
├── IndoorUnit                  室内机零件装配
├── OutdoorUnit                 室外机零件装配
├── ConnectionBundle            室内外管束
├── FanAnimator                 两个风扇的逐帧旋转
├── CoolingCycle                制冷剂循环动画
├── AirflowVisualization        室内外空气流动动画
├── DrainageVisualization       冷凝水形成与排放动画
└── AirConditionerModeGuide      左上角模式说明、步骤和图例
```

React 负责组织组件和界面状态；React Three Fiber 负责把 JSX 转换为 Three.js 场景对象；Three.js 负责底层几何体、材质、相机和逐帧渲染。

## 二、坐标系约定

场景中的坐标均使用 `[x, y, z]`：

- `x`：左右方向；
- `y`：上下方向；
- `z`：前后方向，数值越大越靠近观察者。

室内机整体放在 `[-4.2, 1, 0]`，室外机整体放在 `[4.4, 0, 0]`。各零件在自己的设备局部坐标系中定位。

## 三、演示模式索引

`variant` 的索引不能随意修改，因为多个组件都依赖该值：

```text
0 = 制冷循环
1 = 送风路径
2 = 排水路径
3 = 零件拆装
```

模式切换会同时影响：

- 相机位置；
- 零件显隐；
- 风扇是否旋转；
- 哪一种动画显示；
- 连接管束中哪些通道被突出；
- 是否启用零件拆装。

## 四、零件拆装机制

每个可拆零件都被 `ExplodablePart` 包裹：

```tsx
<ExplodablePart
  id="ac-indoor-crossflow-fan"
  home={[0, -0.48, 0.02]}
  exploded={[0, -3.05, 0.08]}
  assemblyEnabled={assemblyEnabled}
>
  <CrossFlowFan fanRef={fanRef} />
</ExplodablePart>
```

- `id`：必须与 `airConditionerParts.ts` 中的零件说明书 ID 完全一致；
- `home`：正常安装位置；
- `exploded`：拆出后的展示位置；
- `assemblyEnabled`：只有零件拆装模式为 `true`；
- `selectionRadius`：选中零件时目标环的尺寸。

`ExplodablePart` 使用 `MathUtils.damp` 在每一帧平滑插值位置，因此零件不会瞬间跳动。

## 五、流动动画机制

### 1. AnimatedFlowLines

将少量路径控制点转换成 `CatmullRomCurve3` 平滑曲线，再使用 Drei `Line` 绘制虚线。每帧修改材质的 `dashOffset`，形成流动效果。

适用于：

- 空气流线；
- 制冷剂方向；
- 接水盘汇流；
- 排水管水流。

### 2. AnimatedFlowParticles

少量球形粒子沿曲线移动，用来增强速度感。它只作为示踪点，不能大量使用，否则画面会变成“珠子串”。

### 3. AnimatedWaterDroplets

使用 `progress = linear ^ gravityBias` 重新映射进度，使水滴在下落前段较慢、后段较快，并在下落过程中纵向拉长。

## 六、实体管路与动画路径

以下公共路径定义在 `ConnectionBundle.tsx`：

- `GAS_LINE_PATH`：粗气管；
- `LIQUID_LINE_PATH`：细液管；
- `DRAIN_LINE_PATH`：排水管；
- `COMMUNICATION_LINE_PATH`：电源和通信线。

制冷和排水动画会直接复用这些路径。修改管束形状时必须同步检查动画，避免实体管路和移动虚线分离。

## 七、运行剖视与拆装外壳的区别

运行模式不再使用完整透明外壳，因为多层透明面会产生排序错误和严重遮挡。

- 运行模式：使用 `SectionViewGeometry.tsx` 中的细框和钣金骨架；
- 拆装模式：使用 `CutawayShellGeometry.tsx` 中的完整外壳，可通过滑块调整透明度。

这种分离能同时满足“看清运行原理”和“观察完整外壳装配”的需求。

## 八、主要文件职责

| 文件 | 职责 |
|---|---|
| `AirConditionerScene.tsx` | 场景编排、相机预设和模式组合 |
| `IndoorUnit.tsx` | 室内机 15 个零件的安装和爆炸坐标 |
| `OutdoorUnit.tsx` | 室外机 12 个零件的安装和爆炸坐标 |
| `IndoorUnitGeometry.tsx` | 室内机零件几何体 |
| `OutdoorUnitGeometry.tsx` | 室外机零件几何体 |
| `HeatExchangers.tsx` | 室内蒸发器和室外冷凝器 |
| `AirflowGeometry.tsx` | 过滤、贯流风轮和通用气流零件 |
| `OutdoorAirflowGeometry.tsx` | 三叶轴流风扇和完整前格栅 |
| `ConnectionBundle.tsx` | 室内外气管、液管、排水管和电缆 |
| `CoolingCycle.tsx` | 四阶段制冷剂循环 |
| `AirflowVisualization.tsx` | 室内外空气路径 |
| `DrainageVisualization.tsx` | 凝水、接水盘汇流和排水 |
| `SectionViewGeometry.tsx` | 运行模式的剖视边框和骨架 |
| `CutawayShellGeometry.tsx` | 拆装模式的完整外壳和透明外壳 |
| `AirConditionerModeGuide.tsx` | 固定说明卡、步骤和颜色图例 |

## 九、零件说明书数据

零件说明书位于：

```text
src/data/experiments/parts/airConditionerParts.ts
```

每条数据包含：

- `id`：和三维零件对应的唯一 ID；
- `name`、`partCode`、`system`；
- `location`、`function`、`connections`；
- `removalOrder`、`removalPrerequisites`、`removalSteps`；
- `installChecks`、`warnings`、`sourceIds`。

该文件属于声明式数据，不参与三维渲染。新增零件时，应同时在总装组件和说明书数组中增加相同 ID。

## 十、继续优化时的原则

1. 先确认真实结构关系，再调整外观；
2. 每个模式只突出一个问题，隐藏无关信息；
3. 空气、制冷剂和水使用不同视觉语言；
4. 不使用大量透明壳体叠加；
5. 新增零件不得继续堆进单个超长文件，应按系统拆分；
6. 修改公共路径后检查实体、动画、标签三个层级是否一致；
7. 网页模型属于教学级 L2 结构表达，不代替原厂 CAD 和维修手册。
