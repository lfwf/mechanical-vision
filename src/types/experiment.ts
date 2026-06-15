export const experimentIds = [
  "gear-pair",
  "rack-pinion",
  "planetary-gear",
  "slider-crank",
  "cam",
  "centrifugal-pump",
  "valves",
  "bearing",
  "seal",
] as const;

export type ExperimentId = (typeof experimentIds)[number];

export type RuntimeControlKey = "speed" | "primary" | "secondary";

export interface ExperimentRuntimeValues {
  speed: number;
  primary: number;
  secondary: number;
  variant: number;
  direction: 1 | -1;
}

export interface NumericControlDefinition {
  key: RuntimeControlKey;
  label: string;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}

export interface ExperimentMetric {
  label: string;
  value: string;
  note: string;
}

export interface KnowledgeItemDefinition {
  title: string;
  description: string;
  sourceIds: string[];
}

export interface KnowledgeSectionDefinition {
  id: string;
  title: string;
  summary: string;
  items: KnowledgeItemDefinition[];
}

export interface ExperimentDefinition {
  id: ExperimentId;
  index: number;
  category: string;
  title: string;
  subtitle: string;
  sceneTip: string;
  precisionLevel: "L1" | "L2";
  precisionLabel: string;
  defaults: ExperimentRuntimeValues;
  controls: NumericControlDefinition[];
  variantLabel?: string;
  variants?: string[];
  quickSummary: string;
  formula?: string;
  parts: Array<{ name: string; role: string }>;
  knowledge: KnowledgeSectionDefinition[];
  getMetrics: (values: ExperimentRuntimeValues) => ExperimentMetric[];
  getConclusion: (values: ExperimentRuntimeValues) => string;
}
