# 注塑成型 SENJER 流水线

## 目标

一台教学级卧式注塑机按 `S → E → N → J → E → R` 顺序循环生产六个独立字母制品。每件制品依次经历合模、注射、保压、冷却、开模、顶出、取件、输送和定位，六件完成后组成 `SENJER`，停留展示后清空并开始下一批次。

## 文件职责

- `InjectionMoldingScene.tsx`：场景编排和逐帧状态驱动。
- `InjectionMoldingMachine.tsx`：注射单元、模具、拉杆、顶出和冷却结构。
- `LetterProduct.tsx`：S、E、N、J、R 五种可复用字母制品几何体。
- `PickAndPlaceRobot.tsx`：取件横移机构和夹爪。
- `ConveyorAssembly.tsx`：短输送线及滚筒动画。
- `SenjerAssemblyStation.tsx`：六个定位槽和最终组字台。
- `injectionMoldingCycle.ts`：注塑阶段与产线阶段的纯函数状态机。

## 状态机

```text
close → inject → hold → cool → open → eject
      → pick → convey → place
```

第六个字母完成后进入：

```text
batch-complete → 清空 → 下一批 S
```

## 几何与坐标

- X 轴：注射、开合模、输送和组字主方向。
- Y 轴：竖直方向。
- Z 轴：设备横向。
- 字母厚度方向与模具开合方向一致。
- 第二个 E 复用同一字母几何定义，但保留独立制品实例。

## 性能约束

- 动画通过 `useFrame` 和对象引用更新，不在每帧触发 React 状态更新。
- 字母几何由少量圆角长方体组合，避免实时字体挤出和高面数模型。
- 熔体只使用少量示踪粒子，不模拟真实流体。

## 教学边界

该模型用于表达工艺顺序、机构协同和物流方向，不代表真实模具、机械手或注塑机尺寸，不计算熔体流变、模腔压力、温度场、收缩、翘曲、锁模力和机器人节拍。
