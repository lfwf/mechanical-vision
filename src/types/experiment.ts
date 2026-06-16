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
  "air-conditioner",
  "washing-machine",
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
  visibleWhenVariants?: number[];
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

export interface ApplianceReferenceModel {
  manufacturer: string;
  model: string;
  productType: string;
  capacity?: string;
  dimensions?: string;
  hasDryer?: boolean;
  driveType?: "belt" | "direct-drive";
  motorType?: string;
  outerTubConstruction?: string;
  sourceIds?: string[];
  confirmedFacts?: string[];
  engineeringInferences?: string[];
  teachingSimplifications?: string[];
  accuracyStatement: string;
}

export type PartEvidenceStatus = "confirmed" | "engineering-inference" | "teaching-simplification";

export interface PartManualDefinition {
  id: string;
  name: string;
  partCode: string;
  system: string;
  location: string;
  function: string;
  connections: string[];
  removalOrder: number;
  removalPrerequisites: string[];
  prerequisitePartIds?: string[];
  blockedByPartIds?: string[];
  removalDirection?: string;
  assemblyGroup?: string;
  removalSteps: string[];
  installChecks: string[];
  commonFaults?: string[];
  faultSymptoms?: string[];
  warnings: string[];
  sourceIds: string[];
  evidenceStatus?: PartEvidenceStatus;
  precisionNote?: string;
  detachable?: boolean;
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
  showDirectionControl?: boolean;
  supportsPartAssembly?: boolean;
  assemblyVariants?: number[];
  referenceModel?: ApplianceReferenceModel;
  partManuals?: PartManualDefinition[];
  quickSummary: string;
  formula?: string;
  parts: Array<{ name: string; role: string }>;
  knowledge: KnowledgeSectionDefinition[];
  getMetrics: (values: ExperimentRuntimeValues) => ExperimentMetric[];
  getConclusion: (values: ExperimentRuntimeValues) => string;
}
