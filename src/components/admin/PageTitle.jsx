/** Page heading used across the admin screens, with room for actions. */
export default function PageTitle({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-navy">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-[13.5px] text-muted">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
