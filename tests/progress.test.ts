import { describe, expect, it } from 'vitest';
import {
  createEmptyProgress,
  loadProgress,
  markAnswered,
  resetCategoryProgress,
  saveProgress,
  setCategoryPosition,
} from '../src/lib/progress';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  [name: string]: unknown;
  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

describe('local progress store', () => {
  it('round-trips answers and positions through storage', () => {
    const storage = new MemoryStorage();
    const initial = createEmptyProgress();
    const answered = markAnswered(initial, 'networking', 'net-01', true, 'a');
    const positioned = setCategoryPosition(answered, 'networking', 3);

    saveProgress(storage, positioned);

    expect(loadProgress(storage)).toEqual(positioned);
  });

  it('records only the first submitted answer for a question', () => {
    const initial = createEmptyProgress();
    const first = markAnswered(initial, 'active-directory', 'ad-01', true, 'b');
    const repeated = markAnswered(first, 'active-directory', 'ad-01', false, 'a');

    expect(repeated).toBe(first);
    expect(repeated.answersByCategory['active-directory']['ad-01']).toEqual({ choiceId: 'b', correct: true });
    expect(repeated.scoreByCategory['active-directory']).toBe(1);
  });

  it('round-trips the active session through the same injectable boundary', () => {
    const storage = new MemoryStorage();
    const initial = createEmptyProgress();
    const session = {
      categoryId: 'networking' as const,
      position: 2,
      phase: 'evidence' as const,
      selectedChoiceId: 'a',
      revealedChoiceId: 'a',
    };

    saveProgress(storage, { ...initial, session });

    expect(loadProgress(storage).session).toEqual(session);
  });

  it('falls back safely when persisted state is malformed', () => {
    const storage = new MemoryStorage();
    storage.setItem('it-skills-practice-progress-v1', '{not-json');

    expect(loadProgress(storage)).toEqual(createEmptyProgress());
  });

  it('resets only the selected category', () => {
    const progress = markAnswered(markAnswered(createEmptyProgress(), 'active-directory', 'ad-01', true), 'networking', 'net-01', false);
    const reset = resetCategoryProgress(progress, 'active-directory');

    expect(reset.completedByCategory['active-directory']).toEqual([]);
    expect(reset.scoreByCategory['active-directory']).toBe(0);
    expect(reset.completedByCategory.networking).toEqual(['net-01']);
    expect(reset.scoreByCategory.networking).toBe(0);
  });
});
