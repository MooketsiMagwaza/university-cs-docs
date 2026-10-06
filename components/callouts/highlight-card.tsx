'use client';

import React from 'react';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variantStyles: Record<Variant, { outer: string; inner: string; title: string }> = {
  primary: {
    outer: 'border-blue-500/40 bg-blue-500/5',
    inner: 'border-blue-500/20 bg-fd-background shadow-sm',
    title: 'text-blue-600 dark:text-blue-400'
  },
  success: {
    outer: 'border-emerald-500/40 bg-emerald-500/5',
    inner: 'border-emerald-500/20 bg-fd-background shadow-sm',
    title: 'text-emerald-600 dark:text-emerald-400'
  },
  warning: {
    outer: 'border-amber-500/40 bg-amber-500/5',
    inner: 'border-amber-500/20 bg-fd-background shadow-sm',
    title: 'text-amber-600 dark:text-amber-400'
  },
  danger: {
    outer: 'border-red-500/40 bg-red-500/5',
    inner: 'border-red-500/20 bg-fd-background shadow-sm',
    title: 'text-red-600 dark:text-red-400'
  },
  info: {
    outer: 'border-sky-500/40 bg-sky-500/5',
    inner: 'border-sky-500/20 bg-fd-background shadow-sm',
    title: 'text-sky-600 dark:text-sky-400'
  },
  neutral: {
    outer: 'border-fd-border bg-fd-muted/30',
    inner: 'border-fd-border bg-fd-background shadow-sm',
    title: 'text-fd-foreground'
  }
};

export function HighlightCard({
  title,
  description,
  variant = 'primary',
  children
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: Variant;
  children?: React.ReactNode;
}) {
  const styles = variantStyles[variant];

  return (
    <div className={`my-6 w-full overflow-hidden rounded-xl border-2 ${styles.outer} p-4`}>
      {title && <h3 className={`mb-1 text-base font-bold ${styles.title}`}>{title}</h3>}
      {description && (
        <div className={`text-sm leading-relaxed text-fd-foreground/90 ${children ? 'mb-2' : ''}`}>
          {description}
        </div>
      )}

      {children && (
        <div className={`overflow-x-auto rounded-lg border p-3 ${styles.inner}`}>
          {children}
        </div>
      )}
    </div>
  );
}
