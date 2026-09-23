#!/usr/bin/env python3
"""Build the country and element shelves from USGS MCS 2026 and record Leo."""

import csv
import json
import os
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace")
CSV = Path("/tmp/mcs.csv")
OUT = ROOT / "public" / "podcast" / "episodes"
SHELF = ROOT / "src" / "data" / "shelf.ts"

SKIP_COUNTRY = {
    "australia",
    "brazil",
    "chile",
    "india",
    "indonesia",
    "myanmar",
    "peru",
    "philippines",
    "south-africa",
    "sri-lanka",
}

# chapter, detail substring, spoken name, symbol, slug, use, mine?
# mine False means the Survey line is a smelter or refinery, say so.
ELEMENTS = [
    ("BAUXITE AND ALUMINA", "Bauxite, mine production", "Aluminum", "Al", "aluminum", "The metal in almost everything. The mine is not the metal. The mine is bauxite.", True),
    ("ANTIMONY", "Mine production", "Antimony", "Sb", "antimony", "Flame retardants, and the lead in a lead-acid battery.", True),
    ("ARSENIC", "Production (arsenic trioxide", "Arsenic", "As", "arsenic", "A semiconductor dopant, and a poison. The Survey counts arsenic trioxide, not a romantic ore.", False),
    ("BARITE", "Mine production", "Barite", "Ba", "barite", "The drilling mud in an oil well, and a contrast agent in a hospital. The element is barium.", True),
    ("BERYLLIUM", "Mine production", "Beryllium", "Be", "beryllium", "A light, stiff metal for aerospace and defence. Almost nobody mines it.", True),
    ("BISMUTH", "Refinery production", "Bismuth", "Bi", "bismuth", "Medicine, alloys, and a by-product of lead and tungsten. The Survey counts a refinery, not a bismuth pit.", False),
    ("BORON", "Production—", "Boron", "B", "boron", "Glass, ceramics, and the hardening of steel. The product is a borate, and the forms are not the same tonne.", True),
    ("RARE EARTHS", "BASKET", "Cerium", "Ce", "cerium", "Catalysts, glass, and polishing powder. The abundant rare earth.", True),
    ("CESIUM", "NONE", "Cesium", "Cs", "cesium", "Atomic clocks. The Survey does not print a clean mine table.", False),
    ("CHROMIUM", "Mine production", "Chromium", "Cr", "chromium", "Stainless steel. The mine is chromite.", True),
    ("COBALT", "Mine production", "Cobalt", "Co", "cobalt", "The battery cathode, and a metal that is almost never mined for itself.", True),
    ("COPPER", "Mine production", "Copper", "Cu", "copper", "The cable. Added to the critical list in 2025 because the wiring of the transition is not optional.", True),
    ("RARE EARTHS", "BASKET", "Dysprosium", "Dy", "dysprosium", "The heavy rare earth that keeps a magnet working when it is hot.", True),
    ("RARE EARTHS", "BASKET", "Erbium", "Er", "erbium", "Fiber-optic amplifiers. A line in the rare-earth basket, not a mine of its own.", True),
    ("RARE EARTHS", "BASKET", "Europium", "Eu", "europium", "Phosphors, and a nuclear control-rod metal. Scarce, and not separately mined.", True),
    ("FLUORSPAR", "Mine production", "Fluorspar", "F", "fluorspar", "The fluorine mineral: acid, steel, and cement. The element is fluorine.", True),
    ("RARE EARTHS", "BASKET", "Gadolinium", "Gd", "gadolinium", "MRI contrast, and a magnet metal. Counted inside the rare-earth total.", True),
    ("GALLIUM", "Primary production", "Gallium", "Ga", "gallium", "The chips, and the LEDs. It is a by-product of alumina, not a gallium mine.", False),
    ("GERMANIUM", "NONE", "Germanium", "Ge", "germanium", "Fiber optics and infrared. A by-product of zinc. This extract has no 2025 country mine table, and I will not invent one.", False),
    ("GRAPHITE (NATURAL)", "Mine production", "Graphite", "C", "graphite", "The anode. Natural graphite, not the synthetic kind, and not metallurgical coal.", True),
    ("ZIRCONIUM AND HAFNIUM", "HAFNIUM", "Hafnium", "Hf", "hafnium", "Nuclear control rods and superalloys. Separated from zirconium. The Survey prints the zircon, not a hafnium pit.", True),
    ("RARE EARTHS", "BASKET", "Holmium", "Ho", "holmium", "Lasers and magnets. A rare earth without a mine table of its own.", True),
    ("INDIUM", "Refinery production", "Indium", "In", "indium", "The touchscreen. A zinc by-product, counted at the refinery.", False),
    ("PLATINUM-GROUP METALS", "IRIDIUM", "Iridium", "Ir", "iridium", "Crucibles, spark plugs, and catalysts. The Survey prints platinum and palladium, not a separate iridium mine.", True),
    ("RARE EARTHS", "BASKET", "Lanthanum", "La", "lanthanum", "Catalysts, glass, and the old nickel-metal hydride battery.", True),
    ("LEAD", "Mine production", "Lead", "Pb", "lead", "The lead-acid battery, still. Back on the critical list in 2025.", True),
    ("LITHIUM", "Mine production", "Lithium", "Li", "lithium", "The battery metal. Brine, clay, or spodumene. The Survey's tonne is contained lithium, not a carbonate fantasy.", True),
    ("RARE EARTHS", "BASKET", "Lutetium", "Lu", "lutetium", "The scarcest rare earth that still has a medical use. No mine of its own.", True),
    ("MAGNESIUM METAL", "Smelter production", "Magnesium", "Mg", "magnesium", "A light alloy for cars and aircraft. The Survey's line is a smelter, not a pit.", False),
    ("MANGANESE", "Mine production", "Manganese", "Mn", "manganese", "Steel, first. Batteries, second. Almost none of it is mined where the steel is rolled.", True),
    ("COAL", "NONE", "Metallurgical coal", "C", "metallurgical-coal", "Coke for steel. It is on the 2025 critical list, and it is not an element. Do not confuse it with graphite, which is also carbon.", False),
    ("RARE EARTHS", "BASKET", "Neodymium", "Nd", "neodymium", "The permanent magnet. The metal the motor actually wants.", True),
    ("NICKEL", "Mine production", "Nickel", "Ni", "nickel", "Stainless steel, and the battery. The ore and the sulphate are not the same product.", True),
    ("NIOBIUM (COLUMBIUM)", "Mine production", "Niobium", "Nb", "niobium", "The steel strengthener. One country prints almost all of it.", True),
    ("PLATINUM-GROUP METALS", "Mine production: Palladium", "Palladium", "Pd", "palladium", "The gasoline autocatalyst, and a metal Russia and South Africa argue over.", True),
    ("PHOSPHATE ROCK", "Mine production", "Phosphate", "P", "phosphate", "Fertilizer. The element is phosphorus. Food is the offtake, not a battery.", True),
    ("PLATINUM-GROUP METALS", "Mine production: Platinum", "Platinum", "Pt", "platinum", "Catalysts, and the metal South Africa actually dominates.", True),
    ("POTASH", "Mine production", "Potash", "K", "potash", "The other fertilizer. Potassium. A mine, not a battery story.", True),
    ("RARE EARTHS", "BASKET", "Praseodymium", "Pr", "praseodymium", "Paired with neodymium in the magnet alloy. Not a separate pit.", True),
    ("PLATINUM-GROUP METALS", "RHODIUM", "Rhodium", "Rh", "rhodium", "The dearest of the platinum group, and the one the Survey does not give its own mine line.", True),
    ("RUBIDIUM", "NONE", "Rubidium", "Rb", "rubidium", "A specialty metal for research and clocks. No clean mine table in this extract.", False),
    ("PLATINUM-GROUP METALS", "RUTHENIUM", "Ruthenium", "Ru", "ruthenium", "Electronics and catalysts. It rides in the platinum ores. No separate mine table.", True),
    ("RARE EARTHS", "BASKET", "Samarium", "Sm", "samarium", "The samarium-cobalt magnet, which survives heat better than the neodymium kind.", True),
    ("SCANDIUM", "NONE", "Scandium", "Sc", "scandium", "A pinch in an aluminum alloy. The Survey prints a world production and a capacity, not a country pit list.", False),
    ("SILICON", "Silicon metal", "Silicon", "Si", "silicon", "The chip, the solar cell, and the alloy. Metal, not sand, and not ferrosilicon.", False),
    ("SILVER", "Mine production", "Silver", "Ag", "silver", "Electronics, paste for solar cells, and a monetary habit. Mostly a by-product of other mines.", True),
    ("TELLURIUM", "Refinery production", "Tellurium", "Te", "tellurium", "Cadmium-telluride solar cells. A copper-refinery by-product.", False),
    ("RARE EARTHS", "BASKET", "Terbium", "Tb", "terbium", "The other heavy magnet metal, with dysprosium. Counted in the basket, and often in a hillside leach.", True),
    ("RARE EARTHS", "BASKET", "Thulium", "Tm", "thulium", "Portable X-ray, and very little of it. No mine table of its own.", True),
    ("TIN", "Mine production", "Tin", "Sn", "tin", "Solder. The joint in the electronics, and a metal with a long history of being stopped at a border.", True),
    ("TITANIUM MINERAL CONCENTRATES", "Mine production: Ilmenite", "Titanium", "Ti", "titanium", "Aerospace metal, and white paint. The mine is ilmenite and rutile. The sponge is a later plant.", True),
    ("TUNGSTEN", "Mine production", "Tungsten", "W", "tungsten", "Carbide tools. China is the mine and the habit.", True),
    ("URANIUM", "NONE", "Uranium", "U", "uranium", "Nuclear fuel. Back on the critical list in 2025. The nonfuel summaries I am reading do not print a 2025 mine table, and I will not invent the tonne.", False),
    ("VANADIUM", "Mine production", "Vanadium", "V", "vanadium", "High-strength steel, and a redox battery that is still mostly a promise.", True),
    ("RARE EARTHS", "BASKET", "Ytterbium", "Yb", "ytterbium", "Fiber lasers. A rare earth the Survey does not mine on its own line.", True),
    ("YTTRIUM", "NONE", "Yttrium", "Y", "yttrium", "Phosphors and ceramics. The Survey prints a range for yttrium oxide inside rare-earth concentrates, not a country list.", False),
    ("ZINC", "Mine production", "Zinc", "Zn", "zinc", "Galvanizing. The quiet metal that keeps steel from rusting, and the host for indium and germanium.", True),
    ("ZIRCONIUM AND HAFNIUM", "Zirconium mineral", "Zirconium", "Zr", "zirconium", "Foundry sand, ceramics, and nuclear cladding. Hafnium comes out of the same mineral.", True),
]

