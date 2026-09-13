import { getCategoryQuestions } from '../data/catalog';
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
    },
  };
  return progress;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasCategoryKeys(value: unknown): value is Record<CategoryId, unknown> {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return keys.length === CATEGORY_IDS.length && CATEGORY_IDS.every((category) => keys.includes(category));
}

function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && CATEGORY_IDS.includes(value as CategoryId);
}

function isChoiceId(question: ReturnType<typeof getCategoryQuestions>[number], choiceId: string): boolean {
  return question.choices.some((choice) => choice.id === choiceId);
}

function isProgressState(value: unknown): value is ProgressState {
  if (!isRecord(value) || value.version !== 1) return false;
  if (!hasCategoryKeys(value.completedByCategory) || !hasCategoryKeys(value.positionByCategory) || !hasCategoryKeys(value.scoreByCategory) || !hasCategoryKeys(value.answersByCategory) || !isRecord(value.session)) return false;

  for (const category of CATEGORY_IDS) {
    const questions = getCategoryQuestions(category);
    const completed = value.completedByCategory[category];
    const position = value.positionByCategory[category];
    const score = value.scoreByCategory[category];
    const answers = value.answersByCategory[category];

    if (!Array.isArray(completed) || completed.some((id) => typeof id !== 'string')) return false;
    if (new Set(completed).size !== completed.length) return false;
    if (typeof position !== 'number' || !Number.isInteger(position) || position < 0 || position >= questions.length) return false;
    if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > questions.length) return false;
    if (!isRecord(answers) || Object.keys(answers).length !== completed.length) return false;

    let calculatedScore = 0;
    for (const questionId of completed) {
      const question = questions.find((candidate) => candidate.id === questionId);
      const answer = answers[questionId];
      if (!question || !isRecord(answer) || typeof answer.choiceId !== 'string' || typeof answer.correct !== 'boolean') return false;
      if (!isChoiceId(question, answer.choiceId)) return false;
      if (answer.correct !== (answer.choiceId === question.correctChoiceId)) return false;
      calculatedScore += answer.correct ? 1 : 0;
    }

    for (const questionId of Object.keys(answers)) {
      if (!completed.includes(questionId)) return false;
    }
    if (score !== calculatedScore) return false;
  }

  const session = value.session;
  const sessionCategory = session.categoryId;
  if (sessionCategory !== null && !isCategoryId(sessionCategory)) return false;
  if (typeof session.position !== 'number' || !Number.isInteger(session.position) || session.position < 0) return false;
  if (session.phase !== 'prompt' && session.phase !== 'evidence' && session.phase !== 'complete') return false;
  if (session.selectedChoiceId !== null && typeof session.selectedChoiceId !== 'string') return false;

  if (sessionCategory === null) {
    return session.phase === 'prompt' && session.position === 0 && session.selectedChoiceId === null;
  }

  const questions = getCategoryQuestions(sessionCategory);
  const question = questions[session.position];
  const sessionCompleted = value.completedByCategory[sessionCategory];
  if (!Array.isArray(sessionCompleted)) return false;
  if (!question || value.positionByCategory[sessionCategory] !== session.position) return false;
  if (session.selectedChoiceId !== null && !isChoiceId(question, session.selectedChoiceId)) return false;

  if (session.phase === 'prompt') return true;
  if (session.phase === 'evidence') {
    return session.selectedChoiceId !== null && sessionCompleted.includes(question.id);
  }
  return session.position === questions.length - 1
    && sessionCompleted.length === questions.length;
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
    ? { ...progress.session, position: 0, phase: 'prompt' as const, selectedChoiceId: null }
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
