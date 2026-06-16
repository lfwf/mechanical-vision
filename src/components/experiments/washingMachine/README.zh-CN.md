# 滚筒洗衣机 3D 实验架构

## 参考边界

当前参考机型为 LG WM4000HWA，4.5 cu. ft. 前置式洗衣机。

公开资料用于确认型号、容量、前置式产品边界、Direct Drive Motor、Stainless Steel Drum、TurboWash 360、蒸汽和钢化玻璃门等信息。当前尚未获得可覆盖所有生产批次的原厂 CAD、完整服务手册和型号专用爆炸图，因此模型定位为 L2 结构拓扑与运动关系级。

模型不得用于备件适配、紧固扭矩、维修工时、带电诊断或实际拆机决策。

## 坐标系

- X 轴：向右为正。
- Y 轴：向上为正。
- Z 轴：机门方向为正，后置直驱电机方向为负。
- 机壳骨架是固定参考系。
- 外筒、配重、轴承座、定子和内筒轴系位于悬挂外筒总成层级。
- 内筒和转子围绕 Z 轴旋转，外筒不随内筒旋转。

## 模式定义

模式统一定义在 `src/data/experiments/washingMachineModes.ts`：

1. `WashWaterPath`：进水、投放、外筒储水、内筒穿孔和压力水位检测。
2. `DriveCutaway`：定子、转子、主轴、三脚架、轴承、油封和内外筒关系。
3. `SpinSuspension`：偏载、高速旋转、外筒有限摆动、配重、弹簧和减震器。
4. `DrainPath`：外筒最低点、集水波纹管、过滤器、排水泵和排水软管。
5. `Assembly`：零件选择、前置依赖、拆下、装回、全部展开和全部组装。

运行模式与拆装模式分离。进入拆装模式后，运行原理动画自动暂停；运行模式不显示零件选择环。

## 调用关系

```text
WashingMachineScene
├── ExperimentCanvas
├── WashingMachineAssembly
│   ├── CabinetAssembly
│   ├── DoorAssembly
│   ├── suspendedTubRef
│   │   ├── DrumDriveAssembly
│   │   └── TubMountedSuspensionParts
│   ├── SuspensionLinks
│   └── WaterSystemAssembly
└── WashingMachineModeGuide
```

## 文件职责

- `WashingMachineScene.tsx`：选择模式相机并挂载总装和说明卡。
- `WashingMachineAssembly.tsx`：统一管理内筒角度、直驱转子角度和悬挂外筒位移。
- `washingMachineCameraPresets.ts`：维护每种模式的相机位置和观察目标。
- `WashingMachineModeGuide.tsx`：显示目标、重点零件、观察顺序、图例和动画状态。
- `assemblies/CabinetAssembly.tsx`：机壳骨架、顶盖、前后板、控制面板、抽屉和主控板。
- `assemblies/DoorAssembly.tsx`：门、门锁、门封和内外卡箍。
- `assemblies/DrumDriveAssembly.tsx`：内外筒、三脚架、主轴、轴承油封、定子、转子和同轴提示。
- `assemblies/SuspensionAssembly.tsx`：配重、弹簧和减震器；连接件每帧读取外筒位置。
- `assemblies/WaterSystemAssembly.tsx`：进水、投放、压力气路、排水管路和示踪流动。

## 零件数据与拆装机制

零件说明书位于：

`src/data/experiments/parts/washingMachineParts.ts`

每个零件包含唯一 ID、编码、系统、位置、功能、拆卸顺序、前置零件 ID、拆卸方向、故障、风险、来源和证据等级。

`useExperimentStore` 在拆下零件时检查 `prerequisitePartIds`。前置零件未拆除时，操作被拒绝，并把阻挡零件写入 `blockedPartIds`。装回时执行反向检查，防止外层零件先于内部零件复位。

`ExplodablePart` 只处理 home/exploded 坐标插值和选择显示，不决定业务依赖。

## 水流动画

静态软管负责表达真实连接拓扑，少量示踪粒子只用于显示方向：

```text
供水接口 → 进水阀 → 分配器 → 外筒
外筒最低点 → 集水波纹管 → 泵过滤器 → 排水泵 → 排水软管
外筒气室 → 压力细管 → 上部压力传感器
```

暂停时，示踪粒子保持当前位置，不继续移动。

## 旋转和减震动画

- 洗涤模式：内筒低速正反转。
- 驱动模式：内筒和转子低速连续旋转，用于观察同轴关系。
- 脱水模式：内筒和转子高速旋转，悬挂外筒总成产生小幅教学摆动。
- 配重属于外筒总成，会与外筒一起移动。
- 弹簧和减震器位于固定机壳与悬挂外筒之间，每帧重新计算长度和方向。
- 该动画不是有限元、多体动力学或实机振动仿真。

## 建模精度边界

已确认：型号、容量、前置式、直驱和不锈钢内筒等产品边界。

工程推断：轴系、悬挂、水路、压力水位和排水系统的正确拓扑。

教学简化：外筒壳体细节、加强筋、紧固件数量、线束、软管曲率和部分零件外形。

当前不建模：缺乏型号级资料确认的加热器具体形状、蒸汽发生路径、TurboWash 专有循环泵和喷嘴布置。

## 验证

执行：

```bash
npm run verify
```

家电检查会验证：

- 零件 ID 与编码唯一；
- 说明书和三维场景 ID 双向映射；
- 前置零件 ID 存在；
- 拆装依赖不存在循环；
- 必要系统分类存在。
