import { create } from "zustand";
import { experimentDefinitions } from "../data/experiments/experimentRegistry";
import type {
  ExperimentId,
  ExperimentRuntimeValues,
  RuntimeControlKey,
} from "../types/experiment";

interface ExperimentStore extends ExperimentRuntimeValues {
  activeExperimentId: ExperimentId;
  isPlaying: boolean;
  showLabels: boolean;
  showGrid: boolean;
  resetCameraToken: number;
  selectExperiment: (id: ExperimentId) => void;
  setValue: (key: RuntimeControlKey, value: number) => void;
  setVariant: (variant: number) => void;
  setDirection: (direction: 1 | -1) => void;
  togglePlaying: () => void;
  toggleLabels: () => void;
  toggleGrid: () => void;
  requestCameraReset: () => void;
  resetCurrentExperiment: () => void;
}

const initial = experimentDefinitions["gear-pair"].defaults;

export const useExperimentStore = create<ExperimentStore>((set, get) => ({
  activeExperimentId: "gear-pair",
  ...initial,
  isPlaying: true,
  showLabels: true,
  showGrid: true,
  resetCameraToken: 0,
  selectExperiment: (activeExperimentId) => {
    const defaults = experimentDefinitions[activeExperimentId].defaults;
    set((state) => ({
      activeExperimentId,
      ...defaults,
      isPlaying: true,
      resetCameraToken: state.resetCameraToken + 1,
    }));
  },
  setValue: (key, value) => {
    if (key === "speed") set({ speed: value });
    else if (key === "primary") set({ primary: value });
    else set({ secondary: value });
  },
  setVariant: (variant) => set({ variant }),
  setDirection: (direction) => set({ direction }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  requestCameraReset: () =>
    set((state) => ({ resetCameraToken: state.resetCameraToken + 1 })),
  resetCurrentExperiment: () => {
    const defaults = experimentDefinitions[get().activeExperimentId].defaults;
    set((state) => ({
      ...defaults,
      isPlaying: true,
      resetCameraToken: state.resetCameraToken + 1,
    }));
  },
}));
