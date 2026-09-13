import { useEffect, useRef } from 'react';
import type { CategoryMeta } from '../types';

type CompletionViewProps = {
  category: CategoryMeta;
  score: number;
  onReview: () => void;
  onRetry: () => void;
  onLibrary: () => void;
};

export function CompletionView({ category, score, onReview, onRetry, onLibrary }: CompletionViewProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main className="completion-page" id="main-content" tabIndex={-1}>
      <p className="eyebrow">CATEGORY COMPLETE / {category.shortName}</p>
      <div className="completion-score"><span>{String(score).padStart(2, '0')}</span><small>/ 10 RIGHT</small></div>
      <h1 className="focus-target" ref={headingRef} tabIndex={-1}>Good work.<br /><em>Keep the signal.</em></h1>
      <p className="completion-copy">You worked through all 10 {category.name} cases. Review the full path again or choose another track when you’re ready.</p>
      <div className="completion-actions"><button className="primary-button" type="button" onClick={onReview}>Review cases <span aria-hidden="true">↗</span></button><button className="secondary-button" type="button" onClick={onRetry}>Retry this category <span aria-hidden="true">↻</span></button><button className="secondary-button" type="button" onClick={onLibrary}>Back to library <span aria-hidden="true">→</span></button></div>
      </main>
    </>
  );
}
