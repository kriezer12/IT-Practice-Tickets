import { useEffect, useRef } from 'react';

type UnavailableCaseProps = {
  categoryName?: string;
  onBack: () => void;
};

export function UnavailableCase({ categoryName, onBack }: UnavailableCaseProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main className="completion-page unavailable-page" id="main-content" tabIndex={-1}>
        <p className="eyebrow">CASE UNAVAILABLE</p>
        <h1 className="focus-target" ref={headingRef} tabIndex={-1}>This case<br /><em>is unavailable.</em></h1>
        <p className="completion-copy">{categoryName ? `The saved ${categoryName} case is no longer in the local catalog.` : 'The saved case is no longer in the local catalog.'} Return to the library to choose an available practice track.</p>
        <div className="completion-actions"><button className="primary-button" type="button" onClick={onBack}>Return to library <span aria-hidden="true">→</span></button></div>
      </main>
    </>
  );
}
