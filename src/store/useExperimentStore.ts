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
  blockedPartIds: string[];
  assemblyNotice: string | null;
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

function getManuals(id: ExperimentId) {
  return experimentDefinitions[id].partManuals ?? [];
}

function names(ids: string[], experimentId: ExperimentId) {
  const manuals = getManuals(experimentId);
  return ids.map((id) => manuals.find((part) => part.id === id)?.name ?? id).join("、");
}

export const useExperimentStore = create<ExperimentStore>((set, get) => ({
  activeExperimentId: "gear-pair",
  ...initial,
  isPlaying: true,
  showLabels: true,
  showGrid: true,
  resetCameraToken: 0,
  selectedPartId: initialDefinition.partManuals?.[0]?.id ?? null,
  detachedPartIds: [],
  blockedPartIds: [],
  assemblyNotice: null,
  selectExperiment: (activeExperimentId) => {
    const definition = experimentDefinitions[activeExperimentId];
    set((state) => ({
      activeExperimentId,
      ...definition.defaults,
      isPlaying: true,
      selectedPartId: definition.partManuals?.[0]?.id ?? null,
      detachedPartIds: [],
      blockedPartIds: [],
      assemblyNotice: null,
      resetCameraToken: state.resetCameraToken + 1,
    }));
  },
  setValue: (key, value) => {
    if (key === "speed") set({ speed: value });
    else if (key === "primary") set({ primary: value });
    else set({ secondary: value });
  },
  setVariant: (variant) => {
    const definition = experimentDefinitions[get().activeExperimentId];
    const assemblyMode = definition.assemblyVariants?.includes(variant) ?? false;
    set({ variant, isPlaying: !assemblyMode, blockedPartIds: [], assemblyNotice: null });
  },
  setDirection: (direction) => set({ direction }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  requestCameraReset: () => set((state) => ({ resetCameraToken: state.resetCameraToken + 1 })),
  resetCurrentExperiment: () => {
    const definition = experimentDefinitions[get().activeExperimentId];
    set((state) => ({
      ...definition.defaults,
      isPlaying: true,
      selectedPartId: definition.partManuals?.[0]?.id ?? null,
      detachedPartIds: [],
      blockedPartIds: [],
      assemblyNotice: null,
      resetCameraToken: state.resetCameraToken + 1,
    }));
  },
  selectPart: (selectedPartId) => set({ selectedPartId, blockedPartIds: [], assemblyNotice: null }),
  togglePartDetached: (partId) => {
    const state = get();
    const manuals = getManuals(state.activeExperimentId);
    const part = manuals.find((item) => item.id === partId);
    if (!part || part.detachable === false) return;
    const isDetached = state.detachedPartIds.includes(partId);
    if (!isDetached) {
      const blockers = (part.prerequisitePartIds ?? []).filter((id) => !state.detachedPartIds.includes(id));
      if (blockers.length) {
        set({ blockedPartIds: blockers, assemblyNotice: `请先拆下：${names(blockers, state.activeExperimentId)}` });
        return;
      }
      set({ detachedPartIds: [...state.detachedPartIds, partId], blockedPartIds: [], assemblyNotice: `${part.name}已拆下。` });
      return;
    }
    const blockers = manuals
      .filter((candidate) => candidate.prerequisitePartIds?.includes(partId) && state.detachedPartIds.includes(candidate.id))
      .map((candidate) => candidate.id);
    if (blockers.length) {
      set({ blockedPartIds: blockers, assemblyNotice: `请先装回：${names(blockers, state.activeExperimentId)}` });
      return;
    }
    set({ detachedPartIds: state.detachedPartIds.filter((id) => id !== partId), blockedPartIds: [], assemblyNotice: `${part.name}已装回。` });
  },
  detachAll: (partIds) => {
    const manuals = getManuals(get().activeExperimentId);
    const ordered = manuals.filter((part) => partIds.includes(part.id) && part.detachable !== false).sort((a, b) => a.removalOrder - b.removalOrder).map((part) => part.id);
    set({ detachedPartIds: ordered, blockedPartIds: [], assemblyNotice: "已按拆卸顺序展开全部零件。" });
  },
  assembleAll: () => set({ detachedPartIds: [], blockedPartIds: [], assemblyNotice: "全部零件已组装。" }),
}));
