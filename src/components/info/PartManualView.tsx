import {
  AlertTriangle,
  CheckCircle2,
  Link2,
  MapPin,
  PackageCheck,
  PackageOpen,
  Wrench,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { getExperimentDefinition } from "../../data/experiments/experimentRegistry";
import { useExperimentStore } from "../../store/useExperimentStore";
import type { ExperimentId } from "../../types/experiment";

export function PartManualView({ experimentId }: { experimentId: ExperimentId }) {
  const definition = getExperimentDefinition(experimentId);
  const manuals = definition.partManuals ?? [];
  const selectedPartId = useExperimentStore((state) => state.selectedPartId);
  const detachedPartIds = useExperimentStore((state) => state.detachedPartIds);
  const selectPart = useExperimentStore((state) => state.selectPart);
  const togglePartDetached = useExperimentStore((state) => state.togglePartDetached);
  const selectedPart = manuals.find((part) => part.id === selectedPartId) ?? manuals[0];
  const detached = selectedPart ? detachedPartIds.includes(selectedPart.id) : false;

  useEffect(() => {
    if (manuals.length > 0 && !manuals.some((part) => part.id === selectedPartId)) {
      selectPart(manuals[0].id);
    }
  }, [manuals, selectPart, selectedPartId]);

  if (!selectedPart) {
    return <div className="part-manual-empty">该实验暂未建立零件说明书。</div>;
  }

  const systems = Array.from(new Set(manuals.map((part) => part.system));

  return (
    <div className="part-manual-view">
      {definition.referenceModel && (
        <section className="reference-model-card">
          <span>参考实机</span>
          <strong>
            {definition.referenceModel.manufacturer} {definition.referenceModel.model}
          </strong>
          <small>{definition.referenceModel.productType}</small>
          <p>{definition.referenceModel.accuracyStatement}</p>
        </section>
      )}

      <section className="part-picker-section">
        <div className="section-title-row">
          <Wrench size={17} />
          <h3>零件目录</h3>
        </div>
        {systems.map((system) => (
          <div className="part-picker-group" key={system}>
            <span>{system}</span>
            <div className="part-picker-grid">
              {manuals
                .filter((part) => part.system === system)
                .sort((a, b) => a.removalOrder - b.removalOrder)
                .map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    className={selectedPart.id === part.id ? "is-active" : ""}
                    onClick={() => selectPart(part.id)}
                  >
                    <i>{String(part.removalOrder).padStart(2, "0")}</i>
                    <span>{part.name}</span>
                    <small>
                      {detachedPartIds.includes(part.id) ? "已拆下" : "已装配"}
                    </small>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className="part-manual-card">
        <header>
          <div>
            <span>
              {selectedPart.system} · {selectedPart.partCode}
            </span>
            <h3>{selectedPart.name}</h3>
          </div>
          {selectedPart.detachable !== false && (
            <button
              type="button"
              onClick={() => togglePartDetached(selectedPart.id)}
            >
              {detached ? <PackageCheck size={16} /> : <PackageOpen size={16} />}
              {detached ? "装回" : "拆下"}
            </button>
          )}
        </header>

        <div className="part-manual-summary">
          <div>
            <MapPin size={15} />
            <span>位置</span>
            <p>{selectedPart.location}</p>
          </div>
          <div>
            <Wrench size={15} />
            <span>作用</span>
            <p>{selectedPart.function}</p>
          </div>
        </div>

        <ManualList title="连接关系" icon={<Link2 size={15} />} items={selectedPart.connections} />
        <ManualList
          title="拆卸前提"
          icon={<AlertTriangle size={15} />}
          items={selectedPart.removalPrerequisites}
          warning
        />
        <ManualList
          title="仿真拆卸顺序"
          icon={<PackageOpen size={15} />}
          items={selectedPart.removalSteps}
          ordered
        />
        <ManualList
          title="装回检查"
          icon={<CheckCircle2 size={15} />}
          items={selectedPart.installChecks}
        />
        <ManualList
          title="风险提示"
          icon={<AlertTriangle size={15} />}
          items={selectedPart.warnings}
          warning
        />

        <div className="part-source-row">
          <span>依据</span>
          {selectedPart.sourceIds.map((sourceId) => (
            <code key={sourceId}>{sourceId}</code>
          ))}
        </div>
      </section>
    </div>
  );
}

function ManualList({
  title,
  icon,
  items,
  warning = false,
  ordered = false,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  warning?: boolean;
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <section className={`manual-list ${warning ? "is-warning" : ""}`}>
      <div>
        {icon}
        <h4>{title}</h4>
      </div>
      <Tag>{items.map((item) => <li key={item}>{item}</li>)}</Tag>
    </section>
  );
}
