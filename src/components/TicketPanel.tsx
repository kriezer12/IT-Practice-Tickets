import type { PracticeQuestion } from '../types';

type TicketPanelProps = {
  question: PracticeQuestion;
};

export function TicketPanel({ question }: TicketPanelProps) {
  return (
    <article className="ticket-panel">
      <div className="ticket-panel__header"><div className="ticket-panel__title"><span className="ticket-icon" aria-hidden="true">▱</span><span><strong>HELPDESK TICKET</strong><small>FIELD CASE / {question.id.toUpperCase()}</small></span></div><span className="ticket-priority">PRACTICE</span></div>
      <div className="ticket-panel__subject"><p className="eyebrow">SUBJECT</p><h2>{question.ticket.subject}</h2></div>
      <dl className="ticket-facts">
        <div><dt>REQUESTER</dt><dd>{question.ticket.requester}</dd></div>
        <div><dt>ENVIRONMENT</dt><dd>{question.ticket.environment}</dd></div>
        <div><dt>USER REPORT</dt><dd>“{question.ticket.report.replace(/[“”]/g, '')}”</dd></div>
        <div><dt>ADDITIONAL INFO</dt><dd>{question.ticket.additionalInfo}</dd></div>
      </dl>
      <div className="ticket-panel__footer"><span>CASE CONTEXT</span><span aria-hidden="true">↘</span></div>
    </article>
  );
}
