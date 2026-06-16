# 机械视界 · 可信互动式 3D 机械原理百科

机械视界不是一组只能旋转查看的 3D 模型，而是一套用于理解机械结构、运动关系、流动路径、装配层级和工程边界的互动实验系统。

每个实验同时包含：

```text
可交互 3D 模型
+ 结构化知识
+ 零件说明书（适用时）
+ 技术来源
+ 模型卡与内容卡
+ 验证记录
+ 发布门禁
```

当前仓库包含齿轮、齿条、行星齿轮、曲柄滑块、凸轮、离心泵、阀门、轴承、机械密封、分体式空调和滚筒洗衣机等实验。未完成独立模型和内容审核的实验统一保持 `preview`，不得作为工程设计、制造或维修依据。

## Daikin Perfera 分体式空调拆解

空调实验以 Daikin Perfera FTXM35R 室内机和 RXM35R 室外机为比例参考：

- 室内机参考尺寸：998×299×292 mm；
- 室外机参考尺寸：765×550×285 mm；
- 室内机拆分为 15 个主要组件；
- 室外机拆分为 12 个主要组件；
- 支持制冷循环、送风与排水、零件拆装三种模式；
- 支持点击选择、单件拆下、单件装回、全部展开和全部组装；
- 每个主要组件都有位置、作用、连接关系、拆卸前提、装回检查和风险提示。

模型表现前面板、进风格栅、过滤层、折弯换热器、贯流风轮、排水盘、导风机构、PCB、传感器线束、保温管束、墙板、轴流风扇、压缩机、四通阀、电子膨胀阀、气液截止阀、储液/气液分离结构、底盘和减振脚等层级。

该模型属于 **L2 实机比例、结构拓扑与装配层级级**。它不复刻原厂 CAD、制造公差、全部紧固件和维修尺寸，也不提供制冷剂或电气实操指导。

## 主要能力

- React Three Fiber 交互式 3D 场景；
- 程序化机械和家电组件建模；
- 参数、动画速度、观察模式和透明度控制；
- 零件选择、爆炸视图、逐件拆装和组装；
- 结构化知识、来源映射和零件说明书；
- 模型简化、禁止用途和已知限制公开；
- CI 自动执行质量档案、机械公式、家电结构映射、TypeScript 和生产构建检查。

## 技术栈

- React 19 + TypeScript
- Vite 8
- Three.js
- React Three Fiber
- Drei
- Zustand

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:3000
```

## 完整验证

```bash
npm run verify
```

验证顺序：

1. `npm run quality:check`：质量档案、来源映射和发布状态；
2. `npm run mechanics:check`：齿轮公式、相位和接触路径；
3. `npm run appliance:check`：空调与洗衣机零件 ID、说明书字段和场景映射；
4. `npm run check`：TypeScript 严格检查；
5. `npm run build`：Vite 生产构建。

## 目录结构

```text
.github/
├── workflows/quality-gate.yml
├── pull_request_template.md
└── ISSUE_TEMPLATE/

docs/
├── QUALITY_POLICY.md
├── MODEL_STANDARD.md
├── CONTENT_STANDARD.md
├── REVIEW_PROCESS.md
├── checklists/
└── experiments/

scripts/
├── quality-check.mjs
├── gear-math-check.ts
└── appliance-structure-check.mjs

src/
├── components/
│   ├── app/
│   ├── catalog/
│   ├── controls/
│   ├── experiments/
│   │   └── airConditioner/
│   ├── gear/
│   ├── info/
│   └── quality/
├── data/
│   └── experiments/
│       ├── definitions/
│       └── parts/
├── lib/
├── store/
└── types/
```

## 质量框架

质量档案位于：

```text
src/data/experiments/<experiment-id>.quality.json
```

每个实验需要登记模型卡、内容卡、技术来源、关键结论来源映射、验证记录和独立审核记录。存在关键验证未通过或独立审核缺失时，实验只能保持 `preview`。

详细规范：

- [质量政策](docs/QUALITY_POLICY.md)
- [模型制作与审查规范](docs/MODEL_STANDARD.md)
- [内容制作与事实审查规范](docs/CONTENT_STANDARD.md)
- [新模型与内容审查流程](docs/REVIEW_PROCESS.md)
- [模型审核清单](docs/checklists/model-review.md)
- [内容审核清单](docs/checklists/content-review.md)

## 工程边界

本项目用于学习结构和原理，不用于：

- 加工制造与公差决策；
- 强度、寿命、噪声、振动和热分析；
- 实际设备选型、安装、验收或维修；
- 制冷剂、电气、压力容器或高能机械实操；
- 替代制造商服务资料和具备资质的专业人员。

新增实验前应先明确参考对象、目标精度、权威来源、几何或运动验证方案，以及独立模型和内容审核人。
