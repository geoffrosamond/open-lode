import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Player } from "@/components/player";
import { DEFAULT_EPISODE_ID, EPISODES, type Episode, type Project } from "@/data/briefing";

export const Route = createFileRoute("/")({ component: Home });

function kindOf(item: Episode) {
  return item.kind ?? (item.symbol ? "element" : "country");
}

function Home() {
  const [episodeId, setEpisodeId] = useState(DEFAULT_EPISODE_ID);
  const episode = EPISODES.find((item) => item.id === episodeId) ?? EPISODES[0];
  const [shelf, setShelf] = useState<"country" | "element">(kindOf(episode));
  const [episodeQuery, setEpisodeQuery] = useState("");
  const [query, setQuery] = useState("");
  const [commodity, setCommodity] = useState<string>("All");
  const [region, setRegion] = useState<string>("All");
  const [onlyHeard, setOnlyHeard] = useState(false);
  const [openId, setOpenId] = useState<string | null>(episode.defaultOpen);

  function chooseEpisode(id: string) {
    const next = EPISODES.find((item) => item.id === id);
    if (!next) return;
    setEpisodeId(id);
    setQuery("");
    setCommodity("All");
    setRegion("All");
    setOnlyHeard(false);
    setOpenId(next.defaultOpen);
  }

  const listed = useMemo(() => {
    const q = episodeQuery.trim().toLowerCase();
    const items = EPISODES.filter((item) => kindOf(item) === shelf).filter((item) => {
      if (!q) return true;
      return `${item.country} ${item.symbol ?? ""} ${item.title} ${item.number}`
        .toLowerCase()
        .includes(q);
    });
    if (shelf === "country") {
      items.sort((a, b) => Number(b.id === "the-desk") - Number(a.id === "the-desk"));
    }
    return items;
  }, [shelf, episodeQuery]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return episode.projects.filter((project) => {
      if (onlyHeard && !project.heard) return false;
      if (commodity !== "All" && !project.commodities.includes(commodity)) return false;
      if (region !== "All" && project.state !== region) return false;
      if (!q) return true;
      const hay = [project.name, project.company, project.ticker, project.place, project.note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [episode, query, commodity, region, onlyHeard]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="border-b border-rule pb-6">
        <p className="text-xs font-semibold tracking-widest text-copper uppercase">
          Critical minerals · {episode.symbol ? `${episode.country} (${episode.symbol})` : episode.country}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl leading-none font-medium sm:text-5xl">Open Lode</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{episode.lede}</p>
          </div>
          <dl className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
            {episode.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-muted">{stat.label}</dt>
                <dd className="font-display text-2xl tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="min-w-0 lg:sticky lg:top-4">
          <div className="mb-3 flex gap-2" role="group" aria-label="Shelf">
            <Chip
              active={shelf === "country"}
              onClick={() => {
                setShelf("country");
                setEpisodeQuery("");
              }}
            >
              Countries
            </Chip>
            <Chip
              active={shelf === "element"}
              onClick={() => {
                setShelf("element");
                setEpisodeQuery("");
              }}
            >
              Elements
            </Chip>
          </div>
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={episodeQuery}
              onChange={(event) => setEpisodeQuery(event.target.value)}
              placeholder={shelf === "element" ? "Find an element or a symbol" : "Find a country"}
              aria-label={shelf === "element" ? "Find an element" : "Find a country"}
              className="w-full rounded-full border border-rule bg-card py-2 pr-4 pl-10 text-sm text-ink placeholder:text-muted"
            />
          </div>
          <div className="mb-3 max-h-72 space-y-1 overflow-y-auto pr-1" role="group" aria-label="Episode">
            {listed.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === episode.id}
                onClick={() => chooseEpisode(item.id)}
                className={
                  "flex min-h-11 w-full items-baseline gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors " +
                  (item.id === episode.id ? "bg-ink text-paper" : "bg-chip text-ink hover:bg-rule")
                }
              >
                <span className="w-10 shrink-0 text-xs font-semibold tracking-widest uppercase">
                  {item.symbol || item.number}
                </span>
                <span className="font-display text-base leading-tight">{item.country}</span>
              </button>
            ))}
            {listed.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">Nothing on this shelf matches.</p>
            ) : null}
          </div>
          <Player key={episode.id} episode={episode} />
          <p className="mt-3 text-xs leading-relaxed text-muted">{episode.disclaimer}</p>
        </aside>

        <section className="min-w-0" aria-label="Projects">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search project, company, or place"
                aria-label="Search projects"
                className="w-full rounded-full border border-rule bg-card py-3 pr-4 pl-10 text-sm text-ink placeholder:text-muted"
              />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Commodity">
              <Chip active={commodity === "All"} onClick={() => setCommodity("All")}>
                All minerals
              </Chip>
              {episode.commodities.map((item) => (
                <Chip key={item} active={commodity === item} onClick={() => setCommodity(item)}>
                  {item}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-2" role="group" aria-label={episode.regionLabel}>
                <Chip active={region === "All"} onClick={() => setRegion("All")}>
                  All {episode.regionAll}
                </Chip>
                {episode.regions.map((item) => (
                  <Chip key={item} active={region === item} onClick={() => setRegion(item)}>
                    {item}
                  </Chip>
                ))}
              </div>
              <Chip active={onlyHeard} onClick={() => setOnlyHeard((value) => !value)}>
                Heard in the briefing
              </Chip>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted tabular-nums">
            {visible.length} open {visible.length === 1 ? "project" : "projects"}
          </p>

          {visible.length === 0 ? (
            <p className="mt-6 rounded-card border border-dashed border-rule bg-card px-4 py-8 text-center text-sm text-muted">
              {episode.emptyHint}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-rule border-y border-rule">
              {visible.map((project) => (
                <LedgerRow
                  key={project.id}
                  project={project}
                  open={openId === project.id}
                  onToggle={() => setOpenId((id) => (id === project.id ? null : project.id))}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "min-h-11 rounded-full px-3 py-2 text-sm transition-colors " +
        (active ? "bg-ink text-paper" : "bg-chip text-ink hover:bg-rule")
      }
    >
      {children}
    </button>
  );
}

function LedgerRow({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start gap-3 py-4 text-left"
      >
        <span className="mt-0.5 w-12 shrink-0 font-display text-lg text-copper">{project.state}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-display text-xl leading-tight">{project.name}</span>
            {project.heard ? (
              <span className="text-xs font-semibold tracking-wide text-copper uppercase">
                In the briefing
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-sm text-muted">
            {project.company}
            {project.ticker ? ` · ${project.ticker}` : ""}
          </span>
        </span>
        <span className="hidden shrink-0 text-right sm:block">
          <span className="block text-sm">{project.stage}</span>
          <span className="block text-xs text-muted">{project.commodities.join(" · ")}</span>
        </span>
      </button>
      {open ? (
        <div className="mb-4 grid gap-3 rounded-card bg-card p-4 sm:ml-12 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <p className="text-sm leading-relaxed">{project.note}</p>
            <p className="mt-3 text-sm text-muted">{project.place}</p>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Stage</dt>
              <dd>{project.stage}</dd>
            </div>
            {project.capital ? (
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Capital</dt>
                <dd className="tabular-nums">{project.capital}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Still open</dt>
              <dd>{project.stillOpen}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </li>
  );
}
