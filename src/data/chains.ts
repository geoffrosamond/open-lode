export type ChainHolder = {
  name: string;
  /** Episode id, when this book already has that country. */
  episodeId?: string;
  role: string;
};

export type ChainStep = {
  id: string;
  name: string;
  what: string;
  holders: ChainHolder[];
};

export type Chain = {
  id: string;
  name: string;
  symbol: string;
  /** Short enough for the header stat. */
  use: string;
  /** Where the chain actually narrows. Short, for the header. */
  pinch: string;
  lede: string;
  steps: ChainStep[];
};

export const CHAINS: Chain[] = [
  {
    id: "lithium",
    name: "Lithium",
    symbol: "Li",
    use: "A cell",
    pinch: "The chemical",
    lede: "Australia digs the hard rock. Chile and Argentina pump the brine. The chemical — carbonate and hydroxide — is a different country from the pit, and the cell is a different country again.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "Hard-rock spodumene, or a brine. The Survey’s mine line stops here. It is not a battery.",
        holders: [
          { name: "Australia", episodeId: "australia", role: "Hard rock" },
          { name: "Chile", episodeId: "chile", role: "Brine" },
          { name: "Argentina", episodeId: "argentina", role: "Brine" },
        ],
      },
      {
        id: "chemical",
        name: "Chemical",
        what: "Spodumene leaves Australia to be converted, mostly in China, into carbonate or hydroxide. Chile already makes carbonate beside the brine. This is the pinch.",
        holders: [
          { name: "China", episodeId: "china", role: "Converts the rock" },
          { name: "Chile", episodeId: "chile", role: "Carbonate at the brine" },
        ],
      },
      {
        id: "cathode",
        name: "Cathode",
        what: "The lithium chemical is cooked into a cathode powder, with nickel, cobalt, manganese, or iron. The plant is not the mine.",
        holders: [{ name: "China", episodeId: "china", role: "Most of the powder" }],
      },
      {
        id: "cell",
        name: "Cell",
        what: "A cell is what a carmaker buys. Korea, Japan, China, and a newer book in America and Europe. The mine does not sell one.",
        holders: [
          { name: "China", episodeId: "china", role: "Cells" },
          { name: "South Korea", episodeId: "south-korea", role: "Cells" },
          { name: "Japan", role: "Cells" },
        ],
      },
    ],
  },
  {
    id: "nickel",
    name: "Nickel",
    symbol: "Ni",
    use: "Steel, then a cell",
    pinch: "The intermediate",
    lede: "Indonesia is the mine. The product that leaves is not one thing: pig iron for stainless, or an intermediate a battery plant can take. A tonne in steel is not a tonne in a cathode.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "Laterite in the tropics, and a thinner class of sulphide. The volume is Indonesian.",
        holders: [
          { name: "Indonesia", episodeId: "indonesia", role: "The volume" },
          { name: "Philippines", episodeId: "philippines", role: "Ore, often shipped" },
          { name: "Canada", episodeId: "canada", role: "Sulphide" },
          { name: "Australia", episodeId: "australia", role: "Sulphide" },
          { name: "Russia", episodeId: "russia", role: "Sulphide" },
        ],
      },
      {
        id: "intermediate",
        name: "Intermediate",
        what: "Nickel pig iron feeds steel. Mixed hydroxide and matte can feed a battery. Indonesia has moved downstream. The old habit was to ship the ore.",
        holders: [
          { name: "Indonesia", episodeId: "indonesia", role: "Pig iron, hydroxide, matte" },
          { name: "China", episodeId: "china", role: "Still takes feed" },
        ],
      },
      {
        id: "chemical",
        name: "Metal or sulphate",
        what: "Class I metal and battery sulphate are different products. The specification is the sale.",
        holders: [{ name: "China", episodeId: "china", role: "Sulphate and metal" }],
      },
      {
        id: "use",
        name: "Use",
        what: "Stainless still takes the bulk. Batteries take the growth, and only the material that meets the specification.",
        holders: [
          { name: "China", episodeId: "china", role: "Steel and cells" },
          { name: "Indonesia", episodeId: "indonesia", role: "Steel at the mine" },
        ],
      },
    ],
  },
  {
    id: "cobalt",
    name: "Cobalt",
    symbol: "Co",
    use: "A cathode",
    pinch: "The refinery",
    lede: "Congo digs it, mostly as a companion to copper. China refines it. The hole and the blue powder are not the same address.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "A copper by-product in the Congo, and a smaller nickel by-product elsewhere. The mine table is not the refinery table.",
        holders: [
          { name: "Congo", episodeId: "drc", role: "The volume" },
          { name: "Indonesia", episodeId: "indonesia", role: "From nickel laterite" },
        ],
      },
      {
        id: "hydroxide",
        name: "Hydroxide",
        what: "What leaves the African pit is an intermediate. It is not a cathode.",
        holders: [{ name: "Congo", episodeId: "drc", role: "The intermediate" }],
      },
      {
        id: "refine",
        name: "Refinery",
        what: "The pinch. Metal and salts a battery plant will take. China holds the plants. Finland is the other name a buyer can place.",
        holders: [
          { name: "China", episodeId: "china", role: "The plants" },
          { name: "Finland", episodeId: "finland", role: "The other door" },
        ],
      },
      {
        id: "use",
        name: "Use",
        what: "A battery cathode first. A smaller, older book in alloys and tools.",
        holders: [{ name: "China", episodeId: "china", role: "Cathode powder" }],
      },
    ],
  },
  {
    id: "graphite",
    name: "Graphite",
    symbol: "C",
    use: "An anode",
    pinch: "The anode plant",
    lede: "Flake is dressed in a plant. Vein, in Sri Lanka, is already nearly pure and still often leaves as a lump. Neither is an anode until someone spheronises and coats it.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "China for the volume. Mozambique and Madagascar for flake. Sri Lanka for vein — small tonnes, extraordinary rock.",
        holders: [
          { name: "China", episodeId: "china", role: "The volume" },
          { name: "Mozambique", episodeId: "mozambique", role: "Flake" },
          { name: "Madagascar", episodeId: "madagascar", role: "Flake" },
          { name: "Sri Lanka", episodeId: "sri-lanka", role: "Vein" },
        ],
      },
      {
        id: "concentrate",
        name: "Concentrate",
        what: "Flake is dressed. Vein is already carbon. A concentrate is still not a battery material.",
        holders: [
          { name: "China", episodeId: "china", role: "Flake" },
          { name: "Sri Lanka", episodeId: "sri-lanka", role: "Often still a lump" },
        ],
      },
      {
        id: "anode",
        name: "Anode",
        what: "Spherical, coated graphite. This is the pinch, and the plant is still mostly Chinese. Synthetic graphite, from needle coke, is the other feed — not from a mine at all.",
        holders: [{ name: "China", episodeId: "china", role: "The coating plants" }],
      },
      {
        id: "cell",
        name: "Cell",
        what: "The anode side of the battery. The mine’s customer is a processor, not a carmaker.",
        holders: [
          { name: "China", episodeId: "china", role: "Cells" },
          { name: "South Korea", episodeId: "south-korea", role: "Cells" },
        ],
      },
    ],
  },
  {
    id: "rare-earths",
    name: "Rare earths",
    symbol: "REE",
    use: "A magnet",
    pinch: "Separation",
    lede: "The ore is several countries. The separated oxides are not. Neodymium and praseodymium make the magnet. Dysprosium and terbium keep it working when it is hot.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "Bastnaesite, monazite, and ionic clay. A concentrate is a mixed bag, not a magnet metal.",
        holders: [
          { name: "China", episodeId: "china", role: "The volume" },
          { name: "Australia", episodeId: "australia", role: "Concentrate, and Nolans" },
          { name: "United States", episodeId: "united-states", role: "Mountain Pass" },
          { name: "Myanmar", episodeId: "myanmar", role: "Ionic clay" },
        ],
      },
      {
        id: "separation",
        name: "Separation",
        what: "The pinch. Sixteen elements come apart into oxides. China does this. Lynas separates in Malaysia. The American and Australian plants are an attempt at a second door.",
        holders: [
          { name: "China", episodeId: "china", role: "Oxides" },
          { name: "Australia", episodeId: "australia", role: "Lynas, separated abroad" },
        ],
      },
      {
        id: "magnet",
        name: "Metal and magnet",
        what: "Oxide to metal, metal to a sintered magnet. The heavy pair, dysprosium and terbium, is added here. Japan and China make the magnets. The mine does not.",
        holders: [
          { name: "China", episodeId: "china", role: "Metal and magnets" },
          { name: "Japan", role: "Magnets" },
        ],
      },
      {
        id: "use",
        name: "Use",
        what: "A motor, a turbine, a drive. The offtake is the magnet, not the ore.",
        holders: [
          { name: "China", episodeId: "china", role: "Motors" },
          { name: "Japan", role: "Motors" },
        ],
      },
    ],
  },
  {
    id: "copper",
    name: "Copper",
    symbol: "Cu",
    use: "Wire",
    pinch: "The smelter",
    lede: "Chile and Peru dig it. The ship carries a concentrate. China smelts a large share of that concentrate into the cathode a wire mill buys.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "The volume metal. A mine share is not a smelter share.",
        holders: [
          { name: "Chile", episodeId: "chile", role: "The volume" },
          { name: "Peru", episodeId: "peru", role: "Concentrate" },
          { name: "Congo", episodeId: "drc", role: "With the cobalt" },
        ],
      },
      {
        id: "concentrate",
        name: "Concentrate",
        what: "What the ship actually loads. Thirty percent copper, more or less, and a long way from a cable.",
        holders: [
          { name: "Chile", episodeId: "chile", role: "Loaded" },
          { name: "Peru", episodeId: "peru", role: "Loaded" },
        ],
      },
      {
        id: "smelter",
        name: "Smelter",
        what: "The pinch. Concentrate becomes blister, then cathode. China takes a large share of the world’s concentrate.",
        holders: [{ name: "China", episodeId: "china", role: "Cathode" }],
      },
      {
        id: "use",
        name: "Use",
        what: "Wire, the grid, the car. This is the product. The concentrate was the raw.",
        holders: [{ name: "China", episodeId: "china", role: "Wire and grid" }],
      },
    ],
  },
  {
    id: "tantalum",
    name: "Tantalum",
    symbol: "Ta",
    use: "A capacitor",
    pinch: "The powder",
    lede: "Congo and Rwanda, then Brazil, then Australia for the clean bag. Coltan is not a capacitor. The powder is, and the identity file sits in front of the money.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "Coltan from the Great Lakes, a pit in Brazil, and Australian concentrate a buyer can trace. The special briefing already walks this.",
        holders: [
          { name: "Congo", episodeId: "drc", role: "The tonnes" },
          { name: "Rwanda", episodeId: "rwanda", role: "The corridor" },
          { name: "Brazil", episodeId: "brazil", role: "A third pit" },
          { name: "Australia", episodeId: "australia", role: "The clean bag" },
        ],
      },
      {
        id: "concentrate",
        name: "Concentrate",
        what: "A mineral concentrate. Not a powder, and not yet a part.",
        holders: [
          { name: "Congo", episodeId: "drc", role: "Concentrate" },
          { name: "Rwanda", episodeId: "rwanda", role: "Often the export" },
        ],
      },
      {
        id: "powder",
        name: "Powder",
        what: "The pinch. A short list of processors makes capacitor powder. Conflict-mineral diligence is the release condition, not a footnote.",
        holders: [{ name: "The processors", role: "Not the pit" }],
      },
      {
        id: "use",
        name: "Use",
        what: "A capacitor in a phone or a weapons system, and a thinner book in superalloys. The offtake is the powder.",
        holders: [{ name: "The capacitor makers", role: "The offtake" }],
      },
    ],
  },
  {
    id: "manganese",
    name: "Manganese",
    symbol: "Mn",
    use: "Steel, then a chemical",
    pinch: "The chemical",
    lede: "South Africa and Gabon dig the ore. Steel still takes it as an alloy. A battery takes a different product: a high-purity chemical that the ore is not.",
    steps: [
      {
        id: "mine",
        name: "Ore",
        what: "The Kalahari and Gabon. Ore, not a battery salt.",
        holders: [
          { name: "South Africa", episodeId: "south-africa", role: "The Kalahari" },
          { name: "Gabon", episodeId: "gabon", role: "Ore" },
          { name: "Australia", episodeId: "australia", role: "Ore" },
        ],
      },
      {
        id: "alloy",
        name: "Alloy",
        what: "Ferromanganese and silicomanganese. This is the old book, and it is still the large one. It feeds a furnace, not a cathode.",
        holders: [
          { name: "China", episodeId: "china", role: "Alloy" },
          { name: "South Africa", episodeId: "south-africa", role: "Alloy at the ore" },
        ],
      },
      {
        id: "chemical",
        name: "Chemical",
        what: "The pinch for batteries. High-purity sulphate is a different plant from the alloy furnace. China holds most of that step.",
        holders: [{ name: "China", episodeId: "china", role: "The battery salt" }],
      },
      {
        id: "use",
        name: "Use",
        what: "Steel first. A cathode only if the chemical exists.",
        holders: [{ name: "China", episodeId: "china", role: "Steel and cells" }],
      },
    ],
  },
];
