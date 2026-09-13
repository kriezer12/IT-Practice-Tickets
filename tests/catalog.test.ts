import { describe, expect, it } from 'vitest';
import { CATEGORIES, getCategoryQuestions, validateCatalog } from '../src/data/catalog';
import { QUESTIONS } from '../src/data/questions';
import { CATEGORY_IDS, type PracticeQuestion } from '../src/types';

const cloneQuestion = (question: PracticeQuestion): PracticeQuestion => structuredClone(question);

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

  it('gives every case a specific evidence map, accessible text alternative, and reviewed source', () => {
    expect(QUESTIONS).toHaveLength(30);
    expect(QUESTIONS.every((question) => question.visual.title.length > 0)).toBe(true);
    expect(QUESTIONS.every((question) => question.visual.description.length > 0)).toBe(true);
    expect(QUESTIONS.every((question) => question.visual.elements.length >= 3)).toBe(true);
    expect(QUESTIONS.every((question) => question.citations.length > 0)).toBe(true);
    expect(validateCatalog()).toEqual([]);
  });

  it('balances the correct choice position across the catalog', () => {
    const positionCounts = QUESTIONS.reduce((counts, question) => {
      const position = question.choices.findIndex((choice) => choice.id === question.correctChoiceId);
      counts[position] += 1;
      return counts;
    }, [0, 0, 0]);

    expect(positionCounts).toEqual([10, 10, 10]);
  });

  it.each([
    ['blank ticket content', (question: PracticeQuestion) => { question.ticket.subject = ' '; }],
    ['duplicate choice IDs', (question: PracticeQuestion) => { question.choices[1].id = question.choices[0].id; }],
    ['empty choice label', (question: PracticeQuestion) => { question.choices[0].label = ''; }],
    ['invalid correct choice', (question: PracticeQuestion) => { question.correctChoiceId = 'missing'; }],
    ['missing visual evidence reference', (question: PracticeQuestion) => { question.visual.elements[0].evidenceLabel = 'missing evidence'; }],
    ['missing visual text alternative', (question: PracticeQuestion) => { question.visual.description = ''; }],
    ['missing citation label', (question: PracticeQuestion) => { question.citations[0].label = ''; }],
    ['invalid citation URL', (question: PracticeQuestion) => { question.citations[0].url = 'not-a-url'; }],
  ])('rejects %s with an actionable catalog error', (description, mutate) => {
    const questions = QUESTIONS.map(cloneQuestion);
    mutate(questions[0]);

    const errors = validateCatalog(questions);

    expect(errors.some((error) => error.toLowerCase().includes(description.split(' ')[0]))).toBe(true);
  });

  it('rejects a visual that does not account for every evidence item', () => {
    const questions = QUESTIONS.map(cloneQuestion);
    questions[0].visual.elements = questions[0].visual.elements.slice(0, 2);

    expect(validateCatalog(questions)).toContain('ad-01 visual must reference every evidence item');
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
