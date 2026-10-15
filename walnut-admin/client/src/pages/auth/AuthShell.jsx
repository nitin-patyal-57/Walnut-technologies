// Centered card used by every signed-out screen.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="Walnut Technologies" className="h-10 w-auto dark:invert" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Admin Panel</p>
        </div>
        <div className="card p-6">
          <h1 className="text-lg font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-muted">Authorised Walnut Technologies staff only. Activity is logged.</p>
      </div>
    </main>
  );
}
