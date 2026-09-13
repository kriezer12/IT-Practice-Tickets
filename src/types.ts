export const CATEGORY_IDS = [
  'active-directory',
  'networking',
  'physical-troubleshooting',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type EvidenceStatus = 'pass' | 'fail' | 'note';

export type PracticeVisualKind = 'flow' | 'topology' | 'schematic';

export type PracticeVisualElement = {
  id: string;
  label: string;
  detail: string;
  evidenceLabel: string;
  status: EvidenceStatus;
};

export type PracticeVisual = {
  kind: PracticeVisualKind;
  title: string;
  description: string;
  elements: PracticeVisualElement[];
};

export type CitationSourceType = 'official' | 'standard' | 'manufacturer';

export type PracticeCitation = {
  label: string;
  publisher: string;
  url: string;
  claim: string;
  sourceType: CitationSourceType;
};

export type PracticePhase = 'prompt' | 'evidence' | 'complete';

export type AnswerRecord = {
  choiceId: string;
  correct: boolean;
};

export type PracticeSession = {
  categoryId: CategoryId | null;
  position: number;
  phase: PracticePhase;
  selectedChoiceId: string | null;
};

export type PracticeQuestion = {
  id: string;
  category: CategoryId;
  order: number;
  ticket: {
    subject: string;
    requester: string;
    environment: string;
    report: string;
    additionalInfo: string;
  };
  prompt: string;
  choices: Array<{ id: string; label: string }>;
  correctChoiceId: string;
  evidence: Array<{ status: EvidenceStatus; label: string; detail: string }>;
  visual: PracticeVisual;
  citations: PracticeCitation[];
  explanation: string;
  takeaway: string;
};

export type CategoryMeta = {
  id: CategoryId;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  marker: string;
};

export type ProgressState = {
  version: 1;
  completedByCategory: Record<CategoryId, string[]>;
  positionByCategory: Record<CategoryId, number>;
  scoreByCategory: Record<CategoryId, number>;
  answersByCategory: Record<CategoryId, Record<string, AnswerRecord>>;
  session: PracticeSession;
};
