import type { PracticeVisual } from '../types';

type CaseVisualProps = { visual: PracticeVisual };

const statusLabels = { pass: 'Pass', fail: 'Fail', note: 'Note' } as const;

export function CaseVisual({ visual }: CaseVisualProps) {
  return (
    <section className="case-visual" aria-labelledby="case-visual-heading">
      <div className="case-visual__header">
        <p className="eyebrow">CASE EVIDENCE MAP</p>
        <span className="case-visual__kind">{visual.kind.toUpperCase()}</span>
      </div>
      <h3 id="case-visual-heading">{visual.title}</h3>
      <p className="case-visual__description">{visual.description}</p>
      <ol className={`case-visual__map case-visual__map--${visual.kind}`} aria-label={`${visual.kind} evidence steps`}>
        {visual.elements.map((element, index) => (
          <li className={`case-visual__element case-visual__element--${element.status}`} key={element.id}>
            <details>
              <summary>
                <span className="case-visual__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="case-visual__element-copy"><strong>{element.label}</strong><small>{statusLabels[element.status]} / inspect</small></span>
              </summary>
              <p>{element.detail}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
