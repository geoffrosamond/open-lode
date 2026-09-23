export type Stage =
  | "FID taken"
  | "Decision pending"
  | "DFS"
  | "PFS"
  | "Operating"
  | "Study reshaped"
  | "Exploration";

export type Project = {
  id: string;
  name: string;
  company: string;
  ticker?: string;
  state: string;
  place: string;
  commodities: string[];
  stage: Stage;
  capital?: string;
  heard: boolean;
  stillOpen: string;
  note: string;
};

export const EPISODE = {
  title: "The open book",
  kicker: "September 2026 · Episode 01",
  voice: "Leo",
  voiceNote: "English gentleman · unhurried British delivery",
  src: "/podcast/open-lode-briefing.mp3",
};

export const TRANSCRIPT: { heading: string; body: string }[] = [
  {
    heading: "The brief",
    body: "Good evening. You are listening to Open Lode: a short briefing on Australia’s critical minerals projects that remain, in the plain sense of the word, open. Advanced enough to be taken seriously, and still looking for capital, offtake, or the next pour of concrete. I am Leo. I shall keep this to the projects a careful reader would actually circle in the prospectus.",
  },
  {
    heading: "The shape of the book",
    body: "The Commonwealth’s 2025 Resources and Energy Major Projects report counted 130 critical minerals projects, eleven more than the year before. Most of that pipeline is still early. Later-stage value sits mainly in rare earths, about six billion Australian dollars, and in nickel and cobalt, about 5.9. Between mid-2022 and early 2026, final investment decisions were scarce: six in four years, and a long drought in the middle. The projects moving now are the exception, not the rule.",
  },
  {
    heading: "Nolans",
    body: "Nolans, in the Northern Territory, is Arafura Rare Earths’ flagship. Capital is in the order of 1.8 billion dollars. The company has assembled more than 1.3 billion in funding, including substantial Commonwealth support, and the project sits inside the Australia–United States critical minerals framework. By late summer 2026 it was being reported among the few projects actually to reach a final investment decision. If you remember one rare earths name, let it be Nolans: neodymium and praseodymium for permanent magnets.",
  },
  {
    heading: "Donald",
    body: "Donald, in the Wimmera of Victoria, is mineral sands with a rare earths concentrate. Astron holds 51 percent; Energy Fuels of the United States holds the rest. Phase one is described as shovel-ready: roughly 7,100 tonnes of rare earth concentrate a year, and nearly 200,000 tonnes of heavy mineral concentrate. Development cost has been put near 450 million dollars, with a 220 million dollar lending package being assembled. Management has been aiming for a decision before this quarter is out, and construction before the year’s end. Treat that as a company timetable, not a fact already in the bank.",
  },
  {
    heading: "The West",
    body: "Ardea’s Kalgoorlie Nickel Project, the Goongarrie Hub, is the largest nickel-cobalt resource in the country. Under the bilateral framework, Export Finance Australia and the United States Export-Import Bank have each issued letters of support or interest of up to 500 million dollars. A letter is not a cheque. It is, however, a rather loud nod. Northern Minerals at Browns Range is the heavy rare earths story — dysprosium and terbium. A definitive feasibility study landed in September 2025. Alliance Nickel’s NiWest delivered its own study in November 2024. A finished study is not the same thing as a financed mine.",
  },
  {
    heading: "Pencil marks",
    body: "Austrade’s February 2026 prospectus profiles 78 projects across 60 companies: 49 mines and 29 midstream plants. Among the names Canberra and Washington have both circled: Alcoa’s gallium recovery; Graphinex at Esmeralda; RZ Resources at Copi; VHM’s Goschen; La Trobe Magnesium; EQ Resources at Mount Carbine; and Global Advanced Metals. Develop Global has taken Yitirrti copper, formerly Sulphur Springs, and Pioneer Dome lithium through to a final investment decision. Caravel is closing a definitive study on about 1.4 million tonnes of contained copper. Cobalt Blue’s Broken Hill project holds Major Project Status, with the study reshaped while the cobalt price sulks.",
  },
  {
    heading: "Three habits",
    body: "Read the stage, not the adjective. Separate magnet rare earths from the rest of the periodic table. And remember that midstream — the separation, the sulphate, the carbonate — is where Australia has historically waved the ore goodbye. Twenty-nine midstream projects is a more interesting number than another discovery hole. Figures move. If you are putting money to work, read the primary documents, not merely a pleasant voice on an afternoon.",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "nolans",
    name: "Nolans",
    company: "Arafura Rare Earths",
    ticker: "ASX:ARU",
    state: "NT",
    place: "Near Aileron, Northern Territory",
    commodities: ["Rare earths"],
    stage: "FID taken",
    capital: "A$1.8bn",
    heard: true,
    stillOpen: "Construction, offtake discipline, and execution",
    note: "NdPr for permanent magnets. More than A$1.3 billion of funding assembled, including Commonwealth support, and named in the Australia–US framework. Reported among the few FIDs of 2022–2026.",
  },
  {
    id: "donald",
    name: "Donald",
    company: "Astron & Energy Fuels",
    ticker: "ASX:ATR",
    state: "VIC",
    place: "Wimmera, Victoria",
    commodities: ["Rare earths", "Mineral sands"],
    stage: "Decision pending",
    capital: "~A$450m",
    heard: true,
    stillOpen: "FID and a lending package",
    note: "Phase one is described as shovel-ready: about 7,100 t of rare earth concentrate and 192,000 t of heavy mineral concentrate a year. Astron 51%, Energy Fuels 49%. A A$220 million lending package has been the target, with Export Finance Australia in the conversation.",
  },
  {
    id: "goongarrie",
    name: "Kalgoorlie Nickel · Goongarrie Hub",
    company: "Ardea Resources",
    ticker: "ASX:ARL",
    state: "WA",
    place: "North of Kalgoorlie, Western Australia",
    commodities: ["Nickel", "Cobalt"],
    stage: "PFS",
    capital: "Letters to A$500m",
    heard: true,
    stillOpen: "DFS, partners, and turning letters into debt",
    note: "Largest nickel-cobalt resource in Australia. The 2023 Goongarrie Hub PFS is still the study people quote. EFA and US EXIM have each issued letters of support or interest of up to $500 million. Letters are not cheques.",
  },
  {
    id: "browns-range",
    name: "Browns Range",
    company: "Northern Minerals",
    ticker: "ASX:NTU",
    state: "WA",
    place: "East Kimberley, Western Australia",
    commodities: ["Rare earths"],
    stage: "DFS",
    heard: true,
    stillOpen: "Finance and heavy-rare-earth offtake",
    note: "Dysprosium and terbium — the heavy rare earths magnet makers actually worry about. Definitive feasibility study delivered September 2025. Named under the Australia–US framework.",
  },
  {
    id: "niwest",
    name: "NiWest",
    company: "Alliance Nickel",
    ticker: "ASX:AXN",
    state: "WA",
    place: "North-eastern Goldfields, Western Australia",
    commodities: ["Nickel", "Cobalt"],
    stage: "DFS",
    heard: true,
    stillOpen: "A price, and a financier, that can live with the study",
    note: "Definitive feasibility study in November 2024. A finished study is not a financed mine. Nickel has not been kind.",
  },
  {
    id: "yitirrti",
    name: "Yitirrti",
    company: "Develop Global",
    ticker: "ASX:DVP",
    state: "WA",
    place: "Pilbara, Western Australia",
    commodities: ["Copper"],
    stage: "FID taken",
    heard: true,
    stillOpen: "Build-out of the former Sulphur Springs ground",
    note: "Copper project formerly known as Sulphur Springs. Reported to have reached FID alongside Pioneer Dome.",
  },
  {
    id: "pioneer-dome",
    name: "Pioneer Dome",
    company: "Develop Global",
    ticker: "ASX:DVP",
    state: "WA",
    place: "Eastern Goldfields, Western Australia",
    commodities: ["Lithium"],
    stage: "FID taken",
    heard: true,
    stillOpen: "Construction through a softer lithium tape",
    note: "One of the few lithium projects reported to have cleared FID in the long drought after 2022.",
  },
  {
    id: "caravel",
    name: "Caravel",
    company: "Caravel Minerals",
    ticker: "ASX:CVV",
    state: "WA",
    place: "North of Perth, Western Australia",
    commodities: ["Copper"],
    stage: "DFS",
    heard: true,
    stillOpen: "The definitive study, then the financing question",
    note: "Open pit on the order of 597 million tonnes at 0.24% copper, about 1.42 million tonnes contained. Large, low grade, and a financing question.",
  },
  {
    id: "broken-hill",
    name: "Broken Hill Cobalt",
    company: "Cobalt Blue",
    ticker: "ASX:COB",
    state: "NSW",
    place: "Broken Hill, New South Wales",
    commodities: ["Cobalt"],
    stage: "Study reshaped",
    heard: true,
    stillOpen: "A tighter project the cobalt price can support",
    note: "Holds Major Project Status. Ambition is battery-grade cobalt sulphate, plus elemental sulphur for fertiliser. Completion of the DFS was paused in a weak price environment and the scope has been under review.",
  },
  {
    id: "esmeralda",
    name: "Esmeralda",
    company: "Graphinex",
    state: "QLD",
    place: "Queensland",
    commodities: ["Graphite"],
    stage: "Decision pending",
    heard: true,
    stillOpen: "Offtake and project finance",
    note: "Named among projects supported under the Australia–US critical minerals framework. Australia still has no operating graphite mine.",
  },
  {
    id: "copi",
    name: "Copi",
    company: "RZ Resources",
    state: "NSW",
    place: "New South Wales",
    commodities: ["Rare earths", "Mineral sands"],
    stage: "Decision pending",
    heard: true,
    stillOpen: "Development capital",
    note: "Mineral sands and rare earths, circled in the bilateral framework alongside the Victorian sands projects.",
  },
  {
    id: "goschen",
    name: "Goschen",
    company: "VHM",
    ticker: "ASX:VHM",
    state: "VIC",
    place: "Near Swan Hill, Victoria",
    commodities: ["Rare earths", "Mineral sands"],
    stage: "Decision pending",
    heard: true,
    stillOpen: "Finance to move a permitted-style sands project",
    note: "Rare earths and mineral sands in north-west Victoria. Listed in the Australia–US framework and in Austrade’s prospectus.",
  },
  {
    id: "gallium",
    name: "Gallium recovery",
    company: "Alcoa",
    state: "WA",
    place: "Western Australia alumina circuit",
    commodities: ["Gallium"],
    stage: "Operating",
    heard: true,
    stillOpen: "Recovery circuit, not a new mine",
    note: "Gallium from an existing alumina business rather than a greenfield pit. Named in the bilateral framework. Midstream, which is the more interesting half of this story.",
  },
  {
    id: "latrobe",
    name: "La Trobe Magnesium",
    company: "La Trobe Magnesium",
    ticker: "ASX:LTM",
    state: "VIC",
    place: "Victoria",
    commodities: ["Magnesium"],
    stage: "Operating",
    heard: true,
    stillOpen: "Scale-up of metal from waste",
    note: "Magnesium from fly ash and similar residues. Framework support. A processing story, not another hole in the ground.",
  },
  {
    id: "mt-carbine",
    name: "Mount Carbine",
    company: "EQ Resources",
    ticker: "ASX:EQR",
    state: "QLD",
    place: "Far north Queensland",
    commodities: ["Tungsten"],
    stage: "Operating",
    heard: true,
    stillOpen: "Expansion and offtake depth",
    note: "A producing tungsten mine, rare outside China, with framework attention on keeping the circuit growing.",
  },
  {
    id: "gam",
    name: "Global Advanced Metals",
    company: "Global Advanced Metals",
    state: "WA",
    place: "Western Australia",
    commodities: ["Tantalum"],
    stage: "Operating",
    heard: true,
    stillOpen: "Secure tantalum units for capacitors and alloys",
    note: "Named in the Australia–US framework. Tantalum is a small market with outsized importance in electronics.",
  },
  {
    id: "dubbo",
    name: "Dubbo",
    company: "Australian Strategic Materials",
    ticker: "ASX:ASM",
    state: "NSW",
    place: "Toongi, near Dubbo, New South Wales",
    commodities: ["Rare earths", "Zirconium", "Hafnium"],
    stage: "Decision pending",
    heard: false,
    stillOpen: "Offtake and the capital to build separation",
    note: "Long-studied polymetallic project: rare earths plus zirconium, hafnium and niobium. In the Austrade prospectus. The interesting part is refining, not the pit.",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    company: "Sunrise Energy Metals",
    ticker: "ASX:SRL",
    state: "NSW",
    place: "Fifield district, New South Wales",
    commodities: ["Nickel", "Cobalt", "Scandium"],
    stage: "Decision pending",
    heard: false,
    stillOpen: "A development decision the nickel tape will allow",
    note: "Battery-materials complex with scandium alongside nickel and cobalt. Permitting is the lesser problem; the nickel price is the greater one.",
  },
  {
    id: "hillgrove",
    name: "Hillgrove",
    company: "Larvotto Resources",
    ticker: "ASX:LRV",
    state: "NSW",
    place: "New England, New South Wales",
    commodities: ["Antimony", "Gold"],
    stage: "Decision pending",
    heard: false,
    stillOpen: "Restart capital for a historic antimony mine",
    note: "Antimony with a gold credit. Antimony supply is concentrated, which is why this restart keeps appearing in serious lists. Confirm the latest funding notices before treating it as financed.",
  },
  {
    id: "kalkaroo",
    name: "Kalkaroo",
    company: "Havilah Resources",
    ticker: "ASX:HAV",
    state: "SA",
    place: "North-east of the Barrier Highway, South Australia",
    commodities: ["Copper", "Gold", "Cobalt"],
    stage: "PFS",
    heard: false,
    stillOpen: "A partner and a definitive study",
    note: "Copper-gold with a cobalt credit, long present in the critical minerals prospectus. Still a study-and-partner project, not a build.",
  },
];

