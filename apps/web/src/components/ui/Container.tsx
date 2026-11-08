import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Seitenraster: max. 1440 px Inhalt, Gutter 20 / 32 / 48 / 64 px. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 2xl:px-16', className)} {...props} />;
}
