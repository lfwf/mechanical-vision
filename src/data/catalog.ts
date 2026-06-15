import {
  Activity,
  Blend,
  CircleDot,
  Cog,
  Droplets,
  Gauge,
  Orbit,
  RotateCw,
  Snowflake,
  Waves,
} from "lucide-react";
import type { LabCategory } from "../types/lab";

export const labCatalog: LabCategory[] = [
  {
    id: "transmission",
    title: "传动机构",
    items: [
      {
        id: "gear-pair",
        title: "外啮合齿轮",
        subtitle: "齿数、转速与方向",
        status: "preview",
        icon: Cog,
      },
      {
        id: "rack-pinion",
        title: "齿轮齿条",
        subtitle: "旋转运动转直线运动",
        status: "preview",
        icon: Blend,
      },
      {
        id: "planetary-gear",
        title: "行星齿轮组",
        subtitle: "太阳轮、行星轮与齿圈",
        status: "preview",
        icon: Orbit,
      },
    ],
  },
  {
    id: "motion",
    title: "运动机构",
    items: [
      {
        id: "slider-crank",
        title: "曲柄滑块",
        subtitle: "旋转与往复运动转换",
        status: "preview",
        icon: RotateCw,
      },
      {
        id: "cam",
        title: "偏心圆盘凸轮",
        subtitle: "轮廓决定运动规律",
        status: "preview",
        icon: Activity,
      },
    ],
  },
  {
    id: "fluid",
    title: "流体机械",
    items: [
      {
        id: "centrifugal-pump",
        title: "离心泵",
        subtitle: "叶轮与流体能量转换",
        status: "preview",
        icon: Droplets,
      },
      {
        id: "valves",
        title: "工业阀门",
        subtitle: "球阀、蝶阀与截止阀",
        status: "preview",
        icon: Gauge,
      },
    ],
  },
  {
    id: "components",
    title: "通用零部件",
    items: [
      {
        id: "bearing",
        title: "深沟球轴承",
        subtitle: "套圈、滚动体与保持架",
        status: "preview",
        icon: CircleDot,
      },
      {
        id: "seal",
        title: "机械密封",
        subtitle: "动环、静环与密封界面",
        status: "preview",
        icon: Waves,
      },
    ],
  },
  {
    id: "thermal",
    title: "热力设备",
    items: [
      {
        id: "air-conditioner",
        title: "分体式空调",
        subtitle: "拆解、组合与制冷循环",
        status: "preview",
        icon: Snowflake,
      },
    ],
  },
];