ALIASES = {
    "Congo (Kinshasa)": ("Democratic Republic of the Congo", "drc", "CD"),
    "Congo (Brazzaville)": ("Republic of the Congo", "congo", "CG"),
    "Korea, Republic of": ("South Korea", "south-korea", "KR"),
    "Korea, North": ("North Korea", "north-korea", "KP"),
    "United States": ("United States", "united-states", "US"),
    "United Kingdom": ("United Kingdom", "united-kingdom", "GB"),
    "South Africa": ("South Africa", "south-africa", "ZA"),
    "Sri Lanka": ("Sri Lanka", "sri-lanka", "LK"),
    "New Caledonia": ("New Caledonia", "new-caledonia", "NC"),
    "Papua New Guinea": ("Papua New Guinea", "papua-new-guinea", "PG"),
    "Saudi Arabia": ("Saudi Arabia", "saudi-arabia", "SA"),
    "Burma": ("Myanmar", "myanmar", "MM"),
    "Czechia": ("Czechia", "czechia", "CZ"),
    "Turkey": ("Turkey", "turkey", "TR"),
    "Vietnam": ("Vietnam", "vietnam", "VN"),
    "Laos": ("Laos", "laos", "LA"),
}

EXTRAS = {
    "china": "China is also the separator. Rare earths, graphite, tungsten, gallium, germanium: the mine share understates the leverage, because the plant is here even when the pit is not.",
    "drc": "Cobalt is the line the world means. A great deal of it is dug by hand before it is ever a cathode. A national tonne is not a clean bag.",
    "united-states": "The United States mines some of these metals and imports most of the rest. A domestic pit is not self-sufficiency.",
    "canada": "Nickel, potash, and the platinum-group metals are the serious lines. A polite jurisdiction is not a short permit.",
    "russia": "Palladium and nickel are the lines that move a market. A sanction does not delete a tonne. It changes who will sign for it.",
}


