import type { ReactNode } from "react";
export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
  id,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={"panel " + className}>
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
export function Empty({
  children = "No applications in this selection. A fresh start, statistically speaking.",
}: {
  children?: ReactNode;
}) {
  return <div className="empty">{children}</div>;
}
