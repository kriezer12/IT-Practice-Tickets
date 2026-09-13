type ThemeToggleProps = {
  theme: 'light' | 'dark';
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className="icon-button" type="button" onClick={onToggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <span aria-hidden="true">{theme === 'light' ? '◐' : '○'}</span>
      <span className="icon-button__label">{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
