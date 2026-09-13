import type { CategoryMeta } from '../types';

type CompletionViewProps = {
  category: CategoryMeta;
  score: number;
  onReview: () => void;
  onLibrary: () => void;
};

export function CompletionView({ category, score, onReview, onLibrary }: CompletionViewProps) {
  return (
    <main className="completion-page">
      <p className="eyebrow">CATEGORY COMPLETE / {category.shortName}</p>
      <div className="completion-score"><span>{String(score).padStart(2, '0')}</span><small>/ 10 RIGHT</small></div>
      <h1>Good work.<br /><em>Keep the signal.</em></h1>
      <p className="completion-copy">You worked through all 10 {category.name} cases. Review the full path again or choose another track when you’re ready.</p>
      <div className="completion-actions"><button className="primary-button" type="button" onClick={onReview}>Review cases <span aria-hidden="true">↗</span></button><button className="secondary-button" type="button" onClick={onLibrary}>Back to library <span aria-hidden="true">→</span></button></div>
    </main>
  );
}
