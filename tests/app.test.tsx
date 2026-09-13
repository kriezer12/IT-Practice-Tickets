import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { UnavailableCase } from '../src/components/UnavailableCase';
import { CompletionView } from '../src/components/CompletionView';
import { CATEGORIES } from '../src/data/catalog';
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

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(screen.getByText('Pass')).toBeTruthy();
    expect(screen.getByText('Fail')).toBeTruthy();
    expect(screen.getByText('Note')).toBeTruthy();
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

  it('keeps first-answer feedback and score after a review resubmission', () => {
    render(<App />);
    openTrack('Active Directory');

    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
    expect(screen.getByText(/Not the highest-signal first check/)).toBeTruthy();
    expect(screen.getByText('Unlock the account and immediately reset the password')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    fireEvent.click(screen.getAllByRole('radio')[1]);
    fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));

    expect(screen.getByText('Unlock the account and immediately reset the password')).toBeTruthy();
    expect(screen.getByText('Check the account status and lockout source in Active Directory')).toBeTruthy();
    expect(screen.getByText(/Not the highest-signal first check/)).toBeTruthy();
    expect(screen.queryByText(/Correct — this is the highest-signal first check/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Library/i }));
    expect(screen.getByText('01 / 10 COMPLETE')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Active Directory/ }).textContent).toContain('0 RIGHT');
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

  it('preserves completed progress after reviewing and reloading a category', () => {
    const firstRender = render(<App />);
    openTrack('Physical Troubleshooting');

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getAllByRole('radio')[0]);
      fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
      fireEvent.click(screen.getByRole('button', { name: index === 9 ? /See your category result/i : /Next case/i }));
    }

    fireEvent.click(screen.getByRole('button', { name: /Review cases/i }));
    firstRender.unmount();
    render(<App />);

    expect(screen.getByText('PC turns on, but no display')).toBeTruthy();
    expect(screen.getByText('01', { selector: 'strong' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Library/i }));

    const physicalCard = screen.getByRole('button', { name: /Physical Troubleshooting/ });
    expect(physicalCard.textContent).toContain('10 / 10 COMPLETE');
    expect(physicalCard.textContent).toContain('10 RIGHT');
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

  it('keeps the browser theme color synchronized with the runtime theme', () => {
    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#f9f9fa';
    document.head.append(themeColor);

    try {
      render(<App />);

      expect(themeColor.content).toBe('#f9f9fa');
      fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
      expect(themeColor.content).toBe('#0c0c0f');
    } finally {
      themeColor.remove();
    }
  });

  it('keeps the answer-panel Next case control keyboard-focusable in both themes', () => {
    render(<App />);
    openTrack('Active Directory');
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));

    const nextButton = screen.getByRole('button', { name: /Next case/i });
    nextButton.focus();

    expect(document.activeElement).toBe(nextButton);
    expect(nextButton.className).toContain('secondary-button--inverse');

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    const darkNextButton = screen.getByRole('button', { name: /Next case/i });
    darkNextButton.focus();

    expect(document.activeElement).toBe(darkNextButton);
  });

  it('restores focus to the library heading after practice and completion transitions', () => {
    render(<App />);
    openTrack('Active Directory');
    fireEvent.click(screen.getByRole('button', { name: /Library/i }));
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Practice library' }));

    openTrack('Physical Troubleshooting');
    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getAllByRole('radio')[0]);
      fireEvent.click(screen.getByRole('button', { name: /Reveal what you find/i }));
      fireEvent.click(screen.getByRole('button', { name: index === 9 ? /See your category result/i : /Next case/i }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Back to library/i }));

    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Practice library' }));
  });

  it('provides a keyboard skip link to the main content target', () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    const brandLink = screen.getByRole('link', { name: 'IT Support Lab home' });

    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content');
    expect(screen.getByRole('main').getAttribute('tabindex')).toBe('-1');
    expect(skipLink.className).toBe('skip-link');
    expect(brandLink.className).toBe('brand');

    skipLink.focus();
    expect(document.activeElement).toBe(skipLink);
    brandLink.focus();
    expect(document.activeElement).toBe(brandLink);
  });

  it('renders an explicit unavailable-case fallback with a return action', () => {
    const onBack = vi.fn();
    render(<UnavailableCase categoryName="Networking" onBack={onBack} />);

    expect(screen.getByRole('heading', { name: /This case is unavailable/ })).toBeTruthy();
    expect(screen.getByText(/saved Networking case is no longer in the local catalog/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Return to library/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
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

  it('uses the catalog-provided question count in completion score and copy', () => {
    render(<CompletionView category={CATEGORIES[0]} score={5} questionCount={7} onReview={vi.fn()} onRetry={vi.fn()} onLibrary={vi.fn()} />);

    expect(screen.getByText('/ 07 RIGHT')).toBeTruthy();
    expect(screen.getByText(/You worked through all 7 Active Directory cases/)).toBeTruthy();
  });
});