export const COMMODITIES = [
  "Rare earths",
  "Nickel",
  "Cobalt",
  "Copper",
  "Lithium",
  "Graphite",
  "Tungsten",
  "Gallium",
  "Magnesium",
  "Tantalum",
  "Antimony",
  "Mineral sands",
] as const;

export const STATES = ["WA", "NT", "QLD", "NSW", "VIC", "SA"] as const;

export type Episode = {
  id: string;
  number: string;
  country: string;
  title: string;
  kicker: string;
  voice: string;
  voiceNote: string;
  src: string;
  lede: string;
  disclaimer: string;
  regionLabel: string;
  emptyHint: string;
  stats: { label: string; value: string }[];
  transcript: { heading: string; body: string }[];
  commodities: readonly string[];
  regions: readonly string[];
  projects: Project[];
  defaultOpen: string;
};

const SRI_TRANSCRIPT: Episode["transcript"] = [
  {
    heading: "The brief",
    body: "Good evening. This is Open Lode, episode two. Last time we stayed in Australia. Tonight the book moves to Sri Lanka, and to the mineral the island actually has a right to be proud of: vein graphite. I am Leo.",
  },
  {
    heading: "Vein, not flake",
    body: "Sri Lanka does not produce graphite the way Mozambique or Madagascar do. Those are flake deposits, vast and dressed up in a plant. Sri Lankan graphite sits in veins, often of almost pure carbon, won from underground. Natural purity commonly sits above 90 percent, and the best of it is quoted near 99. The whole country’s output is a few thousand tonnes a year, not hundreds of thousands. Small tonnes. Extraordinary rock. And, inconveniently, most of it still leaves the island as a lump.",
  },
  {
    heading: "Bogala",
    body: "Bogala, in the Kegalle district, is the largest producer: an operating underground mine long tied to the German graphite house Graphit Kropfmühl. If you want a shipment of vein graphite this quarter, Bogala is the name on the bag. The open question is not whether the mine exists. It is whether anyone on the island will turn that carbon into a battery anode, or graphene, before it is sold in bulk.",
  },
  {
    heading: "Kahatagaha",
    body: "Kahatagaha, near Dodangaslanda in the North Western Province, is the deepest graphite mine in the country. About 102 acres, run by the state company Kahatagaha Graphite Lanka. In September 2025 the Cabinet set aside an earlier restructuring and approved a public-private partnership: explore the reserve properly, modernise the underground, process, and add value. Ownership of the graphite stays with the state company, and the jobs already underground are to be kept. In March 2026 the Ministry of Industry invited local and foreign investors to express interest. An invitation is not a partner. The government itself has said the mine has not had the technology to know the reserve at depth. That is the opening.",
  },
  {
    heading: "Pencil marks",
    body: "The Geological Survey has spoken of licences beyond the two old mines, including ground at Meegahakiula in Badulla, and in Vavuniya. A permit to reserve land is a pencil mark. It is not a second Bogala.",
  },
  {
    heading: "The beaches",
    body: "Pulmoddai, on the east coast near Trincomalee, is Lanka Mineral Sands, also a state company. The sand is unusually rich. The plant’s nameplate is on the order of 90,000 tonnes of ilmenite a year, with smaller lines of rutile, zircon, and a thin stream of monazite. Ilmenite and rutile are titanium minerals. Monazite is the rare-earth footnote, and it carries thorium, which is why a careful person does not call Pulmoddai a rare-earth mine. Sales are by government tender. Shipments have often sat well below the nameplate. Beside that beach sits Taprobane, Capital Metals’ project, with Sri Lankan partner Ambeon Capital. Results for the year to March 2026 say the engineering for a final investment decision is largely complete, and that stage-one capital has been cut to US$17.7 million. Approvals are still outstanding. The company talks of nine to twelve months of building once they arrive. Treat that as a calendar, not a fact in the bank.",
  },
  {
    heading: "Three habits",
    body: "What is actually open is a handful of projects, not one hundred and thirty. Ask whether the carbon is vein or flake. Ask what leaves the port: a lump, a concentrate, or a battery material. And ask who owns the ore after the partnership is signed. A few thousand tonnes of the best vein graphite in the world is a speciality. It is not a flood. Read the expression of interest, the company statements, and the tender — not merely a pleasant voice on an evening.",
  },
];

