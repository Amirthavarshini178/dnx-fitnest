import type { ReactNode } from 'react'

export default function PageHeading({ section, title, description, action }: { section: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> MEMBER SPACE / {section}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}