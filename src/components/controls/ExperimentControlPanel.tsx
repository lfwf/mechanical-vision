import {
  Eye,
  Grid3X3,
  PackageCheck,
  PackageOpen,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  ScanLine,
  Wrench,
} from "lucide-react";
import { getExperimentDefinition } from "../../data/experiments/experimentRegistry";
import { useExperimentStore } from "../../store/useExperimentStore";
import { RangeField } from "./RangeField";

export function ExperimentControlPanel() {
  const activeId = useExperimentStore((state) => state.activeExperimentId);
  const speed = useExperimentStore((state) => state.speed);
  const primary = useExperimentStore((state) => state.primary);
  const secondary = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const showLabels = useExperimentStore((state) => state.showLabels);
  const showGrid = useExperimentStore((state) => state.showGrid);
  const selectedPartId = useExperimentStore((state) => state.selectedPartId);
  const detachedPartIds = useExperimentStore((state) => state.detachedPartIds);
  const setValue = useExperimentStore((state) => state.setValue);
  const setVariant = useExperimentStore((state) => state.setVariant);
  const setDirection = useExperimentStore((state) => state.setDirection);
  const togglePlaying = useExperimentStore((state) => state.togglePlaying);
  const toggleLabels = useExperimentStore((state) => state.toggleLabels);
  const toggleGrid = useExperimentStore((state) => state.toggleGrid);
  const requestCameraReset = useExperimentStore((state) => state.requestCameraReset);
  const resetCurrentExperiment = useExperimentStore((state) => state.resetCurrentExperiment);
  const togglePartDetached = useExperimentStore((state) => state.togglePartDetached);
  const detachAll = useExperimentStore((state) => state.detachAll);
  const assembleAll = useExperimentStore((state) => state.assembleAll);

  const definition = getExperimentDefinition(activeId);
  const visibleControls = definition.controls.filter(
    (control) =>
      !control.visibleWhenVariants || control.visibleWhenVariants.includes(variant),
  );
  const hasSpeed = visibleControls.some((control) => control.key === "speed");
  const showDirection = hasSpeed && definition.showDirectionControl !== false;
  const assemblyMode =
    definition.supportsPartAssembly === true &&
    (definition.assemblyVariants?.includes(variant) ?? false);
  const selectedPart = definition.partManuals?.find((part) => part.id === selectedPartId);
  const detachableIds =
    definition.partManuals
      ?.filter((part) => part.detachable !== false)
      .map((part) => part.id) ?? [];
  const selectedDetached = selectedPartId
    ? detachedPartIds.includes(selectedPartId)
    : false;
  const runtimeValues = { speed, primary, secondary };

  return (
    <section className="control-panel experiment-control-panel" aria-label="实验控制面板">
      <div className="control-panel-primary">
        {hasSpeed && (
          <button
            className="play-button"
            type="button"
            onClick={togglePlaying}
            aria-label={isPlaying ? "暂停机构" : "播放机构"}
          >
            {isPlaying ? (
              <Pause size={19} fill="currentColor" />
            ) : (
              <Play size={19} fill="currentColor" />
            )}
            <span>{isPlaying ? "暂停" : "播放"}</span>
          </button>
        )}

        {showDirection && (
          <div className="direction-control">
            <span>输入方向</span>
            <div className="segmented-control">
              <button
                type="button"
                className={direction === -1 ? "is-active" : ""}
                onClick={() => setDirection(-1)}
              >
                <RotateCw size={15} /> 顺时针
              </button>
              <button
                type="button"
                className={direction === 1 ? "is-active" : ""}
                onClick={() => setDirection(1)}
              >
                <RotateCcw size={15} /> 逆时针
              </button>
            </div>
          </div>
        )}

        {definition.variants && definition.variants.length > 0 && (
          <div className="experiment-variant-control">
            <span>{definition.variantLabel ?? "模式"}</span>
            <div className="experiment-variant-options">
              {definition.variants.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={variant === index ? "is-active" : ""}
                  onClick={() => setVariant(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {assemblyMode && (
        <div className="assembly-control-strip">
          <div className="assembly-selection-copy">
            <Wrench size={16} />
            <span>当前零件</span>
            <strong>{selectedPart?.name ?? "请在模型或零件页选择"}</strong>
            {selectedPartId && (
              <small>{selectedDetached ? "已拆下" : "已装配"}</small>
            )}
          </div>
          <div className="assembly-control-actions">
            <button
              type="button"
              disabled={!selectedPartId || selectedPart?.detachable === false}
              onClick={() => {
                if (selectedPartId) togglePartDetached(selectedPartId);
              }}
            >
              {selectedDetached ? <PackageCheck size={16} /> : <PackageOpen size={16} />}
              {selectedDetached ? "装回当前零件" : "拆下当前零件"}
            </button>
            <button type="button" onClick={() => detachAll(detachableIds)}>
              <PackageOpen size={16} /> 全部展开
            </button>
            <button type="button" onClick={assembleAll}>
              <PackageCheck size={16} /> 全部组装
            </button>
          </div>
        </div>
      )}

      {visibleControls.length > 0 && (
        <div className={`control-sliders control-count-${visibleControls.length}`}>
          {visibleControls.map((control) => (
            <RangeField
              key={control.key}
              label={control.label}
              value={runtimeValues[control.key]}
              min={control.min}
              max={control.max}
              step={control.step}
              suffix={control.suffix ?? ""}
              onChange={(value) => setValue(control.key, value)}
            />
          ))}
        </div>
      )}

      <div className="control-tools">
        <button
          type="button"
          className={showLabels ? "is-active" : ""}
          onClick={toggleLabels}
          title="显示或隐藏部件标签"
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
        <button
          type="button"
          onClick={resetCurrentExperiment}
          title="恢复当前实验默认参数"
        >
          <RotateCcw size={16} /> 重置
        </button>
      </div>
    </section>
  );
}
