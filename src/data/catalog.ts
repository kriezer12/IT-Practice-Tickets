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

    const ticketFields = Object.entries(question.ticket) as Array<[string, string]>;
    ticketFields.forEach(([field, value]) => {
      if (!value.trim()) errors.push(`Blank ticket field: ${question.id}.${field}`);
    });
    if (!question.prompt.trim()) errors.push(`Blank prompt: ${question.id}`);
    if (!question.explanation.trim()) errors.push(`Blank explanation: ${question.id}`);
    if (!question.takeaway.trim()) errors.push(`Blank takeaway: ${question.id}`);

    if (question.choices.length < 3) errors.push(`${question.id} must have at least three choices`);
    const choiceIds = new Set<string>();
    question.choices.forEach((choice) => {
      if (!choice.id.trim()) errors.push(`Blank choice id: ${question.id}`);
      if (choiceIds.has(choice.id)) errors.push(`Duplicate choice id: ${question.id}.${choice.id}`);
      choiceIds.add(choice.id);
      if (!choice.label.trim()) errors.push(`Empty choice label: ${question.id}.${choice.id}`);
    });
    if (!question.choices.some((choice) => choice.id === question.correctChoiceId)) {
      errors.push(`Invalid correct choice reference: ${question.id}.${question.correctChoiceId}`);
    }

    const evidenceLabels = new Set<string>();
    question.evidence.forEach((item) => {
      if (!item.label.trim()) errors.push(`Blank evidence label: ${question.id}`);
      if (!item.detail.trim()) errors.push(`Blank evidence detail: ${question.id}.${item.label}`);
      if (evidenceLabels.has(item.label)) errors.push(`Duplicate evidence label: ${question.id}.${item.label}`);
      evidenceLabels.add(item.label);
    });

    if (!question.visual.title.trim()) errors.push(`Missing visual title: ${question.id}`);
    if (!question.visual.description.trim()) errors.push(`Missing visual description: ${question.id}`);
    if (!['flow', 'topology', 'schematic'].includes(question.visual.kind)) {
      errors.push(`Invalid visual kind: ${question.id}`);
    }
    const visualElementIds = new Set<string>();
    const referencedEvidence = new Set<string>();
    question.visual.elements.forEach((element) => {
      if (!element.id.trim()) errors.push(`Blank visual element id: ${question.id}`);
      if (visualElementIds.has(element.id)) errors.push(`Duplicate visual element id: ${question.id}.${element.id}`);
      visualElementIds.add(element.id);
      if (!element.label.trim()) errors.push(`Blank visual element label: ${question.id}`);
      if (!element.detail.trim()) errors.push(`Blank visual element detail: ${question.id}.${element.id}`);
      if (!evidenceLabels.has(element.evidenceLabel)) {
        errors.push(`Missing visual evidence reference: ${question.id}.${element.id}`);
      }
      referencedEvidence.add(element.evidenceLabel);
      const evidence = question.evidence.find((item) => item.label === element.evidenceLabel);
      if (evidence && evidence.status !== element.status) {
        errors.push(`Visual status does not match evidence: ${question.id}.${element.id}`);
      }
    });
    if (referencedEvidence.size !== evidenceLabels.size || [...evidenceLabels].some((label) => !referencedEvidence.has(label))) {
      errors.push(`${question.id} visual must reference every evidence item`);
    }

    if (question.citations.length === 0) errors.push(`Missing citation: ${question.id}`);
    question.citations.forEach((citation, index) => {
      if (!citation.label.trim()) errors.push(`Missing citation label: ${question.id}.${index}`);
      if (!citation.publisher.trim()) errors.push(`Missing citation publisher: ${question.id}.${index}`);
      if (!citation.claim.trim()) errors.push(`Missing citation claim: ${question.id}.${index}`);
      if (!['official', 'standard', 'manufacturer'].includes(citation.sourceType)) {
        errors.push(`Invalid citation source type: ${question.id}.${index}`);
      }
      try {
        const url = new URL(citation.url);
        if (url.protocol !== 'https:' || !url.hostname) errors.push(`Invalid citation URL: ${question.id}.${index}`);
      } catch {
        errors.push(`Invalid citation URL: ${question.id}.${index}`);
      }
    });
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
