import type { PracticeQuestion } from '../types';

type EvidencePanelProps = { question: PracticeQuestion };

export function EvidencePanel({ question }: EvidencePanelProps) {
  return (
    <section className="evidence-panel" aria-labelledby="evidence-heading">
      <div className="panel-heading"><div><p className="eyebrow">WHAT YOU FIND</p><h2 id="evidence-heading">The signal gets clearer.</h2></div><span className="panel-heading__mark" aria-hidden="true">✓</span></div>
      <div className="evidence-list">
        {question.evidence.map((item) => (
          <div className={`evidence-row evidence-row--${item.status}`} key={item.label}>
            <span className="evidence-status" aria-label={item.status}>{item.status === 'pass' ? '✓' : item.status === 'fail' ? '×' : '·'}</span>
            <div><strong>{item.label}</strong><p>{item.detail}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
