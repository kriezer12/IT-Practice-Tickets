import { CATEGORY_IDS, type AnswerRecord, type CategoryId, type PracticeSession, type ProgressState } from '../types';

export const PROGRESS_STORAGE_KEY = 'it-skills-practice-progress-v1';
export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function createEmptyProgress(): ProgressState {
  const completedByCategory: Record<CategoryId, string[]> = {
    'active-directory': [],
    networking: [],
    'physical-troubleshooting': [],
  };
  const positionByCategory: Record<CategoryId, number> = {
    'active-directory': 0,
    networking: 0,
    'physical-troubleshooting': 0,
  };
  const scoreByCategory: Record<CategoryId, number> = {
    'active-directory': 0,
    networking: 0,
    'physical-troubleshooting': 0,
  };
  const answersByCategory: Record<CategoryId, Record<string, AnswerRecord>> = {
    'active-directory': {},
    networking: {},
    'physical-troubleshooting': {},
  };
  const progress: ProgressState = {
    version: 1,
    completedByCategory,
    positionByCategory,
    scoreByCategory,
    answersByCategory,
    session: {
      categoryId: null,
      position: 0,
      phase: 'prompt',
      selectedChoiceId: null,
      revealedChoiceId: null,
    },
  };
  return progress;
}

function isProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ProgressState>;
  if (candidate.version !== 1 || !candidate.completedByCategory || !candidate.positionByCategory || !candidate.scoreByCategory || !candidate.answersByCategory || !candidate.session) return false;

  const session = candidate.session;
  const validPhase = session.phase === 'prompt' || session.phase === 'evidence' || session.phase === 'complete';
  const validSessionCategory = session.categoryId === null || CATEGORY_IDS.includes(session.categoryId);
  if (!validPhase || !validSessionCategory || !Number.isInteger(session.position) || session.position < 0) return false;
  if (session.selectedChoiceId !== null && typeof session.selectedChoiceId !== 'string') return false;
  if (session.revealedChoiceId !== null && typeof session.revealedChoiceId !== 'string') return false;

  return CATEGORY_IDS.every((category) => {
    const completed = candidate.completedByCategory?.[category];
    const position = candidate.positionByCategory?.[category];
    const score = candidate.scoreByCategory?.[category];
    const answers = candidate.answersByCategory?.[category];
    return Array.isArray(completed)
      && completed.every((id) => typeof id === 'string')
      && typeof position === 'number'
      && Number.isInteger(position)
      && position >= 0
      && typeof score === 'number'
      && Number.isInteger(score)
      && score >= 0
      && !!answers
      && typeof answers === 'object'
      && Object.entries(answers).every(([questionId, answer]) => questionId.length > 0
        && !!answer
        && typeof answer === 'object'
        && typeof answer.choiceId === 'string'
        && typeof answer.correct === 'boolean');
  });
}

function browserStorage(): ProgressStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function loadProgress(storage?: ProgressStorage): ProgressState {
  const target = storage ?? browserStorage();
  if (!target) return createEmptyProgress();

  try {
    const raw = target.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return createEmptyProgress();
    const parsed: unknown = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(storage: ProgressStorage | undefined, progress: ProgressState): void {
  const target = storage ?? browserStorage();
  if (!target) return;
  try {
    target.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Local persistence is an enhancement; a blocked storage API should not break practice.
  }
}

export function markAnswered(progress: ProgressState, category: CategoryId, questionId: string, correct: boolean, choiceId = ''): ProgressState {
  const completed = progress.completedByCategory[category];
  if (completed.includes(questionId)) return progress;

  return {
    ...progress,
    completedByCategory: { ...progress.completedByCategory, [category]: [...completed, questionId] },
    scoreByCategory: { ...progress.scoreByCategory, [category]: progress.scoreByCategory[category] + (correct ? 1 : 0) },
    answersByCategory: {
      ...progress.answersByCategory,
      [category]: {
        ...progress.answersByCategory[category],
        [questionId]: { choiceId, correct },
      },
    },
  };
}

export function setCategoryPosition(progress: ProgressState, category: CategoryId, position: number): ProgressState {
  return {
    ...progress,
    positionByCategory: { ...progress.positionByCategory, [category]: Math.max(0, Math.floor(position)) },
  };
}

export function setSession(progress: ProgressState, session: PracticeSession): ProgressState {
  return { ...progress, session };
}

export function resetCategoryProgress(progress: ProgressState, category: CategoryId): ProgressState {
  const session = progress.session.categoryId === category
    ? { ...progress.session, position: 0, phase: 'prompt' as const, selectedChoiceId: null, revealedChoiceId: null }
    : progress.session;

  return {
    ...progress,
    completedByCategory: { ...progress.completedByCategory, [category]: [] },
    positionByCategory: { ...progress.positionByCategory, [category]: 0 },
    scoreByCategory: { ...progress.scoreByCategory, [category]: 0 },
    answersByCategory: { ...progress.answersByCategory, [category]: {} },
    session,
  };
}
