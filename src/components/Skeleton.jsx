export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded animate-skeleton"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = '' }) {
  return (
    <div className={`bg-slate-200 rounded-xl animate-skeleton ${className}`} />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-6 border border-slate-200 rounded-xl ${className}`}>
      <div className="w-12 h-12 bg-slate-200 rounded-lg mb-4 animate-skeleton" />
      <div className="h-5 bg-slate-200 rounded w-2/3 mb-2 animate-skeleton" />
      <div className="h-4 bg-slate-200 rounded w-full mb-2 animate-skeleton" />
      <div className="h-4 bg-slate-200 rounded w-4/5 animate-skeleton" />
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClasses[size]} bg-slate-200 rounded-full animate-skeleton ${className}`} />
  );
}
