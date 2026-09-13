import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import '../src/styles.css';

function openTrack(name: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
}

describe('guided practice flow', () => {
  it('derives the library totals from the three ten-case catalog tracks', () => {
    render(<App />);

    expect(screen.getByText('03 TRACKS / 30 CASES')).toBeTruthy();
    expect(screen.getAllByText(/\/ 10 COMPLETE/)).toHaveLength(3);
  });

  it('requires a checkpoint choice, then reveals labeled evidence and answer feedback', () => {
    render(<App />);
    openTrack('Active Directory');

    expect(screen.getByText('User is locked out after repeated sign-ins')).toBeTruthy();
    expect(screen.queryByText('WHAT YOU FIND')).toBeNull();

    const revealButton = screen.getByRole('button', { name: /Reveal what you find/i });
    expect(revealButton).toHaveProperty('disabled', true);

    fireEvent.click(screen.getAllByRole('radio')[0]);
    expect(revealButton).toHaveProperty('disabled', false);
    fireEvent.click(revealButton);

    expect(screen.getByText('WHAT YOU FIND')).toBeTruthy();
    expect(screen.getByText('Pass')).toBeTruthy();
    expect(screen.getByText('Fail')).toBeTruthy();
    expect(screen.getByText('Note')).toBeTruthy();
    expect(screen.getByText('SELECTED ACTION')).toBeTruthy();
    expect(screen.getByText('CORRECT ACTION')).toBeTruthy();
    expect(screen.getByText('FIRST CHECK RESULT')).toBeTruthy();
    expect(screen.getByText('Unlock the account and immediately reset the password')).toBeTruthy();
    expect(screen.getByText('Check the account status and lockout source in Active Directory')).toBeTruthy();
  });

  it('moves between cases without losing the selected category context', () => {
    render(<App />);
    openTrack('Networking');

    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
    const evidenceHeading = screen.getByRole('heading', { name: 'The signal gets clearer.' });
    expect(document.activeElement).toBe(evidenceHeading);
    fireEvent.click(screen.getByRole('button', { name: /Next case/i }));

    expect(screen.getByText('Internal site opens by IP but not by name')).toBeTruthy();
    expect(screen.getByText('Networking')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'What is the most useful first test?' }));

    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    expect(screen.getByText('One laptop has no internet access')).toBeTruthy();
  });

  it('reaches completion only after submitting all ten cases', () => {
    render(<App />);
    openTrack('Physical Troubleshooting');

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getAllByRole('radio')[0]);
      fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
      fireEvent.click(screen.getByRole('button', { name: index === 9 ? /See your category result/i : /Next case/i }));
    }

    expect(screen.getByText('CATEGORY COMPLETE / PHYS')).toBeTruthy();
    expect(screen.getByText(/\/ 10 RIGHT/)).toBeTruthy();
  });

  it('restores the active case and revealed phase after a normal reload', () => {
    const firstRender = render(<App />);
    openTrack('Networking');
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
    expect(screen.getByText('WHAT YOU FIND')).toBeTruthy();

    firstRender.unmount();
    render(<App />);

    expect(screen.getByText('One laptop has no internet access')).toBeTruthy();
    expect(screen.getByText('WHAT YOU FIND')).toBeTruthy();
    expect(screen.getByText('SELECTED ACTION')).toBeTruthy();
  });

  it('uses readable answer tokens in both light and dark themes', () => {
    render(<App />);
    openTrack('Active Directory');
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByText('Check the account status and lockout source in Active Directory')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByText('Check the account status and lockout source in Active Directory')).toBeTruthy();
  });

  it('offers a confirmed category-scoped retry from the completion view', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);
    openTrack('Physical Troubleshooting');

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getAllByRole('radio')[0]);
      fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
      fireEvent.click(screen.getByRole('button', { name: index === 9 ? /See your category result/i : /Next case/i }));
    }

    fireEvent.click(screen.getByRole('button', { name: /Retry this category/i }));

    expect(confirm).toHaveBeenCalledWith('Reset this track’s local progress?');
    expect(screen.getByText('PC turns on, but no display')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'What would you check first?' })).toBeTruthy();
    confirm.mockRestore();
  });
});
