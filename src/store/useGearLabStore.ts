import { create } from "zustand";
import type { GearPartId } from "../types/lab";

interface GearLabState {
  driverTeeth: number;
  drivenTeeth: number;
  inputRpm: number;
  inputDirection: 1 | -1;
  isPlaying: boolean;
  selectedPartId: GearPartId;
  showPitchCircles: boolean;
  showLabels: boolean;
  showGrid: boolean;
  resetCameraToken: number;
  setDriverTeeth: (value: number) => void;
  setDrivenTeeth: (value: number) => void;
  setInputRpm: (value: number) => void;
  setInputDirection: (value: 1 | -1) => void;
  togglePlaying: () => void;
  selectPart: (value: GearPartId) => void;
  togglePitchCircles: () => void;
  toggleLabels: () => void;
  toggleGrid: () => void;
  requestCameraReset: () => void;
  resetExperiment: () => void;
}

const INITIAL_STATE = {
  driverTeeth: 24,
  drivenTeeth: 36,
  inputRpm: 120,
  inputDirection: -1 as const,
  isPlaying: true,
  selectedPartId: "mesh" as const,
  showPitchCircles: true,
  showLabels: true,
  showGrid: true,
};

export const useGearLabStore = create<GearLabState>((set) => ({
  ...INITIAL_STATE,
  resetCameraToken: 0,
  setDriverTeeth: (driverTeeth) => set({ driverTeeth }),
  setDrivenTeeth: (drivenTeeth) => set({ drivenTeeth }),
  setInputRpm: (inputRpm) => set({ inputRpm }),
  setInputDirection: (inputDirection) => set({ inputDirection }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  selectPart: (selectedPartId) => set({ selectedPartId }),
  togglePitchCircles: () =>
    set((state) => ({ showPitchCircles: !state.showPitchCircles })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  requestCameraReset: () =>
    set((state) => ({ resetCameraToken: state.resetCameraToken + 1 })),
  resetExperiment: () =>
    set((state) => ({
      ...INITIAL_STATE,
      resetCameraToken: state.resetCameraToken + 1,
    })),
}));
