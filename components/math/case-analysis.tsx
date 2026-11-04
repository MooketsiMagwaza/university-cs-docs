'use client';

import React from 'react';
import { MathText } from '@/components/interactive/math-text';

export function CaseAnalysis({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-muted/20 p-5">
      {title && <h4 className="mb-4 font-bold text-fd-foreground">{title}</h4>}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function Case({ condition, children, explanation }: { condition: React.ReactNode | string; children: React.ReactNode; explanation?: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-lg bg-fd-background p-4 border border-fd-border/50">
      <div className="sm:w-1/3 flex items-center justify-center p-3 bg-fd-primary/5 rounded-md border border-fd-primary/20">
        <span className="font-serif text-fd-primary font-semibold text-center">
          If <MathText text={condition} />
        </span>
      </div>
      <div className="sm:w-2/3 flex flex-col justify-center">
        <div className="font-serif text-lg text-fd-foreground mb-1">{children}</div>
        {explanation && <p className="text-sm text-fd-muted-foreground">{explanation}</p>}
      </div>
    </div>
  );
}