const SRI_PROJECTS: Project[] = [
  {
    id: "kahatagaha",
    name: "Kahatagaha",
    company: "Kahatagaha Graphite Lanka",
    state: "NW",
    place: "Dodangaslanda, North Western Province",
    commodities: ["Graphite"],
    stage: "Decision pending",
    capital: "PPP · state keeps the ore",
    heard: true,
    stillOpen: "A partner for depth, processing, and value-add",
    note: "The deepest graphite mine in the country, about 102 acres, wholly state-owned. Cabinet approved a public-private partnership in September 2025: explore, modernise, process, and add value, while the graphite and existing jobs stay with the state company. The Ministry of Industry called for expressions of interest in March 2026. An invitation is not a signed partner, and the reserve at depth is still poorly known.",
  },
  {
    id: "bogala",
    name: "Bogala",
    company: "Bogala Graphite Lanka",
    state: "SG",
    place: "Kegalle district, Sabaragamuwa",
    commodities: ["Graphite"],
    stage: "Operating",
    heard: true,
    stillOpen: "Offtake, and processing on the island",
    note: "The largest operating vein-graphite mine, long tied to German processor Graphit Kropfmühl. This is the bag you can actually buy. Most Sri Lankan graphite still leaves as lump. The opening is anode, graphene, or expandables — not another discovery headline.",
  },
  {
    id: "pulmoddai",
    name: "Pulmoddai",
    company: "Lanka Mineral Sands",
    state: "EP",
    place: "Near Trincomalee, Eastern Province",
    commodities: ["Ilmenite", "Rutile", "Zircon", "Monazite"],
    stage: "Operating",
    capital: "90kt ilmenite nameplate",
    heard: true,
    stillOpen: "Downstream pigment or metal, not a sale of the beach",
    note: "State mineral-sands mine on unusually rich east-coast sand. Nameplate is on the order of 90,000 tonnes of ilmenite a year, plus rutile, zircon, and a thin monazite stream. Monazite carries rare earths and thorium; this is not a rare-earth mine. Sold by government tender through Trincomalee, mostly as separated minerals. Shipments have often run well below nameplate.",
  },
  {
    id: "taprobane",
    name: "Taprobane",
    company: "Capital Metals",
    ticker: "AIM:CMET",
    state: "EP",
    place: "Eastern Province, beside the Pulmoddai belt",
    commodities: ["Mineral sands", "Ilmenite", "Rutile", "Zircon"],
    stage: "Decision pending",
    capital: "US$17.7m stage one",
    heard: true,
    stillOpen: "Approvals, then a final investment decision",
    note: "Private mineral sands with Sri Lankan partner Ambeon Capital, which invested US$4 million. Results for the year to March 2026, published this September, say FID engineering is largely complete and stage-one capital has been cut from US$20.9 million to US$17.7 million. An environmental impact assessment has been submitted. Construction of nine to twelve months is the company’s timetable after approvals — not a date already banked.",
  },
  {
    id: "meegahakiula",
    name: "Meegahakiula",
    company: "Licensed explorers",
    state: "UV",
    place: "Badulla, Uva Province",
    commodities: ["Graphite"],
    stage: "Exploration",
    heard: true,
    stillOpen: "A resource, not a reserved parcel",
    note: "Named by the Geological Survey among newer graphite ground, beyond Bogala and Kahatagaha. A permit to reserve land is a pencil mark. It is not a second producing mine.",
  },
  {
    id: "vavuniya-graphite",
    name: "Vavuniya graphite",
    company: "Licensed explorers",
    state: "NP",
    place: "Vavuniya, Northern Province",
    commodities: ["Graphite"],
    stage: "Exploration",
    heard: true,
    stillOpen: "Drilling that would turn a licence into a vein",
    note: "Northern ground reported alongside Meegahakiula as a recent graphite discovery area. Treat it as early. Read the licence, not the adjective.",
  },
];

