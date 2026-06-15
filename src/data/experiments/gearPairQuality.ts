import qualityRecordJson from "./gear-pair.quality.json";
import { evaluateQualityGate } from "../../lib/qualityGate";
import type { ExperimentQualityRecord } from "../../types/quality";

export const gearPairQuality = qualityRecordJson as ExperimentQualityRecord;
export const gearPairQualityGate = evaluateQualityGate(gearPairQuality);
