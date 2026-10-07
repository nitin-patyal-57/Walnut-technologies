export default function Card({ className = '', hover = false, children, ...props }) {
  const hoverCls = hover
    ? 'hover:shadow-md hover:border-slate-300 transition-all duration-300'
    : '';
  return (
    <div className={`glass-card ${hoverCls} ${className}`} {...props}>
      {children}
    </div>
  );
}