export const EPISODES: Episode[] = [
  {
    id: "australia",
    number: "01",
    country: "Australia",
    title: EPISODE.title,
    kicker: EPISODE.kicker,
    voice: EPISODE.voice,
    voiceNote: EPISODE.voiceNote,
    src: EPISODE.src,
    lede: "Projects that are public, advanced, and still open — for capital, offtake, or a decision. The September briefing is read by Leo, an English gentleman.",
    disclaimer:
      "Figures are compiled from public reports through September 2026 — the major projects list, Austrade’s prospectus, and company statements. Not a recommendation, and not a substitute for the primary documents.",
    regionLabel: "State",
    emptyHint: "Nothing in the book matches that. Clear a filter, or try “Nolans”.",
    stats: [
      { label: "Major projects", value: "130" },
      { label: "In this book", value: String(PROJECTS.length) },
      { label: "Midstream, ’26", value: "29" },
    ],
    transcript: TRANSCRIPT,
    commodities: COMMODITIES,
    regions: STATES,
    projects: PROJECTS,
    defaultOpen: "nolans",
  },
  {
    id: "sri-lanka",
    number: "02",
    country: "Sri Lanka",
    title: "Vein and beach",
    kicker: "September 2026 · Episode 02",
    voice: "Leo",
    voiceNote: "English gentleman · unhurried British delivery",
    src: "/podcast/open-lode-sri-lanka.mp3",
    lede: "Episode two leaves Australia for Sri Lanka: vein graphite that still ships as a lump, and east-coast mineral sands that still ship as a concentrate. Read by Leo.",
    disclaimer:
      "Figures are compiled from public notices through September 2026 — the Kahatagaha expression of interest, company results, and the state miners’ own product notes. Not a recommendation, and not a substitute for the tender or the study.",
    regionLabel: "Province",
    emptyHint: "Nothing in the book matches that. Clear a filter, or try “Kahatagaha”.",
    stats: [
      { label: "Vein output", value: "few kt" },
      { label: "In this book", value: String(SRI_PROJECTS.length) },
      { label: "Ilmenite", value: "90kt" },
    ],
    transcript: SRI_TRANSCRIPT,
    commodities: ["Graphite", "Ilmenite", "Rutile", "Zircon", "Monazite", "Mineral sands"],
    regions: ["NW", "SG", "EP", "UV", "NP"],
    projects: SRI_PROJECTS,
    defaultOpen: "kahatagaha",
  },
];

export const DEFAULT_EPISODE_ID = "sri-lanka";
