import type { PropsWithChildren, ReactNode } from 'react'

export function Table({ children }: PropsWithChildren) {
  return <table className="table">{children}</table>
}

export function TableHead({ children }: PropsWithChildren) {
  return <thead>{children}</thead>
}

export function TableBody({ children }: PropsWithChildren) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: PropsWithChildren) {
  return <tr>{children}</tr>
}

export function TableCell({
  children,
  header = false,
}: PropsWithChildren<{ header?: boolean }>) {
  return header ? <th>{children}</th> : <td>{children}</td>
}

export function TableActions({ children }: { children: ReactNode }) {
  return <div className="table-actions">{children}</div>
}
