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
  selectedPartId: string | null;
  detachedPartIds: string[];
  selectExperiment: (id: ExperimentId) => void;
  setValue: (key: RuntimeControlKey, value: number) => void;
  setVariant: (variant: number) => void;
  setDirection: (direction: 1 | -1) => void;
  togglePlaying: () => void;
  toggleLabels: () => void;
  toggleGrid: () => void;
  requestCameraReset: () => void;
  resetCurrentExperiment: () => void;
  selectPart: (partId: string | null) => void;
  togglePartDetached: (partId: string) => void;
  detachAll: (partIds: string[]) => void;
  assembleAll: () => void;
}

const initialDefinition = experimentDefinitions["gear-pair"];
const initial = initialDefinition.defaults;

export const useExperimentStore = create<ExperimentStore>((set, get) => ({
  activeExperimentId: "gear-pair",
  ...initial,
  isPlaying: true,
  showLabels: true,
  showGrid: true,
  resetCameraToken: 0,
  selectedPartId: initialDefinition.partManuals?.[0]?.id ?? null,
  detachedPartIds: [],
  selectExperiment: (activeExperimentId) => {
    const definition = experimentDefinitions[activeExperimentId];
    set((state) => ({
      activeExperimentId,
      ...definition.defaults,
      isPlaying: true,
      selectedPartId: definition.partManuals?.[0]?.id ?? null,
      detachedPartIds: [],
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
    const definition = experimentDefinitions[get().activeExperimentId];
    set((state) => ({
      ...definition.defaults,
      isPlaying: true,
      selectedPartId: definition.partManuals?.[0]?.id ?? null,
      detachedPartIds: [],
      resetCameraToken: state.resetCameraToken + 1,
    }));
  },
  selectPart: (selectedPartId) => set({ selectedPartId }),
  togglePartDetached: (partId) =>
    set((state) => ({
      detachedPartIds: state.detachedPartIds.includes(partId)
        ? state.detachedPartIds.filter((id) => id !== partId)
        : [...state.detachedPartIds, partId],
    })),
  detachAll: (partIds) => set({ detachedPartIds: Array.from(new Set(partIds)) }),
  assembleAll: () => set({ detachedPartIds: [] }),
}));
