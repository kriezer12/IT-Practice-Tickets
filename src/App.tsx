import { useEffect, useState } from 'react';
import { CATEGORIES, getCategoryQuestions } from './data/catalog';
import { CompletionView } from './components/CompletionView';
import { Library } from './components/Library';
import { PracticeView } from './components/PracticeView';
import { UnavailableCase } from './components/UnavailableCase';
import { loadProgress, markAnswered, resetCategoryProgress, saveProgress, setCategoryPosition, setSession } from './lib/progress';
import type { CategoryId, PracticePhase, PracticeSession, ProgressState } from './types';

type Theme = 'light' | 'dark';
type ActivePhase = Exclude<PracticePhase, 'complete'>;

const THEME_STORAGE_KEY = 'it-skills-practice-theme';

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

type InitialAppState = {
  progress: ProgressState;
  categoryId: CategoryId | null;
  position: number;
  phase: ActivePhase;
  selectedChoice: string | null;
  showCompletion: boolean;
};

type CategoryViewState = {
  position: number;
  phase: PracticePhase;
  selectedChoice: string | null;
  showCompletion: boolean;
};

function getCategoryViewState(progress: ProgressState, nextCategory: CategoryId): CategoryViewState {
  const questions = getCategoryQuestions(nextCategory);
  const savedSession = progress.session.categoryId === nextCategory ? progress.session : undefined;
  const savedPosition = progress.positionByCategory[nextCategory] ?? 0;
  const position = Math.min(savedSession?.position ?? savedPosition, Math.max(0, questions.length - 1));
  const categoryComplete = progress.completedByCategory[nextCategory].length === questions.length;
  const phase: PracticePhase = savedSession?.phase === 'complete' || (!savedSession && categoryComplete)
    ? 'complete'
    : savedSession?.phase === 'evidence' ? 'evidence' : 'prompt';

  return {
    position,
    phase,
    selectedChoice: savedSession?.selectedChoiceId ?? null,
    showCompletion: phase === 'complete',
  };
}

function initialAppState(): InitialAppState {
  const progress = loadProgress();
  const session = progress.session;
  const categoryId = session.categoryId;

  if (!categoryId) {
    return { progress, categoryId: null, position: 0, phase: 'prompt', selectedChoice: null, showCompletion: false };
  }

  const categoryState = getCategoryViewState(progress, categoryId);

  return {
    progress,
    categoryId,
    position: categoryState.position,
    phase: categoryState.phase === 'evidence' ? 'evidence' : 'prompt',
    selectedChoice: categoryState.selectedChoice,
    showCompletion: categoryState.showCompletion,
  };
}

