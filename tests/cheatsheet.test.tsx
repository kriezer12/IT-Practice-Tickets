import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import {
  ACTIVE_DIRECTORY_COMMANDS,
  ACTIVE_DIRECTORY_TERMS,
  CHEATSHEET_TOPICS,
  COMMON_PORTS,
  CUSTOMER_SERVICE_PROMPTS,
  DIAGNOSTIC_COMMANDS,
  HARDWARE_TRIAGE,
  NETWORKING_CONCEPTS,
  OSI_LAYERS,
  QUICK_FIRE_SCENARIOS,
  SECURITY_BASICS,
  TROUBLESHOOTING_METHOD,
} from '../src/data/cheatsheet';
import '../src/styles.css';

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('interview cheatsheet', () => {
  it('renders the complete field manual at /cheatsheet', () => {
    window.history.pushState({}, '', '/cheatsheet');
    render(<App />);

    expect(screen.getByRole('heading', { name: /Say the next check clearly/ })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Troubleshoot in seven moves.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Classic hardware and OS problems.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Networking fundamentals.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Active Directory and Windows Server.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Security basics.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Customer service and soft skills.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Quick-fire scenarios.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'PRACTICE' })).toHaveProperty('href', 'http://localhost:3000/');
  });

  it('exposes every topic as a normal anchor link', () => {
    window.history.pushState({}, '', '/cheatsheet');
    render(<App />);

    const navigation = screen.getByRole('navigation', { name: 'Cheatsheet topics' });
    const links = screen.getAllByRole('link').filter((link) => link.closest('nav') === navigation);

    expect(links).toHaveLength(CHEATSHEET_TOPICS.length);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(CHEATSHEET_TOPICS.map((topic) => `#${topic.id}`));
  });

  it('keeps the practice library link and theme toggle available on the root view', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'CHEATSHEET' })).toHaveProperty('href', 'http://localhost:3000/cheatsheet');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('keeps the cheatsheet theme control independent from practice progress', () => {
    window.history.pushState({}, '', '/cheatsheet');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('it-skills-practice-progress-v1')).toBeNull();
  });
});

describe('cheatsheet source content', () => {
  it('keeps the expected interview reference counts', () => {
    expect(TROUBLESHOOTING_METHOD).toHaveLength(7);
    expect(HARDWARE_TRIAGE).toHaveLength(6);
    expect(OSI_LAYERS).toHaveLength(7);
    expect(NETWORKING_CONCEPTS).toHaveLength(5);
    expect(COMMON_PORTS).toHaveLength(7);
    expect(DIAGNOSTIC_COMMANDS).toHaveLength(5);
    expect(ACTIVE_DIRECTORY_TERMS).toHaveLength(6);
    expect(ACTIVE_DIRECTORY_COMMANDS).toHaveLength(4);
    expect(SECURITY_BASICS).toHaveLength(5);
    expect(CUSTOMER_SERVICE_PROMPTS).toHaveLength(4);
    expect(QUICK_FIRE_SCENARIOS).toHaveLength(5);
  });
});
