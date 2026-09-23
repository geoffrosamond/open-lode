import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Player } from "@/components/player";
import { CHAINS, type Chain } from "@/data/chains";
import { DEFAULT_EPISODE_ID, EPISODES, type Episode, type Project } from "@/data/briefing";

export const Route = createFileRoute("/")({ component: Home });

function kindOf(item: Episode) {
  return item.kind ?? (item.symbol ? "element" : "country");
}

function Home() {
  const [episodeId, setEpisodeId] = useState(DEFAULT_EPISODE_ID);
  const episode = EPISODES.find((item) => item.id === episodeId) ?? EPISODES[0];
  const [shelf, setShelf] = useState<"country" | "element" | "chains" | "money">("country");
  const [chainId, setChainId] = useState(CHAINS[0].id);
  const chain = CHAINS.find((item) => item.id === chainId) ?? CHAINS[0];
  const exploring = shelf === "chains";
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

  function selectShelf(next: "country" | "element" | "chains" | "money") {
    setShelf(next);
    setEpisodeQuery("");
    if (next === "money") {
      chooseEpisode("the-desk");
      return;
    }
    const leavingMoney = kindOf(episode) === "money";
    const shelfKind = next === "element" ? "element" : "country";
    if (leavingMoney || (next !== "chains" && kindOf(episode) !== next)) {
      const first = EPISODES.find((item) => kindOf(item) === shelfKind);
      if (first) chooseEpisode(first.id);
    }
  }

  const listed = useMemo(() => {
    const q = episodeQuery.trim().toLowerCase();
    const items = EPISODES.filter((item) => kindOf(item) === shelf).filter((item) => {
      if (!q) return true;
      return `${item.country} ${item.symbol ?? ""} ${item.title} ${item.number}`
        .toLowerCase()
        .includes(q);
    });
    return items;
  }, [shelf, episodeQuery]);

  const chains = useMemo(() => {
    const q = episodeQuery.trim().toLowerCase();
    return CHAINS.filter((item) => {
      if (!q) return true;
      return `${item.name} ${item.symbol} ${item.use}`.toLowerCase().includes(q);
    });
  }, [episodeQuery]);

  const onMoney = shelf === "money";
  const desk = EPISODES.find((item) => item.id === "the-desk") ?? episode;
  const reading =
    kindOf(episode) === "money"
      ? (EPISODES.find((item) => item.id === DEFAULT_EPISODE_ID) ?? episode)
      : episode;
  const shown = onMoney ? desk : reading;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shown.projects.filter((project) => {
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
  }, [shown, query, commodity, region, onlyHeard]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="border-b border-rule pb-6">
        <h1 className="m-0">
          <img
            src="/blog-header-logo.jpg"
            alt="Open Lode — a critical minerals briefing"
            className="w-full rounded-2xl"
          />
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed">
          Open Lode is the Critical Minerals editorial desk: a collection of narrated briefings and
          project notes covering the countries, elements, mines, and processing projects shaping
          critical-mineral supply. Browse the shelf to understand what is being produced, what
          remains open, and where capital, offtake, or development work may still be needed.
        </p>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="min-w-0 lg:sticky lg:top-4">
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Shelf">
            <Chip
              active={shelf === "country"}
              onClick={() => selectShelf("country")}
            >
              Countries
            </Chip>
            <Chip
              active={shelf === "element"}
              onClick={() => selectShelf("element")}
            >
              Elements
            </Chip>
            <Chip
              active={shelf === "chains"}
              onClick={() => selectShelf("chains")}
            >
              Chains
            </Chip>
            <Chip
              active={shelf === "money"}
              onClick={() => selectShelf("money")}
            >
              Smart money
            </Chip>
          </div>
          {onMoney ? null : (
            <>
              <div className="relative mb-2">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <input
                  value={episodeQuery}
                  onChange={(event) => setEpisodeQuery(event.target.value)}
                  placeholder={
                    shelf === "chains"
                      ? "Find a chain"
                      : shelf === "element"
                        ? "Find an element or a symbol"
                        : "Find a country"
                  }
                  aria-label={
                    shelf === "chains"
                      ? "Find a chain"
                      : shelf === "element"
                        ? "Find an element"
                        : "Find a country"
                  }
                  className="w-full rounded-full border border-rule bg-card py-2 pr-4 pl-10 text-sm text-ink placeholder:text-muted"
                />
              </div>
              <div className="mb-3 max-h-72 space-y-1 overflow-y-auto pr-1" role="group" aria-label="Episode">
                {exploring
                  ? chains.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={item.id === chain.id}
                        onClick={() => setChainId(item.id)}
                        className={
                          "flex min-h-11 w-full items-baseline gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors " +
                          (item.id === chain.id ? "bg-ink text-paper" : "bg-chip text-ink hover:bg-rule")
                        }
                      >
                        <span className="w-10 shrink-0 text-xs font-semibold tracking-widest uppercase">
                          {item.symbol}
                        </span>
                        <span className="font-display text-base leading-tight">{item.name}</span>
                      </button>
                    ))
                  : listed.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={item.id === shown.id}
                        onClick={() => chooseEpisode(item.id)}
                        className={
                          "flex min-h-11 w-full items-baseline gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors " +
                          (item.id === shown.id ? "bg-ink text-paper" : "bg-chip text-ink hover:bg-rule")
                        }
                      >
                        <span className="w-10 shrink-0 text-xs font-semibold tracking-widest uppercase">
                          {item.symbol || item.number}
                        </span>
                        <span className="font-display text-base leading-tight">{item.country}</span>
                      </button>
                    ))}
                {(exploring ? chains : listed).length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted">Nothing on this shelf matches.</p>
                ) : null}
              </div>
            </>
          )}
          {onMoney ? null : shelf === "chains" ? null : (
            <>
              <div className="mb-3">
                <p className="text-xs font-semibold tracking-widest text-copper uppercase">
                  This briefing · {shown.symbol ? `${shown.country} (${shown.symbol})` : shown.country}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{shown.lede}</p>
                <dl className="mt-3 grid grid-cols-3 gap-x-3 text-sm">
                  {shown.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-muted">{stat.label}</dt>
                      <dd className="font-display text-xl tabular-nums">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <Player key={shown.id} episode={shown} />
              <p className="mt-3 text-xs leading-relaxed text-muted">{shown.disclaimer}</p>
            </>
          )}
        </aside>

        <section className="min-w-0" aria-label={onMoney ? "Smart money" : exploring ? "Supply chain" : "Projects"}>
          {onMoney ? (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-copper uppercase">
                This briefing · {desk.country}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{desk.lede}</p>
              <dl className="mt-3 grid max-w-md grid-cols-3 gap-x-3 text-sm">
                {desk.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-muted">{stat.label}</dt>
                    <dd className="font-display text-xl tabular-nums">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 max-w-xl">
                <Player key={desk.id} episode={desk} />
                <p className="mt-3 text-xs leading-relaxed text-muted">{desk.disclaimer}</p>
              </div>
            </div>
          ) : null}
          {exploring ? (
            <ChainView
              chain={chain}
              onOpen={(id) => {
                chooseEpisode(id);
              }}
            />
          ) : (
            <>
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
              {shown.commodities.map((item) => (
                <Chip key={item} active={commodity === item} onClick={() => setCommodity(item)}>
                  {item}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-2" role="group" aria-label={shown.regionLabel}>
                <Chip active={region === "All"} onClick={() => setRegion("All")}>
                  All {shown.regionAll}
                </Chip>
                {shown.regions.map((item) => (
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
              {shown.emptyHint}
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
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function ChainView({ chain, onOpen }: { chain: Chain; onOpen: (episodeId: string) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-copper uppercase">
        Supply chain · {chain.name}
      </p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{chain.lede}</p>
      <dl className="mt-4 mb-4 grid max-w-md grid-cols-3 gap-x-4 text-sm">
        <div>
          <dt className="text-muted">Steps</dt>
          <dd className="font-display text-2xl tabular-nums">{chain.steps.length}</dd>
        </div>
        <div>
          <dt className="text-muted">Pinch</dt>
          <dd className="font-display text-2xl">{chain.pinch}</dd>
        </div>
        <div>
          <dt className="text-muted">Buys</dt>
          <dd className="font-display text-2xl">{chain.use}</dd>
        </div>
      </dl>
      <ol className="space-y-3">
        {chain.steps.map((step, index) => (
          <li key={step.id} className="rounded-card border border-rule bg-card p-4">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl text-copper tabular-nums">{index + 1}</span>
              <h2 className="text-xl leading-none font-medium">{step.name}</h2>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed">{step.what}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {step.holders.map((holder) =>
                holder.episodeId ? (
                  <li key={holder.name}>
                    <button
                      type="button"
                      onClick={() => onOpen(holder.episodeId!)}
                      className="min-h-11 rounded-full bg-chip px-3 py-2 text-left text-sm hover:bg-rule"
                    >
                      <span className="font-medium">{holder.name}</span>
                      <span className="text-muted"> · {holder.role}</span>
                    </button>
                  </li>
                ) : (
                  <li
                    key={holder.name}
                    className="flex min-h-11 items-center rounded-full border border-dashed border-rule px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{holder.name}</span>
                    <span className="text-muted"> · {holder.role}</span>
                  </li>
                ),
              )}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        A mine share is not a refining share. The Survey prints the first. It does not print the
        plant. This is the hand-off, not a customs form. A country button loads that briefing in
        the player. It does not leave the chain.
      </p>
    </div>
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
