import bearingJson from "./bearing.quality.json";
import camJson from "./cam.quality.json";
import pumpJson from "./centrifugal-pump.quality.json";
import gearPairJson from "./gear-pair.quality.json";
import planetaryJson from "./planetary-gear.quality.json";
import rackPinionJson from "./rack-pinion.quality.json";
import sealJson from "./seal.quality.json";
import sliderCrankJson from "./slider-crank.quality.json";
import valvesJson from "./valves.quality.json";
import { evaluateQualityGate } from "../../lib/qualityGate";
import type { ExperimentId } from "../../types/experiment";
import type { ExperimentQualityRecord } from "../../types/quality";

const records: Record<ExperimentId, ExperimentQualityRecord> = {
  "gear-pair": gearPairJson as ExperimentQualityRecord,
  "rack-pinion": rackPinionJson as ExperimentQualityRecord,
  "planetary-gear": planetaryJson as ExperimentQualityRecord,
  "slider-crank": sliderCrankJson as ExperimentQualityRecord,
  cam: camJson as ExperimentQualityRecord,
  "centrifugal-pump": pumpJson as ExperimentQualityRecord,
  valves: valvesJson as ExperimentQualityRecord,
  bearing: bearingJson as ExperimentQualityRecord,
  seal: sealJson as ExperimentQualityRecord,
};

export function getExperimentQuality(id: ExperimentId): ExperimentQualityRecord {
  return records[id];
}

export function getExperimentQualityGate(id: ExperimentId) {
  return evaluateQualityGate(records[id]);
}
