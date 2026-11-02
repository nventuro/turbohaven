import { useEffect, useRef, useState } from 'react';
import { shareLink } from './state.ts';
import type { Spoiler } from './types.ts';

const FAQ_ERRATA = 'https://cephalofairgames.github.io/frosthaven-faq/';

interface Props {
  open: boolean;
  spoilers: Spoiler[];
  added: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function SpoilerPanel({ open, spoilers, added, onToggle, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  useEffect(() => setCopied(false), [added]);

  const link = shareLink(window.location.href, [...added]);
  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
  };

  const seals = (group: Spoiler[]) => (
    <div className="seal-grid">
      {group.map((spoiler) => (
        <button
          type="button"
          key={spoiler.id}
          className="seal"
          aria-label={spoiler.label}
          aria-pressed={added.has(spoiler.id)}
          onClick={() => onToggle(spoiler.id)}
        >
          {spoiler.seal}
        </button>
      ))}
    </div>
  );

  return (
    <dialog ref={dialog} className="panel" onClose={onClose}>
      <div className="panel-head">
        <h2>Spoilers</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <p>
        Break a seal once your rule book has that sticker, or the book lets you read that appendix. Anything still
        sealed stays out of this page and its search.
      </p>

      <h3>Stickers</h3>
      {seals(spoilers.filter((spoiler) => spoiler.id.startsWith('sticker-')))}
      <h3>Appendices</h3>
      {seals(spoilers.filter((spoiler) => !spoiler.id.startsWith('sticker-')))}

      <p className="panel-note">
        Five first-printing envelopes list the wrong sticker numbers. <a href={FAQ_ERRATA}>Check the FAQ</a> before
        breaking a seal for one.
      </p>

      <h3>Share with your party</h3>
      <div className="share">
        <input readOnly aria-label="Link to this list" value={link} onFocus={(event) => event.target.select()} />
        <button type="button" onClick={copyLink}>
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </dialog>
  );
}
