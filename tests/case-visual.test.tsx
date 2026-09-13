import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CaseVisual } from '../src/components/CaseVisual';
import type { PracticeVisual } from '../src/types';
import '../src/styles.css';

const visualFor = (kind: PracticeVisual['kind'], elementCount = 3): PracticeVisual => {
  const labels = ['First evidence node', 'Second evidence node', 'Third evidence node'] as const;
  const statuses = ['pass', 'fail', 'note'] as const;

  return {
    kind,
    title: `${kind} test visual`,
    description: 'Accessible evidence description for this visual.',
    elements: Array.from({ length: elementCount }, (_, index) => ({
      id: `element-${index}`,
      label: labels[index] ?? `${index + 1} evidence node`,
      detail: `${index + 1} detail.`,
      evidenceLabel: `${index + 1} evidence`,
      status: statuses[index % statuses.length],
    })),
  };
};

describe('case visual modes', () => {
  it('renders flow evidence as a directional sequence', () => {
    render(<CaseVisual visual={visualFor('flow')} />);

    expect(screen.getByLabelText('Directional flow visualization')).toBeTruthy();
    expect(screen.getByText('First evidence node')).toBeTruthy();
    expect(screen.getByText('Pass / inspect')).toBeTruthy();
    expect(screen.getAllByText('→')).toHaveLength(2);
    expect(screen.queryByLabelText('Network topology visualization')).toBeNull();
  });

  it('keeps flow connectors aligned with any content-provided element count', () => {
    render(<CaseVisual visual={visualFor('flow', 4)} />);

    const flow = screen.getByLabelText('Directional flow visualization');

    expect(flow.style.getPropertyValue('--case-visual-columns')).toBe('4');
    expect(flow.querySelectorAll('.case-visual__flow-step')).toHaveLength(4);
    expect(flow.querySelectorAll('.case-visual__flow-connector')).toHaveLength(3);
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