def parse_num(raw: str):
    s = (raw or "").strip().replace(",", "")
    if s in ("", "NA", "W", "XX", "—", "-", "*"):
        return None
    if s.startswith((">", "<")) or " - " in (raw or ""):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def tonnes_phrase(t: float) -> str:
    if t >= 1_000_000:
        v = t / 1_000_000
        if abs(v - round(v)) < 0.05:
            return f"{round(v):.0f} million tonnes"
        return f"{v:.1f} million tonnes"
    if t >= 100:
        return f"{t:,.0f} tonnes"
    if abs(t - round(t)) < 0.05:
        return f"{round(t):.0f} tonnes"
    return f"{t:.1f} tonnes"


def pretty(n: float, unit: str) -> str:
    u = unit.lower()
    if "thousand" in u:
        return tonnes_phrase(n * 1000)
    if u.startswith("kilogram"):
        if n >= 1000:
            return tonnes_phrase(n / 1000)
        return f"{n:,.0f} kilograms"
    return tonnes_phrase(n)


def short_stat(n: float, unit: str) -> str:
    u = unit.lower()
    if "thousand" in u:
        t = n * 1000
    elif u.startswith("kilogram"):
        t = n / 1000
    else:
        t = n
    if t >= 1_000_000:
        v = t / 1_000_000
        text = f"{v:.0f} Mt" if abs(v - round(v)) < 0.05 else f"{v:.1f} Mt"
        return text
    if t >= 100:
        return f"{t/1000:.1f} kt" if t >= 10_000 else f"{t:,.0f} t"
    return f"{t:.0f} t"


