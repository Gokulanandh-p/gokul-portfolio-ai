"use client";

import { useMemo, useState } from "react";

const CATEGORIES: { label: string; match: (s: string) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "Analytics", match: (s) => /power bi|tableau|excel|analytics|dashboard|visual/i.test(s) },
  { label: "Data/ETL", match: (s) => /python|sql|etl|data|quality|validation|mapping/i.test(s) },
  { label: "APIs", match: (s) => /api|rest|postman/i.test(s) },
  { label: "AWS/Cloud", match: (s) => /aws|lambda|dynamo|connect|serverless|iam/i.test(s) },
  { label: "Dev", match: (s) => /node|javascript/i.test(s) }
];

export default function SkillsPanel({ skills }: { skills: string[] }) {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.label === active) ?? CATEGORIES[0];
    return skills
      .filter((s) => cat.match(s))
      .filter((s) => s.toLowerCase().includes(q.trim().toLowerCase()));
  }, [skills, active, q]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => setActive(c.label)}
              className={
                "text-sm px-3 py-2 rounded-xl border transition " +
                (active === c.label ? "bg-black text-white" : "bg-white hover:bg-gray-50")
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search skills…"
          className="w-full md:w-64 border rounded-xl px-3 py-2 text-sm bg-white text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {filtered.map((s) => (
          <span key={s} className="text-xs px-3 py-1 rounded-full border bg-gray-50">
            {s}
          </span>
        ))}
        {filtered.length === 0 && <div className="text-sm text-gray-500">No skills match.</div>}
      </div>
    </div>
  );
}
