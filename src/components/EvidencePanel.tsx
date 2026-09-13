import type { RefObject } from 'react';
import type { PracticeQuestion } from '../types';
import { CaseVisual } from './CaseVisual';
import { EVIDENCE_STATUS_METADATA } from './evidenceStatus';

type EvidencePanelProps = { question: PracticeQuestion; headingRef: RefObject<HTMLHeadingElement | null> };

export function EvidencePanel({ question, headingRef }: EvidencePanelProps) {
  return (
    <section className="evidence-panel" aria-labelledby="evidence-heading">
      <div className="panel-heading"><div><p className="eyebrow">WHAT YOU FIND</p><h2 className="focus-target" id="evidence-heading" ref={headingRef} tabIndex={-1}>The signal gets clearer.</h2></div><span className="panel-heading__mark" aria-hidden="true">✓</span></div>
      <div className="evidence-list">
        {question.evidence.map((item) => (
          <div className={`evidence-row evidence-row--${item.status}`} key={item.label}>
            <span className="evidence-status"><span className="evidence-status__glyph" aria-hidden="true">{EVIDENCE_STATUS_METADATA[item.status].symbol}</span><span className="evidence-status__label">{EVIDENCE_STATUS_METADATA[item.status].label}</span></span>
            <div><strong>{item.label}</strong><p>{item.detail}</p></div>
          </div>
        ))}
      </div>
      <CaseVisual visual={question.visual} />
    </section>
  );
}
