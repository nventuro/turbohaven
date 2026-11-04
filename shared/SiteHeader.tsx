import type { ReactNode } from 'react';

const OTHER_APP = {
  rules: { href: '../scenarios/', label: 'Scenarios' },
  scenarios: { href: '../rules/', label: 'Rulebook' },
};

interface Props {
  /** The app showing the bar, which leads to the other one. */
  app: keyof typeof OTHER_APP;
  className?: string;
  /** Comes before the site's name. */
  start?: ReactNode;
  /** The screen's own part of the bar, between the site's name and the link to the other app. */
  children?: ReactNode;
}

/** The bar along the top of every screen of the site. */
export function SiteHeader({ app, className, start, children }: Props) {
  const other = OTHER_APP[app];
  return (
    <header className={className ? `top ${className}` : 'top'}>
      {start}
      <a className="brand" href="../">
        Turbohaven
      </a>
      {children}
      <a className="site-link" href={other.href}>
        {other.label}
      </a>
    </header>
  );
}
