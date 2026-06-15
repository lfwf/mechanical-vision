import type { ExperimentDefinition, ExperimentId, ExperimentRuntimeValues } from "../../types/experiment";
import { componentsDefinitions } from "./definitions/components";
import { fluidDefinitions } from "./definitions/fluid";
import { motionDefinitions } from "./definitions/motion";
import { transmissionDefinitions } from "./definitions/transmission";

const definitions = {
  ...transmissionDefinitions,
  ...motionDefinitions,
  ...fluidDefinitions,
  ...componentsDefinitions,
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
