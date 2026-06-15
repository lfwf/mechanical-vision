import type { GearPartId } from "../types/lab";

interface PartContent {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}

export const partContent: Record<GearPartId, PartContent> = {
  driver: {
    eyebrow: "动力输入件",
    title: "主动齿轮",
    description:
      "主动齿轮与电机、手柄或其他动力源连接，将输入转矩通过渐开线齿面接触传给从动齿轮。",
    points: [
      "当前使用标准 20° 压力角渐开线齿廓。",
      "主动轮齿数决定每转一圈参与啮合的齿数。",
      "提高输入转速会按相同比例提高从动轮转速。",
    ],
  },
  driven: {
    eyebrow: "动力输出件",
    title: "从动齿轮",
    description:
      "从动齿轮接收主动轮传递的运动与转矩，其齿数决定输出转速和理想扭矩倍率。",
    points: [
      "从动轮齿数越多，输出转速越低。",
      "从动轮以齿槽中心对准主动轮齿顶，奇数齿与偶数齿都能正确建立初始相位。",
      "外啮合齿轮的旋转方向必然相反。",
    ],
  },
  mesh: {
    eyebrow: "核心运动关系",
    title: "标准渐开线外啮合",
    description:
      "两个同模数、同压力角齿轮按标准中心距安装。齿面沿作用线连续接触，节圆在节点处作无滑动滚动。",
    points: [
      "模数 m = 0.145，压力角 α = 20°。",
      "中心距等于两个节圆半径之和。",
      "齿顶高为 1m，齿根高为 1.25m，保留标准顶隙。",
      "当前不计侧隙、弹性变形、摩擦和效率损失。",
    ],
  },
  shaft: {
    eyebrow: "支承与连接",
    title: "传动轴",
    description:
      "轴穿过齿轮中心孔，用于支承齿轮并把转矩传递给相邻机构。",
    points: [
      "实际装配通常还需要键、花键或过盈配合。",
      "轴线平行是直齿圆柱齿轮正常啮合的基本条件。",
      "轴承间隙和轴挠曲会影响啮合质量。",
    ],
  },
};
