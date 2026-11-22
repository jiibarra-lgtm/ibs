"use client";

import { useState } from "react";
import KitCard, { type KitView } from "./KitCard";

export default function KitsBrowser({ kits }: { kits: KitView[] }) {
  const rubros = ["Todos", ...Array.from(new Set(kits.map((k) => k.rubro)))];
  const [r, setR] = useState("Todos");
  const lista = kits.filter((k) => r === "Todos" || k.rubro === r);
  return (
    <>
      <div className="kit-filters" role="tablist">
        {rubros.map((x) => (
          <button key={x} role="tab" aria-selected={r === x} className={r === x ? "on" : ""} onClick={() => setR(x)}>
            {x} <small>{x === "Todos" ? kits.length : kits.filter((k) => k.rubro === x).length}</small>
          </button>
        ))}
      </div>
      <div className="kits kits--page">{lista.map((k) => <KitCard key={k.slug} k={k} />)}</div>
    </>
  );
}
