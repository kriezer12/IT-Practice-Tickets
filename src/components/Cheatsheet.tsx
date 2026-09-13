import { useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import {
  ACTIVE_DIRECTORY_COMMANDS,
  ACTIVE_DIRECTORY_TERMS,
  CHEATSHEET_TOPICS,
  COMMON_PORTS,
  CUSTOMER_SERVICE_PROMPTS,
  CUSTOMER_SERVICE_TIPS,
  DIAGNOSTIC_COMMANDS,
  DOMAIN_LOGIN_STEPS,
  HARDWARE_TRIAGE,
  LAB_TALKING_POINT,
  NETWORKING_CONCEPTS,
  OSI_LAYERS,
  QUICK_FIRE_SCENARIOS,
  SECURITY_BASICS,
  TROUBLESHOOTING_METHOD,
} from '../data/cheatsheet';

type CheatsheetProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

function NoteList({ items }: { items: Array<{ label: string; detail: string }> }) {
  return (
    <dl className="cheatsheet-note-list">
      {items.map((item) => (
        <div className="cheatsheet-note" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionHeading({ number, eyebrow, title, id }: { number: string; eyebrow: string; title: string; id: string }) {
  return (
    <div className="cheatsheet-section__heading">
      <span className="cheatsheet-section__number" aria-hidden="true">{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="focus-target" tabIndex={-1}>{title}</h2>
      </div>
    </div>
  );
}

export function Cheatsheet({ theme, onToggleTheme }: CheatsheetProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    document.title = 'Interview Cheatsheet — IT Support Lab';
    headingRef.current?.focus();
    return () => {
      document.title = 'IT Support Lab — Practice the next check';
    };
  }, []);

  return (
    <div className="page-shell cheatsheet-page">
      <a className="skip-link" href="#cheatsheet-content">Skip to cheatsheet content</a>
      <header className="site-header cheatsheet-header">
        <a className="brand" href="/" aria-label="IT Support Lab home">
          <span className="brand__mark" aria-hidden="true">↗</span>
          <span className="brand__words"><strong>IT SUPPORT LAB</strong><small>Practice the next check</small></span>
        </a>
        <div className="header-actions">
          <a className="header-text-link" href="/">PRACTICE <span aria-hidden="true">↗</span></a>
          <span className="status-chip"><span className="status-dot" aria-hidden="true" />LOCAL SESSION</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main id="cheatsheet-content" className="cheatsheet-main" tabIndex={-1}>
        <section className="cheatsheet-hero" aria-labelledby="cheatsheet-title">
          <div>
            <p className="eyebrow">INTERVIEW FIELD MANUAL / IT SUPPORT</p>
            <h1 id="cheatsheet-title" ref={headingRef} className="focus-target">Say the next<br /><em>check clearly.</em></h1>
            <p className="cheatsheet-hero__description">A practical refresher for technical support interviews: frame the symptom, isolate the signal, and explain why your first check matters.</p>
          </div>
          <div className="cheatsheet-hero__aside" aria-label="Cheatsheet summary">
            <span className="cheatsheet-hero__mark" aria-hidden="true">07</span>
            <p>TOPICS<br />ONE REFERENCE</p>
            <div className="mini-rule" />
            <span className="cheatsheet-hero__meta">LOCAL / NO ACCOUNT<br />READY TO REVIEW</span>
          </div>
        </section>

        <div className="cheatsheet-index-layout">
          <nav className="cheatsheet-nav" aria-label="Cheatsheet topics">
            <p className="eyebrow">ON THIS PAGE</p>
            <ol>
              {CHEATSHEET_TOPICS.map((topic) => (
                <li key={topic.id}>
                  <a href={`#${topic.id}`}><span>{topic.number}</span><strong>{topic.label}</strong><span aria-hidden="true">↘</span></a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="cheatsheet-content">
            <section id="methodology" className="cheatsheet-section cheatsheet-section--feature" aria-labelledby="methodology-heading">
              <SectionHeading number="01" eyebrow="THE ANSWER SHAPE" title="Troubleshoot in seven moves." id="methodology-heading" />
              <p className="cheatsheet-section__intro">When an interviewer asks you to walk through a problem, make your reasoning easy to follow. This is the formal methodology behind a strong support answer.</p>
              <ol className="cheatsheet-method-grid">
                {TROUBLESHOOTING_METHOD.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div><h3>{step.title}</h3><p>{step.description}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="hardware" className="cheatsheet-section" aria-labelledby="hardware-heading">
              <SectionHeading number="02" eyebrow="FIRST CHECKS / WINDOWS" title="Classic hardware and OS problems." id="hardware-heading" />
              <div className="cheatsheet-table-wrap">
                <table className="cheatsheet-table">
                  <caption className="sr-only">Hardware and operating system problems, likely causes, and first checks</caption>
                  <thead><tr><th scope="col">Problem</th><th scope="col">Likely causes</th><th scope="col">First things to check</th></tr></thead>
                  <tbody>{HARDWARE_TRIAGE.map((row) => <tr key={row.problem}><th scope="row">{row.problem}</th><td>{row.causes}</td><td>{row.check}</td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section id="networking" className="cheatsheet-section" aria-labelledby="networking-heading">
              <SectionHeading number="03" eyebrow="PATH / SIGNAL" title="Networking fundamentals." id="networking-heading" />
              <div className="cheatsheet-network-grid">
                <div className="cheatsheet-subsection">
                  <div className="cheatsheet-subheading"><span>OSI MODEL</span><span>07 → 01</span></div>
                  <ol className="cheatsheet-osi-list">{OSI_LAYERS.map((layer) => <li key={layer.label}><strong>{layer.label}</strong><span>{layer.detail}</span></li>)}</ol>
                </div>
                <div className="cheatsheet-subsection">
                  <div className="cheatsheet-subheading"><span>KEY CONCEPTS</span><span>KNOW THE LAYERS</span></div>
                  <NoteList items={NETWORKING_CONCEPTS} />
                </div>
              </div>
              <div className="cheatsheet-network-lower">
                <div className="cheatsheet-subsection">
                  <div className="cheatsheet-subheading"><span>COMMON PORTS</span><span>TCP / UDP</span></div>
                  <table className="cheatsheet-table cheatsheet-table--compact"><caption className="sr-only">Common network ports</caption><thead><tr><th scope="col">Port</th><th scope="col">Service</th><th scope="col">Use</th></tr></thead><tbody>{COMMON_PORTS.map((item) => <tr key={item.port}><th scope="row"><code>{item.port}</code></th><td>{item.service}</td><td>{item.use}</td></tr>)}</tbody></table>
                </div>
                <div className="cheatsheet-subsection">
                  <div className="cheatsheet-subheading"><span>DIAGNOSTIC COMMANDS</span><span>START HERE</span></div>
                  <ul className="cheatsheet-command-list">{DIAGNOSTIC_COMMANDS.map((item) => <li key={item.command}><code>{item.command}</code><span>{item.purpose}</span></li>)}</ul>
                </div>
              </div>
            </section>

            <section id="active-directory" className="cheatsheet-section" aria-labelledby="active-directory-heading">
              <SectionHeading number="04" eyebrow="IDENTITY / POLICY" title="Active Directory and Windows Server." id="active-directory-heading" />
              <p className="cheatsheet-section__intro">Your home lab is a real talking point. Be ready to connect the terms below to the systems you have configured and debugged.</p>
              <div className="cheatsheet-ad-grid"><NoteList items={ACTIVE_DIRECTORY_TERMS} /><div className="cheatsheet-command-card"><div className="cheatsheet-subheading"><span>AD TOOLBELT</span><span>WINDOWS SERVER</span></div><ul className="cheatsheet-command-list">{ACTIVE_DIRECTORY_COMMANDS.map((item) => <li key={item.command}><code>{item.command}</code><span>{item.purpose}</span></li>)}</ul></div></div>
              <div className="cheatsheet-login-flow"><div className="cheatsheet-subheading"><span>SAMPLE QUESTION</span><span>DOMAIN LOGIN FAILURE</span></div><h3>“A user cannot log into their domain-joined PC. Walk me through it.”</h3><ol>{DOMAIN_LOGIN_STEPS.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></div>
            </section>

            <section id="security" className="cheatsheet-section" aria-labelledby="security-heading">
              <SectionHeading number="05" eyebrow="PROTECT THE SYSTEM" title="Security basics." id="security-heading" />
              <div className="cheatsheet-card-grid">{SECURITY_BASICS.map((item) => <article className="cheatsheet-card" key={item.label}><p className="eyebrow">{item.label}</p><p>{item.detail}</p></article>)}</div>
            </section>

            <section id="customer-service" className="cheatsheet-section" aria-labelledby="customer-service-heading">
              <SectionHeading number="06" eyebrow="THE HUMAN LAYER" title="Customer service and soft skills." id="customer-service-heading" />
              <p className="cheatsheet-section__intro">Prepare STAR-format answers for these prompts. Keep the story short, show your judgment, and make the result concrete.</p>
              <div className="cheatsheet-star-grid"><div><div className="cheatsheet-subheading"><span>STAR PROMPTS</span><span>REHEARSE THESE</span></div><ol className="cheatsheet-prompt-list">{CUSTOMER_SERVICE_PROMPTS.map((prompt, index) => <li key={prompt}><span>{String(index + 1).padStart(2, '0')}</span><p>{prompt}</p></li>)}</ol></div><div><div className="cheatsheet-subheading"><span>FRAMING TIPS</span><span>GOOD SUPPORT</span></div><ul className="cheatsheet-tips-list">{CUSTOMER_SERVICE_TIPS.map((tip) => <li key={tip}>{tip}</li>)}</ul></div></div>
            </section>

            <section id="quick-fire" className="cheatsheet-section" aria-labelledby="quick-fire-heading">
              <SectionHeading number="07" eyebrow="ISOLATE / EXPLAIN" title="Quick-fire scenarios." id="quick-fire-heading" />
              <div className="cheatsheet-scenario-list">{QUICK_FIRE_SCENARIOS.map((item, index) => <article key={item.scenario}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.scenario}</h3><p>{item.direction}</p></article>)}</div>
            </section>

            <aside className="cheatsheet-callout" aria-label="Hands-on lab talking point"><div className="cheatsheet-callout__mark" aria-hidden="true">↗</div><div><p className="eyebrow">YOUR DIFFERENTIATOR</p><h2>Do not just recite the lab.</h2><p>{LAB_TALKING_POINT}</p></div></aside>
          </div>
        </div>
      </main>

      <footer className="site-footer"><span>IT SUPPORT LAB / LOCAL-FIRST</span><span>NO ACCOUNT REQUIRED <span aria-hidden="true">·</span> BUILT FOR REPETITION</span></footer>
    </div>
  );
}
