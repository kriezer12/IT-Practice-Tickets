import type { EvidenceStatus } from '../types';

export const EVIDENCE_STATUS_METADATA: Record<EvidenceStatus, { label: string; symbol: string }> = {
  pass: { label: 'Pass', symbol: '✓' },
  fail: { label: 'Fail', symbol: '×' },
  note: { label: 'Note', symbol: '·' },
};
