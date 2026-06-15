# 机械视界 · 可信互动式 3D 机械原理百科

机械视界的目标不是堆积可旋转的 3D 模型，而是用**可验证的模型、可追溯的内容和公开的工程边界**，帮助用户理解机械结构、运动关系、参数影响与失效风险。

当前仓库包含一个外啮合直齿圆柱齿轮实验，状态为：

```text
L2 运动原理级 · preview 公开预览 · 尚未正式发布
```

未正式发布的原因会直接显示在网页“质量”面板中。目前主要阻断项是：独立模型审核、独立内容审核和独立几何内核的完整周期干涉扫描。

## 当前实验能力

- 程序化生成 20° 压力角渐开线直齿轮；
- 使用相同模数和标准中心距建立外啮合关系；
- 18–48 齿参数范围；
- 奇数齿、偶数齿自动校正齿槽初始相位；
- 主动轮和从动轮转速、方向、传动比实时联动；
- 显示齿根圆、基圆、节圆和齿顶圆；
- 计算理论端面重合度；
- 右侧实验、知识和质量内容独立滚动，不再撑高 3D 演示区域；
- 结构化知识、来源索引、模型卡、验证记录和审核记录；
- 公开模型简化、禁止用途和已知限制；
- CI 自动执行质量档案、机械公式、TypeScript 和生产构建检查。

## 质量框架

每个实验必须拥有：

```text
模型卡
+ 内容卡
+ 技术来源
+ 关键结论来源映射
+ 验证记录
+ 独立审核记录
+ 发布门禁结果
```

质量档案位于：

```text
src/data/experiments/<experiment-id>.quality.json
```

页面和自动检查共同读取该档案。存在发布阻断项时，实验只能保持 `preview`，不得标记为 `released`。

详细规范：

- [质量政策](docs/QUALITY_POLICY.md)
- [模型制作与审查规范](docs/MODEL_STANDARD.md)
- [内容制作与事实审查规范](docs/CONTENT_STANDARD.md)
- [新模型与内容审查流程](docs/REVIEW_PROCESS.md)
- [模型审核清单](docs/checklists/model-review.md)
- [内容审核清单](docs/checklists/content-review.md)
- [当前齿轮实验验证记录](docs/experiments/gear-pair-verification.md)

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

打开：

```text
http://localhost:3000
```

## 完整验证

```bash
npm run verify
```

该命令依次执行：

1. `npm run quality:check`：质量档案、来源映射和发布状态检查；
2. `npm run mechanics:check`：18–48 齿共 961 个组合的公式、相位和接触路径检查；
3. `npm run check`：TypeScript 严格检查；
4. `npm run build`：Vite 生产构建。

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
└── gear-math-check.ts

src/
├── components/
│   ├── app/
│   ├── catalog/
│   ├── controls/
│   ├── gear/
│   ├── info/
│   └── quality/
├── data/
│   └── experiments/
├── lib/
├── store/
└── types/
```

## 当前工程边界

当前齿轮模型用于结构和理想运动学教学，不用于：

- 加工制造；
- 强度和寿命校核；
- 噪声、振动和热分析；
- 实际设备选型；
- 安全、维修或验收决策。

齿根过渡仍采用教学展示级简化，未包含齿侧间隙、变位、齿廓修形、制造误差、材料、载荷、润滑和弹性变形。

## 新增模型

不要直接复制一个 GLB 并加入目录。先创建“新模型提案”Issue，明确：

- 用户需要理解什么；
- 目标精度等级；
- A/B 级来源；
- 几何和运动验证方案；
- 独立模型审核人；
- 独立内容审核人。

所有技术纠错可以通过“技术纠错”Issue 提交，修正过程需要更新模型版本、内容版本和质量档案。
