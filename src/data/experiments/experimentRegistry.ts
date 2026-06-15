import type { ExperimentDefinition, ExperimentId, ExperimentRuntimeValues } from "../../types/experiment";
import { componentsDefinitions } from "./definitions/components";
import { fluidDefinitions } from "./definitions/fluid";
import { motionDefinitions } from "./definitions/motion";
import { thermalDefinitions } from "./definitions/thermal";
import { transmissionDefinitions } from "./definitions/transmission";

const definitions = {
  ...transmissionDefinitions,
  ...motionDefinitions,
  ...fluidDefinitions,
  ...componentsDefinitions,
  ...thermalDefinitions,
} as Record<ExperimentId, ExperimentDefinition>;

export const experimentDefinitions = definitions;

export function getExperimentDefinition(id: ExperimentId): ExperimentDefinition {
  return definitions[id];
}

export function getExperimentMetrics(
  id: ExperimentId,
  values: ExperimentRuntimeValues,
) {
  return definitions[id].getMetrics(values);
}
