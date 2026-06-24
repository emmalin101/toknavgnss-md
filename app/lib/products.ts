import { getPublishedCmsProducts } from "./cms/public";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductSpecGroup = {
  title: string;
  specs: ProductSpec[];
};

export type ProductDownload = {
  label: string;
  description: string;
  href: string;
  kind: "catalog" | "datasheet" | "quote";
};

export type ProductDatasheet = {
  label: string;
  description: string;
  href: string;
  updated: string;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  type: string;
  image: string;
  excerpt: string;
  description?: string;
  applications: string[];
  highlights: string[];
  specs: ProductSpec[];
  source: string;
  gallery?: string[];
  seoTitle?: string;
  seoDescription?: string;
  pageVariant?: "markingRobot";
};

export type ProductCategory = {
  slug: string;
  name: string;
  kicker: string;
  title: string;
  description: string;
  image: string;
  sourcePdf: string;
  buyerIntent: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "gnss-receivers",
    name: "GNSS Receivers",
    kicker: "RTK / CORS / Base Station",
    title: "High-Precision GNSS Receivers for Surveying, Mapping and Construction",
    description:
      "TOKNAV GNSS receiver line covers T series RTK rovers, tBase base station receivers and NET660 CORS/base-station receivers for distributors, contractors and system integrators.",
    image: "/assets/products/gnss-receiver-series-combo.webp",
    sourcePdf: "GNSS Receiver.pdf",
    buyerIntent: "Choose RTK receivers, base stations and CORS hardware by application."
  },
  {
    slug: "rugged-gis",
    name: "Rugged & GIS",
    kicker: "Controllers / Portable RTK",
    title: "Rugged Data Controllers and Portable RTK Terminals",
    description:
      "Android field controllers and portable high-precision positioning terminals for surveying crews, GIS data collection and mobile field operations.",
    image: "/assets/products/pcr500.webp",
    sourcePdf: "Rugged & GIS.pdf",
    buyerIntent: "Compare controllers and portable RTK terminals for field workflows."
  },
  {
    slug: "gnss-antennas",
    name: "GNSS Antennas",
    kicker: "Choke Ring / Survey / Helix",
    title: "GNSS Antennas for High-Precision Positioning Systems",
    description:
      "Choke ring, survey and helix antenna families for CORS stations, monitoring, surveying, handheld and machine-control applications.",
    image: "/assets/products/tca930.webp",
    sourcePdf: "GNSS Antennas.pdf",
    buyerIntent: "Select antenna type by signal tracking, environment and installation method."
  },
  {
    slug: "precision-agriculture-machine-control",
    name: "Precision Agriculture & Machine Control",
    kicker: "Auto-Steering / Land Leveling / 3D Guidance",
    title: "GNSS Auto-Steering, Land Leveling and Machine Control Systems",
    description:
      "Precision agriculture and machine-control systems for tractors, land leveling, dozer guidance and excavator guidance.",
    image: "/assets/products/tag66.webp",
    sourcePdf: "Precision Agriculture&Machine Control.pdf",
    buyerIntent: "Build solution pages for farm dealers and construction machine-control projects."
  },
  {
    slug: "accessories",
    name: "Accessories",
    kicker: "Power / Antenna / Cables / Cases",
    title: "GNSS Accessories for RTK Receiver Kits and Base Stations",
    description:
      "Power adapters, antennas, brackets, cables, cases, tripods and kit accessories used with TOKNAV RTK receivers, controllers and antennas.",
    image: "/assets/products/tbase.webp",
    sourcePdf: "Accessories.pdf",
    buyerIntent: "Help buyers complete receiver kits and replacement accessory lists."
  },
  {
    slug: "gnss-application-solutions",
    name: "GNSS Application Solutions",
    kicker: "Monitoring / CORS / Marking Robot / USV / SLAM",
    title: "GNSS Application Solutions for Monitoring, CORS/VRS, Marking, USV and SLAM",
    description:
      "Solution packages for deformation monitoring, CORS/VRS deployment, automated line marking, unmanned surface vehicle survey and handheld LiDAR SLAM mapping.",
    image: "/assets/products/tboat20.webp",
    sourcePdf: "Solution Brochure.pdf",
    buyerIntent: "Explain complete project solutions and recommended product mix."
  }
];

const commonReceiverSpecs: ProductSpec[] = [
  { label: "GNSS signals", value: "GPS, GLONASS, Galileo, BDS, QZSS, SBAS and NavIC support depending on model" },
  { label: "Channels", value: "Up to 1408 channels in T series receiver line" },
  { label: "Data format", value: "NMEA-0183 and RTCM 3.x correction I/O" },
  { label: "Tilt measurement", value: "IMU 60 degrees on supported receiver models" },
  { label: "Protection", value: "IP65 to IP68 rugged field protection depending on model" }
];

