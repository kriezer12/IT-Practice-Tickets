type AnswerPanelProps = {
  correct: boolean;
  selectedAction: string;
  correctAction: string;
  explanation: string;
  takeaway: string;
  onNext: () => void;
  isLast: boolean;
};

export function AnswerPanel({ correct, selectedAction, correctAction, explanation, takeaway, onNext, isLast }: AnswerPanelProps) {
  return (
    <section className={`answer-panel ${correct ? 'answer-panel--correct' : 'answer-panel--review'}`} aria-live="polite" aria-labelledby="answer-heading">
      <div className="answer-panel__top"><span className="answer-badge">{correct ? 'GOOD CHECK' : 'REVIEW THE PATH'}</span><span className="answer-panel__symbol" aria-hidden="true">{correct ? '↗' : '↘'}</span></div>
      <h2 id="answer-heading">{correct ? 'That check would move you forward.' : 'The useful next check is elsewhere.'}</h2>
      <div className="answer-comparison">
        <div><span className="answer-detail__label">SELECTED ACTION</span><strong>{selectedAction}</strong></div>
        <div><span className="answer-detail__label">CORRECT ACTION</span><strong>{correctAction}</strong></div>
      </div>
      <p className="answer-result"><span className="answer-detail__label">FIRST CHECK RESULT</span> {correct ? 'Correct — this is the highest-signal first check.' : 'Not the highest-signal first check; compare it with the correct action above.'}</p>
      <p>{explanation}</p>
      <div className="takeaway"><span className="takeaway__icon" aria-hidden="true">✳</span><div><p className="eyebrow">KEY TAKEAWAY</p><strong>{takeaway}</strong></div></div>
      <button className="secondary-button secondary-button--inverse" type="button" onClick={onNext}>{isLast ? 'See your category result' : 'Next case'} <span aria-hidden="true">→</span></button>
    </section>
  );
}
