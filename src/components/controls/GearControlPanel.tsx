import {
  CircleDashed,
  Eye,
  Grid3X3,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  ScanLine,
} from "lucide-react";
import { useGearLabStore } from "../../store/useGearLabStore";
import { RangeField } from "./RangeField";

export function GearControlPanel() {
  const driverTeeth = useGearLabStore((state) => state.driverTeeth);
  const drivenTeeth = useGearLabStore((state) => state.drivenTeeth);
  const inputRpm = useGearLabStore((state) => state.inputRpm);
  const inputDirection = useGearLabStore((state) => state.inputDirection);
  const isPlaying = useGearLabStore((state) => state.isPlaying);
  const showPitchCircles = useGearLabStore((state) => state.showPitchCircles);
  const showLabels = useGearLabStore((state) => state.showLabels);
  const showGrid = useGearLabStore((state) => state.showGrid);
  const setDriverTeeth = useGearLabStore((state) => state.setDriverTeeth);
  const setDrivenTeeth = useGearLabStore((state) => state.setDrivenTeeth);
  const setInputRpm = useGearLabStore((state) => state.setInputRpm);
  const setInputDirection = useGearLabStore((state) => state.setInputDirection);
  const togglePlaying = useGearLabStore((state) => state.togglePlaying);
  const togglePitchCircles = useGearLabStore((state) => state.togglePitchCircles);
  const toggleLabels = useGearLabStore((state) => state.toggleLabels);
  const toggleGrid = useGearLabStore((state) => state.toggleGrid);
  const requestCameraReset = useGearLabStore((state) => state.requestCameraReset);
  const resetExperiment = useGearLabStore((state) => state.resetExperiment);

  return (
    <section className="control-panel" aria-label="实验控制面板">
      <div className="control-panel-primary">
        <button
          className="play-button"
          type="button"
          onClick={togglePlaying}
          aria-label={isPlaying ? "暂停齿轮" : "播放齿轮"}
        >
          {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
          <span>{isPlaying ? "暂停" : "播放"}</span>
        </button>

        <div className="direction-control">
          <span>主动轮方向</span>
          <div className="segmented-control">
            <button
              type="button"
              className={inputDirection === -1 ? "is-active" : ""}
              onClick={() => setInputDirection(-1)}
            >
              <RotateCw size={15} /> 顺时针
            </button>
            <button
              type="button"
              className={inputDirection === 1 ? "is-active" : ""}
              onClick={() => setInputDirection(1)}
            >
              <RotateCcw size={15} /> 逆时针
            </button>
          </div>
        </div>
      </div>

      <div className="control-sliders">
        <RangeField
          label="主动轮齿数"
          value={driverTeeth}
          min={12}
          max={42}
          suffix="齿"
          onChange={setDriverTeeth}
        />
        <RangeField
          label="从动轮齿数"
          value={drivenTeeth}
          min={12}
          max={42}
          suffix="齿"
          onChange={setDrivenTeeth}
        />
        <RangeField
          label="输入转速"
          value={inputRpm}
          min={20}
          max={240}
          step={5}
          suffix="RPM"
          onChange={setInputRpm}
        />
      </div>

      <div className="control-tools">
        <button
          type="button"
          className={showPitchCircles ? "is-active" : ""}
          onClick={togglePitchCircles}
          title="显示或隐藏节圆"
        >
          <CircleDashed size={16} /> 节圆
        </button>
        <button
          type="button"
          className={showLabels ? "is-active" : ""}
          onClick={toggleLabels}
          title="显示或隐藏齿轮标签"
        >
          <Eye size={16} /> 标签
        </button>
        <button
          type="button"
          className={showGrid ? "is-active" : ""}
          onClick={toggleGrid}
          title="显示或隐藏参考网格"
        >
          <Grid3X3 size={16} /> 网格
        </button>
        <button type="button" onClick={requestCameraReset} title="重置相机视角">
          <ScanLine size={16} /> 视角
        </button>
        <button type="button" onClick={resetExperiment} title="恢复默认参数">
          <RotateCcw size={16} /> 重置
        </button>
      </div>
    </section>
  );
}
