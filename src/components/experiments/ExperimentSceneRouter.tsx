import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import type { ExperimentId } from "../../types/experiment";

const RackPinionScene = lazy(() => import("./RackPinionScene"));
const PlanetaryGearScene = lazy(() => import("./PlanetaryGearScene"));
const SliderCrankScene = lazy(() => import("./SliderCrankScene"));
const CamScene = lazy(() => import("./CamScene"));
const CentrifugalPumpScene = lazy(() => import("./CentrifugalPumpScene"));
const ValveScene = lazy(() => import("./ValveScene"));
const BearingScene = lazy(() => import("./BearingScene"));
const MechanicalSealScene = lazy(() => import("./MechanicalSealScene"));
const AirConditionerScene = lazy(() => import("./AirConditionerScene"));
const WashingMachineScene = lazy(() => import("./WashingMachineScene"));

const scenes: Partial<Record<ExperimentId, LazyExoticComponent<ComponentType>>> = {
  "rack-pinion": RackPinionScene,
  "planetary-gear": PlanetaryGearScene,
  "slider-crank": SliderCrankScene,
  cam: CamScene,
  "centrifugal-pump": CentrifugalPumpScene,
  valves: ValveScene,
  bearing: BearingScene,
  seal: MechanicalSealScene,
  "air-conditioner": AirConditionerScene,
  "washing-machine": WashingMachineScene,
};

export function ExperimentSceneRouter({ id }: { id: ExperimentId }) {
  const Scene = scenes[id];
  if (!Scene) return null;

  return (
    <Suspense
      fallback={
        <div className="scene-loading">
          <span />
          正在加载实验模型…
        </div>
      }
    >
      <Scene />
    </Suspense>
  );
}
