import type { ExperimentDefinition } from "../../../types/experiment";
import { washingMachineDefinition } from "./washingMachineDefinition";

export const householdDefinitions = {
  "washing-machine": washingMachineDefinition,
} satisfies Record<string, ExperimentDefinition>;
