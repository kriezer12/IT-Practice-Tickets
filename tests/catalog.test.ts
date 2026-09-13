import { describe, expect, it } from 'vitest';
import { CATEGORIES, getCategoryQuestions, validateCatalog } from '../src/data/catalog';
import { CATEGORY_IDS } from '../src/types';

describe('question catalog', () => {
  it('contains exactly ten ordered questions for every enabled category', () => {
    expect(CATEGORIES.map((category) => category.id)).toEqual([...CATEGORY_IDS]);
    expect(validateCatalog()).toEqual([]);

    expect(CATEGORIES.reduce((total, category) => total + getCategoryQuestions(category.id).length, 0)).toBe(30);

    for (const category of CATEGORY_IDS) {
      const questions = getCategoryQuestions(category);
      expect(questions).toHaveLength(10);
      expect(questions.map((question) => question.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(new Set(questions.map((question) => question.id)).size).toBe(10);
    }
  });

  it('reports duplicate IDs and broken category ordering', () => {
    const questions = getCategoryQuestions('active-directory');
    const broken = [...questions.slice(0, 9), { ...questions[9], id: questions[0].id, order: 12 }];

    const errors = validateCatalog(broken);

    expect(errors).toContain(`Duplicate question id: ${questions[0].id}`);
    expect(errors).toContain(`active-directory has non-contiguous order at ${questions[0].id}`);
    expect(errors).not.toContain('active-directory must contain exactly 10 questions; found 10');
  });
});
