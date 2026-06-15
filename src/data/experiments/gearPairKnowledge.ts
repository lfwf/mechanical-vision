export interface KnowledgeItem {
  title: string;
  description: string;
  sourceIds: string[];
}

export interface KnowledgeSection {
  id: string;
  title: string;
  summary: string;
  items: KnowledgeItem[];
}

export const gearPairKnowledge = {
  quickSummary:
    "外啮合直齿圆柱齿轮用于在两根平行轴之间传递旋转运动和转矩。两个齿轮具有兼容的模数与压力角时，渐开线齿面可形成近似恒定的角速度比；外啮合使两个齿轮旋转方向相反。",
  sourceIds: ["ISO-21771-2007", "ISO-53-1998"],
  sections: [
    {
      id: "definition",
      title: "定义与边界",
      summary: "先明确当前实验展示的对象，以及它没有覆盖的工程问题。",
      items: [
        {
          title: "结构类型",
          description:
            "当前对象是外啮合、直齿、圆柱、渐开线齿轮副。两根轴平行，齿线与轴线平行。它不同于斜齿轮、锥齿轮、蜗杆副和内啮合行星机构。",
          sourceIds: ["ISO-21771-2007"],
        },
        {
          title: "展示范围",
          description:
            "实验只处理几何与理想刚体运动学，用于理解结构和传动关系，不处理材料、载荷、润滑、误差、效率、强度和寿命。",
          sourceIds: ["ISO-6336-1-2019"],
        },
      ],
    },
    {
      id: "geometry",
      title: "关键几何",
      summary: "齿轮不是由简单梯形齿组成，核心是基圆渐开线与一组参考圆。",
      items: [
        {
          title: "节圆与模数",
          description:
            "标准参考圆直径满足 d = m × z。模数 m 决定齿的尺度，齿数 z 决定参考圆大小；相互啮合的标准齿轮必须采用兼容的模数。",
          sourceIds: ["ISO-21771-2007", "ISO-54-1996"],
        },
        {
          title: "基圆与渐开线",
          description:
            "渐开线从基圆展开。对于标准压力角 α，基圆半径为 rb = r × cos α。当前模型按这一关系生成左右齿面。",
          sourceIds: ["ISO-21771-2007", "MATSUMOTO-SEGERMAN-2022"],
        },
        {
          title: "齿顶圆与齿根圆",
          description:
            "当前采用全齿高基本齿条比例：齿顶高系数 1.0、齿根高系数 1.25。齿根过渡在网页模型中仍作了简化。",
          sourceIds: ["ISO-53-1998"],
        },
      ],
    },
    {
      id: "kinematics",
      title: "运动与啮合",
      summary: "理解速度比、方向、作用线和接触比，是这一实验的核心。",
      items: [
        {
          title: "传动比",
          description:
            "理想外啮合关系为 n₁z₁ = −n₂z₂。负号表示旋转方向相反，转速大小与齿数成反比。",
          sourceIds: ["ISO-21771-2007"],
        },
        {
          title: "中心距",
          description:
            "无变位标准齿轮副的参考中心距等于两个参考圆半径之和。本实验调整齿数时同步更新中心距。",
          sourceIds: ["ISO-21771-2007"],
        },
        {
          title: "作用线",
          description:
            "渐开线齿面接触法线沿一条固定作用线，作用线与节圆公切线之间的角度为压力角。页面中的作用线用于解释力与接触点的运动方向。",
          sourceIds: ["ISO-21771-2007", "MATSUMOTO-SEGERMAN-2022"],
        },
      ],
    },
    {
      id: "applications",
      title: "适用场景与取舍",
      summary: "直齿轮结构简单，但不是所有传动场景的最佳方案。",
      items: [
        {
          title: "典型用途",
          description:
            "适用于平行轴之间的定传动比传动，常见于减速机构、仪器、自动化设备和一般机械传动。具体选型仍需依据载荷、速度、噪声和空间条件。",
          sourceIds: ["ISO-21771-2007", "ISO-6336-1-2019"],
        },
        {
          title: "主要优点",
          description:
            "几何定义成熟、传动比明确、制造和检测体系完善。与斜齿轮相比，直齿轮不因螺旋角产生同类轴向分力，但啮入通常更突然。",
          sourceIds: ["ISO-21771-2007"],
        },
        {
          title: "主要限制",
          description:
            "高速、重载、低噪声或高精度场景需要进一步考虑齿形修形、精度等级、支承刚度、润滑和动态载荷，不能仅依据本实验结果决策。",
          sourceIds: ["ISO-6336-1-2019"],
        },
      ],
    },
    {
      id: "failure",
      title: "失效与维护认知",
      summary: "页面只提供识别思路，不替代现场诊断和工程计算。",
      items: [
        {
          title: "齿面问题",
          description:
            "异常磨损、点蚀或表面损伤通常需要结合载荷、材料、硬度、表面质量、润滑和对中状态分析。只看齿形模型不能判断剩余寿命。",
          sourceIds: ["ISO-6336-1-2019"],
        },
        {
          title: "齿根问题",
          description:
            "齿根是弯曲应力敏感区域。裂纹、缺口、过载和循环载荷可能导致齿根疲劳失效，工程评估需使用相应强度标准和实际参数。",
          sourceIds: ["ISO-6336-1-2019"],
        },
        {
          title: "检查思路",
          description:
            "现场检查通常同时关注异常噪声、振动、温升、润滑状态、接触斑迹、齿面损伤、轴承间隙和轴系对中。发现异常时应按设备手册和企业维修规范处理。",
          sourceIds: ["ISO-6336-1-2019"],
        },
      ],
    },
    {
      id: "misconceptions",
      title: "常见误解",
      summary: "避免把教学模型误当成工程结论。",
      items: [
        {
          title: "齿数比不等于实际效率",
          description:
            "齿数比决定理想运动学比例，但实际输出功率和扭矩还受摩擦、润滑、变形和其他损失影响。",
          sourceIds: ["ISO-6336-1-2019"],
        },
        {
          title: "看起来不穿透不等于制造可用",
          description:
            "网页网格无明显穿透，只能证明基础几何表现合理，不能证明公差、侧隙、加工刀具包络和装配精度满足要求。",
          sourceIds: ["ISO-21771-2007", "ISO-53-1998"],
        },
      ],
    },
  ] satisfies KnowledgeSection[],
};