def load():
    rows = list(csv.reader(CSV.open(encoding="cp1252")))[1:]
    return rows


def series_for(rows, chapter, detail_sub):
    """Return (world_num, world_unit, [(country, num, unit)])."""
    if detail_sub in ("NONE", "BASKET", "HAFNIUM", "IRIDIUM", "RHODIUM", "RUTHENIUM"):
        return None, None, []
    countries = []
    world = None
    unit = None
    for r in rows:
        if r[0] != chapter or r[7] != "2025":
            continue
        if "World" not in r[1] and "world" not in r[1].lower():
            continue
        if detail_sub not in r[5]:
            continue
        if "rounded" in r[5].lower() or r[5].lower().endswith("rounded"):
            if r[3].lower().startswith("world"):
                n = parse_num(r[8])
                if n is not None:
                    world, unit = n, r[6]
            continue
        if r[3].lower().startswith("world") or r[3].lower().startswith("other"):
            continue
        n = parse_num(r[8])
        if n is None or n <= 0:
            continue
        countries.append((r[3], n, r[6]))
        unit = r[6]
    # boron and similar: several detail strings. If detail is prefix, we may have mixed forms.
    if detail_sub == "Production—":
        # keep the single largest form per country, prefer refined/all if present — already filtered by substring
        # collapse to max per country
        best = {}
        for name, n, u in countries:
            if name not in best or n > best[name][0]:
                best[name] = (n, u)
        countries = [(k, v[0], v[1]) for k, v in best.items()]
    countries.sort(key=lambda x: -x[1])
    if world is None and countries:
        world = sum(n for _, n, _ in countries)
        unit = countries[0][2]
    return world, unit, countries


def slug_of(name: str):
    if name in ALIASES:
        return ALIASES[name]
    slug = name.lower().replace(" ", "-").replace(",", "")
    code = "".join(w[0] for w in name.split() if w[0].isalpha())[:3].upper() or "XX"
    return name, slug, code


