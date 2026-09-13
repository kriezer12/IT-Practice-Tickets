import { describe, expect, it } from 'vitest';
import { CATEGORIES, getCategoryQuestions, isReviewedCitationUrl, validateCatalog } from '../src/data/catalog';
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

  it('accepts only reviewed canonical citation URLs', () => {
    const citationUrls = QUESTIONS.flatMap((question) => question.citations.map((citation) => citation.url));

    expect(citationUrls).toHaveLength(30);
    expect(citationUrls.every((url) => isReviewedCitationUrl(url))).toBe(true);
  });

  it.each([
    ['', 'empty citation URL'],
    ['not-a-url', 'malformed citation URL'],
    ['http://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top', 'non-HTTPS citation URL'],
    ['https://learn.microsoft.com/en-us/unreviewed-placeholder', 'unreviewed citation URL'],
  ])('rejects %s as an %s', (url) => {
    expect(isReviewedCitationUrl(url)).toBe(false);
  });

  it.each([
    ['blank ticket content', (question: PracticeQuestion) => { question.ticket.subject = ' '; }],
    ['duplicate choice IDs', (question: PracticeQuestion) => { question.choices[1].id = question.choices[0].id; }],
    ['duplicate choice labels', (question: PracticeQuestion) => { question.choices[1].label = question.choices[0].label; }],
    ['empty choice label', (question: PracticeQuestion) => { question.choices[0].label = ''; }],
    ['empty evidence', (question: PracticeQuestion) => { question.evidence = []; }],
    ['invalid evidence status', (question: PracticeQuestion) => { (question.evidence[0] as { status: string }).status = 'unknown'; }],
    ['invalid correct choice', (question: PracticeQuestion) => { question.correctChoiceId = 'missing'; }],
    ['empty visual elements', (question: PracticeQuestion) => { question.visual.elements = []; }],
    ['missing visual evidence reference', (question: PracticeQuestion) => { question.visual.elements[0].evidenceLabel = 'missing evidence'; }],
    ['missing visual text alternative', (question: PracticeQuestion) => { question.visual.description = ''; }],
    ['missing citation label', (question: PracticeQuestion) => { question.citations[0].label = ''; }],
    ['missing citation publisher', (question: PracticeQuestion) => { question.citations[0].publisher = ''; }],
    ['missing citation claim', (question: PracticeQuestion) => { question.citations[0].claim = ''; }],
    ['invalid citation source type', (question: PracticeQuestion) => { (question.citations[0] as { sourceType: string }).sourceType = 'other'; }],
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

  it('keeps physical handling behind an explicit safety gate', () => {
    for (const question of getCategoryQuestions('physical-troubleshooting')) {
      const content = JSON.stringify(question).toLowerCase();

      expect(content).toMatch(/shut down|power down/);
      expect(content).toMatch(/disconnect(?:ed)? ac|ac (?:off|disconnected)|de-energize/);
      expect(content).toMatch(/manufacturer|service guide/);
      expect(content).toMatch(/live handling|live connection|never .*live|before .*inside|before .*touch/);
    }
  });

  it('keeps choices within plausible diagnostic scope', () => {
    const unrelatedOrDisproportionateChoice = [
      /monitor resolution/i,
      /reset .*password/i,
      /replace .*keyboard/i,
      /replace .*motherboard/i,
      /reinstall windows/i,
      /format .*immediately/i,
      /delete .*all/i,
      /domain admin/i,
      /disable (?:every|all)/i,
      /replace (?:both|every)/i,
      /restart every/i,
      /change .*production ip/i,
    ];

    for (const question of QUESTIONS) {
      for (const choice of question.choices) {
        expect(unrelatedOrDisproportionateChoice.some((pattern) => pattern.test(choice.label))).toBe(false);
      }
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

  it('rejects a category with fewer than ten cases', () => {
    const questions = QUESTIONS.filter((question) => question.id !== 'ad-01');

    expect(validateCatalog(questions)).toContain('active-directory must contain exactly 10 questions; found 9');
  });

  it('rejects a category with more than ten cases', () => {
    const adQuestion = QUESTIONS.find((question) => question.id === 'ad-01');
    expect(adQuestion).toBeDefined();
    const questions = [...QUESTIONS, { ...cloneQuestion(adQuestion!), id: 'ad-extra', order: 11 }];

    expect(validateCatalog(questions)).toContain('active-directory must contain exactly 10 questions; found 11');
  });
});
