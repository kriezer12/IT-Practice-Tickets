import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CaseVisual } from '../src/components/CaseVisual';
import type { PracticeVisual } from '../src/types';
import '../src/styles.css';

const visualFor = (kind: PracticeVisual['kind']): PracticeVisual => ({
  kind,
  title: `${kind} test visual`,
  description: 'Accessible evidence description for this visual.',
  elements: [
    { id: 'first', label: 'First evidence node', detail: 'First detail.', evidenceLabel: 'First evidence', status: 'pass' },
    { id: 'second', label: 'Second evidence node', detail: 'Second detail.', evidenceLabel: 'Second evidence', status: 'fail' },
    { id: 'third', label: 'Third evidence node', detail: 'Third detail.', evidenceLabel: 'Third evidence', status: 'note' },
  ],
});

describe('case visual modes', () => {
  it('renders flow evidence as a directional sequence', () => {
    render(<CaseVisual visual={visualFor('flow')} />);

    expect(screen.getByLabelText('Directional flow visualization')).toBeTruthy();
    expect(screen.getByText('First evidence node')).toBeTruthy();
    expect(screen.getByText('Pass / inspect')).toBeTruthy();
    expect(screen.getAllByText('→')).toHaveLength(2);
    expect(screen.queryByLabelText('Network topology visualization')).toBeNull();
  });

  it('renders topology evidence as linked relationship nodes', () => {
    render(<CaseVisual visual={visualFor('topology')} />);

    expect(screen.getByLabelText('Network topology visualization')).toBeTruthy();
    expect(screen.getByText('First evidence node')).toBeTruthy();
    expect(screen.getByText('Fail / inspect')).toBeTruthy();
    expect(screen.getAllByText('↔')).toHaveLength(2);
    expect(screen.queryByLabelText('Directional flow visualization')).toBeNull();
  });

  it('renders schematic evidence as a hardware layout', () => {
    render(<CaseVisual visual={visualFor('schematic')} />);

    expect(screen.getByLabelText('Hardware layout visualization')).toBeTruthy();
    expect(screen.getByText('First evidence node')).toBeTruthy();
    expect(screen.getByText('Second evidence node')).toBeTruthy();
    expect(screen.getByText('Third evidence node')).toBeTruthy();
    expect(screen.getByText('Note / inspect')).toBeTruthy();
    expect(screen.getAllByText('→')).toHaveLength(2);
    expect(screen.queryByText('PORT / INPUT')).toBeNull();
    expect(screen.queryByText('DEVICE / BOARD')).toBeNull();
    expect(screen.queryByText('PATH / SERVICE')).toBeNull();
    expect(screen.queryByLabelText('Directional flow visualization')).toBeNull();
  });
});