export const products: Product[] = [
  {
    slug: "t5lite",
    name: "T5Lite GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Entry RTK receiver",
    image: "/assets/products/t5.webp",
    excerpt: "Compact GNSS RTK receiver for cost-sensitive surveying and mapping projects.",
    applications: ["Surveying", "Mapping", "GIS field work"],
    highlights: ["ARM Cortex-A7 platform", "Linux OS", "Multi-constellation tracking", "Rover workflow support"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 7"
  },
  {
    slug: "t5",
    name: "T5 GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "RTK receiver",
    image: "/assets/products/t5.webp",
    excerpt: "T series RTK receiver for standard field surveying, mapping and stakeout work.",
    applications: ["Surveying", "Construction staking", "Mapping"],
    highlights: ["410-470MHz radio option", "Bluetooth and Wi-Fi", "NMEA-0183 output", "Field-ready receiver kit"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 8"
  },
  {
    slug: "t10pro",
    name: "T10Pro GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Professional RTK receiver",
    image: "/assets/products/t10pro.webp",
    excerpt: "Professional RTK receiver for overseas dealers that need strong field performance and kit packaging.",
    applications: ["Surveying", "Road construction", "Contractor projects"],
    highlights: ["410-470MHz radio", "RTCM 3.x correction", "LTE communication", "Rover and base workflows"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 9"
  },
  {
    slug: "t20pro",
    name: "T20Pro GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "High-power radio RTK receiver",
    image: "/assets/products/t20pro.webp",
    excerpt: "RTK receiver with integrated high-power transceiver for base-rover field operations.",
    applications: ["Base-rover RTK", "Construction", "Open-field surveying"],
    highlights: ["1W/2W/5W radio power options", "IMU tilt support", "Long work-time design", "Rugged IP protection"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 10"
  },
  {
    slug: "tbase",
    name: "tBase GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Base station receiver",
    image: "/assets/products/tbase.webp",
    excerpt: "Base station receiver designed for stable correction transmission and RTK base deployment.",
    applications: ["RTK base station", "CORS support", "Construction base setup"],
    highlights: ["Integrated high-power radio", "32GB storage", "Base station workflows", "Rugged receiver body"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 11"
  },
  {
    slug: "t30",
    name: "T30 GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "RTK receiver",
    image: "/assets/products/t30.webp",
    excerpt: "High-precision RTK receiver with Bluetooth, Wi-Fi and 410-470MHz radio support.",
    applications: ["Surveying", "Mapping", "Construction"],
    highlights: ["Bluetooth BR+EDR+BLE", "Wi-Fi 802.11 b/g/n", "IP68 receiver class", "IMU 60 degree tilt"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 12"
  },
  {
    slug: "t30pro",
    name: "T30Pro GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Image survey RTK receiver",
    image: "/assets/products/t30pro.webp",
    excerpt: "Professional RTK receiver supporting image survey workflows for improved field productivity.",
    applications: ["Image survey", "Surveying", "Stakeout"],
    highlights: ["Supports image survey", "Integrated radio", "IMU tilt measurement", "RTCM 3.x workflow"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 13"
  },
  {
    slug: "t40",
    name: "T40 GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "AR stakeout RTK receiver",
    image: "/assets/products/t40.webp",
    excerpt: "RTK receiver family with AR stakeout and laser-related field capabilities depending on configuration.",
    applications: ["AR stakeout", "Surveying", "Construction"],
    highlights: ["NFC and AR stakeout", "Laser measurement/camera support on selected models", "IP68", "20Hz data update"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 14"
  },
  {
    slug: "t40pro",
    name: "T40Pro GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Photogrammetry RTK receiver",
    image: "/assets/products/t40pro.webp",
    excerpt: "Professional RTK receiver with photogrammetry-oriented field capability and integrated radio.",
    applications: ["Photogrammetry", "AR stakeout", "Surveying"],
    highlights: ["Integrated receiver/transmitter", "AR stakeout", "Photogrammetry workflow", "IP68 protection"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 15"
  },
  {
    slug: "t50basic",
    name: "T50basic GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "RTK receiver",
    image: "/assets/products/t50basic.webp",
    excerpt: "T50 family receiver for distributors needing a practical RTK model with modern field functions.",
    applications: ["Surveying", "Mapping", "Dealer channel sales"],
    highlights: ["NFC", "AR stakeout", "Integrated transceiver radio", "Compact T50 family design"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 16"
  },
  {
    slug: "t50",
    name: "T50 GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Laser RTK receiver",
    image: "/assets/products/t50.webp",
    excerpt: "T50 receiver with laser measurement/camera-oriented capabilities for advanced field tasks.",
    applications: ["Surveying", "Laser measurement", "Construction"],
    highlights: ["Laser measurement and laser camera", "NFC and AR stakeout", "Integrated high-power transceiver", "IP68"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 17"
  },
  {
    slug: "t50pro",
    name: "T50Pro GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Photogrammetry RTK receiver",
    image: "/assets/products/t50pro.webp",
    excerpt: "High-end T50 family receiver for photogrammetry, AR stakeout and professional surveying workflows.",
    applications: ["Photogrammetry", "AR stakeout", "Surveying"],
    highlights: ["Photogrammetry", "AR stakeout", "RTCM 3.x", "Professional dealer-ready receiver kit"],
    specs: commonReceiverSpecs,
    source: "GNSS Receiver.pdf, page 18"
  },
  {
    slug: "net660",
    name: "NET660 GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "CORS/base receiver",
    image: "/assets/products/net660.webp",
    excerpt: "High-precision CORS/base-station receiver for monitoring, reference station and network applications.",
    applications: ["CORS", "Deformation monitoring", "Reference station"],
    highlights: ["RJ45 Ethernet", "Serial ports", "32GB storage", "Magnesium alloy body"],
    specs: [
      { label: "Data", value: "RTCM 3.x differential data and NMEA-0183 position data" },
      { label: "Output frequency", value: "1Hz, 2Hz, 5Hz, 10Hz, 20Hz depending on mode" },
      { label: "Interfaces", value: "Ethernet, serial, antenna, power and data interfaces" },
      { label: "Protection", value: "IP68 receiver class" }
    ],
    source: "GNSS Receiver.pdf, page 19"
  },
  {
    slug: "net660i",
    name: "NET660i GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Miniaturized GNSS receiver",
    image: "/assets/products/net660i.webp",
    excerpt: "Compact GNSS receiver designed for system integration, CORS and monitoring deployments.",
    applications: ["CORS", "System integration", "Monitoring"],
    highlights: ["ARM Cortex-A7 platform", "RS232 serial", "Ethernet", "32GB storage"],
    specs: [
      { label: "Signals", value: "GPS, GLONASS, BDS, Galileo, QZSS and SBAS support depending on variant" },
      { label: "Interfaces", value: "Power, DATA, PPS, Ethernet, SIM and GNSS antenna interfaces" },
      { label: "Working temperature", value: "-40℃ to +85℃ on industrial variants" },
      { label: "Weight", value: "Approx. 490g for compact variants" }
    ],
    source: "GNSS Receiver.pdf, page 20"
  },
  {
    slug: "net660i-h",
    name: "NET660i-H GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Cost-effective compact GNSS receiver",
    image: "/assets/products/net660i.webp",
    excerpt: "Miniaturized receiver for integration projects that need compact installation and robust interfaces.",
    applications: ["Monitoring", "System integration", "CORS"],
    highlights: ["Cost-effective miniaturized design", "Industrial temperature range", "Ethernet and serial connectivity", "PPS support"],
    specs: [
      { label: "System", value: "ARM Cortex-A7 1.8GHz platform" },
      { label: "Data", value: "RTCM 3.x and NMEA-0183 support" },
      { label: "Storage", value: "32GB storage" },
      { label: "Environment", value: "Designed for long-term installation" }
    ],
    source: "GNSS Receiver.pdf, page 21"
  },
  {
    slug: "net660i-1u",
    name: "NET660i-1U GNSS Receiver",
    categorySlug: "gnss-receivers",
    type: "Rack-style GNSS receiver",
    image: "/assets/products/net660i.webp",
    excerpt: "1U GNSS receiver variant for station-room deployment and professional infrastructure projects.",
    applications: ["CORS station room", "Reference network", "Monitoring center"],
    highlights: ["1U installation concept", "GNSS and network interfaces", "Industrial receiver design", "Long-term operation"],
    specs: [
      { label: "Form factor", value: "1U infrastructure receiver" },
      { label: "Data", value: "RTCM 3.x and NMEA-0183" },
      { label: "Connectivity", value: "Ethernet, serial and GNSS interfaces" },
      { label: "Use case", value: "CORS/VRS and monitoring infrastructure" }
    ],
    source: "GNSS Receiver.pdf, page 22"
  },
  {
    slug: "pcr100t",
    name: "PCR100T Data Controller",
    categorySlug: "rugged-gis",
    type: "RTK data controller",
    image: "/assets/products/pcr100t.webp",
    excerpt: "Flagship RTK measurement controller for field data collection and survey software operation.",
    applications: ["Survey control", "RTK field operation", "GIS collection"],
    highlights: ["Android field controller", "4GB RAM + 64GB ROM class", "IP68 protection", "Long battery work time"],
    specs: [
      { label: "Operating system", value: "Android controller platform" },
      { label: "Display", value: "High-resolution touch display" },
      { label: "GNSS", value: "GPS, BDS and GLONASS/A-GPS class support depending on model" },
      { label: "Battery", value: "9000mAh class battery in controller line" }
    ],
    source: "Rugged & GIS.pdf, page 5"
  },
  {
    slug: "pcr500",
    name: "PCR500 Data Controller",
    categorySlug: "rugged-gis",
    type: "Android data controller",
    image: "/assets/products/pcr500.webp",
    excerpt: "Android 12 data controller for surveying crews that need rugged mobility and reliable connectivity.",
    applications: ["Surveying", "Stakeout", "Field software operation"],
    highlights: ["Android 12", "Qualcomm platform", "BT5.0", "Rapid charging"],
    specs: [
      { label: "OS", value: "Android 12" },
      { label: "Memory", value: "4GB RAM + 64GB ROM" },
      { label: "Protection", value: "IP68" },
      { label: "Battery", value: "9000mAh, working time up to 22 hours depending on model" }
    ],
    source: "Rugged & GIS.pdf, page 6"
  },
  {
    slug: "pcr500pro",
    name: "PCR500Pro Data Controller",
    categorySlug: "rugged-gis",
    type: "Professional handheld terminal",
    image: "/assets/products/pcr500.webp",
    excerpt: "Professional handheld terminal for high-efficiency mobile field operations.",
    applications: ["GIS", "Mobile mapping", "Surveying"],
    highlights: ["Android 14 GMS class", "Rugged handheld design", "NFC support", "Fast charging"],
    specs: [
      { label: "OS", value: "Android 14 GMS class" },
      { label: "Display", value: "1080*1920p class display in controller line" },
      { label: "Camera", value: "Rear 13MP with flash in controller line" },
      { label: "Protection", value: "IP68 rugged protection" }
    ],
    source: "Rugged & GIS.pdf, page 7"
  },
  {
    slug: "pcr600",
    name: "PCR600 Data Controller",
    categorySlug: "rugged-gis",
    type: "Full-keyboard surveying controller",
    image: "/assets/products/pcr500.webp",
    excerpt: "Full-keyboard surveying data collector designed for professional field crews.",
    applications: ["Surveying", "Field coding", "Stakeout"],
    highlights: ["Full keyboard", "9000mAh battery class", "Surveying-focused design", "Rugged operation"],
    specs: [
      { label: "WIFI", value: "802.11 a/b/g/n/ac" },
      { label: "Battery", value: "9000mAh class" },
      { label: "Protection", value: "Rugged field housing" },
      { label: "Use", value: "Surveying data collection" }
    ],
    source: "Rugged & GIS.pdf, page 8"
  },
  {
    slug: "p8-p8pro",
    name: "P8 / P8Pro Portable RTK Receiver",
    categorySlug: "rugged-gis",
    type: "Portable RTK terminal",
    image: "/assets/products/pcr100t.webp",
    excerpt: "Portable intelligent positioning terminal based on BDS high-precision positioning technology.",
    applications: ["Portable RTK", "GIS", "Mapping"],
    highlights: ["Portable positioning terminal", "BDS high-precision positioning", "Mobile workflow", "Easy field deployment"],
    specs: [
      { label: "Positioning", value: "BDS high-precision positioning technology" },
      { label: "Use", value: "Portable RTK and GIS workflows" },
      { label: "Workflow", value: "Mobile terminal operation" },
      { label: "Buyer fit", value: "Dealers and field crews needing lightweight RTK" }
    ],
    source: "Rugged & GIS.pdf, page 9"
  },
  {
    slug: "p8glo",
    name: "P8Glo Portable RTK Receiver",
    categorySlug: "rugged-gis",
    type: "Portable RTK terminal",
    image: "/assets/products/pcr100t.webp",
    excerpt: "Portable intelligent positioning terminal for global high-precision field applications.",
    applications: ["Portable RTK", "GIS", "Mapping"],
    highlights: ["Portable design", "High-precision positioning", "Global field workflow", "Mobile operation"],
    specs: [
      { label: "Product family", value: "P8Global portable positioning terminal" },
      { label: "Use", value: "BDS high-precision positioning workflows" },
      { label: "Application", value: "GIS and mapping" },
      { label: "Form", value: "Portable RTK receiver" }
    ],
    source: "Rugged & GIS.pdf, page 10"
  },
  {
    slug: "tca920",
    name: "TCA920 Choke Ring Antenna",
    categorySlug: "gnss-antennas",
    type: "Choke ring antenna",
    image: "/assets/products/tca930.webp",
    excerpt: "High-performance choke ring antenna for stable multi-frequency GNSS signal reception.",
    applications: ["CORS", "Monitoring", "Reference station"],
    highlights: ["GPS L1/L2/L5/L-Band", "GLONASS L1/L2/L3", "BDS B1/B2/B3", "Choke ring design"],
    specs: [
      { label: "Antenna type", value: "Choke ring antenna" },
      { label: "Signals", value: "GPS, GLONASS, Galileo and BDS multi-frequency support" },
      { label: "Use case", value: "CORS/reference station and monitoring" },
      { label: "Source", value: "GNSS antenna line overview" }
    ],
    source: "GNSS Antennas.pdf, page 6"
  },
  {
    slug: "tca930",
    name: "TCA930 Choke Ring Antenna",
    categorySlug: "gnss-antennas",
    type: "Choke ring antenna",
    image: "/assets/products/tca930.webp",
    excerpt: "High-performance choke ring antenna for CORS and monitoring applications.",
    applications: ["CORS", "Reference station", "Monitoring"],
    highlights: ["Multi-frequency tracking", "Choke ring structure", "Professional base installation", "Stable signal reception"],
    specs: [
      { label: "Signals", value: "GPS, GLONASS, Galileo, BDS multi-frequency support" },
      { label: "Installation", value: "Reference station and monitoring installation" },
      { label: "Category", value: "Choke ring antenna" },
      { label: "Buyer fit", value: "CORS builders and monitoring integrators" }
    ],
    source: "GNSS Antennas.pdf, page 7"
  },
  {
    slug: "tca930m",
    name: "TCA930M Choke Ring Antenna",
    categorySlug: "gnss-antennas",
    type: "Choke ring antenna",
    image: "/assets/products/tca930.webp",
    excerpt: "Choke ring antenna variant for high-precision fixed GNSS applications.",
    applications: ["CORS", "Monitoring", "Base station"],
    highlights: ["Multi-frequency GNSS", "Professional fixed installation", "Choke ring design", "Stable reference data"],
    specs: [
      { label: "Type", value: "Choke ring antenna" },
      { label: "Signals", value: "Multi-constellation, multi-frequency support" },
      { label: "Use case", value: "Fixed high-precision GNSS station" },
      { label: "Project fit", value: "Reference station and deformation monitoring" }
    ],
    source: "GNSS Antennas.pdf, page 8"
  },
  {
    slug: "tsa320",
    name: "TSA320 Survey GNSS Antenna",
    categorySlug: "gnss-antennas",
    type: "Survey antenna",
    image: "/assets/products/tsa520.webp",
    excerpt: "External measurement antenna for survey-grade positioning workflows.",
    applications: ["Surveying", "Mapping", "External antenna workflows"],
    highlights: ["Survey GNSS antenna", "External measurement antenna", "Multi-frequency coverage", "Portable installation"],
    specs: [
      { label: "Type", value: "Survey GNSS antenna" },
      { label: "Use", value: "External measurement antenna" },
      { label: "Signals", value: "Multi-frequency GNSS support depending on model" },
      { label: "Application", value: "Surveying and mapping" }
    ],
    source: "GNSS Antennas.pdf, page 9"
  },
  {
    slug: "tsa500",
    name: "TSA500 Survey GNSS Antenna",
    categorySlug: "gnss-antennas",
    type: "Survey antenna",
    image: "/assets/products/tsa520.webp",
    excerpt: "Survey GNSS antenna designed for superior field satellite reception.",
    applications: ["Surveying", "Mapping", "Machine control"],
    highlights: ["External antenna", "Survey-grade use", "Stable GNSS reception", "Field installation"],
    specs: [
      { label: "Type", value: "Survey GNSS antenna" },
      { label: "Use", value: "High-precision field measurement" },
      { label: "Installation", value: "External antenna mounting" },
      { label: "Buyer fit", value: "Survey dealers and integrators" }
    ],
    source: "GNSS Antennas.pdf, page 10"
  },
  {
    slug: "tsa520",
    name: "TSA520 Survey GNSS Antenna",
    categorySlug: "gnss-antennas",
    type: "Survey antenna",
    image: "/assets/products/tsa520.webp",
    excerpt: "External measurement antenna covering four major GNSS systems for survey applications.",
    applications: ["Surveying", "Mapping", "Monitoring"],
    highlights: ["Covers four GNSS systems", "External measurement antenna", "Survey-grade reception", "Compact field use"],
    specs: [
      { label: "Type", value: "Survey GNSS antenna" },
      { label: "Signals", value: "Four-system GNSS coverage described in brochure" },
      { label: "Use", value: "External measurement antenna" },
      { label: "Application", value: "Surveying and mapping" }
    ],
    source: "GNSS Antennas.pdf, page 11"
  },
  {
    slug: "tsa1000",
    name: "TSA1000 Survey GNSS Antenna",
    categorySlug: "gnss-antennas",
    type: "Survey antenna",
    image: "/assets/products/tsa520.webp",
    excerpt: "Survey antenna for high-precision GNSS signal reception in field applications.",
    applications: ["Surveying", "Mapping", "Base setup"],
    highlights: ["External measurement antenna", "Survey-grade design", "Multi-system support", "Field-ready installation"],
    specs: [
      { label: "Type", value: "Survey GNSS antenna" },
      { label: "Signals", value: "Multi-system GNSS support" },
      { label: "Use case", value: "Survey field operations" },
      { label: "Category", value: "Survey antenna" }
    ],
    source: "GNSS Antennas.pdf, page 12"
  },
  ...["tha-x601a", "tha-x603a", "tha-7603a", "tha-7609a", "tha-9603a"].map((slug) => ({
    slug,
    name: `${slug.toUpperCase().replace("THA-", "THA-")} Helix Antenna`,
    categorySlug: "gnss-antennas",
    type: "Helix antenna",
    image: "/assets/products/tha-x601a.webp",
    excerpt: "High-performance helix antenna for handheld, UAV, machine-control and compact GNSS integration workflows.",
    applications: ["Handheld GNSS", "Machine control", "Compact integration"],
    highlights: ["External handheld antenna", "High-precision positioning support", "Compact helix design", "Multi-frequency family"],
    specs: [
      { label: "Type", value: "Helix GNSS antenna" },
      { label: "Use", value: "Handheld and compact high-precision positioning" },
      { label: "Signals", value: "Multi-frequency GNSS support depending on model" },
      { label: "Installation", value: "Compact external antenna" }
    ],
    source: "GNSS Antennas.pdf, pages 13-17"
  })),
  {
    slug: "tag66",
    name: "TAG66 Electric Steering Wheel Autonomous Driving System",
    categorySlug: "precision-agriculture-machine-control",
    type: "Auto-steering system",
    image: "/assets/products/tag66.webp",
    excerpt: "Electric steering wheel autonomous driving system with integrated controller, 4G, IMU, UHF radio and BeiDou positioning module.",
    applications: ["Sowing", "Spraying", "Plowing", "Harvesting"],
    highlights: ["2.5cm pass precision under RTK conditions", "0.15-25km/h speed range", "AB line, A+ line and custom curve modes", "No additional wheel angle sensor required"],
    specs: [
      { label: "Precision", value: "Industry-standard RTK precision, pass precision described as 2.5cm" },
      { label: "Speed range", value: "0.15 to 25 km/h" },
      { label: "Controller", value: "Integrated 4G, IMU, UHF radio and BeiDou positioning module" },
      { label: "Use", value: "Sowing, planting, spraying, plowing and ridge making" }
    ],
    source: "Precision Agriculture&Machine Control.pdf, pages 3-4"
  },
  {
    slug: "tag88",
    name: "TAG88 Automated GNSS Land Leveling System",
    categorySlug: "precision-agriculture-machine-control",
    type: "Land leveling system",
    image: "/assets/products/tag88.webp",
    excerpt: "Automated GNSS land leveling system for precision agriculture leveling applications.",
    applications: ["Land leveling", "Farmland preparation", "Precision agriculture"],
    highlights: ["GNSS automated leveling", "Full-network signal coverage", "Base station coverage up to 30km described in brochure", "Agricultural terrain workflow"],
    specs: [
      { label: "Signals", value: "BeiDou, GPS, Galileo and GLONASS compatibility described in brochure" },
      { label: "Coverage", value: "Base station maximum radius up to 30km described in brochure" },
      { label: "System", value: "Automated GNSS land leveling" },
      { label: "Use", value: "Farmland leveling and preparation" }
    ],
    source: "Precision Agriculture&Machine Control.pdf, pages 5-6"
  },
  {
    slug: "tmc10",
    name: "TMC10 Dozer 3D Guidance System",
    categorySlug: "precision-agriculture-machine-control",
    type: "Dozer guidance",
    image: "/assets/products/tmc10.webp",
    excerpt: "Dozer 3D guidance system using GNSS positioning and sensor fusion for digital construction workflows.",
    applications: ["Dozer grading", "Digital construction", "Earthwork"],
    highlights: ["GNSS positioning", "Sensor fusion", "3D guidance", "Construction machine workflow"],
    specs: [
      { label: "System", value: "Dozer 3D guidance" },
      { label: "Technology", value: "GNSS positioning and sensor fusion" },
      { label: "Use", value: "Earthwork and grading" },
      { label: "Project fit", value: "Construction machine-control dealers" }
    ],
    source: "Precision Agriculture&Machine Control.pdf, pages 7-8"
  },
  {
    slug: "tmc20",
    name: "TMC20 Excavator Guidance System",
    categorySlug: "precision-agriculture-machine-control",
    type: "Excavator guidance",
    image: "/assets/products/tmc20.webp",
    excerpt: "Excavator guidance system with rugged industrial display and high-precision positioning workflow.",
    applications: ["Excavation", "Digital construction", "Machine guidance"],
    highlights: ["Industrial-grade display", "Rugged durability", "GNSS signal support", "Pitch angle measurement up to ±80° described in brochure"],
    specs: [
      { label: "System", value: "Excavator guidance" },
      { label: "Signals", value: "BDS B1I/B2I/B3I/B1C/B2a/B2b described in brochure" },
      { label: "Sensor", value: "Pitch angle measurement described as ±80°" },
      { label: "Use", value: "Excavation and construction guidance" }
    ],
    source: "Precision Agriculture&Machine Control.pdf, pages 9-10"
  },
  ...[
    ["accessory-kit", "RTK Receiver Accessory Kit", "Tripods, tribrachs, brackets, suction cup bases and kit accessories for RTK receiver sets."],
    ["power-adapter", "Power Adapter", "USB and Lemo power adapters for charging and powering receivers and controllers."],
    ["antenna-accessories", "Antenna Accessories", "410-470MHz antennas and GNSS antenna accessories for receiver and base-station setups."],
    ["wire-cables", "GNSS Cables and Wires", "TNC-TNC GNSS antenna cables and power/data cables for NET660 and receiver workflows."],
    ["rtk-cases", "RTK Cases and Toolboxes", "Foam RTK rover kits and 1+1 toolboxes for T10Pro, T20Pro and receiver kits."]
  ].map(([slug, name, excerpt]) => ({
    slug,
    name,
    categorySlug: "accessories",
    type: "Accessory",
    image: "/assets/products/tbase.webp",
    excerpt,
    applications: ["RTK kits", "Receiver setup", "Dealer spare parts"],
    highlights: ["Receiver kit completion", "Field replacement parts", "Dealer-ready accessory planning", "Compatible with TOKNAV product families"],
    specs: [
      { label: "Accessory family", value: name },
      { label: "Use", value: "RTK receiver, controller and antenna workflows" },
      { label: "Buyer fit", value: "Distributors, field crews and service teams" },
      { label: "Source", value: "Accessories brochure" }
    ],
    source: "Accessories.pdf"
  })),
  {
    slug: "deformation-monitoring",
    name: "Deformation Monitoring Solution",
    categorySlug: "gnss-application-solutions",
    type: "Monitoring solution",
    image: "/assets/products/u6.webp",
    excerpt: "GNSS-based monitoring solution for landslide, dam, mining subsidence, tailings reservoir, bridge and high-rise building deformation monitoring.",
    applications: ["Landslide monitoring", "Dam monitoring", "Bridge monitoring", "Mining subsidence"],
    highlights: ["Flexible control without line-of-sight between stations", "Real-time data output", "Safety-focused monitoring workflow", "Product mix can include U6 receiver and solar/power accessories"],
    specs: [
      { label: "Application", value: "Geological hazard and structural deformation monitoring" },
      { label: "Data", value: "Collected data can output results in real time" },
      { label: "Deployment", value: "Flexible positioning options" },
      { label: "Product mix", value: "GNSS receiver, solar panel, controller, battery protection and pole setting" }
    ],
    source: "Solution Brochure.pdf, page 4"
  },
  {
    slug: "cors-vrs-service",
    name: "CORS and VRS Service Solution",
    categorySlug: "gnss-application-solutions",
    type: "Network RTK solution",
    image: "/assets/products/net660.webp",
    excerpt: "Full-stack CORS/VRS service solution for GNSS correction infrastructure projects.",
    applications: ["CORS network", "VRS service", "Regional correction service"],
    highlights: ["Self-developed software and hardware technology", "Network RTK service concept", "Reference station infrastructure", "Suitable for integrators and government/enterprise projects"],
    specs: [
      { label: "Solution", value: "CORS and VRS service" },
      { label: "Hardware", value: "Reference station receiver and antenna configuration" },
      { label: "Software", value: "VRS service and correction management workflow" },
      { label: "Buyer fit", value: "System integrators and correction service operators" }
    ],
    source: "Solution Brochure.pdf, page 5"
  },
  {
    slug: "marking-robot",
    name: "TR10Pro Line Marking Robot",
    categorySlug: "gnss-application-solutions",
    type: "Intelligent marking robot",
    image: "/assets/products/tr10pro-marking-robot.png",
    excerpt: "RTK-guided line marking robot for sports fields, highways, municipal roads, airport runways and pre-marking workflows.",
    applications: ["Sports field marking", "Highway pre-marking", "Municipal road marking", "Airport runway marking"],
    highlights: ["Centimeter-level marking accuracy", "3 times faster than manual work", "Built-in sports field templates", "DXF and CSV file import", "5cm-15cm adjustable side nozzle", "0-degree turn in place"],
    specs: [
      { label: "Product", value: "TR10Pro line marking robot" },
      { label: "Accuracy", value: "+/-1.5cm marking accuracy listed in the latest TR10 series brochure" },
      { label: "Drawing width", value: "5cm-15cm adjustable side nozzle" },
      { label: "Templates", value: "Running track, tennis court, soccer field, football field, lacrosse court and baseball field" }
    ],
    source: "TR10series.pdf, updated 2026-04-27",
    gallery: [
      "/assets/products/tr10pro-marking-robot.png",
      "/assets/products/tr10pro-marking-robot-front.png",
      "/assets/products/tr10pro-marking-robot-top.png",
      "/assets/products/tr10pro-marking-robot-side.png"
    ],
    pageVariant: "markingRobot"
  },
  {
    slug: "tboat-usv-series",
    name: "Tboat USV Series",
    categorySlug: "gnss-application-solutions",
    type: "Unmanned surface vehicle",
    image: "/assets/products/tboat20.webp",
    excerpt: "Tboat10 and Tboat20 unmanned surface vehicles for bathymetric survey, water quality monitoring, patrol and hydrographic operations.",
    applications: ["Bathymetric survey", "Water quality monitoring", "Patrol USV with side-scan sonar", "Hydrological monitoring"],
    highlights: ["Tboat10 and Tboat20 platforms", "RTK positioning accuracy", "4G / 2.4G / optional radio communication", "Up to 7 hours endurance", "IP67 hull design", "Multiple payload options"],
    specs: [
      { label: "Series", value: "Tboat10 and Tboat20 unmanned surface vehicle platforms" },
      { label: "Applications", value: "Bathymetric survey, water quality monitoring, water quality sampling, patrol, hydrological monitoring and underwater surveying" },
      { label: "Navigation", value: "Full-system multi-frequency GNSS positioning with RTK support" },
      { label: "Source", value: "Tboat Series brochure, 2025 edition" }
    ],
    source: "Tboat Series brochure, pages 1-8",
    gallery: [
      "/assets/products/tboat20.webp",
      "/assets/products/tboat10.webp",
      "/assets/products/tboat10-side.webp",
      "/assets/products/tboat20-annotated.webp",
      "/assets/products/tboat10-series.webp"
    ]
  },
  {
    slug: "tsr20-slam",
    name: "TSR20 Handheld LiDAR SLAM Scanner",
    categorySlug: "gnss-application-solutions",
    type: "Handheld LiDAR SLAM scanner",
    image: "/assets/products/tsr20.webp",
    excerpt: "Lightweight real-time mapping LiDAR system for indoor and outdoor 3D point cloud capture in GNSS and GNSS-denied environments.",
    applications: ["Indoor mapping", "Outdoor building scanning", "Digital twin modeling", "Power line patrol", "Forestry and low-canopy survey"],
    highlights: ["Livox Mid-360 LiDAR", "SLAM / RTK-SLAM / PPK-SLAM modes", "1.0kg handheld design", "Dual 20MP cameras", "200,000 points/sec", "Up to 5cm absolute accuracy"],
    specs: [
      { label: "Mapping modes", value: "SLAM, RTK-SLAM and PPK-SLAM" },
      { label: "Accuracy", value: "≤3cm relative accuracy, ≤5cm absolute accuracy listed in TSR20 EN brochure" },
      { label: "Sensor", value: "Livox Mid-360 LiDAR with 40m range at 10% reflectivity" },
      { label: "Source", value: "TSR20 EN.pdf, 2026-06" }
    ],
    source: "TSR20 EN.pdf, pages 1-4",
    gallery: [
      "/assets/products/tsr20.webp",
      "/assets/products/tsr20-angle.webp",
      "/assets/products/tsr20-side.webp",
      "/assets/products/tsr20-studio.webp",
      "/assets/products/tsr20-kit.webp"
    ]
  }
];

const receiverSignalSpec =
  "GPS L1C/A, L1C, L2P(Y), L2C, L5; GLONASS L1/L2/L3; BDS B1I/B2I/B3I/B1C/B2a/B2b(PPP); Galileo E1/E5a/E5b/E6(PPP); QZSS L1/L2/L5; SBAS L1(PPP); NavIC L5 on supported firmware.";

const tSeriesAccuracySpecs: ProductSpec[] = [
  { label: "Channels", value: "1408" },
  { label: "Standard output", value: "NMEA-0183" },
  { label: "Correction protocol", value: "RTCM 3.x, with RTCM 2.x also listed for T10Pro" },
  { label: "Single point accuracy", value: "Horizontal 1.5m RMS / Vertical 2.5m RMS" },
  { label: "DGPS accuracy", value: "Horizontal 0.4m RMS / Vertical 0.8m RMS" },
  { label: "RTK accuracy", value: "Horizontal +/- (8mm+1ppm), Vertical +/- (15mm+1ppm)" },
  { label: "Static accuracy", value: "Horizontal +/- (2.5mm+1ppm), Vertical +/- (5mm+1ppm); selected models list +/- (2.5mm+0.5ppm) / +/- (5mm+0.5ppm)" },
  { label: "Speed accuracy", value: "0.03m/s RMS" },
  { label: "Reacquisition", value: "<1s" }
];

const tSeriesPlatformSpecs: ProductSpec[] = [
  { label: "Platform", value: "ARM Cortex-A7 with Linux OS" },
  { label: "Bluetooth", value: "BR + EDR + BLE" },
  { label: "Wi-Fi", value: "802.11 b/g/n" },
  { label: "4G network", value: "LTE FDD / LTE TDD / WCDMA / GSM bands depending on model and market version" },
  { label: "Storage", value: "32GB storage" },
  { label: "Tilt correction", value: "<2cm within 60 degrees on IMU-supported receiver models" }
];

const t5FamilySpecs: ProductSpecGroup[] = [
  {
    title: "GNSS and Positioning",
    specs: [
      { label: "GNSS signals", value: receiverSignalSpec },
      { label: "Update frequency", value: "5Hz max" },
      ...tSeriesAccuracySpecs
    ]
  },
  {
    title: "Communication and Data",
    specs: [
      ...tSeriesPlatformSpecs,
      { label: "Data radio", value: "T5 supports receive-only 410-470MHz radio; T5Lite focuses on 4G, Bluetooth and Wi-Fi workflows" },
      { label: "Radio protocol", value: "TRIMTALK, TRIMMK3, SOUTH, TRANSEOT on T5" }
    ]
  },
  {
    title: "Power and Environment",
    specs: [
      { label: "Battery", value: "3.7V, 9600mAh" },
      { label: "Work time", value: "More than 16 hours typical rover GSM; static collection up to 24 hours" },
      { label: "Charging", value: "MTK PE+ 9V/2A and USB PD 12V/1.25A or 5V/3A fast charging support" },
      { label: "Operating temperature", value: "-20°C to +60°C" },
      { label: "Storage temperature", value: "-40°C to +85°C" },
      { label: "Protection", value: "IP65" },
      { label: "Drop resistance", value: "Can withstand a 1.5m drop at normal temperature" },
      { label: "Dimensions / weight", value: "T5Lite 100.5 x 100.5 x 69mm, 600g; T5 100.5 x 100.5 x 72mm, 630g" }
    ]
  }
];

const t10T20Specs: ProductSpecGroup[] = [
  {
    title: "GNSS and Positioning",
    specs: [
      { label: "GNSS signals", value: receiverSignalSpec },
      { label: "Channels", value: "1408" },
      { label: "Update frequency", value: "T10Pro 5Hz typical / 20Hz max; T20Pro 20Hz max" },
      ...tSeriesAccuracySpecs.filter((spec) => spec.label !== "Channels")
    ]
  },
  {
    title: "Radio, Communication and Display",
    specs: [
      ...tSeriesPlatformSpecs,
      { label: "Radio frequency", value: "410-470MHz" },
      { label: "Radio power", value: "T10Pro 0.5W/1.5W; T20Pro adjustable 1W/2W/5W" },
      { label: "Radio protocol", value: "TRIMTALK, TRIMMK3, SOUTH, TRANSEOT" },
      { label: "Open area distance", value: "T20Pro built-in 5W radio is described for up to 16km in open areas" },
      { label: "Display", value: "T20Pro includes 1.3-inch TFT LCD, 240 x 240" }
    ]
  },
  {
    title: "Power, Body and Certification",
    specs: [
      { label: "Battery", value: "T10Pro 3.7V 9600mAh; T20Pro 7.4V 6500mAh" },
      { label: "Work time", value: "T10Pro more than 16 hours typical; T20Pro more than 18 hours typical and static mode up to 26 hours" },
      { label: "Charging", value: "USB PD fast charging support" },
      { label: "Operating temperature", value: "-20°C to +60°C" },
      { label: "Protection", value: "IP68" },
      { label: "Dimensions / weight", value: "T10Pro Phi147.9 x 68mm, 740g; T20Pro Phi143.5 x 90.7mm, 900g" },
      { label: "Certification", value: "T10Pro NGS, CE, FCC, KC; T20Pro NGS, CE, FCC" }
    ]
  }
];

const t30T40Specs: ProductSpecGroup[] = [
  {
    title: "GNSS, Accuracy and Visual Functions",
    specs: [
      { label: "GNSS signals", value: receiverSignalSpec },
      { label: "Channels / output", value: "1408 channels, NMEA-0183 output and RTCM 3.x correction I/O" },
      { label: "Update frequency", value: "20Hz max" },
      { label: "RTK accuracy", value: "Horizontal +/- (8mm+1ppm), Vertical +/- (15mm+1ppm)" },
      { label: "Tilt correction", value: "<2cm within 60 degrees" },
      { label: "AR stakeout accuracy", value: "Horizontal +/- (8mm+1ppm), Vertical +/- (15mm+1ppm) on T40/T40Pro" },
      { label: "Photogrammetry", value: "T30Pro/T40Pro include image survey or photogrammetry support" },
      { label: "Laser measurement", value: "T30 laser within 5m; T40 laser module range up to 30m" }
    ]
  },
  {
    title: "Camera, Radio and Communication",
    specs: [
      { label: "AR camera", value: "1/2.8-inch sensor, f/2.5 aperture, 1920 x 1080 resolution on listed visual models" },
      { label: "Image survey camera", value: "T30Pro/T40Pro use 1/2.6-inch image survey camera, f/2.8 aperture, 1920 x 1080 resolution" },
      { label: "Laser assist camera", value: "T30/T40 use 1/3.06-inch laser assist camera, 4224 x 3200 resolution" },
      { label: "Radio", value: "410-470MHz high-power transceiver; T30/T40 family supports up to 5W on selected models" },
      { label: "Network", value: "LTE FDD, LTE TDD, WCDMA and GSM full Netcom bands depending on market version" },
      { label: "Storage", value: "32GB storage" }
    ]
  },
  {
    title: "Power and Mechanical",
    specs: [
      { label: "Battery", value: "T30/T30Pro: 7.2V 13800mAh; T40/T40Pro: 7.2V 3400mAh x 2 removable batteries" },
      { label: "Endurance", value: "T30/T30Pro over 48 hours in controller network mode; T40/T40Pro over 20 hours in controller network mode" },
      { label: "Operating temperature", value: "-20°C to +60°C" },
      { label: "Protection", value: "IP68" },
      { label: "Drop resistance", value: "Can withstand a 1.5m drop at normal temperature" },
      { label: "Dimensions / weight", value: "T30/T30Pro Phi174.9 x 104.9mm, 1500g; T40/T40Pro Phi160 x 103mm, 850g without battery" }
    ]
  }
];

const t50FamilySpecs: ProductSpecGroup[] = [
  {
    title: "GNSS, Accuracy and Survey Functions",
    specs: [
      { label: "GNSS signals", value: receiverSignalSpec },
      { label: "Channels / output", value: "1408 channels, NMEA-0183 output and RTCM 3.x correction I/O" },
      { label: "Update frequency", value: "20Hz max" },
      { label: "RTK accuracy", value: "Horizontal +/- (8mm+1ppm), Vertical +/- (15mm+1ppm)" },
      { label: "Static accuracy", value: "Horizontal +/- (2.5mm+1ppm), Vertical +/- (5mm+1ppm)" },
      { label: "Tilt correction", value: "<2cm within 60 degrees" },
      { label: "AR stakeout", value: "Supported on T50basic, T50 and T50Pro" },
      { label: "Laser / photogrammetry", value: "T50 includes 100m laser measurement; T50Pro includes photogrammetry with 2-4cm error within 2-15m" }
    ]
  },
  {
    title: "Camera, Radio and Communication",
    specs: [
      { label: "AR camera", value: "1/2.8-inch sensor, f/2.5 aperture, 1920 x 1080 resolution, distortion <0.38%" },
      { label: "T50 laser module", value: "Class 3R, 100m range, +/-5mm +/-100 x 10-6 x D precision, 520 +/-20nm wavelength" },
      { label: "T50Pro image camera", value: "1/2.6-inch sensor, 3.27mm focal length, f/2.8 aperture, 1920 x 1080 resolution, FOV 83 x 72 x 51 degrees" },
      { label: "Radio", value: "Integrated transceiver, 410-470MHz, 0.5W/1.5W, TRIMTALK/TRIMMK3/SOUTH/TRANSEOT/SATEL/LORA" },
      { label: "Wireless", value: "Bluetooth BR+EDR+BLE, Wi-Fi 802.11 b/g/n, LTE FDD/TDD, WCDMA and GSM bands" },
      { label: "Storage", value: "32GB storage" }
    ]
  },
  {
    title: "Power and Mechanical",
    specs: [
      { label: "Battery", value: "7.4V, 6500mAh" },
      { label: "Work time", value: "Over 16 hours in controller network mode or typical rover GSM use depending on model" },
      { label: "Charging", value: "USB PD 15V/2A and 5V/3A" },
      { label: "Operating temperature", value: "-30°C to +65°C" },
      { label: "Storage temperature", value: "-40°C to +85°C" },
      { label: "Protection", value: "IP68" },
      { label: "Dimensions / weight", value: "Phi132 x 83mm, 770g" }
    ]
  }
];

const net660FamilySpecs: ProductSpecGroup[] = [
  {
    title: "GNSS and Data",
    specs: [
      { label: "Platform", value: "ARM Cortex-A7 1.8GHz with Linux OS" },
      { label: "GNSS signals", value: "GPS, GLONASS, BDS, Galileo, QZSS, SBAS and NavIC depending on model; NET660i-H supports dual-antenna directed positioning" },
      { label: "Channels", value: "1408 on NET660i / NET660i-H family" },
      { label: "Data format", value: "RINEX and custom data format" },
      { label: "Position data", value: "NMEA-0183" },
      { label: "Differential data", value: "RTCM 3.x" },
      { label: "Data update frequency", value: "1Hz, 2Hz, 5Hz, 10Hz, 20Hz" },
      { label: "RTK accuracy", value: "Horizontal +/- (8mm+1ppm), Vertical +/- (15mm+1ppm)" },
      { label: "Static accuracy", value: "Horizontal +/- (2.5mm+0.5ppm), Vertical +/- (5mm+0.5ppm)" },
      { label: "Timing accuracy", value: "20ns RMS" }
    ]
  },
  {
    title: "Interfaces and Protocols",
    specs: [
      { label: "Serial port", value: "Standard RS232, baud rates 1200 to 230400bps on NET660i family" },
      { label: "Network port", value: "RJ45 10/100Mbps adaptive Ethernet" },
      { label: "Ports", value: "Power, DATA, PPS, SIM, Ethernet, GNSS antenna and 4G antenna ports depending on model" },
      { label: "Storage", value: "32GB circular storage, multi-channel storage support" },
      { label: "Protocols", value: "Ntrip Client/Server/Caster, TCP Client/Server, FTP, HTTP/HTTPS and private network transfer" },
      { label: "Cloud service", value: "Reports location, network status, signal strength and satellite reception; supports remote restart, reset and upgrade" }
    ]
  },
  {
    title: "Electrical, Environment and Body",
    specs: [
      { label: "Voltage input", value: "9-24V DC, 12V typical on NET660i family" },
      { label: "Power dissipation", value: "1.8W typical for NET660i, 2W typical for NET660i-H" },
      { label: "Operating temperature", value: "-40°C to +85°C" },
      { label: "Storage temperature", value: "-40°C to +85°C" },
      { label: "Protection", value: "IP68" },
      { label: "Material", value: "Magnesium alloy main body" },
      { label: "Dimensions / weight", value: "NET660i family 148.8 x 105 x 50.3mm, 490g" },
      { label: "Heading accuracy", value: "NET660i-H lists 0.2 degrees/m heading accuracy" }
    ]
  }
];

const controllerSpecs: ProductSpecGroup[] = [
  {
    title: "System and Display",
    specs: [
      { label: "OS", value: "PCR100T Android 11; PCR500 Android 12; PCR500Pro Android 12 GMS support" },
      { label: "Processor", value: "8-core 2.0GHz class processor; PCR500 uses Qualcomm SM6115, PCR500Pro uses Qualcomm SDM662" },
      { label: "Memory", value: "4GB RAM + 64GB ROM" },
      { label: "Display", value: "PCR100T 5.45-inch 720 x 1440; PCR500/PCR500Pro 5.5-inch 1080 x 1920, 500 nit" },
      { label: "Keyboard", value: "Surveying-focused English keypad / QWERTY keypad depending on model" },
      { label: "Camera", value: "Rear 13MP camera with flash or autofocus depending on model" }
    ]
  },
  {
    title: "Communication and GNSS",
    specs: [
      { label: "Wi-Fi", value: "IEEE 802.11 a/b/g/n/ac, dual-band 2.4G/5G" },
      { label: "Bluetooth", value: "BT5.0 BLE" },
      { label: "NFC", value: "Supported" },
      { label: "Cellular", value: "GSM, WCDMA, LTE-TDD and LTE-FDD global bands depending on region version" },
      { label: "GNSS", value: "GPS, BDS, GLONASS, Galileo and A-GPS support depending on model" },
      { label: "PCR500Pro RTK", value: "1408 channels, RTK 2cm HRMS, SBAS <1m HRMS listed in brochure" }
    ]
  },
  {
    title: "Battery and Rugged Design",
    specs: [
      { label: "Battery", value: "9000mAh non-removable battery, rapid charging support" },
      { label: "Working time", value: "PCR100T 18 hours; PCR500/PCR500Pro 22 hours typical" },
      { label: "Protection", value: "IP68 dust and water protection" },
      { label: "Drop resistance", value: "1.2m pole drop / fall on concrete depending on model" },
      { label: "Operating temperature", value: "PCR100T -20°C to +55°C; PCR500/PCR500Pro -20°C to +65°C" },
      { label: "Dimensions / weight", value: "Around 228 x 96 x 21mm and 420g for PCR500/PCR500Pro; PCR100T 221 x 78 x 16.5mm and 410.6g" },
      { label: "Certifications", value: "CE, FCC and regional certifications listed for controller line" }
    ]
  }
];

const tca930Specs: ProductSpecGroup[] = [
  {
    title: "Signal Tracking and RF",
    specs: [
      { label: "Signals", value: "GPS L1/L2/L5/L-Band, GLONASS L1/L2/L3, Galileo E1/E5a/E5b/E6, BDS B1/B2/B3, QZSS L1/L2/L5/L6, SBAS L1/L5, NavIC L5" },
      { label: "Nominal impedance", value: "50 ohm" },
      { label: "Polarization", value: "RHCP" },
      { label: "Axial ratio", value: "<=2dB" },
      { label: "Gain at zenith", value: "1164-1300MHz 7.0dBi max; 1525-1615MHz 6.5dBi max" },
      { label: "LNA gain", value: "50dB typical" },
      { label: "Noise figure", value: "<=2dB" },
      { label: "Group delay ripple", value: "<5ns" }
    ]
  },
  {
    title: "Mechanical and Environment",
    specs: [
      { label: "Operation voltage", value: "+3.3VDC to +12VDC" },
      { label: "Operation current", value: "60mA maximum" },
      { label: "Dimensions", value: "Phi379mm x 312mm" },
      { label: "Connector", value: "TNC female" },
      { label: "Weight", value: "<=10.5kg" },
      { label: "Mounting", value: "BSW 5/8''-11 screw, depth >=22mm" },
      { label: "Operating temperature", value: "-40°C to +85°C" },
      { label: "Protection", value: "IP67" },
      { label: "Compliance", value: "IGS, NGS, CE, FCC, RoHS" }
    ]
  }
];

const surveyAntennaSpecs: ProductSpecGroup[] = [
  {
    title: "Signal and RF Performance",
    specs: [
      { label: "Signals", value: "GPS L1/L2/L5, GLONASS L1/L2/L3, Galileo E1/E5a/E5b/E6, BDS B1/B2/B3, QZSS L1/L2/L5/L6, SBAS L1/L5, NavIC L5 and L-Band depending on model" },
      { label: "Phase center offset", value: "2mm listed for TSA520" },
      { label: "Nominal impedance", value: "50 ohm" },
      { label: "Polarization", value: "RHCP" },
      { label: "Axial ratio", value: "<=3dB" },
      { label: "Gain at zenith", value: "TSA520 4.5dBi" },
      { label: "LNA gain", value: "L1 34 +/-2dB, L2 36 +/-2dB on TSA520" },
      { label: "Noise figure", value: "<=2dB" },
      { label: "Operation voltage", value: "+3.3VDC to +12VDC" }
    ]
  },
  {
    title: "Mechanical and Installation",
    specs: [
      { label: "Operation current", value: "<=45mA on TSA520" },
      { label: "Group delay ripple", value: "<=5ns" },
      { label: "Dimensions", value: "TSA520 Phi152mm x 62.2mm" },
      { label: "Connector", value: "TNC female" },
      { label: "Weight", value: "<=400g on TSA520" },
      { label: "Mounting", value: "BSW 5/8''-11 screw, depth 12-14mm" },
      { label: "Operating temperature", value: "-40°C to +85°C" },
      { label: "Storage temperature", value: "-55°C to +85°C" },
      { label: "Protection", value: "IP67" }
    ]
  }
];

const agriMachineSpecs: Record<string, ProductSpecGroup[]> = {
  tag66: [
    {
      title: "Receiver and Control",
      specs: [
        { label: "GNSS signals", value: "GPS L1/L2/L5, GLONASS L1/L2, Galileo E1/E5a/E5b, BDS B1/B2/B3" },
        { label: "RTK accuracy", value: "Horizontal +/-8mm + 1ppm RMS, Vertical +/-15mm + 1ppm RMS" },
        { label: "Speed range", value: "0.15 to 25km/h" },
        { label: "Pass precision", value: "2.5cm under RTK conditions" },
        { label: "Operating modes", value: "AB line, A+ line, custom curves, angle harrowing and shared multi-vehicle operation" },
        { label: "Correction input", value: "External RTK corrections via UHF radio supported" }
      ]
    },
    {
      title: "Hardware and Accessories",
      specs: [
        { label: "Display terminal", value: "12-inch 5-point capacitive touch, Android 11, Linux 5.10 / Qt 5.15.7, 1280 x 800, 750cd/m2" },
        { label: "Communication", value: "4G, Wi-Fi 2.4G/5G, BT 4.2 BLE, USB 3.0, RS232, RS485 and CAN" },
        { label: "Auto steering motor", value: "Rated torque 7.5N.m, max 180RPM, 15A rated current, 9-32VDC" },
        { label: "Protection", value: "Display IP65, GNSS receiver IP69K" },
        { label: "Kit", value: "Receiver, tablet, steering wheel, motor and driver, main cable, tablet power cable, mount and screw accessory pack" }
      ]
    }
  ],
  tag88: [
    {
      title: "System Capability",
      specs: [
        { label: "GNSS signals", value: "BDS, GPS, GLONASS, Galileo, QZSS, IRNSS and L-Band listed in brochure" },
        { label: "Coverage", value: "Base station maximum radius up to 30km" },
        { label: "Operation accuracy", value: "+/-2.5cm land leveling operation accuracy" },
        { label: "Operation", value: "Supports 24-hour continuous operation and multiple simultaneous devices" },
        { label: "Applications", value: "Agricultural field leveling, road construction, building site preparation, airport runway construction, mining and landscape grading" }
      ]
    },
    {
      title: "Display, ECU and Kit",
      specs: [
        { label: "Display terminal", value: "12-inch 5-point capacitive touch, Android 11, Linux 5.10 / Qt 5.15.7, 1280 x 800, 750cd/m2" },
        { label: "ECU", value: "16 x 10.8 x 4.5cm, 9-36V input, 12V hydraulic output" },
        { label: "Environment", value: "GNSS antenna -40°C to +85°C operating, -55°C to +85°C storage" },
        { label: "Protection", value: "Display IP65" },
        { label: "Kit", value: "Tablet, ECU, GNSS antenna, hydraulic control valve, holder, power cable, hydraulic valve cable and antenna cable" }
      ]
    }
  ],
  tmc10: [
    {
      title: "Guidance and GNSS",
      specs: [
        { label: "GNSS signals", value: "BDS, GPS, GLONASS, Galileo, QZSS, IRNSS and L-Band listed in brochure" },
        { label: "Positioning accuracy", value: "2cm positioning accuracy described in brochure" },
        { label: "Heading accuracy", value: "0.1 degrees" },
        { label: "Use case", value: "Dozer grading, road and rail grading, dam construction, riverbed leveling and land preparation" },
        { label: "Operation", value: "3D model guidance for stakeless earthwork operations" }
      ]
    },
    {
      title: "Display, Sensor and Kit",
      specs: [
        { label: "Display", value: "10.1-inch 5-point capacitive touch, 1024 x 600, 750cd/m2" },
        { label: "Communication", value: "4G, Wi-Fi 2.4G, BT 4.2 BLE, USB 2.0, RS232, RS485 and CAN" },
        { label: "Gyroscope range", value: "+/-400 degrees/s" },
        { label: "Output rate", value: "0.2Hz to 500Hz, default 10Hz" },
        { label: "Protection", value: "Display IP65; operating temperature -30°C to +70°C" },
        { label: "Kit", value: "Tablet, ECU, gyroscope, 2 GNSS antennas, main cable, data cable, tablet power cable, antenna harness, mount, screws and support rod kit" }
      ]
    }
  ],
  tmc20: [
    {
      title: "Excavator Guidance",
      specs: [
        { label: "GNSS signals", value: "BDS, GPS, GLONASS, Galileo, QZSS and IRNSS listed in brochure" },
        { label: "Planar accuracy", value: "Up to 2cm" },
        { label: "Fill / dig accuracy", value: "3cm high accuracy for fill and dig volumes" },
        { label: "Sensor angle range", value: "Pitch angle +/-80 degrees, roll angle +/-180 degrees" },
        { label: "Angle repeatability", value: "<0.05 degrees" },
        { label: "Dynamic accuracy", value: "0.7 degrees" },
        { label: "Applications", value: "Trench excavation, river channel excavation, slope trimming, slope leveling, night and all-weather construction" }
      ]
    }
  ]
};

const markingRobotSpecs: ProductSpecGroup[] = [
  {
    title: "Positioning and Workflow",
    specs: [
      { label: "GNSS positioning", value: "Full-constellation RTK positioning with 1408 channels" },
      { label: "Supported constellations", value: "BDS, GPS, GLONASS, Galileo, SBAS and QZSS listed in the latest TR10 series brochure" },
      { label: "File import", value: "DXF, CSV and other design file formats supported by the app" },
      { label: "Templates", value: "Built-in sports field models, icons, arrows and numbers, with user-defined editing and template import" },
      { label: "Workflow", value: "Import design file, calculation, task scheduling, route planning, measuring and locating, automatic marking and report output" }
    ]
  },
  {
    title: "Marking Performance",
    specs: [
      { label: "Marking accuracy", value: "+/-1.5cm listed in the latest TR10 series brochure" },
      { label: "Line types", value: "Dots, lines, curves, numbers, letters and patterns" },
      { label: "Drawing width", value: "5cm-15cm adjustable side nozzle" },
      { label: "Material", value: "Latex paint / titanium white slurry" },
      { label: "Hopper capacity", value: "10L" },
      { label: "Operating speed", value: "Maximum speed 1m/s; mobility speed listed as 2.6km/h" },
      { label: "Productivity", value: "Brochure describes the workflow as 3 times faster than manual work" }
    ]
  },
  {
    title: "Robot Platform",
    specs: [
      { label: "Dimensions", value: "TR10Pro: 525 x 746 x 527mm, with removable side scribing mechanism width of 243mm; TR10: 558 x 610 x 527mm" },
      { label: "Weight", value: "TR10: 36kg; TR10Pro: 39.3kg" },
      { label: "Motor", value: "400W x 2 hub motors" },
      { label: "Turning radius", value: "0-degree turn in place" },
      { label: "Climbing ability", value: "20 degrees" },
      { label: "Wheelbase / wheel track", value: "400mm wheelbase, 465mm wheel track" }
    ]
  },
  {
    title: "Controller, Battery and Environment",
    specs: [
      { label: "Controller", value: "Android tablet control" },
      { label: "Battery", value: "TR10: 48V / 15Ah lithium; TR10Pro: 48V / 7.5Ah lithium" },
      { label: "Battery life", value: "8 hours listed in the brochure" },
      { label: "Endurance", value: "Up to 30km listed in the brochure; customized battery capacity supported" },
      { label: "Communication", value: "CAN" },
      { label: "IP rating", value: "IP3X" },
      { label: "Temperature", value: "Operating -10°C to 60°C; storage -10°C to 45°C" }
    ]
  }
];

const tboatSpecs: ProductSpecGroup[] = [
  {
    title: "Series and Applications",
    specs: [
      { label: "Models", value: "Tboat10 for compact unmanned surface operations; Tboat20 for full-function professional USV projects" },
      { label: "Application scenarios", value: "Bathymetric survey, water quality monitoring, water quality sampling, patrol USV with side-scan sonar, hydrological monitoring and underwater surveying" },
      { label: "Payload", value: "Tboat10 maximum payload 35kg; Tboat20 maximum payload 50kg" },
      { label: "Hull protection", value: "IP67 waterproof and dustproof hull design with reinforced bumper protection" }
    ]
  },
  {
    title: "Hull, Power and Endurance",
    specs: [
      { label: "Tboat10 hull dimensions", value: "980 x 520 x 254mm; draft 8.5cm; hull 7kg, total weight 30kg" },
      { label: "Tboat20 hull dimensions", value: "1280 x 580 x 430mm; draft 10cm; hull 12kg, total weight 40kg" },
      { label: "Battery", value: "33.6V 25Ah x 2 rechargeable ternary lithium battery packs with hot-swap replacement" },
      { label: "Operating time", value: "3 hours at 2m/s; up to 7 hours at 1.5m/s" },
      { label: "Maximum speed", value: "Tboat10 up to 7m/s and supports safe passage through 4m/s current cross-sections; Tboat20 up to 6m/s" },
      { label: "Motor", value: "Brushless dual motors; Tboat10 rated 900W, Tboat20 rated 1100W" }
    ]
  },
  {
    title: "Navigation, Control and Communication",
    specs: [
      { label: "GNSS", value: "Built-in GNSS positioning and orientation dual antenna with BDS, GPS, GLONASS, Galileo, QZSS and SBAS signal support" },
      { label: "RTK positioning accuracy", value: "Horizontal +/-8mm + 1ppm; vertical +/-15mm + 1ppm" },
      { label: "Directional accuracy", value: "0.1 degree accuracy with 1m baseline" },
      { label: "Control modes", value: "Manual, automatic, hover and return-to-home modes" },
      { label: "Communication", value: "4G and 2.4G data/video communication; optional base station radio and network CORS" },
      { label: "Interfaces", value: "2 x RJ45 Ethernet ports, 2 x RS232 serial ports, 2 x RS485 serial ports" }
    ]
  },
  {
    title: "Depth Measurement and Payload Options",
    specs: [
      { label: "Depth frequency", value: "200kHz single-beam depth measurement listed in series brochure" },
      { label: "Depth range", value: "0.15-200m, with extended range available as an option" },
      { label: "Depth accuracy", value: "+/-1cm + 0.1% D, where D is water depth" },
      { label: "Payload options", value: "Echo sounder, side-scan sonar, multibeam echo sounder, ADCP, in-situ analyzer, cameras, LiDAR and water quality sensors depending on configuration" }
    ]
  }
];

const tsr20Specs: ProductSpecGroup[] = [
  {
    title: "SLAM Mapping System",
    specs: [
      { label: "Mapping mode", value: "SLAM, RTK-SLAM and PPK-SLAM" },
      { label: "Accuracy", value: "≤3cm relative accuracy and ≤5cm absolute accuracy listed in TSR20 EN brochure" },
      { label: "Point cloud thickness", value: "1cm" },
      { label: "Point cloud update frequency", value: "10Hz" },
      { label: "Typical applications", value: "Underground, indoor, stairs, parking lots, outdoor buildings, low-canopy forest and power line patrol" }
    ]
  },
  {
    title: "LiDAR and Camera",
    specs: [
      { label: "Laser sensor", value: "Livox Mid-360 LiDAR" },
      { label: "Measuring range", value: "40m at 10% reflectivity" },
      { label: "Scan rate", value: "Single echo, 200,000 points/sec" },
      { label: "Field of view", value: "Horizontal 360 degrees; vertical -7 degrees to 52 degrees" },
      { label: "Range accuracy", value: "≤2cm at 10m, ≤3cm at 0.2m" },
      { label: "Camera", value: "Dual 20MP cameras with 200-degree ultra-wide time-synchronized scanning" }
    ]
  },
  {
    title: "GNSS / POS",
    specs: [
      { label: "GNSS system", value: "GPS L1/L2/L5, GLONASS L1/L2, Galileo E1/E5a/E5b and BDS signals listed in brochure" },
      { label: "Positioning accuracy", value: "Horizontal +/-0.02m, vertical +/-0.03m" },
      { label: "IMU update rate", value: "200Hz" },
      { label: "Pitch accuracy", value: "0.015 degrees" },
      { label: "Roll accuracy", value: "0.015 degrees" },
      { label: "Heading accuracy", value: "0.040 degrees" }
    ]
  },
  {
    title: "Hardware and Storage",
    specs: [
      { label: "Dimensions", value: "16.5 x 12.0 x 32.4cm" },
      { label: "Weight", value: "1.0kg including battery" },
      { label: "Operating temperature", value: "-20°C to 55°C" },
      { label: "System consumption", value: "25W" },
      { label: "Storage", value: "64GB internal flash memory and 128GB MicroSD card support" },
      { label: "Wi-Fi transmission", value: "Smooth data reception within 5m" }
    ]
  }
];

const detailedSpecGroups: Record<string, ProductSpecGroup[]> = {
  t5lite: t5FamilySpecs,
  t5: t5FamilySpecs,
  t10pro: t10T20Specs,
  t20pro: t10T20Specs,
  t30: t30T40Specs,
  t30pro: t30T40Specs,
  t40: t30T40Specs,
  t40pro: t30T40Specs,
  t50basic: t50FamilySpecs,
  t50: t50FamilySpecs,
  t50pro: t50FamilySpecs,
  net660: net660FamilySpecs,
  net660i: net660FamilySpecs,
  "net660i-h": net660FamilySpecs,
  "net660i-1u": net660FamilySpecs,
  pcr100t: controllerSpecs,
  pcr500: controllerSpecs,
  pcr500pro: controllerSpecs,
  tca930: tca930Specs,
  tca930m: tca930Specs,
  tsa520: surveyAntennaSpecs,
  tag66: agriMachineSpecs.tag66,
  tag88: agriMachineSpecs.tag88,
  tmc10: agriMachineSpecs.tmc10,
  tmc20: agriMachineSpecs.tmc20,
  "marking-robot": markingRobotSpecs,
  "tboat-usv-series": tboatSpecs,
  "tsr20-slam": tsr20Specs
};

const categoryApplications: Record<string, { title: string; text: string; products: string }[]> = {
  "gnss-receivers": [
    { title: "Surveying and Mapping", text: "RTK rovers, controllers and accessories for cadastral survey, topographic mapping and daily field stakeout.", products: "T5Lite, T5, T10Pro, T30, T50" },
    { title: "Construction Layout", text: "Laser, AR and photogrammetry receiver options for contractors that need faster point collection and layout confirmation.", products: "T30, T40, T50, T50Pro" },
    { title: "Base Station and CORS", text: "Base receivers and infrastructure units for correction transmission, monitoring and long-term reference networks.", products: "tBase, NET660, NET660i" }
  ],
  "rugged-gis": [
    { title: "Field Survey Control", text: "Rugged Android controllers for RTK setup, stakeout, collection and field software operation.", products: "PCR100T, PCR500, PCR500Pro" },
    { title: "GIS Data Collection", text: "Portable terminals and controllers for mobile crews collecting assets, boundaries and inspection data.", products: "P8 / P8Pro, P8Glo" },
    { title: "Harsh Outdoor Work", text: "Rugged hardware for long workdays, strong sunlight, dust and mobile communication requirements.", products: "PCR500, PCR600" }
  ],
  "gnss-antennas": [
    { title: "CORS and Monitoring", text: "Choke ring antennas for stable fixed-station reception and multipath-sensitive environments.", products: "TCA920, TCA930, TCA930M" },
    { title: "Survey and Base Setup", text: "Survey antennas for external measurement workflows, base stations and mobile mapping kits.", products: "TSA320, TSA500, TSA520" },
    { title: "Compact Integration", text: "Helix antennas for handheld GNSS, UAV, machine-control and embedded high-precision positioning.", products: "THA series" }
  ],
  "precision-agriculture-machine-control": [
    { title: "Precision Farming", text: "Auto-steering and land-leveling workflows for sowing, spraying, plowing and field preparation.", products: "TAG66, TAG88" },
    { title: "Earthwork Guidance", text: "3D guidance systems for dozer grading, excavation and digital construction workflows.", products: "TMC10, TMC20" },
    { title: "Dealer Solution Packages", text: "Bundle GNSS antennas, controllers and installation support for agriculture and construction-machine dealers.", products: "TAG / TMC series" }
  ],
  accessories: [
    { title: "Complete RTK Kits", text: "Cases, chargers, brackets, tripods and poles for receiver kits shipped to field crews or distributors.", products: "RTK cases, power adapters, brackets" },
    { title: "Base Station Setup", text: "Cables, antennas and mounting parts for CORS, base-rover and monitoring station deployments.", products: "GNSS cables, antenna accessories" },
    { title: "Spare Parts Planning", text: "Accessory lists for overseas dealers preparing service inventory and replacement packages.", products: "Accessory kit families" }
  ],
  "gnss-application-solutions": [
    { title: "Deformation Monitoring", text: "GNSS monitoring packages for landslides, dams, bridges, mining subsidence and structural safety projects.", products: "Monitoring solution" },
    { title: "CORS / VRS Service", text: "Reference station hardware and correction-service concepts for regional positioning infrastructure.", products: "CORS and VRS solution" },
    { title: "Robotic Line Marking", text: "RTK-guided marking workflows for sports fields, roads, runways and pre-marking service providers.", products: "TR10Pro Line Marking Robot" },
    { title: "USV Hydrographic Survey", text: "Unmanned surface vehicle workflows for bathymetric survey, water quality monitoring, patrol and underwater surveying projects.", products: "Tboat10 / Tboat20 USV" },
    { title: "Handheld LiDAR SLAM", text: "Mobile 3D scanning for indoor mapping, outdoor buildings, digital twins, power line patrol and GNSS-denied environments.", products: "TSR20 Handheld LiDAR SLAM" }
  ]
};

const catalogDownloads: Record<string, ProductDownload> = {
  "gnss-receivers": {
    label: "Download GNSS Receiver Catalog",
    description: "Full TOKNAV GNSS receiver brochure for RTK rover, base station and CORS model comparison.",
    href: "/assets/downloads/catalogs/gnss-receiver.pdf",
    kind: "catalog"
  },
  "rugged-gis": {
    label: "Download Rugged & GIS Catalog",
    description: "Controller and portable RTK brochure for field software, GIS and surveying workflows.",
    href: "/assets/downloads/catalogs/rugged-gis.pdf",
    kind: "catalog"
  },
  "gnss-antennas": {
    label: "Download GNSS Antenna Catalog",
    description: "Antenna brochure covering choke ring, survey and helix antenna families.",
    href: "/assets/downloads/catalogs/gnss-antennas.pdf",
    kind: "catalog"
  },
  "precision-agriculture-machine-control": {
    label: "Download Agriculture & Machine Control Catalog",
    description: "Solution brochure for auto-steering, land leveling, dozer and excavator guidance.",
    href: "/assets/downloads/catalogs/precision-agriculture-machine-control.pdf",
    kind: "catalog"
  },
  accessories: {
    label: "Download Accessories Catalog",
    description: "Accessory brochure for cables, antennas, cases, toolboxes and replacement kit items.",
    href: "/assets/downloads/catalogs/accessories.pdf",
    kind: "catalog"
  },
  "gnss-application-solutions": {
    label: "Download Solution Brochure",
    description: "Application brochure for monitoring, CORS/VRS and complete GNSS project solutions.",
    href: "/assets/downloads/catalogs/solution-brochure.pdf",
    kind: "catalog"
  }
};

const modelDatasheets: Record<string, ProductDatasheet> = {
  t5lite: {
    label: "Download T5Lite Datasheet",
    description: "Latest T5Lite economical handheld RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t5lite.pdf",
    updated: "2025-09"
  },
  t5: {
    label: "Download T5 Datasheet",
    description: "Latest T5 handheld convenient RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t5.pdf",
    updated: "2025-09"
  },
  t10pro: {
    label: "Download T10Pro Datasheet",
    description: "Latest T10Pro engineering-level RTK datasheet, updated October 2025.",
    href: "/assets/downloads/datasheets/t10pro.pdf",
    updated: "2025-10"
  },
  t20pro: {
    label: "Download T20Pro Datasheet",
    description: "Latest T20Pro multifunctional intelligent RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t20pro.pdf",
    updated: "2025-09"
  },
  tbase: {
    label: "Download tBase Datasheet",
    description: "Latest tBase professional base station RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/tbase.pdf",
    updated: "2025-09"
  },
  t30: {
    label: "Download T30 Datasheet",
    description: "Latest T30 laser measurement RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t30.pdf",
    updated: "2025-09"
  },
  t30pro: {
    label: "Download T30Pro Datasheet",
    description: "Latest T30Pro photogrammetry and AR stakeout RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t30pro.pdf",
    updated: "2025-09"
  },
  t40: {
    label: "Download T40 Datasheet",
    description: "Latest T40 AR stakeout and laser RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t40.pdf",
    updated: "2025-09"
  },
  t40pro: {
    label: "Download T40Pro Datasheet",
    description: "Latest T40Pro photogrammetry RTK datasheet, updated September 2025.",
    href: "/assets/downloads/datasheets/t40pro.pdf",
    updated: "2025-09"
  },
  t50basic: {
    label: "Download T50basic Datasheet",
    description: "Latest T50basic palm-sized AR IMU RTK datasheet, updated November 2025.",
    href: "/assets/downloads/datasheets/t50basic.pdf",
    updated: "2025-11"
  },
  t50: {
    label: "Download T50 Datasheet",
    description: "Latest T50 palm-sized laser RTK datasheet, updated April 2026.",
    href: "/assets/downloads/datasheets/t50.pdf",
    updated: "2026-04"
  },
  t50pro: {
    label: "Download T50Pro Datasheet",
    description: "Latest T50Pro palm-sized photogrammetry RTK datasheet, updated November 2025.",
    href: "/assets/downloads/datasheets/t50pro.pdf",
    updated: "2025-11"
  },
  net660: {
    label: "Download NET660 Datasheet",
    description: "NET660 CORS and base station receiver datasheet for infrastructure projects.",
    href: "/assets/downloads/datasheets/net660.pdf",
    updated: "2024-06"
  },
  net660i: {
    label: "Download NET660i Datasheet",
    description: "NET660i miniaturized GNSS receiver datasheet for CORS and system integration.",
    href: "/assets/downloads/datasheets/net660i.pdf",
    updated: "2023-11"
  },
  "net660i-h": {
    label: "Download NET660i-H Datasheet",
    description: "NET660i-H compact GNSS receiver datasheet for cost-effective integration projects.",
    href: "/assets/downloads/datasheets/net660i-h.pdf",
    updated: "2023-11"
  },
  "net660i-1u": {
    label: "Download NET660i Family Datasheet",
    description: "NET660i family datasheet for rack-style and station-room receiver planning.",
    href: "/assets/downloads/datasheets/net660i.pdf",
    updated: "2023-11"
  },
  "marking-robot": {
    label: "Download TR10 Series Datasheet",
    description: "Latest TR10 series intelligent marking robot brochure, updated April 2026.",
    href: "/assets/downloads/datasheets/tr10series.pdf",
    updated: "2026-04"
  },
  "tboat-usv-series": {
    label: "Download Tboat Series Datasheet",
    description: "Tboat10 and Tboat20 unmanned surface vehicle brochure for USV survey and monitoring projects.",
    href: "/assets/downloads/datasheets/tboat-series.pdf",
    updated: "2025"
  },
  "tsr20-slam": {
    label: "Download TSR20 Datasheet",
    description: "TSR20 handheld LiDAR SLAM scanner brochure with mapping modes, LiDAR, camera and POS specifications.",
    href: "/assets/downloads/datasheets/tsr20.pdf",
    updated: "2026-06"
  }
};

export function getCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}

function mapCmsProduct(product: ReturnType<typeof getPublishedCmsProducts>[number]): Product {
  return {
    slug: product.slug,
    name: product.name,
    categorySlug: product.category,
    type: product.type || product.tags[0] || "CMS product",
    image: product.image || "/assets/products/gnss-receiver-series-combo.webp",
    excerpt: product.summary || product.description.slice(0, 180),
    description: product.description,
    applications: product.applications?.length ? product.applications : product.tags.length ? product.tags : ["Surveying", "B2B projects"],
    highlights: product.highlights?.length ? product.highlights : product.specs.length ? product.specs.slice(0, 6).map((spec) => `${spec.label}: ${spec.value}`) : product.tags,
    specs: product.specs,
    source: "CMS",
    gallery: product.gallery.length ? product.gallery : product.image ? [product.image] : undefined,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription
  };
}

export function getAllProducts() {
  const cmsProducts = getPublishedCmsProducts().map(mapCmsProduct);
  const cmsKeys = new Set(cmsProducts.map((product) => `${product.categorySlug}/${product.slug}`));
  return [...cmsProducts, ...products.filter((product) => !cmsKeys.has(`${product.categorySlug}/${product.slug}`))];
}

export function getProductsByCategory(categorySlug: string) {
  return getAllProducts().filter((product) => product.categorySlug === categorySlug);
}

export function getCategoryApplications(categorySlug: string) {
  return categoryApplications[categorySlug] ?? [];
}

export function getProduct(categorySlug: string, productSlug: string) {
  return getAllProducts().find((product) => product.categorySlug === categorySlug && product.slug === productSlug);
}

export function getProductSpecGroups(product: Product): ProductSpecGroup[] {
  if (product.source === "CMS" && product.specs.length > 0) {
    return [
      {
        title: "CMS Specifications",
        specs: product.specs
      }
    ];
  }

  return detailedSpecGroups[product.slug] ?? [
    {
      title: "Technical Snapshot",
      specs: product.specs
    }
  ];
}

export function getProductInquiryUrl(product: Product) {
  const message = `I am interested in ${product.name}. Please send the latest datasheet, price, MOQ, lead time and recommended accessories.`;
  const params = new URLSearchParams({
    product: product.name,
    message
  });
  return `/inquiry?${params.toString()}`;
}

export function getProductDownloads(product: Product): ProductDownload[] {
  const inquiryHref = getProductInquiryUrl(product);
  const catalog = catalogDownloads[product.categorySlug];
  const datasheet = modelDatasheets[product.slug];
  const downloads: ProductDownload[] = [];
  if (catalog) downloads.push(catalog);
  downloads.push(
    datasheet
      ? {
          label: datasheet.label,
          description: datasheet.description,
          href: datasheet.href,
          kind: "datasheet"
        }
      : {
          label: "Ask for Latest Model Datasheet",
          description: `Request the latest ${product.name} datasheet, packing list, dealer price and firmware-related notes before ordering.`,
          href: inquiryHref,
          kind: "datasheet"
        }
  );
  downloads.push({
    label: "Send Project Requirements",
    description: "Share quantity, country, application, correction method and accessory needs for a faster quotation.",
    href: inquiryHref,
    kind: "quote"
  });
  return downloads;
}

export function getProductDatasheet(product: Product) {
  return modelDatasheets[product.slug];
}

export function getProductGallery(product: Product) {
  return product.gallery ?? [product.image];
}

export function getProductBuyerBenefits(product: Product) {
  if (product.slug === "marking-robot") {
    return [
      "Built-in field templates and imported DXF/CSV files help crews move from design to marking with fewer manual layout steps.",
      "RTK positioning and robotic route planning support repeatable centimeter-level line marking on sports fields, roads and runways.",
      "The adjustable side nozzle, 10L hopper and 0-degree turn-in-place design make the robot practical for different marking jobs and tight spaces."
    ];
  }
  if (product.slug === "tboat-usv-series") {
    return [
      "The Tboat series gives distributors two USV sizes for different water-area projects, from compact bathymetric survey to professional multi-payload operations.",
      "RTK positioning, 4G/2.4G communication and optional radio/CORS workflows help integrators plan reliable unmanned water-surface data collection.",
      "Payload options such as echo sounder, side-scan sonar, ADCP and water quality sensors make the platform practical for survey, patrol and monitoring bids."
    ];
  }
  if (product.slug === "tsr20-slam") {
    return [
      "SLAM, RTK-SLAM and PPK-SLAM modes help buyers cover both GNSS and GNSS-denied mapping environments with one handheld scanner.",
      "The 1.0kg body, Livox Mid-360 LiDAR and dual 20MP cameras support fast field capture for indoor mapping, digital twins and infrastructure inspection.",
      "Built-in storage, Wi-Fi transfer and dedicated post-processing workflow make it easier for dealers to demonstrate a complete 3D scanning solution."
    ];
  }
  if (["t30", "t40", "t50"].includes(product.slug)) {
    return [
      "Laser-assisted measurement helps crews collect difficult or unsafe points without occupying every point directly.",
      "AR stakeout and visual workflows reduce field rework on construction and layout projects.",
      "Rugged IP68 housing and long battery design support outdoor survey teams and dealer demo kits."
    ];
  }
  if (["t30pro", "t40pro", "t50pro"].includes(product.slug)) {
    return [
      "Photogrammetry and AR workflows help overseas dealers position the model as a productivity upgrade.",
      "Full-system GNSS tracking, IMU tilt and integrated communication options cover common survey scenarios.",
      "The compact receiver package is suitable for distributor demos, tender preparation and project delivery."
    ];
  }
  if (["t20pro", "tbase"].includes(product.slug)) {
    return [
      "High-power radio capability is useful for base-rover operations in open construction and survey sites.",
      "Integrated 4G, radio, Bluetooth and Wi-Fi reduce the need for extra field accessories.",
      "The model fits B2B buyers who need stable correction transmission and practical field endurance."
    ];
  }
  if (product.slug.startsWith("net660")) {
    return [
      "Designed for CORS, monitoring and reference station infrastructure where interfaces and protocols matter.",
      "Linux platform, Ethernet and serial connectivity support system integration and remote management workflows.",
      "The receiver family is suitable for integrators that need project documentation and long-term deployment planning."
    ];
  }
  return [
    "Compact receiver design helps dealers offer an accessible RTK option for surveying and mapping customers.",
    "Multi-constellation tracking, Linux platform and IMU support cover mainstream field requirements.",
    "The model can be quoted with a complete kit, including controller, pole, charger, case and accessories."
  ];
}

export function getProductSeoTitle(product: Product) {
  if (product.seoTitle) return product.seoTitle;
  return `${product.name} Specs, Datasheet and Quote | TOKNAV`;
}

export function getProductMetaDescription(product: Product) {
  if (product.seoDescription) return product.seoDescription;
  if (product.slug === "marking-robot") {
    return "Review TR10Pro line marking robot features, RTK positioning, sports field templates, DXF/CSV import, marking accuracy, specifications and quote options.";
  }
  if (product.slug === "tboat-usv-series") {
    return "Review TOKNAV Tboat10 and Tboat20 USV specifications, payloads, RTK navigation, bathymetric survey applications, datasheet download and quote support.";
  }
  if (product.slug === "tsr20-slam") {
    return "Review TSR20 handheld LiDAR SLAM scanner specifications, SLAM/RTK-SLAM/PPK-SLAM modes, Livox Mid-360 LiDAR, camera system and quote support.";
  }
  return `Review ${product.name} specifications, applications, catalog source, downloadable brochure and quote options for B2B GNSS purchasing.`;
}

export function getProductFaqs(product: Product) {
  return [
    {
      question: `What is ${product.name} mainly used for?`,
      answer: `${product.name} is mainly used for ${product.applications.join(", ")}. Buyers can confirm the final configuration based on project application, country, correction method and accessory requirements.`
    },
    {
      question: `Can I request the latest datasheet and price for ${product.name}?`,
      answer: `Yes. Use the quote form on this page to request the latest datasheet, price, MOQ, lead time, packing list and recommended accessories for ${product.name}.`
    },
    {
      question: "Are the parameters final for every market?",
      answer: "Product parameters may be updated by the manufacturer and can vary by configuration or regional version. TOKNAV should confirm the latest configuration before quotation or shipment."
    }
  ];
}
