import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";
import profile from "@/data/profile.json";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <span className="text-orange-500">◆</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="h-px bg-gray-200 mt-3" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-[720px] mx-auto px-4 py-10">
        {/* TOP CARD */}
        <section className="rounded-3xl border bg-white shadow-sm p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Photo */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border">
              <Image
                src={profile.photoPath}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-bold">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{profile.location}</p>

            <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-xl">
              {profile.intro}
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full border bg-gray-50">
                Visa: {profile.visaStatus}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border bg-gray-50">
                Employer: {profile.employer}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border bg-gray-50">
                Open to: Client-facing roles
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <a
                href={profile.resumePath}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90"
              >
                Resume
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
              >
                LinkedIn
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
              >
                GitHub
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
              >
                Email
              </a>
            </div>
          </div>
        </section>

        {/* WORK */}
        <SectionHeader title="Work Experience" />
        <section className="mt-4 space-y-3">
          {profile.work.map((w: any) => (
            <div key={w.title} className="rounded-2xl border bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{w.title}</div>
                  <div className="text-sm text-gray-600">{w.company}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {w.date}
                </div>
              </div>

              {Array.isArray(w.highlights) && w.highlights.length > 0 && (
                <ul className="mt-3 list-disc ml-5 text-sm text-gray-700 space-y-1">
                  {w.highlights.map((h: string) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* SKILLS */}
        <SectionHeader title="Skills" />
        <section className="mt-4 rounded-2xl border bg-white p-5">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s: string) => (
              <span
                key={s}
                className="text-xs px-3 py-1 rounded-full border bg-gray-50"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <SectionHeader title="Projects" />
        <section className="mt-4 space-y-3">
          {profile.projects.map((p: any) => (
            <a
              key={p.title}
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border bg-white p-5 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {p.description}
                  </div>
                </div>
                <div className="text-sm text-gray-500">↗</div>
              </div>
            </a>
          ))}

          <a
            className="inline-flex mt-2 px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
          >
            View all on GitHub
          </a>
        </section>

        {/* EDUCATION */}
        <SectionHeader title="Education" />
        <section className="mt-4 space-y-3">
          {profile.education.map((e: any) => (
            <div key={e.degree} className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border bg-white">
                  <Image src={e.logo} alt={e.degree} fill className="object-contain p-1" />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold">{e.degree}</div>
                  <div className="text-sm text-gray-600">{e.date}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {profile.name}
        </div>
      </div>

      {/* Chat stays bottom-right */}
      <ChatWidget />
    </main>
  );
}
