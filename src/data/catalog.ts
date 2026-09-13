import { QUESTIONS } from './questions';
import { CATEGORY_IDS, type CategoryId, type CategoryMeta, type PracticeQuestion } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'active-directory', name: 'Active Directory', shortName: 'AD', eyebrow: 'IDENTITY / POLICY', description: 'Build confidence with accounts, groups, policy scope, and domain health.', marker: '01' },
  { id: 'networking', name: 'Networking', shortName: 'NET', eyebrow: 'PATH / SIGNAL', description: 'Trace a symptom through link, address, DNS, routing, and service layers.', marker: '02' },
  { id: 'physical-troubleshooting', name: 'Physical Troubleshooting', shortName: 'PHYS', eyebrow: 'HARDWARE / SIGNAL', description: 'Practice safe isolation from power and cables to components and airflow.', marker: '03' },
];

const REVIEWED_CITATION_URLS = new Set([
  'https://learn.microsoft.com/en-us/troubleshoot/windows-server/user-profiles-and-logon/cached-domain-logon-information',
  'https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/account-lockout-and-management-tool',
  'https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/kerberos-authentication-troubleshooting-guidance',
  'https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/usb-3-0-driver-stack-architecture',
  'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/gpresult',
  'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig',
  'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nslookup',
  'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-domain-services',
  'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-scope',
  'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups',
  'https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/domain-join-log-analysis',
  'https://learn.microsoft.com/en-us/windows-server/networking/',
  'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top',
  'https://learn.microsoft.com/en-us/windows/win32/ndf/troubleshooting-wireless-lan-connections',
  'https://learn.microsoft.com/en-us/windows-server/remote/remote-access/vpn/always-on-vpn/',
  'https://learn.microsoft.com/en-us/windows-server/storage/disk-management/overview-of-disk-management',
  'https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control',
  'https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/',
  'https://www.cisco.com/c/en/us/support/docs/lan-switching/inter-vlan-routing/41260-189.html',
  'https://www.displayport.org/faq/',
  'https://www.intel.com/content/www/us/en/support/articles/000005597/processors.html',
  'https://www.intel.com/content/www/us/en/support/articles/000021605/processors.html',
  'https://www.intel.com/content/www/us/en/support/articles/000058487/processors.html',
  'https://www.osha.gov/electrical',
  'https://www.rfc-editor.org/rfc/rfc2131',
  'https://www.usb.org/usb-charger-pd',
].map((url) => new URL(url).toString()));

type UnknownRecord = Record<string, unknown>;

const VALID_EVIDENCE_STATUSES = new Set(['pass', 'fail', 'note']);
const VALID_VISUAL_KINDS = new Set(['flow', 'topology', 'schematic']);
const VALID_CITATION_SOURCE_TYPES = new Set(['official', 'standard', 'manufacturer']);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isCategoryId(value: unknown): value is CategoryId {
  return isString(value) && CATEGORY_IDS.includes(value as CategoryId);
}

function questionLabel(question: UnknownRecord, index: number): string {
  return isString(question.id) && question.id.trim() ? question.id : `question[${index}]`;
}

export function isReviewedCitationUrl(value: unknown): boolean {
  if (!isString(value)) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && REVIEWED_CITATION_URLS.has(url.toString());
  } catch {
    return false;
  }
}

export const getCategoryQuestions = (category: CategoryId): PracticeQuestion[] =>
  QUESTIONS.filter((question) => question.category === category).sort((a, b) => a.order - b.order);

type QuestionRecord = {
  id: string;
  category: string | undefined;
  order: unknown;
};

