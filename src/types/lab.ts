import type { LucideIcon } from "lucide-react";
import type { ExperimentId } from "./experiment";

export type LabStatus = "preview" | "released" | "planned";

export interface LabItem {
  id: ExperimentId;
  title: string;
  subtitle: string;
  status: LabStatus;
  icon: LucideIcon;
}

export interface LabCategory {
  id: string;
  title: string;
  items: LabItem[];
}

export type GearPartId = "driver" | "driven" | "mesh" | "shaft";
