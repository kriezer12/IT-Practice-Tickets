import type { RefObject } from 'react';
import type { PracticeQuestion } from '../types';

type CheckpointPanelProps = {
  question: PracticeQuestion;
  selectedChoice: string | null;
  onSelect: (choiceId: string) => void;
  onSubmit: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

export function CheckpointPanel({ question, selectedChoice, onSelect, onSubmit, headingRef }: CheckpointPanelProps) {
  return (
    <section className="checkpoint-panel" aria-labelledby="checkpoint-heading">
      <div className="checkpoint-panel__label"><span className="question-icon" aria-hidden="true">?</span><p className="eyebrow">FIRST CHECK</p></div>
      <h2 className="focus-target" id="checkpoint-heading" ref={headingRef} tabIndex={-1}>{question.prompt}</h2>
      <p className="checkpoint-hint">Read the ticket. Select the smallest useful action to narrow the fault.</p>
      <fieldset className="choice-list">
        <legend className="sr-only">Choose your first check</legend>
        {question.choices.map((choice, index) => (
          <label className={`choice-row ${selectedChoice === choice.id ? 'is-selected' : ''}`} key={choice.id}>
            <input type="radio" name="first-check" value={choice.id} checked={selectedChoice === choice.id} onChange={() => onSelect(choice.id)} />
            <span className="choice-row__index">{String.fromCharCode(65 + index)}</span>
            <span className="choice-row__label">{choice.label}</span>
            <span className="choice-row__indicator" aria-hidden="true" />
          </label>
        ))}
      </fieldset>
      <button className="primary-button" type="button" onClick={onSubmit} disabled={!selectedChoice}>Reveal what you find <span aria-hidden="true">↗</span></button>
    </section>
  );
}
