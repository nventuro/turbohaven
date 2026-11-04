import { createElement, memo, useMemo } from 'react';
import { composeBody, type SpoilerState } from './compose.ts';
import { TreasureLookup } from './TreasureLookup.tsx';
import type { Section } from './types.ts';

interface Props {
  section: Section;
  spoilers: SpoilerState;
  closed: Set<string>;
}

export const SectionView = memo(function SectionView({ section, spoilers, closed }: Props) {
  const body = useMemo(() => composeBody(section.html, spoilers, closed), [section.html, spoilers, closed]);

  return (
    <details id={section.id} className="section" data-level={section.level} open={!closed.has(section.id)}>
      <summary>
        {section.pageAnchors.map((page) => (
          <span key={page} id={`page-${page}`} />
        ))}
        {createElement(`h${Math.min(section.level, 6)}`, { dangerouslySetInnerHTML: { __html: section.titleHtml } })}
        {section.page > 0 && <span className="page">p. {section.page}</span>}
      </summary>
      <div className="section-body" dangerouslySetInnerHTML={{ __html: body }} />
      {section.hasTreasureLookup && <TreasureLookup />}
      {section.children.map((child) => (
        <SectionView key={child.id} section={child} spoilers={spoilers} closed={closed} />
      ))}
    </details>
  );
});
