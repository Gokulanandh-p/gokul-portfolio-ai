"use client";

import { useState } from "react";

type Project = {
  title: string;
  tags?: string[];
  description: string;
  links?: { label: string; url: string }[];
};

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <button
            key={p.title}
            onClick={() => setActive(p)}
            className="text-left rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold text-lg">{p.title}</div>
              <span className="text-xs px-2 py-1 rounded-full border bg-gray-50">View</span>
            </div>

            <div className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {p.description}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(p.tags ?? []).slice(0, 6).map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full border bg-gray-50">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white border shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-lg">{active.title}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(active.tags ?? []).map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full border bg-gray-50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActive(null)}
                className="text-sm px-3 py-2 rounded-xl border hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <div className="text-sm text-gray-700 leading-relaxed">{active.description}</div>

              {active.links?.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {active.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm px-3 py-2 rounded-xl border hover:bg-gray-50"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
