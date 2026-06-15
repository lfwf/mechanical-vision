export type PrecisionLevel = "L1" | "L2" | "L3" | "L4";

export type ReleaseStage =
  | "draft"
  | "research"
  | "model-review"
  | "content-review"
  | "integration-review"
  | "preview"
  | "released"
  | "rejected";

export type EvidenceLevel = "A" | "B" | "C" | "D" | "E";

export type VerificationStatus = "pass" | "fail" | "pending" | "not-applicable";

export type ReviewDecision = "approved" | "changes-requested" | "pending";

export type ReviewArea = "model" | "content" | "integration";

export interface TechnicalSource {
  id: string;
  evidenceLevel: EvidenceLevel;
  title: string;
  publisher: string;
  edition?: string;
  year?: number;
  locator?: string;
  url?: string;
  supports: string[];
  notes?: string;
}

export interface TechnicalClaim {
  id: string;
  statement: string;
  sourceIds: string[];
  scope: "definition" | "geometry" | "kinematics" | "application" | "failure" | "maintenance";
}

export interface ModelParameter {
  symbol: string;
  name: string;
  value: string;
  unit?: string;
  sourceIds: string[];
}

export interface ModelCard {
  modelId: string;
  title: string;
  version: string;
  precisionLevel: PrecisionLevel;
  precisionLabel: string;
  intendedUses: string[];
  prohibitedUses: string[];
  units: string;
  coordinateSystem: string;
  sourceFormat: string;
  webFormat: string;
  generationMethod: string;
  parameters: ModelParameter[];
  simplifications: string[];
  knownLimitations: string[];
  author: string;
  createdAt: string;
}

export interface ContentCard {
  contentId: string;
  version: string;
  audience: string[];
  learningObjectives: string[];
  scope: string[];
  outOfScope: string[];
  author: string;
  createdAt: string;
}

export interface VerificationItem {
  id: string;
  category: "geometry" | "assembly" | "kinematics" | "content" | "visual" | "performance";
  title: string;
  critical: boolean;
  status: VerificationStatus;
  method: string;
  evidence?: string;
  notes?: string;
}

export interface ReviewRecord {
  id: string;
  area: ReviewArea;
  decision: ReviewDecision;
  reviewer: string | null;
  reviewerRole: string;
  reviewedAt: string | null;
  independent: boolean;
  notes: string;
}

export interface ExperimentQualityRecord {
  experimentId: string;
  title: string;
  version: string;
  releaseStage: ReleaseStage;
  modelCard: ModelCard;
  contentCard: ContentCard;
  sources: TechnicalSource[];
  claims: TechnicalClaim[];
  verification: VerificationItem[];
  reviews: ReviewRecord[];
}

export interface QualityGateResult {
  canRelease: boolean;
  passedChecks: string[];
  blockers: string[];
  warnings: string[];
}
