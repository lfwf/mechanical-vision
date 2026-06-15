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
      "主动齿轮与电机、手柄或其他动力源连接，将输入转矩通过齿面接触传给从动齿轮。",
    points: [
      "主动轮齿数决定每转一圈参与啮合的齿数。",
      "提高输入转速会按相同比例提高从动轮转速。",
      "改变旋转方向后，从动轮方向会立即反向。",
    ],
  },
  driven: {
    eyebrow: "动力输出件",
    title: "从动齿轮",
    description:
      "从动齿轮接收主动轮传递的运动与转矩，其齿数决定输出转速和理想扭矩倍率。",
    points: [
      "从动轮齿数越多，输出转速越低。",
      "忽略损耗时，减速比例也近似等于扭矩放大比例。",
      "外啮合齿轮的旋转方向必然相反。",
    ],
  },
  mesh: {
    eyebrow: "核心运动关系",
    title: "外啮合齿轮副",
    description:
      "两个齿轮的节圆相切，接触点处线速度相等，因此转速与齿数成反比，并且旋转方向相反。",
    points: [
      "节圆是计算传动比和中心距的基准圆。",
      "正确中心距等于两个节圆半径之和。",
      "本实验按理想刚性传动计算，暂不计摩擦、侧隙和效率损失。",
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
