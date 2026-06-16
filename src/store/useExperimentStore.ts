import { create } from "zustand";
import { experimentDefinitions } from "../data/experiments/experimentRegistry";
import type {
  ExperimentId,
  ExperimentRuntimeValues,
  PartManualDefinition,
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
let assemblyTimers: Array<ReturnType<typeof setTimeout>> = [];

function clearAssemblyTimers() {
  assemblyTimers.forEach((timer) => clearTimeout(timer));
  assemblyTimers = [];
}

function getPartManuals(experimentId: ExperimentId): PartManualDefinition[] {
  return experimentDefinitions[experimentId].partManuals ?? [];
}

function getPartNames(ids: string[], manuals: PartManualDefinition[]) {
  return ids
    .map((id) => manuals.find((part) => part.id === id)?.name ?? id)
    .join("、");
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
    clearAssemblyTimers();
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
    clearAssemblyTimers();
    const definition = experimentDefinitions[get().activeExperimentId];
    const assemblyMode = definition.assemblyVariants?.includes(variant) ?? false;
    set({
      variant,
      isPlaying: !assemblyMode,
      blockedPartIds: [],
      assemblyNotice: null,
    });
  },

  setDirection: (direction) => set({ direction }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  requestCameraReset: () =>
    set((state) => ({ resetCameraToken: state.resetCameraToken + 1 })),

  resetCurrentExperiment: () => {
    clearAssemblyTimers();
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

  selectPart: (selectedPartId) =>
    set({ selectedPartId, blockedPartIds: [], assemblyNotice: null }),

  togglePartDetached: (partId) => {
    clearAssemblyTimers();
    const state = get();
    const manuals = getPartManuals(state.activeExperimentId);
    const part = manuals.find((item) => item.id === partId);
    if (!part || part.detachable === false) return;

    const detached = state.detachedPartIds.includes(partId);
    if (!detached) {
      const blockers = (part.prerequisitePartIds ?? []).filter(
        (id) => !state.detachedPartIds.includes(id),
      );
      if (blockers.length > 0) {
        set({
          selectedPartId: partId,
          blockedPartIds: blockers,
          assemblyNotice: `暂时不能拆下${part.name}。请先拆下：${getPartNames(blockers, manuals)}。`,
        });
        return;
      }

      set({
        selectedPartId: partId,
        detachedPartIds: [...state.detachedPartIds, partId],
        blockedPartIds: [],
        assemblyNotice: `${part.name}已沿教学拆卸方向移出。`,
      });
      return;
    }

    const dependents = manuals
      .filter(
        (candidate) =>
          candidate.prerequisitePartIds?.includes(partId) &&
          state.detachedPartIds.includes(candidate.id),
      )
      .map((candidate) => candidate.id);

    if (dependents.length > 0) {
      set({
        selectedPartId: partId,
        blockedPartIds: dependents,
        assemblyNotice: `暂时不能装回${part.name}。请先装回更内部的零件：${getPartNames(dependents, manuals)}。`,
      });
      return;
    }

    set({
      selectedPartId: partId,
      detachedPartIds: state.detachedPartIds.filter((id) => id !== partId),
      blockedPartIds: [],
      assemblyNotice: `${part.name}已装回安装位置。`,
    });
  },

  detachAll: (partIds) => {
    clearAssemblyTimers();
    const state = get();
    const sequence = getPartManuals(state.activeExperimentId)
      .filter((part) => partIds.includes(part.id) && part.detachable !== false)
      .sort((a, b) => a.removalOrder - b.removalOrder);

    set({
      blockedPartIds: [],
      assemblyNotice: "正在按拆卸顺序逐件展开。",
    });

    sequence.forEach((part, index) => {
      const timer = setTimeout(() => {
        set((current) => ({
          selectedPartId: part.id,
          detachedPartIds: current.detachedPartIds.includes(part.id)
            ? current.detachedPartIds
            : [...current.detachedPartIds, part.id],
          assemblyNotice:
            index === sequence.length - 1
              ? "全部可拆零件已按顺序展开。"
              : `正在拆下：${part.name}`,
        }));
      }, index * 180);
      assemblyTimers.push(timer);
    });
  },

  assembleAll: () => {
    clearAssemblyTimers();
    const state = get();
    const sequence = getPartManuals(state.activeExperimentId)
      .filter((part) => state.detachedPartIds.includes(part.id))
      .sort((a, b) => b.removalOrder - a.removalOrder);

    set({
      blockedPartIds: [],
      assemblyNotice: "正在按反向依赖逐件组装。",
    });

    sequence.forEach((part, index) => {
      const timer = setTimeout(() => {
        set((current) => ({
          selectedPartId: part.id,
          detachedPartIds: current.detachedPartIds.filter(
            (id) => id !== part.id,
          ),
          assemblyNotice:
            index === sequence.length - 1
              ? "全部零件已按顺序组装。"
              : `正在装回：${part.name}`,
        }));
      }, index * 180);
      assemblyTimers.push(timer);
    });
  },
}));
