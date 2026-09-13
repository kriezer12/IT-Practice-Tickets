import { useEffect, useRef } from 'react';
import type { CategoryMeta, PracticePhase, PracticeQuestion } from '../types';
import { AnswerPanel } from './AnswerPanel';
import { CheckpointPanel } from './CheckpointPanel';
import { EvidencePanel } from './EvidencePanel';
import { ThemeToggle } from './ThemeToggle';
import { TicketPanel } from './TicketPanel';

type PracticeViewState = {
  phase: Exclude<PracticePhase, 'complete'>;
  selectedChoice: string | null;
  correct: boolean;
};

type PracticeViewActions = {
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelectChoice: (choiceId: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  onToggleTheme: () => void;
};

type PracticeViewProps = {
  category: CategoryMeta;
  question: PracticeQuestion;
  navigation: { position: number; total: number };
  state: PracticeViewState;
  actions: PracticeViewActions;
  theme: 'light' | 'dark';
};

export function PracticeView({ category, question, navigation, state, actions, theme }: PracticeViewProps) {
  const { position, total } = navigation;
  const { phase, selectedChoice, correct } = state;
  const { onBack, onPrevious, onNext, onSelectChoice, onSubmit, onReset, onToggleTheme } = actions;
  const progress = ((position + 1) / total) * 100;
  const selectedAction = question.choices.find((choice) => choice.id === selectedChoice)?.label ?? 'No action selected';
  const correctAction = question.choices.find((choice) => choice.id === question.correctChoiceId)?.label ?? 'Unavailable';
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase, position]);

  return (
    <div className="practice-page">
      <header className="practice-header">
        <button className="back-button" type="button" onClick={onBack}><span aria-hidden="true">←</span> Library</button>
        <div className="practice-header__meta"><span className="status-chip"><span className="status-dot" aria-hidden="true" />{category.shortName} / LOCAL</span><ThemeToggle theme={theme} onToggle={onToggleTheme} /></div>
      </header>
      <main className="practice-main">
        <section className="practice-intro">
          <div><p className="eyebrow">{category.eyebrow} / GUIDED CASE</p><h1>{category.name}</h1><p>{category.description}</p></div>
          <div className="case-progress"><span className="eyebrow">CASE</span><strong>{String(position + 1).padStart(2, '0')}<small> / {String(total).padStart(2, '0')}</small></strong><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
        </section>

        <div className="practice-layout">
          <TicketPanel question={question} />
          <div className="practice-action">
            {phase === 'prompt' ? <CheckpointPanel question={question} selectedChoice={selectedChoice} onSelect={onSelectChoice} onSubmit={onSubmit} headingRef={headingRef} /> : <><EvidencePanel question={question} headingRef={headingRef} /><AnswerPanel correct={correct} selectedAction={selectedAction} correctAction={correctAction} explanation={question.explanation} takeaway={question.takeaway} onNext={onNext} isLast={position === total - 1} /></>}
          </div>
        </div>

        <footer className="practice-footer">
          <button className="text-button" type="button" onClick={onPrevious} disabled={phase === 'prompt' && position === 0}><span aria-hidden="true">←</span> Previous</button>
          <div className="practice-footer__center"><span>{phase === 'prompt' ? 'CHOOSE THE FIRST USEFUL CHECK' : correct ? 'CHECK COMPLETE / SIGNAL CONFIRMED' : 'CHECK COMPLETE / REVIEW THE PATH'}</span><span className="practice-footer__dots" aria-hidden="true">{Array.from({ length: total }, (_, index) => <i className={index === position ? 'is-active' : index < position ? 'is-done' : ''} key={index} />)}</span></div>
          <button className="text-button" type="button" onClick={onReset}>Reset track <span aria-hidden="true">↗</span></button>
        </footer>
      </main>
    </div>
  );
}
