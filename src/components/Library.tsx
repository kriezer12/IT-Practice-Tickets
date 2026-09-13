import type { CategoryMeta, CategoryId, ProgressState } from '../types';
import { getCategoryQuestions } from '../data/catalog';
import { ThemeToggle } from './ThemeToggle';

type LibraryProps = {
  categories: CategoryMeta[];
  progress: ProgressState;
  onSelect: (category: CategoryId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function Library({ categories, progress, onSelect, theme, onToggleTheme }: LibraryProps) {
  const totalCompleted = categories.reduce((total, category) => total + progress.completedByCategory[category.id].length, 0);
  const totalQuestions = categories.reduce((total, category) => total + getCategoryQuestions(category.id).length, 0);

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="IT Support Lab home">
          <span className="brand__mark" aria-hidden="true">↗</span>
          <span className="brand__words"><strong>IT SUPPORT LAB</strong><small>Practice the next check</small></span>
        </a>
        <div className="header-actions">
          <span className="status-chip"><span className="status-dot" aria-hidden="true" />LOCAL SESSION</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main>
        <section className="hero-block">
          <div className="hero-copy">
            <p className="eyebrow">FIELD PRACTICE / 2026.09</p>
            <h1>Think like the<br /><em>next check.</em></h1>
            <p className="hero-description">A focused practice lab for the moments that make support work good: reading the symptom, isolating the signal, and explaining the why.</p>
          </div>
          <div className="hero-aside" aria-label="Session progress">
            <div className="hero-aside__number">{String(totalCompleted).padStart(2, '0')}</div>
            <div className="hero-aside__label">OF {String(totalQuestions).padStart(2, '0')} CASES REVIEWED</div>
            <div className="mini-rule" />
            <p>Three tracks.<br />Ten cases each.</p>
          </div>
        </section>

        <section className="library-section" aria-labelledby="tracks-heading">
          <div className="section-heading">
            <div><p className="eyebrow">CHOOSE A TRACK</p><h2 id="tracks-heading">Practice library</h2></div>
            <span className="section-count">{String(categories.length).padStart(2, '0')} TRACKS / {String(totalQuestions).padStart(2, '0')} CASES</span>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const completed = progress.completedByCategory[category.id].length;
              const score = progress.scoreByCategory[category.id];
              const questionCount = getCategoryQuestions(category.id).length;
              return (
                <button className="category-card" type="button" key={category.id} onClick={() => onSelect(category.id)}>
                  <div className="category-card__top"><span className="category-marker">{category.marker}</span><span className="category-arrow" aria-hidden="true">↗</span></div>
                  <div className="category-card__diagram" aria-hidden="true"><span className={`diagram-shape diagram-shape--${category.id}`} /></div>
                  <div className="category-card__body">
                    <p className="eyebrow">{category.eyebrow}</p>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                  <div className="category-card__footer"><span>{String(completed).padStart(2, '0')} / {String(questionCount).padStart(2, '0')} COMPLETE</span><span>{score} RIGHT <span aria-hidden="true">→</span></span></div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="principles-section" aria-label="Practice principles">
          <div className="principle-intro"><p className="eyebrow">THE METHOD</p><h2>Make the<br />signal clearer.</h2></div>
          <div className="principle-list">
            <div><span>01</span><p><strong>Start with the symptom.</strong><br />Name what is actually failing before reaching for a fix.</p></div>
            <div><span>02</span><p><strong>Choose the smallest useful check.</strong><br />Use evidence to move one layer deeper.</p></div>
            <div><span>03</span><p><strong>Explain the why.</strong><br />A good answer leaves the next technician stronger.</p></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><span>IT SUPPORT LAB / LOCAL-FIRST</span><span>NO ACCOUNT REQUIRED <span aria-hidden="true">·</span> BUILT FOR REPETITION</span></footer>
    </div>
  );
}
