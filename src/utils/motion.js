export const reduceMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const scrollBehavior = () => (reduceMotion() ? 'auto' : 'smooth');
