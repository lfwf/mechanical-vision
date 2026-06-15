import { BookOpen, ExternalLink } from "lucide-react";
import { getExperimentDefinition } from "../../data/experiments/experimentRegistry";
import { getExperimentQuality } from "../../data/experiments/qualityRecords";
import type { ExperimentId } from "../../types/experiment";

export function GenericKnowledgeView({ experimentId }: { experimentId: ExperimentId }) {
  const definition = getExperimentDefinition(experimentId);
  const quality = getExperimentQuality(experimentId);
  const quickSourceIds = Array.from(
    new Set(definition.knowledge.flatMap((section) => section.items.flatMap((item) => item.sourceIds))),
  ).slice(0, 4);

  return (
    <div className="knowledge-view">
      <section className="knowledge-intro">
        <div className="section-title-row">
          <BookOpen size={17} />
          <h3>一分钟理解</h3>
        </div>
        <p>{definition.quickSummary}</p>
        <div className="source-chip-row">
          {quickSourceIds.map((sourceId) => (
            <span className="source-chip" key={sourceId}>{sourceId}</span>
          ))}
        </div>
      </section>

      <div className="knowledge-sections">
        {definition.knowledge.map((section, sectionIndex) => (
          <details className="knowledge-section" key={section.id} open={sectionIndex === 0}>
            <summary>
              <span>{section.title}</span>
              <small>{section.summary}</small>
            </summary>
            <div className="knowledge-items">
              {section.items.map((item) => (
                <article key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <div className="source-chip-row">
                    {item.sourceIds.map((sourceId) => (
                      <span className="source-chip" key={sourceId}>{sourceId}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </details>
        ))}
      </div>

      <section className="knowledge-source-index">
        <h3>本页来源索引</h3>
        <ul>
          {quality.sources.map((source) => (
            <li key={source.id}>
              <strong>{source.id}</strong>
              <span>{source.title}</span>
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer">
                  查看来源 <ExternalLink size={12} />
                </a>
              )}
              {!source.url && <small>{source.locator}</small>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
