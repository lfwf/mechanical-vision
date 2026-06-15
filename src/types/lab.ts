import type { LucideIcon } from "lucide-react";

export type LabStatus = "preview" | "released" | "planned";

export interface LabItem {
  id: string;
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
