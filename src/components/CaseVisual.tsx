import type { CSSProperties } from 'react';
import type { PracticeVisual, PracticeVisualElement } from '../types';
import { EVIDENCE_STATUS_METADATA } from './evidenceStatus';

type CaseVisualProps = { visual: PracticeVisual };
type ElementDetailsProps = { element: PracticeVisualElement; index: number; className: string };

function ElementDetails({ element, index, className }: ElementDetailsProps) {
  return (
    <details className={`${className} case-visual__detail case-visual__detail--${element.status}`}>
      <summary>
        <span className="case-visual__detail-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="case-visual__detail-copy"><strong>{element.label}</strong><small>{EVIDENCE_STATUS_METADATA[element.status].label} / inspect</small></span>
      </summary>
      <p>{element.detail}</p>
    </details>
  );
}

function FlowVisual({ elements }: { elements: PracticeVisualElement[] }) {
  return (
    <ol
      className="case-visual__flow"
      aria-label="Directional flow visualization"
      style={{ '--case-visual-columns': elements.length } as CSSProperties}
    >
      {elements.map((element, index) => (
        <li className={`case-visual__flow-step case-visual__flow-step--${element.status}`} key={element.id}>
          <ElementDetails element={element} index={index} className="case-visual__flow-node" />
          {index < elements.length - 1 && <span className="case-visual__flow-connector" aria-hidden="true">→</span>}
        </li>
      ))}
    </ol>
  );
}

function TopologyVisual({ elements }: { elements: PracticeVisualElement[] }) {
  return (
    <div className="case-visual__topology" role="group" aria-label="Network topology visualization">
      {elements.map((element, index) => (
        <div className="case-visual__topology-segment" key={element.id}>
          <div className={`case-visual__topology-node case-visual__topology-node--${element.status}`}>
            <span className="case-visual__topology-pin" aria-hidden="true" />
            <ElementDetails element={element} index={index} className="case-visual__topology-card" />
          </div>
          {index < elements.length - 1 && <span className="case-visual__topology-link" aria-hidden="true">↔</span>}
        </div>
      ))}
    </div>
  );
}

function SchematicVisual({ elements }: { elements: PracticeVisualElement[] }) {
  return (
    <div className="case-visual__schematic" role="group" aria-label="Hardware layout visualization">
      <div className="case-visual__schematic-frame" aria-hidden="true" />
      <ol className="case-visual__schematic-parts" aria-label="Hardware layout parts">
        {elements.map((element, index) => (
          <li className={`case-visual__schematic-part case-visual__schematic-part--${element.status}`} key={element.id}>
            <ElementDetails element={element} index={index} className="case-visual__schematic-card" />
            {index < elements.length - 1 && <span className="case-visual__schematic-edge" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CaseVisual({ visual }: CaseVisualProps) {
  const mode = visual.kind === 'flow'
    ? <FlowVisual elements={visual.elements} />
    : visual.kind === 'topology'
      ? <TopologyVisual elements={visual.elements} />
      : <SchematicVisual elements={visual.elements} />;

  return (
    <section className="case-visual" aria-labelledby="case-visual-heading">
      <div className="case-visual__header">
        <p className="eyebrow">CASE EVIDENCE MAP</p>
        <span className="case-visual__kind">{visual.kind.toUpperCase()}</span>
      </div>
      <h3 id="case-visual-heading">{visual.title}</h3>
      <p className="case-visual__description">{visual.description}</p>
      {mode}
    </section>
  );
}