export function validateCatalog(questions: unknown = QUESTIONS): string[] {
  if (!Array.isArray(questions)) return ['Catalog must be an array of questions'];

  const errors: string[] = [];
  const ids = new Set<string>();
  const questionRecords: QuestionRecord[] = [];

  for (const [questionIndex, rawQuestion] of questions.entries()) {
    const questionPath = `questions[${questionIndex}]`;
    if (!isRecord(rawQuestion)) {
      errors.push(`Invalid question: ${questionPath} must be an object`);
      continue;
    }

    const id = rawQuestion.id;
    const idLabel = questionLabel(rawQuestion, questionIndex);
    if (!isString(id)) {
      errors.push(`Invalid question id: ${questionPath}.id must be a string`);
    } else {
      if (!id.trim()) errors.push(`Blank question id: ${questionPath}.id`);
      if (ids.has(id)) errors.push(`Duplicate question id: ${id}`);
      ids.add(id);
    }

    const category = rawQuestion.category;
    if (!isString(category)) errors.push(`Invalid category: ${idLabel}.category must be a string`);
    const order = rawQuestion.order;
    if (typeof order !== 'number' || !Number.isInteger(order)) {
      errors.push(`Invalid question order: ${idLabel}.order must be an integer`);
    }
    questionRecords.push({ id: idLabel, category: isString(category) ? category : undefined, order });

    const ticket = rawQuestion.ticket;
    if (!isRecord(ticket)) {
      errors.push(`Invalid ticket: ${idLabel}.ticket must be an object`);
    } else {
      for (const field of ['subject', 'requester', 'environment', 'report', 'additionalInfo']) {
        const value = ticket[field];
        if (!isString(value)) {
          errors.push(`Invalid ticket field: ${idLabel}.ticket.${field} must be a string`);
        } else if (!value.trim()) {
          errors.push(`Blank ticket field: ${idLabel}.${field}`);
        }
      }
    }

    for (const field of ['prompt', 'explanation', 'takeaway']) {
      const value = rawQuestion[field];
      if (!isString(value)) {
        errors.push(`Invalid ${field}: ${idLabel}.${field} must be a string`);
      } else if (!value.trim()) {
        errors.push(`Blank ${field}: ${idLabel}`);
      }
    }

    const choices = rawQuestion.choices;
    const choiceIds = new Set<string>();
    const choiceLabels = new Set<string>();
    if (!Array.isArray(choices)) {
      errors.push(`Invalid choices: ${idLabel}.choices must be an array`);
    } else {
      if (choices.length < 3) errors.push(`${idLabel} must have at least three choices`);
      choices.forEach((rawChoice, choiceIndex) => {
        const choicePath = `${idLabel}.choices[${choiceIndex}]`;
        if (!isRecord(rawChoice)) {
          errors.push(`Invalid choice: ${choicePath} must be an object`);
          return;
        }

        const choiceId = rawChoice.id;
        if (!isString(choiceId)) {
          errors.push(`Invalid choice id: ${choicePath}.id must be a string`);
        } else {
          if (!choiceId.trim()) errors.push(`Blank choice id: ${idLabel}`);
          if (choiceIds.has(choiceId)) errors.push(`Duplicate choice id: ${idLabel}.${choiceId}`);
          choiceIds.add(choiceId);
        }

        const choiceLabel = rawChoice.label;
        if (!isString(choiceLabel)) {
          errors.push(`Invalid choice label: ${choicePath}.label must be a string`);
        } else {
          if (!choiceLabel.trim()) errors.push(`Empty choice label: ${idLabel}.${isString(choiceId) ? choiceId : choiceIndex}`);
          if (choiceLabels.has(choiceLabel)) errors.push(`Duplicate choice label: ${idLabel}.${choiceLabel}`);
          choiceLabels.add(choiceLabel);
        }
      });
    }

    const correctChoiceId = rawQuestion.correctChoiceId;
    if (!isString(correctChoiceId)) {
      errors.push(`Invalid correct choice reference: ${idLabel}.correctChoiceId must be a string`);
    } else if (!choiceIds.has(correctChoiceId)) {
      errors.push(`Invalid correct choice reference: ${idLabel}.${correctChoiceId}`);
    }

    const evidence = rawQuestion.evidence;
    const evidenceLabels = new Set<string>();
    const evidenceStatuses = new Map<string, string>();
    if (!Array.isArray(evidence)) {
      errors.push(`Invalid evidence: ${idLabel}.evidence must be an array`);
    } else {
      if (evidence.length === 0) errors.push(`Empty evidence: ${idLabel}`);
      evidence.forEach((rawItem, evidenceIndex) => {
        const evidencePath = `${idLabel}.evidence[${evidenceIndex}]`;
        if (!isRecord(rawItem)) {
          errors.push(`Invalid evidence item: ${evidencePath} must be an object`);
          return;
        }

        const label = rawItem.label;
        const labelForMessage = isString(label) && label.trim() ? label : evidenceIndex;
        const status = rawItem.status;
        if (!isString(status) || !VALID_EVIDENCE_STATUSES.has(status)) {
          errors.push(`Invalid evidence status: ${idLabel}.${labelForMessage}`);
        }
        if (!isString(label)) {
          errors.push(`Invalid evidence label: ${evidencePath}.label must be a string`);
        } else {
          if (!label.trim()) errors.push(`Blank evidence label: ${idLabel}`);
          if (evidenceLabels.has(label)) errors.push(`Duplicate evidence label: ${idLabel}.${label}`);
          evidenceLabels.add(label);
          if (isString(status)) evidenceStatuses.set(label, status);
        }

        const detail = rawItem.detail;
        if (!isString(detail)) {
          errors.push(`Invalid evidence detail: ${evidencePath}.detail must be a string`);
        } else if (!detail.trim()) {
          errors.push(`Blank evidence detail: ${idLabel}.${isString(label) ? label : evidenceIndex}`);
        }
      });
    }

    const visual = rawQuestion.visual;
    const referencedEvidence = new Set<string>();
    let visualElementsAreArray = false;
    if (!isRecord(visual)) {
      errors.push(`Invalid visual: ${idLabel}.visual must be an object`);
    } else {
      const visualTitle = visual.title;
      if (!isString(visualTitle)) {
        errors.push(`Invalid visual title: ${idLabel}.visual.title must be a string`);
      } else if (!visualTitle.trim()) {
        errors.push(`Missing visual title: ${idLabel}`);
      }

      const visualDescription = visual.description;
      if (!isString(visualDescription)) {
        errors.push(`Invalid visual description: ${idLabel}.visual.description must be a string`);
      } else if (!visualDescription.trim()) {
        errors.push(`Missing visual description: ${idLabel}`);
      }

      if (!isString(visual.kind) || !VALID_VISUAL_KINDS.has(visual.kind)) {
        errors.push(`Invalid visual kind: ${idLabel}`);
      }

      const visualElements = visual.elements;
      if (!Array.isArray(visualElements)) {
        errors.push(`Invalid visual elements: ${idLabel}.visual.elements must be an array`);
      } else {
        visualElementsAreArray = true;
        if (visualElements.length === 0) errors.push(`Empty visual elements: ${idLabel}`);
        const visualElementIds = new Set<string>();
        visualElements.forEach((rawElement, elementIndex) => {
          const elementPath = `${idLabel}.visual.elements[${elementIndex}]`;
          if (!isRecord(rawElement)) {
            errors.push(`Invalid visual element: ${elementPath} must be an object`);
            return;
          }

          const elementId = rawElement.id;
          if (!isString(elementId)) {
            errors.push(`Invalid visual element id: ${elementPath}.id must be a string`);
          } else {
            if (!elementId.trim()) errors.push(`Blank visual element id: ${idLabel}`);
            if (visualElementIds.has(elementId)) errors.push(`Duplicate visual element id: ${idLabel}.${elementId}`);
            visualElementIds.add(elementId);
          }

          const elementLabel = rawElement.label;
          if (!isString(elementLabel)) {
            errors.push(`Invalid visual element label: ${elementPath}.label must be a string`);
          } else if (!elementLabel.trim()) {
            errors.push(`Blank visual element label: ${idLabel}`);
          }

          const elementDetail = rawElement.detail;
          if (!isString(elementDetail)) {
            errors.push(`Invalid visual element detail: ${elementPath}.detail must be a string`);
          } else if (!elementDetail.trim()) {
            errors.push(`Blank visual element detail: ${idLabel}.${isString(elementId) ? elementId : elementIndex}`);
          }

          const evidenceLabel = rawElement.evidenceLabel;
          if (!isString(evidenceLabel)) {
            errors.push(`Invalid visual evidence reference: ${elementPath}.evidenceLabel must be a string`);
          } else {
            if (!evidenceLabels.has(evidenceLabel)) {
              errors.push(`Missing visual evidence reference: ${idLabel}.${isString(elementId) ? elementId : elementIndex}`);
            }
            referencedEvidence.add(evidenceLabel);
          }

          const status = rawElement.status;
          if (!isString(status) || !VALID_EVIDENCE_STATUSES.has(status)) {
            errors.push(`Invalid visual element status: ${idLabel}.${isString(elementId) ? elementId : elementIndex}`);
          } else if (isString(evidenceLabel) && evidenceStatuses.has(evidenceLabel) && evidenceStatuses.get(evidenceLabel) !== status) {
            errors.push(`Visual status does not match evidence: ${idLabel}.${isString(elementId) ? elementId : elementIndex}`);
          }
        });
      }
    }

    if (visualElementsAreArray && (referencedEvidence.size !== evidenceLabels.size || [...evidenceLabels].some((label) => !referencedEvidence.has(label)))) {
      errors.push(`${idLabel} visual must reference every evidence item`);
    }

    const citations = rawQuestion.citations;
    if (!Array.isArray(citations)) {
      errors.push(`Invalid citations: ${idLabel}.citations must be an array`);
    } else {
      if (citations.length === 0) errors.push(`Missing citation: ${idLabel}`);
      citations.forEach((rawCitation, citationIndex) => {
        const citationPath = `${idLabel}.citations[${citationIndex}]`;
        if (!isRecord(rawCitation)) {
          errors.push(`Invalid citation: ${citationPath} must be an object`);
          return;
        }

        const citationLabel = rawCitation.label;
        if (!isString(citationLabel)) {
          errors.push(`Invalid citation label: ${citationPath}.label must be a string`);
        } else if (!citationLabel.trim()) {
          errors.push(`Missing citation label: ${idLabel}.${citationIndex}`);
        }

        const publisher = rawCitation.publisher;
        if (!isString(publisher)) {
          errors.push(`Invalid citation publisher: ${citationPath}.publisher must be a string`);
        } else if (!publisher.trim()) {
          errors.push(`Missing citation publisher: ${idLabel}.${citationIndex}`);
        }

        const claim = rawCitation.claim;
        if (!isString(claim)) {
          errors.push(`Invalid citation claim: ${citationPath}.claim must be a string`);
        } else if (!claim.trim()) {
          errors.push(`Missing citation claim: ${idLabel}.${citationIndex}`);
        }

        const sourceType = rawCitation.sourceType;
        if (!isString(sourceType)) {
          errors.push(`Invalid citation source type: ${idLabel}.${citationIndex} must be a string`);
        } else if (!VALID_CITATION_SOURCE_TYPES.has(sourceType)) {
          errors.push(`Invalid citation source type: ${idLabel}.${citationIndex}`);
        }

        const url = rawCitation.url;
        if (!isString(url)) {
          errors.push(`Invalid citation URL: ${idLabel}.${citationIndex} must be a string`);
        } else if (!isReviewedCitationUrl(url)) {
          errors.push(`Invalid or unreviewed citation URL: ${idLabel}.${citationIndex}`);
        }
      });
    }
  }

  for (const category of CATEGORY_IDS) {
    const categoryQuestions = questionRecords
      .filter((question) => question.category === category)
      .sort((a, b) => (typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY) - (typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY));
    if (categoryQuestions.length !== 10) errors.push(`${category} must contain exactly 10 questions; found ${categoryQuestions.length}`);
    categoryQuestions.forEach((question, index) => {
      if (question.order !== index + 1) errors.push(`${category} has non-contiguous order at ${question.id}`);
    });
  }

  const unknownCategories = questionRecords.filter((question) => question.category !== undefined && !isCategoryId(question.category));
  if (unknownCategories.length > 0) errors.push(`Unknown category on ${unknownCategories.map((question) => question.id).join(', ')}`);
  return errors;
}

export function assertCatalogInvariant(questions: unknown = QUESTIONS): void {
  const errors = validateCatalog(questions);
  if (errors.length > 0) throw new Error(errors.join('; '));
}
