export const SENJER_SEQUENCE = ["S", "E", "N", "J", "E", "R"] as const;
export type SenjerLetter = (typeof SENJER_SEQUENCE)[number];

export const productionPhases = [
  "close",
  "inject",
  "hold",
  "cool",
  "open",
  "eject",
  "pick",
  "convey",
  "place",
  "batch-complete",
] as const;

export type ProductionPhase = (typeof productionPhases)[number];

const phaseDurations: Record<ProductionPhase, number> = {
  close: 0.85,
  inject: 1.0,
  hold: 0.72,
  cool: 1.28,
  open: 0.82,
  eject: 0.7,
  pick: 0.72,
  convey: 1.55,
  place: 0.72,
  "batch-complete": 2.2,
};

export interface ProductionFrame {
  phase: ProductionPhase;
  phaseProgress: number;
  letterIndex: number;
  letter: SenjerLetter;
  completedCount: number;
  batchComplete: boolean;
}

export function getPhaseDuration(phase: ProductionPhase) {
  return phaseDurations[phase];
}

export function getLetterCycleDuration() {
  return productionPhases
    .filter((phase) => phase !== "batch-complete")
    .reduce((total, phase) => total + phaseDurations[phase], 0);
}

export function resolveProductionFrame(letterIndex: number, elapsed: number): ProductionFrame {
  const isLastLetter = letterIndex === SENJER_SEQUENCE.length - 1;
  const phases = isLastLetter ? productionPhases : productionPhases.filter((phase) => phase !== "batch-complete");
  let cursor = 0;

  for (const phase of phases) {
    const duration = phaseDurations[phase];
    if (elapsed <= cursor + duration || phase === phases[phases.length - 1]) {
      const phaseProgress = Math.min(Math.max((elapsed - cursor) / duration, 0), 1);
      const isPlaced = phase === "place" && phaseProgress >= 0.98;
      const batchComplete = phase === "batch-complete";
      return {
        phase,
        phaseProgress,
        letterIndex,
        letter: SENJER_SEQUENCE[letterIndex],
        completedCount: Math.min(letterIndex + (isPlaced || batchComplete ? 1 : 0), SENJER_SEQUENCE.length),
        batchComplete,
      };
    }
    cursor += duration;
  }

  return {
    phase: "close",
    phaseProgress: 0,
    letterIndex,
    letter: SENJER_SEQUENCE[letterIndex],
    completedCount: letterIndex,
    batchComplete: false,
  };
}