def js(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def episode_ts(ep: dict) -> str:
    stats = ",\n".join(
        f'      {{ label: {js(a)}, value: {js(b)} }}' for a, b in ep["stats"]
    )
    commodities = ", ".join(js(c) for c in ep["commodities"])
    regions = ", ".join(js(c) for c in ep["regions"])
    p = ep["project"]
    ticker = f'\n      ticker: {js(p["ticker"])},' if p.get("ticker") else ""
    capital = f'\n      capital: {js(p["capital"])},' if p.get("capital") else ""
    transcript = ",\n".join(
        f'    {{ heading: {js(h)}, body: {js(b)} }}' for h, b in ep["transcript"]
    )
    symbol = f"\n    symbol: {js(ep['symbol'])}," if ep.get("symbol") else ""
    return f"""  {{
    id: {js(ep["id"])},
    number: {js(ep["number"])},
    country: {js(ep["country"])},{symbol}
    kind: {js(ep["kind"])},
    title: {js(ep["title"])},
    kicker: {js(ep["kicker"])},
    voice: "Leo",
    voiceNote: "English gentleman · unhurried British delivery",
    src: {js(ep["src"])},
    lede: {js(ep["lede"])},
    disclaimer: {js(ep["disclaimer"])},
    regionLabel: {js(ep["regionLabel"])},
    regionAll: {js(ep["regionAll"])},
    emptyHint: {js(ep["emptyHint"])},
    stats: [
{stats}
    ],
    transcript: [
{transcript}
    ],
    commodities: [{commodities}],
    regions: [{regions}],
    projects: [
    {{
      id: {js(p["id"])},
      name: {js(p["name"])},
      company: {js(p["company"])},{ticker}
      state: {js(p["state"])},
      place: {js(p["place"])},
      commodities: [{", ".join(js(c) for c in p["commodities"])}],
      stage: "Operating",{capital}
      heard: true,
      stillOpen: {js(p["stillOpen"])},
      note: {js(p["note"])},
    }},
    ],
    defaultOpen: {js(p["id"])},
  }}"""


DISCLAIMER = (
    "Figures are the U.S. Geological Survey Mineral Commodity Summaries 2026, "
    "estimates for 2025. Where the briefing says the table does not print a number, "
    "it does not. A national total is not a mine. Not a recommendation."
)


def element_script(name, symbol, use, world_phrase, leaders, note):
    if note:
        body = (
            f"Good evening. A special briefing. {name}. Symbol {symbol}. {use} I am Leo. {note} "
            "A place on the critical list is not a pit, and a symbol is not a shipment. "
            "If you are putting money to work, read the table that exists. Not merely a pleasant voice. Open Lode."
        )
        return body
    bits = []
    for i, (country, phrase, share) in enumerate(leaders[:3]):
        rank = ("First", "Then", "Then")[i]
        share_bit = ""
        if share and i == 0:
            share_bit = (
                ", in line with the rounded world total"
                if share >= 98
                else f", about {share:.0f} percent of the world"
            )
        bits.append(f"{rank}, {country}, {phrase}{share_bit}.")
    ladder = " ".join(bits) if bits else "The table names no country I can rank."
    return (
        f"Good evening. A special briefing. {name}. Symbol {symbol}. {use} I am Leo. "
        f"The Survey's 2025 line puts the world at {world_phrase}. {ladder} "
        "That is a national total, not a pit with a gate. If the separator sits in a different country from the mine, the mine is not the industry. "
        "Ask whether the number is a mine or a smelter. Ask who separates the metal. And do not pay a rank as if it were a project. Open Lode."
    )


def build(rows):
    # rare earth basket leaders
    re_world, re_unit, re_countries = series_for(rows, "RARE EARTHS", "Mine production")
    re_phrase = pretty(re_world, re_unit) if re_world else "a total the table rounds elsewhere"
    re_leaders = []
    for c, n, u in re_countries[:3]:
        share = (n / re_world * 100) if re_world else None
        re_leaders.append((slug_of(c)[0], pretty(n, u), share))
    china_share = None
    for c, n, u in re_countries:
        if c == "China" and re_world:
            china_share = n / re_world * 100

    episodes = []
    # element specials except Re and Ta which already exist as long briefings
    for chapter, detail, name, symbol, slug, use, _mine in ELEMENTS:
        if slug in ("rhenium", "tantalum"):
            continue
        leaders = []
        world_phrase = None
        stat_world = "—"
        stat_leader = "—"
        note = None
        if detail == "BASKET":
            world_phrase = re_phrase
            leaders = re_leaders
            stat_world = short_stat(re_world, re_unit) if re_world else "—"
            if re_countries:
                stat_leader = slug_of(re_countries[0][0])[0].split()[-1]
            note = None
            # rewrite use to include basket fact inside the normal script via leaders
            # but preface that there is no separate mine
            use = (
                use
                + " The Survey does not print a separate mine for it. "
                + f"It sits in the rare-earth total, {re_phrase}."
                + (f" China is about {china_share:.0f} percent of that line." if china_share else "")
            )
        elif detail in ("NONE", "HAFNIUM", "IRIDIUM", "RHODIUM", "RUTHENIUM"):
            if detail == "HAFNIUM":
                zw, zu, zc = series_for(rows, "ZIRCONIUM AND HAFNIUM", "Zirconium mineral")
                if zw:
                    note = (
                        f"Hafnium is taken out of zircon. The Survey's 2025 zircon line is {pretty(zw, zu)}. "
                        f"The leading miner on that line is {slug_of(zc[0][0])[0]}, {pretty(zc[0][1], zc[0][2])}. "
                        "There is no hafnium mine in the table."
                    )
                    stat_world = short_stat(zw, zu)
                    stat_leader = "With Zr"
            elif detail == "IRIDIUM" or detail == "RHODIUM" or detail == "RUTHENIUM":
                pw, pu, pc = series_for(rows, "PLATINUM-GROUP METALS", "Mine production: Platinum")
                if pw:
                    note = (
                        f"The Survey prints platinum, {pretty(pw, pu)}, and does not print a separate {name.lower()} mine. "
                        f"{slug_of(pc[0][0])[0]} leads the platinum line, {pretty(pc[0][1], pc[0][2])}. "
                        f"{name} comes out of those same ores, in grams, not in a pit of its own."
                    )
                    stat_world = "In PGM"
                    stat_leader = slug_of(pc[0][0])[0].split()[-1]
            elif slug == "scandium":
                note = (
                    "The Survey puts world scandium production at about 80 tonnes of oxide, and capacity at about 90. "
                    "It does not name the country pit. Eighty tonnes is a small room, not an industry you can tour."
                )
                stat_world = "80 t"
                stat_leader = "Unnamed"
            elif slug == "yttrium":
                note = (
                    "The Survey prints yttrium as a range, about 10,000 to 15,000 tonnes of oxide inside rare-earth concentrates. "
                    "It does not give a country list. Yttrium is a line in someone else's concentrate."
                )
                stat_world = "10–15 kt"
                stat_leader = "In REE"
            elif slug == "uranium":
                note = (
                    "Symbol U. Nuclear fuel, restored to the critical list in 2025. "
                    "The nonfuel summaries do not print a 2025 uranium mine table. "
                    "Kazakhstan has been the mine that matters for many years. I will not invent this year's tonne."
                )
                stat_world = "Not here"
                stat_leader = "—"
            elif slug == "metallurgical-coal":
                note = (
                    "Metallurgical coal is on the 2025 critical list because steel needs coke. "
                    "It is not an element. Graphite is also carbon, and it is a different rock, with a different mine. "
                    "I will not pretend a coal statistic from another agency is this Survey's mine line."
                )
                stat_world = "Not ore"
                stat_leader = "Coke"
            elif slug == "cesium":
                note = (
                    "Cesium is the metal in an atomic clock. "
                    "The Survey does not print a country mine table. "
                    "It names Australia, Canada, China, and Namibia as the places people estimate, and then it stops. I will stop with it."
                )
                stat_world = "No table"
                stat_leader = "—"
            elif slug == "rubidium":
                note = (
                    "Rubidium is the quieter twin of cesium. "
                    "The same sentence in the Survey: Australia, Canada, China, and Namibia, and no clean mine table. "
                    "A research metal is not a shipment."
                )
                stat_world = "No table"
                stat_leader = "—"
            elif slug == "germanium":
                note = (
                    "Germanium goes into fiber and into infrared optics. It is won, when it is won, as a by-product of zinc. "
                    "This extract of the 2025 tables does not print a country mine line. "
                    "I will not supply the percentage the folklore wants."
                )
                stat_world = "No table"
                stat_leader = "Zn byproduct"
            else:
                note = f"The Survey does not print a 2025 country mine table for {name}. I will not invent one."
        else:
            world, unit, countries = series_for(rows, chapter, detail)
            if world and unit:
                world_phrase = pretty(world, unit)
                stat_world = short_stat(world, unit)
            else:
                world_phrase = "a figure the table does not round cleanly"
            for c, n, u in countries[:3]:
                share = (n / world * 100) if world else None
                leaders.append((slug_of(c)[0], pretty(n, u), share))
            if countries:
                stat_leader = slug_of(countries[0][0])[0]
                if len(stat_leader) > 12:
                    stat_leader = stat_leader.split()[-1]

        if detail == "BASKET":
            # leaders already set; world_phrase set
            script = element_script(name, symbol, use, world_phrase, leaders, None)
        elif note and detail in ("NONE", "HAFNIUM", "IRIDIUM", "RHODIUM", "RUTHENIUM"):
            script = element_script(name, symbol, use, None, [], note)
        else:
            script = element_script(name, symbol, use, world_phrase or "an unpublished total", leaders, None)

        display_country = name
        episodes.append(
            {
                "id": slug,
                "number": symbol,
                "country": display_country,
                "symbol": symbol,
                "kind": "element",
                "title": name,
                "kicker": f"September 2026 · Special · {symbol}",
                "src": f"/podcast/episodes/{slug}/briefing.mp3",
                "lede": f"{name} ({symbol}). {use.split('.')[0]}.",
                "disclaimer": DISCLAIMER,
                "regionLabel": "Country",
                "regionAll": "countries",
                "emptyHint": f"Nothing matches. Try {name}.",
                "stats": [
                    ("World", stat_world),
                    ("First", stat_leader[:18]),
                    ("Symbol", symbol),
                ],
                "transcript": [("The brief", script)],
                "commodities": [name],
                "regions": ["XX"],
                "script": script,
                "project": {
                    "id": f"{slug}-line",
                    "name": "The Survey line",
                    "company": "Mineral Commodity Summaries 2026",
                    "state": "XX",
                    "place": "2025 estimate",
                    "commodities": [name],
                    "capital": stat_world,
                    "stillOpen": "A named pit, which this total is not",
                    "note": script,
                },
            }
        )

    # countries
    mine_details = [
        ("ANTIMONY", "Mine production", "antimony"),
        ("BARITE", "Mine production", "barite"),
        ("BAUXITE AND ALUMINA", "Bauxite, mine production", "bauxite"),
        ("BERYLLIUM", "Mine production", "beryllium"),
        ("CHROMIUM", "Mine production", "chromium"),
        ("COBALT", "Mine production", "cobalt"),
        ("COPPER", "Mine production", "copper"),
        ("FLUORSPAR", "Mine production", "fluorspar"),
        ("GRAPHITE (NATURAL)", "Mine production", "graphite"),
        ("LEAD", "Mine production", "lead"),
        ("LITHIUM", "Mine production", "lithium"),
        ("MANGANESE", "Mine production", "manganese"),
        ("NICKEL", "Mine production", "nickel"),
        ("NIOBIUM (COLUMBIUM)", "Mine production", "niobium"),
        ("PHOSPHATE ROCK", "Mine production", "phosphate"),
        ("PLATINUM-GROUP METALS", "Mine production: Platinum", "platinum"),
        ("PLATINUM-GROUP METALS", "Mine production: Palladium", "palladium"),
        ("POTASH", "Mine production", "potash"),
        ("RARE EARTHS", "Mine production", "rare earths"),
        ("RHENIUM", "Mine production", "rhenium"),
        ("SILVER", "Mine production", "silver"),
        ("TANTALUM", "Mine production", "tantalum"),
        ("TIN", "Mine production", "tin"),
        ("TITANIUM MINERAL CONCENTRATES", "Mine production: Ilmenite", "ilmenite"),
        ("TUNGSTEN", "Mine production", "tungsten"),
        ("VANADIUM", "Mine production", "vanadium"),
        ("ZINC", "Mine production", "zinc"),
        ("ZIRCONIUM AND HAFNIUM", "Zirconium mineral", "zircon"),
    ]
    by_country = defaultdict(list)
    for chapter, detail, label in mine_details:
        world, unit, countries = series_for(rows, chapter, detail)
        if not world:
            continue
        for c, n, u in countries:
            share = n / world * 100
            if share < 2:
                continue
            by_country[c].append((share, label, pretty(n, u), share))

    country_eps = []
    for raw, items in sorted(by_country.items(), key=lambda kv: slug_of(kv[0])[0]):
        display, slug, code = slug_of(raw)
        if slug in SKIP_COUNTRY:
            continue
        items.sort(key=lambda x: -x[0])
        # unique minerals, keep best share
        seen = set()
        lines = []
        for share, label, phrase, sh in items:
            if label in seen:
                continue
            seen.add(label)
            lines.append((label, phrase, sh))
            if len(lines) == 4:
                break
        if not lines:
            continue
        spoken = " ".join(
            f"{label.capitalize()}, {phrase}, about {sh:.0f} percent of that mine line."
            for label, phrase, sh in lines
        )
        extra = EXTRAS.get(slug, "")
        script = (
            f"Good evening. {display}. A short country briefing, held to the Survey's 2025 mine tables. "
            f"The longer books, where I have already recorded them, are still on the shelf. I am Leo. "
            f"On those tables, {display} is a named producer of {', '.join(l for l,_,_ in lines)}. {spoken} "
            f"{extra} "
            "A line in a national table is not a concession, and it is not a permit. "
            "If you are putting money to work, read the project. Not merely the country's rank. Open Lode."
        )
        top_label, top_phrase, top_share = lines[0]
        country_eps.append(
            {
                "id": slug,
                "number": code,
                "country": display,
                "symbol": "",
                "kind": "country",
                "title": "The table",
                "kicker": "September 2026 · Survey line",
                "src": f"/podcast/episodes/{slug}/briefing.mp3",
                "lede": f"{display}, on the Survey's 2025 mine tables. The largest line here is {top_label}.",
                "disclaimer": DISCLAIMER,
                "regionLabel": "Line",
                "regionAll": "lines",
                "emptyHint": f"Nothing matches. Try {top_label}.",
                "stats": [
                    ("Lines", str(len(lines))),
                    ("Largest", top_label[:16]),
                    ("Share", f"{top_share:.0f}%"),
                ],
                "transcript": [("The brief", script)],
                "commodities": [label.capitalize() for label, _, _ in lines],
                "regions": [code],
                "script": script,
                "project": {
                    "id": f"{slug}-table",
                    "name": top_label.capitalize(),
                    "company": "Mineral Commodity Summaries 2026",
                    "state": code,
                    "place": display,
                    "commodities": [label.capitalize() for label, _, _ in lines],
                    "capital": top_phrase,
                    "stillOpen": "The concession, which a national total is not",
                    "note": script,
                },
            }
        )
    country_eps.sort(key=lambda e: e["country"])
    return episodes, country_eps


def speak(ep):
    dest = OUT / ep["id"] / "briefing.mp3"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000 and dest.read_bytes()[:1] == b"\xff":
        return ep["id"], "skip", dest.stat().st_size
    payload = {
        "text": ep["script"],
        "voice_id": "leo",
        "language": "en-GB",
        "speed": 0.92,
        "text_normalization": True,
        "output_format": {"codec": "mp3", "sample_rate": 44100, "bit_rate": 128000},
    }
    req = urllib.request.Request(
        "https://api.x.ai/v1/tts",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {os.environ['XAI_API_KEY']}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    last = None
    for _ in range(3):
        try:
            with urllib.request.urlopen(req, timeout=180) as res:
                body = res.read()
            if body[:1] != b"\xff":
                raise RuntimeError(f"bad audio {body[:20]!r}")
            dest.write_bytes(body)
            return ep["id"], "ok", len(body)
        except Exception as exc:  # noqa: BLE001
            last = exc
    return ep["id"], f"fail {last}", 0


def main():
    rows = load()
    elements, countries = build(rows)
    print(f"elements {len(elements)} countries {len(countries)}")
    for ep in countries:
        print(" C", ep["country"], ep["stats"])
    jobs = elements + countries
    results = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = [pool.submit(speak, ep) for ep in jobs]
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            print("AUDIO", rec, flush=True)
    failed = [r for r in results if r[1].startswith("fail")]
    print("failed", len(failed))
    parts = [episode_ts(ep) for ep in countries + elements]
    SHELF.write_text(
        "import type { Episode } from \"./briefing\";\n\n"
        "export const SHELF: Episode[] = [\n" + ",\n".join(parts) + "\n];\n",
        encoding="utf-8",
    )
    print("wrote", SHELF, "failures", failed)


if __name__ == "__main__":
    main()