export default function App() {
  const [initialState] = useState(initialAppState);
  const [progress, setProgress] = useState<ProgressState>(initialState.progress);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [categoryId, setCategoryId] = useState<CategoryId | null>(initialState.categoryId);
  const [position, setPosition] = useState(initialState.position);
  const [phase, setPhase] = useState<ActivePhase>(initialState.phase);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(initialState.selectedChoice);
  const [showCompletion, setShowCompletion] = useState(initialState.showCompletion);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // A blocked theme preference must not block the practice loop.
    }
  }, [theme]);

  const activeCategory = categoryId ? CATEGORIES.find((category) => category.id === categoryId) : undefined;
  const activeQuestions = categoryId ? getCategoryQuestions(categoryId) : [];
  const currentQuestion = activeQuestions[position];
  const storedAnswer = categoryId && currentQuestion
    ? progress.answersByCategory[categoryId][currentQuestion.id]
    : undefined;
  const feedback = phase === 'evidence' && storedAnswer
    ? { choiceId: storedAnswer.choiceId, correct: storedAnswer.correct }
    : null;

  const persistProgress = (next: ProgressState) => {
    setProgress(next);
    saveProgress(undefined, next);
  };

  const selectCategory = (nextCategory: CategoryId) => {
    const categoryState = getCategoryViewState(progress, nextCategory);
    const nextSession: PracticeSession = {
      categoryId: nextCategory,
      position: categoryState.position,
      phase: categoryState.phase,
      selectedChoiceId: categoryState.selectedChoice,
    };

    setCategoryId(nextCategory);
    setPosition(categoryState.position);
    setPhase(categoryState.phase === 'evidence' ? 'evidence' : 'prompt');
    setSelectedChoice(nextSession.selectedChoiceId);
    setShowCompletion(categoryState.showCompletion);
    persistProgress(setSession(progress, nextSession));
  };

  const returnToLibrary = () => {
    persistProgress(setSession(progress, {
      categoryId: null,
      position: 0,
      phase: 'prompt',
      selectedChoiceId: null,
    }));
    setCategoryId(null);
    setShowCompletion(false);
    setSelectedChoice(null);
  };

  const selectChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    if (!categoryId) return;
    persistProgress(setSession(progress, {
      categoryId,
      position,
      phase: 'prompt',
      selectedChoiceId: choiceId,
    }));
  };

  const submitChoice = () => {
    if (!currentQuestion || !selectedChoice) return;
    const correct = selectedChoice === currentQuestion.correctChoiceId;
    const answered = markAnswered(progress, currentQuestion.category, currentQuestion.id, correct, selectedChoice);
    persistProgress(setSession(answered, {
      categoryId: currentQuestion.category,
      position,
      phase: 'evidence',
      selectedChoiceId: selectedChoice,
    }));
    setPhase('evidence');
  };

  const goNext = () => {
    if (!categoryId || !currentQuestion) return;
    if (position === activeQuestions.length - 1) {
      if (progress.completedByCategory[categoryId].length < activeQuestions.length) return;
      persistProgress(setSession(progress, {
        categoryId,
        position,
        phase: 'complete',
        selectedChoiceId: selectedChoice,
      }));
      setShowCompletion(true);
      return;
    }
    const nextPosition = position + 1;
    const positioned = setCategoryPosition(progress, categoryId, nextPosition);
    persistProgress(setSession(positioned, {
      categoryId,
      position: nextPosition,
      phase: 'prompt',
      selectedChoiceId: null,
    }));
    setPosition(nextPosition);
    setPhase('prompt');
    setSelectedChoice(null);
  };

  const goPrevious = () => {
    if (phase === 'evidence') {
      if (categoryId) {
        persistProgress(setSession(progress, {
          categoryId,
          position,
          phase: 'prompt',
          selectedChoiceId: selectedChoice,
        }));
      }
      setPhase('prompt');
      return;
    }
    if (!categoryId || position === 0) return;
    const nextPosition = position - 1;
    const positioned = setCategoryPosition(progress, categoryId, nextPosition);
    persistProgress(setSession(positioned, {
      categoryId,
      position: nextPosition,
      phase: 'prompt',
      selectedChoiceId: null,
    }));
    setPosition(nextPosition);
    setSelectedChoice(null);
  };

  const resetTrack = () => {
    if (!categoryId || !window.confirm('Reset this track’s local progress?')) return;
    persistProgress(resetCategoryProgress(progress, categoryId));
    setPosition(0);
    setPhase('prompt');
    setSelectedChoice(null);
    setShowCompletion(false);
  };

  const reviewCategory = () => {
    if (!categoryId) return;
    persistProgress(setSession(progress, {
      categoryId,
      position: 0,
      phase: 'prompt',
      selectedChoiceId: null,
    }));
    setPosition(0);
    setPhase('prompt');
    setSelectedChoice(null);
    setShowCompletion(false);
  };

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');

  if (!categoryId) return <Library categories={CATEGORIES} progress={progress} onSelect={selectCategory} theme={theme} onToggleTheme={toggleTheme} />;
  if (showCompletion && activeCategory) return <CompletionView category={activeCategory} score={progress.scoreByCategory[categoryId]} onReview={reviewCategory} onRetry={resetTrack} onLibrary={returnToLibrary} />;
  if (!activeCategory || !currentQuestion) return <UnavailableCase categoryName={activeCategory?.name} onBack={returnToLibrary} />;

  return <PracticeView
    category={activeCategory}
    question={currentQuestion}
    navigation={{ position, total: activeQuestions.length }}
    state={{ phase, selectedChoice, feedback }}
    actions={{
      onBack: returnToLibrary,
      onPrevious: goPrevious,
      onNext: goNext,
      onSelectChoice: selectChoice,
      onSubmit: submitChoice,
      onReset: resetTrack,
      onToggleTheme: toggleTheme,
    }}
    theme={theme}
  />;
}
