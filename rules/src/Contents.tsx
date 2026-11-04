import type { MouseEvent } from 'react';
import type { Section } from './types.ts';

const DEEPEST_LEVEL = 5;

interface Props {
  sections: Section[];
  closed: Set<string>;
  onPick: (id: string) => void;
  onToggle: (id: string, isOpen: boolean) => void;
}

function Entries({ sections, closed, onPick, onToggle }: Props) {
  const pick = (event: MouseEvent, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    onPick(id);
  };

  const toggle = (event: MouseEvent, id: string) => {
    event.preventDefault();
    onToggle(id, !closed.has(id));
  };

  return (
    <ul>
      {sections.map((section) => {
        const link = (
          <a href={`#${section.id}`} onClick={(event) => pick(event, section.id)}>
            {section.title}
          </a>
        );
        if (section.children.length === 0 || section.level >= DEEPEST_LEVEL) return <li key={section.id}>{link}</li>;
        return (
          <li key={section.id}>
            <details open={!closed.has(section.id)}>
              <summary onClick={(event) => toggle(event, section.id)}>{link}</summary>
              <Entries sections={section.children} closed={closed} onPick={onPick} onToggle={onToggle} />
            </details>
          </li>
        );
      })}
    </ul>
  );
}

export function Contents(props: Props) {
  return (
    <div className="contents">
      <Entries {...props} />
    </div>
  );
}
