/** Renderizador mínimo de markdown para las guías: ## / ###, párrafos, listas, tablas, **negrita**, > nota, [link](url) */
import Link from "next/link";
import { Fragment } from "react";

function inline(t: string, k: string) {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(t.slice(last, m.index));
    if (m[1]) out.push(<b key={`${k}b${i++}`}>{m[1]}</b>);
    else out.push(m[3].startsWith("/") ? <Link key={`${k}l${i++}`} href={m[3]}>{m[2]}</Link> : <a key={`${k}l${i++}`} href={m[3]} target="_blank" rel="noopener">{m[2]}</a>);
    last = re.lastIndex;
  }
  if (last < t.length) out.push(t.slice(last));
  return out;
}

export default function Md({ src }: { src: string }) {
  const blocks = src.trim().replace(/^(#{2,3} .+)\n(?!\n)/gm, "$1\n\n").replace(/^(> .+)\n(?!\n)/gm, "$1\n\n").split(/\n{2,}/);
  return (
    <div className="md">
      {blocks.map((b, n) => {
        const k = `b${n}`;
        if (b.startsWith("### ")) return <h3 key={k}>{inline(b.slice(4), k)}</h3>;
        if (b.startsWith("## ")) return <h2 key={k}>{inline(b.slice(3), k)}</h2>;
        if (b.startsWith("> ")) return <aside key={k} className="md-tip">💡 {inline(b.replace(/^> /gm, ""), k)}</aside>;
        const lines = b.split("\n");
        if (lines.length >= 2 && lines.every((l) => /^\|.*\|$/.test(l.trim())) && /^\|[\s:|-]+\|$/.test(lines[1].trim())) {
          const cells = (l: string) => l.trim().slice(1, -1).split("|").map((c) => c.trim());
          const [head, , ...rows] = lines;
          return (
            <div key={k} className="md-table"><table>
              <thead><tr>{cells(head).map((c, i) => <th key={i}>{inline(c, `${k}h${i}`)}</th>)}</tr></thead>
              <tbody>{rows.map((r, j) => <tr key={j}>{cells(r).map((c, i) => <td key={i}>{inline(c, `${k}r${j}${i}`)}</td>)}</tr>)}</tbody>
            </table></div>
          );
        }
        if (lines.every((l) => /^- /.test(l))) return <ul key={k}>{lines.map((l, i) => <li key={i}>{inline(l.slice(2), `${k}${i}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l))) return <ol key={k}>{lines.map((l, i) => <li key={i}>{inline(l.replace(/^\d+\. /, ""), `${k}${i}`)}</li>)}</ol>;
        return <p key={k}>{lines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{inline(l, `${k}${i}`)}</Fragment>)}</p>;
      })}
    </div>
  );
}
