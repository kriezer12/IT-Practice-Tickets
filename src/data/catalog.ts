import { QUESTIONS } from './questions';
import { CATEGORY_IDS, type CategoryId, type CategoryMeta, type PracticeQuestion } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'active-directory', name: 'Active Directory', shortName: 'AD', eyebrow: 'IDENTITY / POLICY', description: 'Build confidence with accounts, groups, policy scope, and domain health.', marker: '01' },
  { id: 'networking', name: 'Networking', shortName: 'NET', eyebrow: 'PATH / SIGNAL', description: 'Trace a symptom through link, address, DNS, routing, and service layers.', marker: '02' },
  { id: 'physical-troubleshooting', name: 'Physical Troubleshooting', shortName: 'PHYS', eyebrow: 'HARDWARE / SIGNAL', description: 'Practice safe isolation from power and cables to components and airflow.', marker: '03' },
];

export const getCategoryQuestions = (category: CategoryId): PracticeQuestion[] =>
  QUESTIONS.filter((question) => question.category === category).sort((a, b) => a.order - b.order);

export function validateCatalog(questions: PracticeQuestion[] = QUESTIONS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const question of questions) {
    if (ids.has(question.id)) errors.push(`Duplicate question id: ${question.id}`);
    ids.add(question.id);
  }

  for (const category of CATEGORY_IDS) {
    const categoryQuestions = questions.filter((question) => question.category === category).sort((a, b) => a.order - b.order);
    if (categoryQuestions.length !== 10) errors.push(`${category} must contain exactly 10 questions; found ${categoryQuestions.length}`);
    categoryQuestions.forEach((question, index) => {
      if (question.order !== index + 1) errors.push(`${category} has non-contiguous order at ${question.id}`);
    });
  }

  const unknownCategories = questions.filter((question) => !CATEGORY_IDS.includes(question.category));
  if (unknownCategories.length > 0) errors.push(`Unknown category on ${unknownCategories.map((question) => question.id).join(', ')}`);
  return errors;
}

export function assertCatalogInvariant(questions: PracticeQuestion[] = QUESTIONS): void {
  const errors = validateCatalog(questions);
  if (errors.length > 0) throw new Error(errors.join('; '));
}
