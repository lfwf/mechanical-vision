import {
  Activity,
  Blend,
  CircleDot,
  Cog,
  Droplets,
  Gauge,
  Orbit,
  RotateCw,
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
        status: "planned",
        icon: Blend,
      },
      {
        id: "planetary-gear",
        title: "行星齿轮组",
        subtitle: "太阳轮、行星轮与齿圈",
        status: "planned",
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
        status: "planned",
        icon: RotateCw,
      },
      {
        id: "cam",
        title: "凸轮机构",
        subtitle: "轮廓决定运动规律",
        status: "planned",
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
        status: "planned",
        icon: Droplets,
      },
      {
        id: "valves",
        title: "工业阀门",
        subtitle: "球阀、蝶阀与截止阀",
        status: "planned",
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
        title: "滚动轴承",
        subtitle: "载荷、滚动体与保持架",
        status: "planned",
        icon: CircleDot,
      },
      {
        id: "seal",
        title: "机械密封",
        subtitle: "动环、静环与泄漏控制",
        status: "planned",
        icon: Waves,
      },
    ],
  },
];
