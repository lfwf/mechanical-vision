import { WashingMachineMode } from "../../../data/experiments/washingMachineModes";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { ExperimentCanvas } from "../ExperimentCanvas";
import { WashingMachineAssembly } from "./WashingMachineAssembly";
import { washingMachineCameraPresets } from "./washingMachineCameraPresets";
import { WashingMachineModeGuide } from "./WashingMachineModeGuide";

export default function WashingMachineScene() {
  const mode = useExperimentStore((state) => state.variant) as WashingMachineMode;
  const preset = washingMachineCameraPresets[mode] ?? washingMachineCameraPresets[WashingMachineMode.WashWaterPath];

  return (
    <ExperimentCanvas
      camera={preset.position}
      target={preset.target}
      cameraKey={`washing-machine-${mode}`}
      gridY={-2.9}
      shadowY={-2.84}
      minDistance={preset.minDistance}
      maxDistance={preset.maxDistance}
    >
      <WashingMachineAssembly />
      <WashingMachineModeGuide />
    </ExperimentCanvas>
  );
}
