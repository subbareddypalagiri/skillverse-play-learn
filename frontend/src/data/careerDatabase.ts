// Comprehensive UG & PG career database mapping (15 Deep Departments, 90+ Specializations, 150+ Roles)
export const branchCatalog = [
  {
    id: 'cse',
    category: 'ug',
    name: 'Computer Science Engineering (CSE)',
    badge: 'UG Core Computing',
    level: 'High Demand',
    desc: 'Master artificial intelligence, distributed systems, cybersecurity, cloud software engineering, and spatial graphics powering digital tech titans.',
    stats: '7 Specializations • 14 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'aids',
    category: 'emerging',
    name: 'AI & Data Science Engineering',
    badge: 'Emerging Frontier',
    level: 'Highest Growth',
    desc: 'Specialized deep learning, generative AI foundation models, neural engineering, computer vision, and petabyte-scale streaming analytics architecture.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'it',
    category: 'ug',
    name: 'Information Technology & FinTech',
    badge: 'UG Cloud & Systems',
    level: 'High Pay Benchmark',
    desc: 'Architect multi-cloud hybrid servers, zero-trust network security, ultra-low latency quantitative financial trading engines, and distributed databases.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'ece',
    category: 'ug',
    name: 'Electronics & Communication (ECE)',
    badge: 'UG Hardware & Silicon',
    level: 'Core Semiconductor',
    desc: 'Architect sub-nanometer VLSI microchips, 5G/6G aerospace telecommunications, silicon photonics, quantum circuits, and IoT microcontrollers.',
    stats: '7 Specializations • 14 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'eee',
    category: 'ug',
    name: 'Electrical & Electronics (EEE)',
    badge: 'UG Power & EV Systems',
    level: 'Evergreen Core',
    desc: 'Design green renewable energy micro-grids, high-voltage SiC traction battery inverters, SCADA automation networks, and smart lighting grids.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'mech',
    category: 'ug',
    name: 'Mechanical Systems Engineering',
    badge: 'UG Robotics & Aero',
    level: 'Core Industry',
    desc: 'Engineer multi-axis robotic kinematics, supersonic aerodynamic turbine propulsion, EV mechatronics, additive 3D printing, and net-zero HVAC.',
    stats: '7 Specializations • 14 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'civil',
    category: 'ug',
    name: 'Civil & Smart Infrastructure',
    badge: 'UG Smart Cities',
    level: 'Global Infrastructure',
    desc: 'Simulate urban digital twins, earthquake-resilient suspension structures, high-speed maglev rail tracks, and 7D sustainable BIM networks.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'chem',
    category: 'ug',
    name: 'Chemical & Green Process Engineering',
    badge: 'UG Clean Energy',
    level: 'Specialized Core',
    desc: 'Innovate green hydrogen electrolyzers, sustainable ammonia synthesis, biodegradable polymers, carbon capture reactors, and fuel cell stacks.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'biotech',
    category: 'emerging',
    name: 'Biotechnology & Bioinformatics',
    badge: 'Bio-AI Frontier',
    level: 'R&D Pioneer',
    desc: 'Combine deep learning neural models with molecular genomics to simulate targeted antibody therapeutics, CRISPR editing, and 3D organ bioprinting.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'aero',
    category: 'ug',
    name: 'Aerospace & Spacecraft Engineering',
    badge: 'UG Space Tech',
    level: 'Elite Engineering',
    desc: 'Write orbital rocket guidance telemetry, Mach 8+ hypersonic propulsion models, CubeSat constellations, planetary rovers, and combat VTOL drones.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'metal',
    category: 'ug',
    name: 'Metallurgy & Advanced Materials',
    badge: 'UG Nanotechnology',
    level: 'Specialized R&D',
    desc: 'Synthesizes extreme heat-resistant titanium superalloys for rocket nozzles, GaN semiconductors, graphene supercapacitors, and smart shape-memory metals.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '4-Year B.Tech Degree'
  },
  {
    id: 'mtech_cloud',
    category: 'pg',
    name: 'M.Tech // Cloud & Distributed Systems',
    badge: 'PG Masters specialization',
    level: 'Executive Tech',
    desc: 'Advanced postgraduate specialization in zero-downtime distributed consensus algorithms, serverless runtime mesh, and carbon-aware edge topologies.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '2-Year M.Tech Postgraduate Degree'
  },
  {
    id: 'mtech_vlsi',
    category: 'pg',
    name: 'M.Tech // Quantum & VLSI Chip Design',
    badge: 'PG Masters specialization',
    level: 'Elite Hardware',
    desc: 'Postgraduate research in sub-2nm SoC GAA transistors, cryogenic quantum signal processing, neuromorphic AI chips, and 3D heterogeneous packaging.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '2-Year M.Tech Postgraduate Degree'
  },
  {
    id: 'mca',
    category: 'pg',
    name: 'Master of Computer Applications (MCA)',
    badge: 'PG Software Masters',
    level: 'High Demand',
    desc: 'Postgraduate degree focusing on cloud-native full stack architectures, zero-knowledge Web3 rollups, autonomous LangChain AI agents, and metaverse netcode.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '2-Year Postgraduate Degree'
  },
  {
    id: 'mba_tech',
    category: 'pg',
    name: 'MBA // Tech Leadership & AI Strategy',
    badge: 'PG Executive Management',
    level: 'C-Suite Fast Track',
    desc: 'Combine enterprise generative AI engineering roadmap strategy with global SaaS product leadership, FinTech venture scale, and corporate M&A.',
    stats: '6 Specializations • 12 Target Roles',
    duration: '2-Year Postgraduate Degree'
  }
];

export const careerDatabase: Record<string, any> = {
  cse: {
    subs: {
      aiml: {
        name: "Artificial Intelligence & ML",
        roles: [
          {
            title: "MLOps Chief Architect",
            desc: "Automates deployment, monitoring, and scaling of large language models and multi-modal neural networks across distributed GPU production clusters.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹22L - ₹42L", expert: "₹50L - ₹95L+" },
            promotions: ["Junior MLOps Engineer", "Senior ML Platform Specialist", "Principal AI Infrastructure Architect", "VP of Artificial Intelligence"]
          },
          {
            title: "Applied Computer Vision Scientist",
            desc: "Develops real-time spatial perception algorithms and 3D Gaussian splatting pipelines for autonomous vehicles and drone surveillance grids.",
            salary: { fresher: "₹9L - ₹16L", mid: "₹18L - ₹34L", expert: "₹42L - ₹80L" },
            promotions: ["CV Researcher", "Lead Applied Vision Scientist", "Director of Spatial Perception R&D"]
          }
        ]
      },
      datasci: {
        name: "Data Science & Big Data",
        roles: [
          {
            title: "Petabyte Streaming Data Architect",
            desc: "Builds high-throughput Apache Flink and Kafka streaming pipelines processing Petabytes of live telemetry and real-time financial datasets.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹45L - ₹90L+" },
            promotions: ["Data Engineer", "Senior Big Data Lead", "Principal Data Platform Architect", "Chief Data Officer (CDO)"]
          },
          {
            title: "Enterprise Quantitative Analytics Lead",
            desc: "Constructs probabilistic predictive forecasting models and causal inference algorithms guiding C-suite enterprise financial strategies.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹32L", expert: "₹40L - ₹75L" },
            promotions: ["Data Scientist", "Lead Statistical Analyst", "Head of Decision Science"]
          }
        ]
      },
      cyber: {
        name: "Offensive Cyber Security",
        roles: [
          {
            title: "Red Team Zero-Day Penetration Lead",
            desc: "Conducts ethical zero-day vulnerability exploits and adversary red team security simulations on enterprise multi-cloud infrastructures.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹35L", expert: "₹42L - ₹85L" },
            promotions: ["Security Analyst", "Senior Offensive Hacker", "Principal Security Architect", "Chief Information Security Officer (CISO)"]
          },
          {
            title: "Cloud Cryptography Defense Architect",
            desc: "Implements quantum-resistant cryptographic encryption meshes and automated zero-trust runtime anomaly containment protocols.",
            salary: { fresher: "₹9L - ₹16L", mid: "₹20L - ₹38L", expert: "₹45L - ₹88L" },
            promotions: ["Cryptographic Analyst", "Lead Cloud Security Specialist", "Director of Cryptographic Defense"]
          }
        ]
      },
      cloud: {
        name: "Cloud Computing & DevOps",
        roles: [
          {
            title: "Principal Site Reliability Engineer (SRE)",
            desc: "Guarantees 99.999% global availability across hybrid Kubernetes serverless clusters using automated chaos engineering pipelines.",
            salary: { fresher: "₹9L - ₹16L", mid: "₹19L - ₹36L", expert: "₹44L - ₹85L+" },
            promotions: ["Junior SRE", "Senior Platform DevOps Lead", "Principal Infrastructure Fellow", "VP of Cloud Operations"]
          },
          {
            title: "Multi-Cloud Solutions Architect",
            desc: "Architects disaster-resilient multi-region serverless topologies across AWS, Azure, and Google Cloud with Terraform automation.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Cloud Consultant", "Lead Infrastructure Architect", "Global Cloud Director"]
          }
        ]
      },
      fullstack: {
        name: "Full Stack Web & Mobile Systems",
        roles: [
          {
            title: "Distributed Microservices Architect",
            desc: "Designs high-concurrency event-driven Go/Rust microservices and GraphQL API gateways supporting 10M+ daily active enterprise users.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹34L", expert: "₹40L - ₹80L" },
            promotions: ["Full Stack Developer", "Lead Systems Architect", "Principal Engineering Fellow"]
          },
          {
            title: "Principal Frontend Spatial Engineer",
            desc: "Architects ultra-smooth 120 FPS web client architectures using React 19, WebGL, and WebAssembly high-performance rendering engines.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹36L - ₹72L" },
            promotions: ["UI/UX Engineer", "Senior Client Architect", "Head of Frontend Experience"]
          }
        ]
      },
      gamevr: {
        name: "Game Dev & AR/VR Graphics",
        roles: [
          {
            title: "Unreal Engine 5 Graphics Architect",
            desc: "Writes custom Nanite geometry shaders and real-time raytracing lighting pipelines for AAA game engines and spatial simulations.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["3D Graphics Programmer", "Lead Engine Architect", "Chief Technical Director"]
          },
          {
            title: "Spatial Computing AR/VR Lead",
            desc: "Develops gesture-tracked mixed reality experiences and haptic feedback loops for Apple Vision Pro and Meta Quest hardware.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹42L - ₹82L" },
            promotions: ["Spatial Developer", "Lead XR Architect", "Director of Metaverse Engineering"]
          }
        ]
      },
      web3: {
        name: "Blockchain & Web3 Systems",
        roles: [
          {
            title: "Zero-Knowledge Cryptographic Architect",
            desc: "Develops zk-SNARK layer-2 rollup circuits and privacy-preserving decentralized execution kernels on Ethereum and Solana.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹24L - ₹48L", expert: "₹55L - ₹110L+" },
            promotions: ["Smart Contract Dev", "Lead Protocol Engineer", "Chief Blockchain Scientist"]
          },
          {
            title: "Smart Contract Security Auditor",
            desc: "Mathematically verifies formal proofs and conducts rigorous automated security fuzzing on multi-million dollar DeFi protocols.",
            salary: { fresher: "₹9L - ₹18L", mid: "₹22L - ₹42L", expert: "₹48L - ₹95L" },
            promotions: ["Protocol Auditor", "Lead Security Reviewer", "Head of Protocol Security"]
          }
        ]
      }
    }
  },
  aids: {
    subs: {
      genai: {
        name: "Generative AI & Foundation Models",
        roles: [
          {
            title: "Large Language Model Pre-training Scientist",
            desc: "Pre-trains, fine-tunes, and quantizes 100B+ parameter transformer models on multi-node GPU superclusters for enterprise domain automation.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹26L - ₹50L", expert: "₹60L - ₹120L+" },
            promotions: ["AI Research Fellow", "Senior Foundation Model Lead", "Chief AI Scientist"]
          },
          {
            title: "Autonomous Generative Agent Architect",
            desc: "Builds self-correcting multi-agent reasoning loops and retrieval-augmented generation (RAG) pipelines integrating enterprise databases.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹22L - ₹42L", expert: "₹48L - ₹95L" },
            promotions: ["AI Engineer", "Principal Agent Architect", "Head of Enterprise AI"]
          }
        ]
      },
      neural: {
        name: "Neural Engineering & Deep Learning",
        roles: [
          {
            title: "Edge Silicon Quantized Neural Lead",
            desc: "Deploys ultra-low latency sub-int4 quantized neural networks directly onto edge silicon and industrial IoT sensors.",
            salary: { fresher: "₹9L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Embedded AI Dev", "Lead Edge Analytics Architect", "VP of Edge AI"]
          },
          {
            title: "Neuromorphic Silicon AI Researcher",
            desc: "Simulates spiking neural network architectures that mimic human brain synaptic plasticity for ultra-low power hardware computing.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹20L - ₹38L", expert: "₹45L - ₹85L" },
            promotions: ["Hardware Fellow", "Lead Neuromorphic Architect", "Director of Silicon AI"]
          }
        ]
      },
      nlp: {
        name: "Natural Language Processing & Speech",
        roles: [
          {
            title: "Real-Time Conversational Speech Scientist",
            desc: "Engineers sub-100ms multi-lingual speech recognition and neural voice cloning synthesis systems for global voice assistants.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["NLP Developer", "Senior Speech Architect", "Head of Voice AI"]
          },
          {
            title: "Cross-Lingual Semantic Search Lead",
            desc: "Architects dense vector embedding spaces and hybrid semantic ranking engines indexing billions of multi-lingual enterprise documents.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹38L - ₹75L" },
            promotions: ["Search Engineer", "Principal Retrieval Lead", "Director of Semantic Systems"]
          }
        ]
      },
      cv: {
        name: "Advanced Computer Vision & Robotics",
        roles: [
          {
            title: "Autonomous Vehicle Vision Lead",
            desc: "Fuses LiDAR, radar, and optical camera sensor feeds into unified 3D spatial occupancy grids for self-driving automotive navigation.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹22L - ₹42L", expert: "₹48L - ₹92L" },
            promotions: ["Vision Engineer", "Lead Perception Architect", "VP of Autonomous Driving"]
          },
          {
            title: "Industrial Robotic Vision Specialist",
            desc: "Writes real-time object segmentation and 6-DOF pose estimation code for high-speed automated robotic factory assembly lines.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["Robotics Vision Dev", "Senior Industrial Architect", "Head of Robotic Perception"]
          }
        ]
      },
      biomed_ai: {
        name: "Biomedical AI & Health Informatics",
        roles: [
          {
            title: "AI Drug Discovery Molecular Modeler",
            desc: "Applies graph neural networks to simulate protein-ligand binding affinities, accelerating clinical trial candidates by years.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹88L" },
            promotions: ["Computational Chemist", "Lead Molecular AI Lead", "VP of AI Drug Discovery"]
          },
          {
            title: "Medical Imaging Diagnostic Architect",
            desc: "Develops FDA-grade 3D MRI and CT tumor segmentation models with explainable heatmaps for oncology diagnostics.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Health AI Analyst", "Senior Diagnostic Modeler", "Director of Clinical AI"]
          }
        ]
      },
      bigdata_ai: {
        name: "Real-Time Streaming & AI Pipelines",
        roles: [
          {
            title: "Real-Time ML Feature Store Architect",
            desc: "Engineers sub-10ms feature ingestion stores and live inference serving endpoints handling 100,000 requests per second.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹45L - ₹88L" },
            promotions: ["ML Data Engineer", "Principal Feature Architect", "Head of AI Infrastructure"]
          },
          {
            title: "Distributed Graph Analytics Lead",
            desc: "Analyzes billions of interconnected network nodes to identify real-time financial fraud rings and cybersecurity threat vectors.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Graph Scientist", "Senior Network Intelligence Lead", "Chief Analytics Fellow"]
          }
        ]
      }
    }
  },
  it: {
    subs: {
      fintech: {
        name: "High-Frequency Trading & Quantitative Systems",
        roles: [
          {
            title: "Ultra-Low Latency HFT Quantitative Developer",
            desc: "Writes lock-free kernel-bypass C++/Rust execution engines matching institutional financial orders in sub-microsecond latency.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹55L", expert: "₹65L - ₹130L+" },
            promotions: ["Quantitative Dev", "Senior Execution Architect", "Managing Director of Core Trading"]
          },
          {
            title: "Algorithmic Market Making Architect",
            desc: "Formulates stochastic volatility pricing models and automated risk-hedging algorithms for global cryptocurrency & equities desks.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹25L - ₹48L", expert: "₹55L - ₹110L" },
            promotions: ["Algorithmic Trader", "Lead Quantitative Researcher", "Head of Quantitative Strategies"]
          }
        ]
      },
      cloud_sys: {
        name: "Enterprise Cloud Systems Architecture",
        roles: [
          {
            title: "Hybrid Enterprise Cloud Architect",
            desc: "Orchestrates seamless data synchronization and zero-downtime workload migrations between on-premise mainframes and AWS/GCP.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Cloud Engineer", "Senior Enterprise Lead", "VP of Cloud Transformation"]
          },
          {
            title: "Principal IAM & Zero-Trust Security Specialist",
            desc: "Architects cryptographic identity federations, passwordless FIDO2 authentication, and granular role-based access across 50,000 endpoints.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹38L - ₹75L" },
            promotions: ["IAM Engineer", "Lead Security Architect", "Global Identity Director"]
          }
        ]
      },
      net_sec: {
        name: "Zero-Trust Network & Infrastructure Security",
        roles: [
          {
            title: "Enterprise SASE & SD-WAN Architect",
            desc: "Engineers global Secure Access Service Edge (SASE) networks with automated DDoS mitigation and inspection tunnels.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹76L" },
            promotions: ["Network Engineer", "Lead SASE Specialist", "Director of Network Defense"]
          },
          {
            title: "Cyber Incident Forensic Response Lead",
            desc: "Investigates advanced persistent threat (APT) breaches, reverses memory malware dumps, and reconstructs attack killchains.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["Forensic Analyst", "Lead Incident Responder", "Head of Global Cyber Defense"]
          }
        ]
      },
      db_sys: {
        name: "Distributed Database & Storage Architecture",
        roles: [
          {
            title: "CockroachDB & Distributed Storage Fellow",
            desc: "Architects geo-partitioned ACID-compliant SQL clusters ensuring zero data loss during multi-datacenter blackouts.",
            salary: { fresher: "₹9L - ₹18L", mid: "₹20L - ₹40L", expert: "₹45L - ₹88L" },
            promotions: ["Database Engineer", "Principal Distributed DBA", "Fellow Storage Architect"]
          },
          {
            title: "High-Performance In-Memory Cache Architect",
            desc: "Designs Redis/Dragonfly in-memory data grids processing tens of millions of concurrent sessions with sub-millisecond response.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Cache Systems Dev", "Lead Performance Architect", "VP of Data Infrastructure"]
          }
        ]
      },
      saas: {
        name: "Enterprise SaaS & API Ecosystems",
        roles: [
          {
            title: "High-Concurrency API Gateway Lead",
            desc: "Builds enterprise GraphQL and REST rate-limiting gateways handling billions of third-party developer API requests monthly.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["API Engineer", "Principal Ecosystem Architect", "Head of Developer Platform"]
          },
          {
            title: "Multi-Tenant SaaS Core Platform Architect",
            desc: "Engineers isolated tenant data encryption schemes and dynamic provisioning pipelines for global B2B enterprise software suites.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹42L - ₹82L" },
            promotions: ["SaaS Developer", "Senior Platform Architect", "VP of Platform Engineering"]
          }
        ]
      },
      ops: {
        name: "IT Service Automation & AIOps",
        roles: [
          {
            title: "Autonomous Infrastructure AIOps Architect",
            desc: "Deploys machine learning log anomaly detectors that automatically isolate failed nodes and reroute enterprise network traffic.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["Automation Engineer", "Lead AIOps Specialist", "Director of Intelligent Operations"]
          },
          {
            title: "Enterprise Site Reliability Lead",
            desc: "Defines error budgets, SLO monitoring dashboards, and disaster recovery runbooks across Fortune 500 IT footprints.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["SRE Associate", "Senior SRE Lead", "Head of Global Reliability"]
          }
        ]
      }
    }
  },
  ece: {
    subs: {
      vlsi: {
        name: "VLSI & System-on-Chip Semiconductor Design",
        roles: [
          {
            title: "ASIC SoC Sub-2nm Chip Architect",
            desc: "Designs ultra-dense custom silicon logic blocks and hardware accelerators using RISC-V and ARM instruction sets.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹24L - ₹45L", expert: "₹50L - ₹98L+" },
            promotions: ["Silicon RTL Engineer", "Lead SoC Verification Specialist", "Fellow Silicon Architect"]
          },
          {
            title: "Post-Silicon Hardware Validation Lead",
            desc: "Conducts cryogenic electron microscope stress tests and high-speed oscilloscope debugging on fabricated silicon prototype wafers.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹42L - ₹82L" },
            promotions: ["Silicon Test Engineer", "Principal Validation Architect", "Director of Semiconductor Quality"]
          }
        ]
      },
      embedded: {
        name: "Embedded Systems & Real-Time IoT",
        roles: [
          {
            title: "Automotive AUTOSAR Firmware Lead",
            desc: "Writes real-time safety-critical C/C++ firmware running electronic control units (ECUs) inside modern electric and autonomous vehicles.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["Firmware Engineer", "Senior ECU Architect", "VP of Automotive Electronics"]
          },
          {
            title: "Ultra-Low Power IoT Edge Microcontroller Architect",
            desc: "Engineers battery-harvesting wireless sensor nodes that run for 10+ years on coin cells deploying Zigbee and LoRaWAN meshes.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹34L - ₹68L" },
            promotions: ["IoT Hardware Dev", "Lead Edge Hardware Architect", "Director of IoT Systems"]
          }
        ]
      },
      telecom: {
        name: "5G / 6G Wireless Telecommunications",
        roles: [
          {
            title: "6G MIMO Beamforming Signal Architect",
            desc: "Develops terahertz frequency massive-MIMO beamforming algorithms and protocol stacks for next-gen cellular infrastructure grids.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Telecom Firmware Dev", "Lead Wireless Systems Architect", "VP Communications R&D"]
          },
          {
            title: "Satellite Low Earth Orbit RF Link Engineer",
            desc: "Designs high-gain transponders and Doppler error-correction modems connecting orbital satellite swarms with ground terminals.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹38L - ₹75L" },
            promotions: ["RF Systems Engineer", "Principal Space Telecom Lead", "Head of Satellite Communications"]
          }
        ]
      },
      photonics: {
        name: "Silicon Photonics & Optical Communications",
        roles: [
          {
            title: "Integrated Silicon Photonics Chip Architect",
            desc: "Engineers on-chip lasers and optical waveguides that transmit data using photons at terabits per second inside AI supercomputers.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹22L - ₹42L", expert: "₹48L - ₹92L" },
            promotions: ["Photonics Researcher", "Lead Optical Chip Architect", "Fellow Photonics Scientist"]
          },
          {
            title: "Ultra-High Speed Transoceanic Fiber Engineer",
            desc: "Designs submarine optical repeaters and dense wavelength division multiplexing (DWDM) links connecting continents undersea.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹72L" },
            promotions: ["Optical Engineer", "Senior Submarine Link Lead", "Director of Global Optical Networks"]
          }
        ]
      },
      avionics: {
        name: "Satellite Radar & Avionics Navigation",
        roles: [
          {
            title: "Phased-Array Active Radar Systems Lead",
            desc: "Architects electronically scanned radar antennas tracking supersonic airborne threats and orbital space debris in real-time.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹85L" },
            promotions: ["Radar Systems Engineer", "Principal Defense Architect", "VP of Avionics & Radar"]
          },
          {
            title: "Aerospace Flight Control Avionics Specialist",
            desc: "Designs triple-redundant fly-by-wire navigational hardware resistant to severe electromagnetic pulses and cosmic radiation.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Avionics Dev", "Senior Flight Systems Architect", "Chief Avionics Engineer"]
          }
        ]
      },
      dsp: {
        name: "Digital Signal & Image Processing Architect",
        roles: [
          {
            title: "Real-Time FPGA Video & Audio DSP Lead",
            desc: "Implements hardware-accelerated 8K video compression algorithms and multi-channel spatial acoustic filters on Xilinx FPGAs.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["DSP Engineer", "Senior Hardware Algorithm Lead", "Principal Signal Processing Fellow"]
          },
          {
            title: "Biomedical Neural Signal Processing Scientist",
            desc: "Filters micro-volt electrical brainwaves from EEG electrodes to translate neural intention into robotic prosthetic limb motion.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹78L" },
            promotions: ["Bio-Signal Analyst", "Senior Neural Interfaces Lead", "Director of Neuro-Engineering"]
          }
        ]
      },
      quantum_circ: {
        name: "Cryogenic Quantum Circuit Engineering",
        roles: [
          {
            title: "Cryogenic Microwave Quantum Control Architect",
            desc: "Engineers superconducting resonant cavities and multi-qubit pulse modulation circuits operating at 15 milli-Kelvin temperatures.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹25L - ₹48L", expert: "₹55L - ₹110L+" },
            promotions: ["Quantum Circuit Dev", "Lead Quantum Hardware Architect", "Head of Quantum Hardware"]
          },
          {
            title: "Quantum Error Correction Silicon Designer",
            desc: "Designs hardware parity-check lattices that identify and suppress quantum decoherence noise in fault-tolerant quantum processors.",
            salary: { fresher: "₹10L - ₹19L", mid: "₹22L - ₹42L", expert: "₹48L - ₹95L" },
            promotions: ["Quantum Theorist", "Lead Error Correction Lead", "Chief Quantum Scientist"]
          }
        ]
      }
    }
  },
  eee: {
    subs: {
      smartgrid: {
        name: "Smart Grids & Renewable Energy Automation",
        roles: [
          {
            title: "AI-Driven Smart Grid Automation Architect",
            desc: "Implements real-time load distribution controllers and solar/wind micro-grid synchronization relays balancing national grids.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹34L - ₹68L" },
            promotions: ["Grid Systems Engineer", "Senior Grid Architect", "Director of Energy Automation"]
          },
          {
            title: "Utility-Scale Battery Energy Storage (BESS) Lead",
            desc: "Designs multi-megawatt containerized lithium-ion storage farms with thermal fire suppression and frequency regulation modems.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹38L - ₹74L" },
            promotions: ["Storage Engineer", "Principal BESS Architect", "VP of Clean Energy Storage"]
          }
        ]
      },
      evpower: {
        name: "High-Voltage EV Inverter & Battery Propulsion",
        roles: [
          {
            title: "800V Silicon-Carbide (SiC) Traction Inverter Lead",
            desc: "Designs high-efficiency power electronics switching at 100kHz to drive electric motors with minimal thermal loss.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Power Electronics Dev", "Lead Powertrain Specialist", "Chief EV Systems Architect"]
          },
          {
            title: "EV Solid-State Battery Management System Architect",
            desc: "Writes real-time cell balancing algorithms and thermal runaway prevention models for next-gen solid-state EV packs.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹76L" },
            promotions: ["BMS Firmware Lead", "Senior Battery Systems Architect", "Director of EV Powertrain"]
          }
        ]
      },
      ind_auto: {
        name: "Industrial SCADA & PLC Automation Systems",
        roles: [
          {
            title: "Gigafactory SCADA Automation Chief Architect",
            desc: "Orchestrates thousands of automated robotic arms and PLC controllers across mega-scale battery and semiconductor factories.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["Automation Engineer", "Principal PLC Architect", "VP of Industrial Automation"]
          },
          {
            title: "Industrial Cyber-Physical Security Lead",
            desc: "Secures critical power plant SCADA and DCS control loops against state-sponsored cyber intrusions and kinetic sabotage.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹38L - ₹75L" },
            promotions: ["SCADA Security Analyst", "Senior Industrial Defense Architect", "Head of Critical Infrastructure Security"]
          }
        ]
      },
      power_sys: {
        name: "EHV Transmission & Power Systems Engineering",
        roles: [
          {
            title: "Ultra-High Voltage Substation Design Lead",
            desc: "Architects 765kV gas-insulated substations (GIS) and lightning surge arresters protecting continental transmission corridors.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹62L" },
            promotions: ["Substation Engineer", "Principal EHV Architect", "Chief Transmission Consultant"]
          },
          {
            title: "Power Flow Stability & Blackout Prevention Modeler",
            desc: "Simulates transient electromagnetic oscillations across national grid interconnections to prevent cascading grid collapse.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Grid Modeler", "Lead Power Stability Scientist", "Fellow Power Systems Architect"]
          }
        ]
      },
      green_gen: {
        name: "Solar & Wind Hydro Generator Engineering",
        roles: [
          {
            title: "Offshore Wind Turbine Electrical Systems Lead",
            desc: "Designs 15-Megawatt direct-drive permanent magnet generators and subsea HVDC transmission cables in offshore storm zones.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹72L" },
            promotions: ["Wind Systems Engineer", "Principal Offshore Architect", "Director of Renewable Generation"]
          },
          {
            title: "Utility-Scale Solar Tracker Array Architect",
            desc: "Engineers dual-axis sun-tracking photovoltaic grids and MPPT central inverters optimizing gigawatt solar farm yields.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Solar Electrical Dev", "Senior Solar Array Lead", "Head of Solar Engineering"]
          }
        ]
      },
      illuminate: {
        name: "Smart Lighting & Building Automation",
        roles: [
          {
            title: "IoT Smart Building Energy Management Lead",
            desc: "Integrates PoE human-centric LED lighting with occupancy thermal sensors to slash commercial skyscraper energy costs by 40%.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹13L - ₹25L", expert: "₹28L - ₹58L" },
            promotions: ["Building Automation Dev", "Senior Energy Efficiency Lead", "Director of Smart Buildings"]
          },
          {
            title: "Architectural Solid-State Lighting Designer",
            desc: "Engineers custom chromaticity tunable LED fixtures and thermal dissipation heat sinks for stadiums and airports.",
            salary: { fresher: "₹6L - ₹11L", mid: "₹12L - ₹23L", expert: "₹26L - ₹54L" },
            promotions: ["Lighting Engineer", "Principal Illumination Lead", "Chief Lighting Architect"]
          }
        ]
      }
    }
  },
  mech: {
    subs: {
      robotics: {
        name: "Industrial Robotics & Mechatronics Kinematics",
        roles: [
          {
            title: "Multi-Axis Robotic Arm Servo Kinematics Architect",
            desc: "Engineers zero-backlash harmonic drive gearboxes and high-torque servo feedback loops for precision 7-axis industrial robot arms.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["Mechatronics Engineer", "Senior Robotics Lead", "Head of Robotics Engineering"]
          },
          {
            title: "Collaborative Robot (Cobot) Safety Systems Lead",
            desc: "Develops tactile force-torque sensing skins and instant collision-braking algorithms allowing robots to safely work beside humans.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["Cobot Specialist", "Principal Automation Architect", "VP of Collaborative Automation"]
          }
        ]
      },
      automotive: {
        name: "Next-Gen Automotive & Electric Vehicle Propulsion",
        roles: [
          {
            title: "EV Powertrain & Battery Thermal Systems Lead",
            desc: "Designs liquid cooling plates and refrigerant heat pumps keeping 100kWh EV battery packs at uniform 25°C under rapid charging.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Thermal Engineer", "Lead Powertrain Specialist", "Chief EV Mechanical Architect"]
          },
          {
            title: "High-Performance Vehicle Vehicle Dynamics Specialist",
            desc: "Simulates active suspension kinematics, carbon-ceramic brake dissipation, and downforce aero stability for hypercars.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹34L - ₹68L" },
            promotions: ["Chassis Engineer", "Lead Vehicle Dynamics Architect", "Director of Automotive R&D"]
          }
        ]
      },
      aeroprop: {
        name: "Supersonic Aerodynamic & Gas Turbine Propulsion",
        roles: [
          {
            title: "Jet Turbine Combustor Thermodynamic Architect",
            desc: "Simulates 1800°C combustion flame turbulence and film-cooling micro-perforations inside commercial turbofan jet engines.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Propulsion Scientist", "Principal Turbine Architect", "Chief Propulsion Fellow"]
          },
          {
            title: "Supersonic Wing Aerodynamics CFD Specialist",
            desc: "Applies Navier-Stokes computational fluid dynamics on supercomputers to minimize sonic boom shockwaves on supersonic aircraft.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹38L - ₹74L" },
            promotions: ["CFD Analyst", "Lead Aerodynamics Lead", "Director of Aerospace Flight R&D"]
          }
        ]
      },
      additive: {
        name: "Additive Manufacturing & Industrial 3D Printing",
        roles: [
          {
            title: "Laser Powder Bed Fusion Metal 3D Architect",
            desc: "Engineers laser sintering parameters to 3D print titanium rocket engine combustion chambers with internal cooling channels.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["Additive Engineer", "Principal Industrial 3D Lead", "Head of Advanced Manufacturing"]
          },
          {
            title: "Generative Topology Optimization Modeler",
            desc: "Uses AI generative design algorithms to shave 40% structural weight off aerospace brackets while maintaining full tensile strength.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Design Modeler", "Senior Topology Architect", "Chief Lightweighting Consultant"]
          }
        ]
      },
      hvac: {
        name: "Net-Zero HVAC & Industrial Refrigeration Systems",
        roles: [
          {
            title: "Cryogenic Industrial Cooling Systems Lead",
            desc: "Designs liquid nitrogen and LNG cryogenic refrigeration loops for pharmaceutical bio-repositories and semiconductor fabs.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Refrigeration Engineer", "Principal Thermal Architect", "Director of Cryogenic Engineering"]
          },
          {
            title: "Net-Zero Skyscraper HVAC Energy Optimization Lead",
            desc: "Architects geothermal heat exchange loops and variable refrigerant flow (VRF) grids achieving LEED Platinum green building certifications.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹60L" },
            promotions: ["HVAC Engineer", "Senior Sustainable Thermal Lead", "Chief Mechanical Building Lead"]
          }
        ]
      },
      cadcam: {
        name: "Precision Tooling & Parametric CAD/CAM Systems",
        roles: [
          {
            title: "5-Axis Robotic CNC Tooling Chief Lead",
            desc: "Programs automated 5-axis milling cutter paths achieving micron-level tolerances on aerospace turbine blades and medical implants.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹62L" },
            promotions: ["CNC CAM Specialist", "Principal Tooling Architect", "Director of Precision Tooling"]
          },
          {
            title: "Parametric Mechanical Digital Twin Specialist",
            desc: "Builds dynamic CAD assemblies with automated kinematic clash detection across 10,000-part industrial locomotive blueprints.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹13L - ₹25L", expert: "₹28L - ₹58L" },
            promotions: ["CAD Modeler", "Lead Assembly Architect", "Head of Mechanical CAD Systems"]
          }
        ]
      },
      acoustics: {
        name: "NVH (Noise, Vibration & Harshness) Diagnostics",
        roles: [
          {
            title: "Automotive Cabin NVH Acoustic Architect",
            desc: "Eliminates high-pitch electric motor whine and road tire roar inside luxury EV cabins using active noise cancellation hardware.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["NVH Analyst", "Senior Acoustic Engineering Lead", "Chief NVH Scientist"]
          },
          {
            title: "Heavy Machinery Structural Vibration Dampening Lead",
            desc: "Designs tuned mass dampers and elastomeric isolation pads preventing destructive resonance in offshore oil drilling rigs.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹60L" },
            promotions: ["Vibration Engineer", "Lead Structural Diagnostics Specialist", "Principal Mechanical Dynamics Fellow"]
          }
        ]
      }
    }
  },
  civil: {
    subs: {
      smartcity: {
        name: "Smart City GIS & Digital Twin Infrastructure",
        roles: [
          {
            title: "Urban Digital Twin 3D GIS Architect",
            desc: "Creates real-time 3D parametric simulations of city utilities, traffic congestion, and climate resiliency grids across entire metro areas.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹64L" },
            promotions: ["GIS Analyst", "Smart City Infrastructure Planner", "Chief Urban Systems Director"]
          },
          {
            title: "Municipal Water Utility SCADA Network Lead",
            desc: "Engineers automated leak detection sensors and flood control sluice gates protecting urban populations from storm surges.",
            salary: { fresher: "₹6L - ₹11L", mid: "₹13L - ₹24L", expert: "₹28L - ₹58L" },
            promotions: ["Hydraulic Engineer", "Senior Municipal Utility Lead", "Director of Water Infrastructure"]
          }
        ]
      },
      quake: {
        name: "Seismic Engineering & Earthquake Resiliency",
        roles: [
          {
            title: "Base-Isolated Skyscraper Seismic Lead",
            desc: "Calculates non-linear dynamic damping coefficients and installs hydraulic base isolators beneath 80-story earthquake zone towers.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Structural Associate", "Lead Seismic Architect", "Principal Structural Fellow"]
          },
          {
            title: "Suspension Bridge Aerodynamic Stability Lead",
            desc: "Simulates typhoon cross-wind flutter and cable tension dynamics on 3-kilometer long ocean crossing suspension spans.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Bridge Engineer", "Senior Span Architect", "Chief Structural Bridge Consultant"]
          }
        ]
      },
      geo: {
        name: "Geotechnical & Subsurface Tunnelling Engineering",
        roles: [
          {
            title: "Deep Subway Tunnel Geotechnical Architect",
            desc: "Engineers tunnel boring machine (TBM) excavation parameters and concrete segment linings 50 meters below dense city foundations.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Geotechnical Engineer", "Principal Tunnelling Lead", "Head of Underground Infrastructure"]
          },
          {
            title: "Soil Mechanics Foundation Stabilization Specialist",
            desc: "Designs deep bored piles and chemical soil grouting stabilizing high-rise foundations in soft reclaimed coastal marshland.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹60L" },
            promotions: ["Foundation Analyst", "Senior Geotechnical Lead", "Chief Soil Mechanics Consultant"]
          }
        ]
      },
      water: {
        name: "Coastal, Marine & Hydraulic Engineering",
        roles: [
          {
            title: "Offshore Deep-Water Port Breakwater Architect",
            desc: "Simulates 100-year storm wave impact forces to construct concrete tetrapod breakwaters and LNG container shipping terminals.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Coastal Engineer", "Lead Marine Structural Lead", "Director of Port Engineering"]
          },
          {
            title: "Hydroelectric Dam Spillway & Turbine Lead",
            desc: "Architects massive reinforced concrete spillways and penstock tunnels driving multi-gigawatt hydroelectric turbine installations.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Dam Engineer", "Senior Hydro-Structural Lead", "Chief Dam Infrastructure Fellow"]
          }
        ]
      },
      transpo: {
        name: "High-Speed Rail & Highway Traffic Engineering",
        roles: [
          {
            title: "Maglev High-Speed Rail Track Systems Lead",
            desc: "Designs sub-millimeter precision ballastless slab tracks and superconducting magnetic levitation guideways for 500+ km/h trains.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹72L" },
            promotions: ["Rail Track Engineer", "Principal High-Speed Systems Architect", "Director of Railway R&D"]
          },
          {
            title: "AI Highway Traffic Flow Optimization Lead",
            desc: "Deploys smart camera computer vision and adaptive traffic signal synchronization eliminating rush-hour gridlock across major interstates.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹26L", expert: "₹30L - ₹62L" },
            promotions: ["Transportation Engineer", "Senior Traffic Systems Lead", "Chief Urban Transit Director"]
          }
        ]
      },
      green_bim: {
        name: "Sustainable Construction & 7D BIM Modeling",
        roles: [
          {
            title: "Enterprise 7D BIM Virtual Design Director",
            desc: "Manages integrated 3D geometry, 4D scheduling, 5D cost estimating, and 7D lifecycle sustainability across $5B mega-projects.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹35L - ₹70L" },
            promotions: ["BIM Coordinator", "Senior VDC Lead", "VP of Virtual Construction"]
          },
          {
            title: "Carbon-Neutral Engineered Timber Architect",
            desc: "Engineers cross-laminated timber (CLT) skyscrapers that sequester carbon while meeting all fire-code and structural load benchmarks.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹13L - ₹25L", expert: "₹28L - ₹58L" },
            promotions: ["Sustainable Structural Dev", "Lead Green Materials Architect", "Chief Sustainable Construction Fellow"]
          }
        ]
      }
    }
  },
  chem: {
    subs: {
      hydrogen: {
        name: "Green Hydrogen Electrolyzers & Clean Ammonia",
        roles: [
          {
            title: "Industrial Green Hydrogen Electrolyzer Lead",
            desc: "Optimizes proton exchange membrane (PEM) stack current density producing green hydrogen fuel from solar electricity at gigawatt scale.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹74L" },
            promotions: ["Electrochemical Dev", "Principal Green Hydrogen Lead", "VP of Clean Hydrogen Engineering"]
          },
          {
            title: "Zero-Carbon Synthetic Ammonia Process Lead",
            desc: "Engineers Haber-Bosch catalytic reactors powered entirely by green hydrogen for global zero-carbon fertilizer production.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Chemical Process Dev", "Senior Synthesis Lead", "Director of Sustainable Chemistry"]
          }
        ]
      },
      petro: {
        name: "Petrochemical Refining & Catalytic Systems",
        roles: [
          {
            title: "Fluid Catalytic Cracking (FCC) Chief Lead",
            desc: "Optimizes zeolite catalyst flow inside 50-meter refining towers to maximize high-octane clean fuel yields from crude feedstocks.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Refining Process Engineer", "Principal Catalyst Architect", "Head of Refinery Operations"]
          },
          {
            title: "Bio-Refinery Algae to Aviation Fuel Architect",
            desc: "Designs hydrothermal liquefaction reactors converting harvested marine microalgae directly into sustainable aviation jet fuels.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Bio-Process Dev", "Lead Sustainable Fuel Specialist", "Director of Bio-Energy R&D"]
          }
        ]
      },
      polymers: {
        name: "Biodegradable Polymers & Advanced Plastics",
        roles: [
          {
            title: "Marine-Biodegradable PHA Bioplastic Scientist",
            desc: "Synthesizes polyhydroxyalkanoate (PHA) biopolymer chains that fully biodegrade in seawater within 90 days leaving zero microplastics.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Polymer Chemist", "Lead Bioplastics Researcher", "VP of Sustainable Materials"]
          },
          {
            title: "Ultra-High Molecular Weight Nanocomposite Lead",
            desc: "Engineers Kevlar-carbon nanofiber composite matrices yielding bulletproof lightweight armor for aerospace and military hulls.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Composite Materials Engineer", "Principal Advanced Polymer Fellow", "Director of Polymer Science"]
          }
        ]
      },
      pharma_proc: {
        name: "Biopharma Continuous Manufacturing Systems",
        roles: [
          {
            title: "Continuous Sterile Bioreactor Process Architect",
            desc: "Automates multi-stage perfusion bioreactors producing sterile monoclonal antibody therapies with real-time spectroscopic quality checks.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹36L - ₹72L" },
            promotions: ["Bioprocess Engineer", "Principal Biopharma Lead", "Head of Pharmaceutical Manufacturing"]
          },
          {
            title: "Cryogenic Drug Formulation & Lyophilization Lead",
            desc: "Engineers freeze-drying vacuum cycle chambers preserving delicate mRNA vaccine lipid nanoparticles at -80°C storage specs.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Formulation Engineer", "Senior Lyophilization Specialist", "Director of Pharmaceutical Process"]
          }
        ]
      },
      carbon_cap: {
        name: "Carbon Capture, Utilization & Storage (CCUS)",
        roles: [
          {
            title: "Direct Air Capture (DAC) Chemical Reactor Lead",
            desc: "Designs solid amine contactor towers sucking CO2 directly out of ambient atmosphere and mineralizing it into basalt rock formations.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹74L" },
            promotions: ["CCUS Process Dev", "Principal Carbon Capture Lead", "Chief Climate Engineering Scientist"]
          },
          {
            title: "Flue-Gas Carbon Scrubbing Absorption Specialist",
            desc: "Installs liquid potassium carbonate scrubbing loops inside industrial steel mill chimneys capturing 98% of industrial carbon emissions.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Emissions Process Engineer", "Lead Industrial CCUS Lead", "VP of Carbon Mitigation"]
          }
        ]
      },
      electro: {
        name: "Electrochemical & Fuel Cell Engineering",
        roles: [
          {
            title: "PEM Fuel Cell Stack Architecture Lead",
            desc: "Engineers platinum-ruthenium catalyst layers and bipolar flow plates generating clean electricity from hydrogen for heavy transport trucks.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹38L - ₹76L" },
            promotions: ["Fuel Cell Engineer", "Principal Stack Designer", "Chief Electrochemical Architect"]
          },
          {
            title: "Vanadium Redox Flow Grid Battery Lead",
            desc: "Designs mega-scale liquid electrolyte storage tanks providing 12-hour duration backup power to municipal clean energy grids.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Electrolyte Dev", "Senior Redox Flow Lead", "Head of Grid Storage Chemistry"]
          }
        ]
      }
    }
  },
  biotech: {
    subs: {
      genomics: {
        name: "Computational Genomics & CRISPR Modeling",
        roles: [
          {
            title: "CRISPR Gene Editing Computational Lead",
            desc: "Applies transformer sequence AI models to identify off-target DNA cleavage sites and design precision CRISPR-Cas9 guide RNAs.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹88L" },
            promotions: ["Genomics Data Scientist", "Principal Gene Editing Lead", "Director of Computational Biology"]
          },
          {
            title: "Single-Cell Transcriptomics AI Modeler",
            desc: "Processes millions of single-cell RNA sequencing barcodes to map cellular differentiation pathways in Alzheimer's neurodegeneration.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Bioinformatics Scientist", "Senior Transcriptomics Lead", "Fellow Computational Genomicist"]
          }
        ]
      },
      drug_ai: {
        name: "AI-Driven Structure-Based Drug Discovery",
        roles: [
          {
            title: "De Novo Protein Design Diffusion Modeler",
            desc: "Uses diffusion neural networks to invent entirely novel synthetic protein inhibitors neutralizing oncology targets in silico.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹22L - ₹42L", expert: "₹48L - ₹95L" },
            promotions: ["Protein AI Scientist", "Lead Drug Design Fellow", "VP of AI Drug Discovery"]
          },
          {
            title: "Quantum Molecular Docking Simulation Lead",
            desc: "Simulates sub-atomic ligand binding free energy calculations on supercomputers to optimize lead biopharmaceutical drug potency.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹85L" },
            promotions: ["Computational Chemist", "Principal Biophysical Simulation Lead", "Head of Molecular Discovery"]
          }
        ]
      },
      syn_bio: {
        name: "Synthetic Biology & Metabolic Engineering",
        roles: [
          {
            title: "Synthetic Biopathway Metabolic Engineer",
            desc: "Rewires E. coli and yeast genetic regulatory networks to ferment sustainable spider-silk fibers and synthetic vanilla aromas.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹72L" },
            promotions: ["Synthetic Biologist", "Senior Metabolic Pathway Designer", "Director of Synthetic Bio R&D"]
          },
          {
            title: "Industrial Enzyme Evolution Architect",
            desc: "Performs directed evolution mutations to engineer hyper-stable industrial enzymes that break down PET plastic waste in hours.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Enzyme Engineer", "Principal Protein Evolution Lead", "Head of Green Bioremediation"]
          }
        ]
      },
      biopharma: {
        name: "Bioprocess Antibody & Vaccine Engineering",
        roles: [
          {
            title: "Monoclonal Antibody Bioreactor Scale-Up Lead",
            desc: "Optimizes Chinese Hamster Ovary (CHO) cell perfusion feeding profiles inside 20,000-liter stainless steel bioreactor tanks.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["Bioprocess Engineer", "Principal Cell Culture Lead", "VP of Biopharmaceutical Manufacturing"]
          },
          {
            title: "mRNA Lipid Nanoparticle Encapsulation Specialist",
            desc: "Designs microfluidic mixing chambers encapsulating fragile mRNA strands inside targeted lipid nanoparticles for personalized cancer vaccines.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Nanomedicine Engineer", "Senior mRNA Formulation Lead", "Director of Vaccine Process R&D"]
          }
        ]
      },
      biomaterials: {
        name: "Tissue Engineering & 3D Bioprinting",
        roles: [
          {
            title: "Vascularized Organ Scaffold 3D Bioprinting Lead",
            desc: "Bioprints bio-ink hydrogels seeded with human stem cells to construct functional vascularized heart patches for transplant testing.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Bioprinting Engineer", "Lead Tissue Architect", "Director of Regenerative Organ Engineering"]
          },
          {
            title: "Smart Bio-Resorbable Bone Implant Architect",
            desc: "Synthesizes porous magnesium-calcium phosphate scaffolds that slowly dissolve and release growth factors as real bone regenerates.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Biomaterials Scientist", "Senior Orthopedic Implant Lead", "Head of Regenerative Biomaterials"]
          }
        ]
      },
      neuro_bio: {
        name: "Neuro-Informatics & Brain-Computer Interfaces",
        roles: [
          {
            title: "Flexible Brain-Computer Interface Implant Lead",
            desc: "Engineers ultra-thin flexible polymer neural electrode threads that record action potentials from 1024 brain neurons simultaneously.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹22L - ₹42L", expert: "₹48L - ₹95L" },
            promotions: ["Neural Hardware Dev", "Principal BCI Implant Lead", "Director of Neural Engineering"]
          },
          {
            title: "Real-Time EEG Neuromodulation Algorithm Lead",
            desc: "Writes real-time closed-loop deep learning classifiers predicting epileptic seizures 5 minutes in advance and triggering soothing neuro-pulses.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹78L" },
            promotions: ["Neuro-Data Scientist", "Lead Neural Algorithm Lead", "Fellow Neuro-Informatics Architect"]
          }
        ]
      }
    }
  },
  aero: {
    subs: {
      spacecraft: {
        name: "Orbital Launch Systems & Rocket Propulsion",
        roles: [
          {
            title: "Cryogenic Liquid Methane Rocket Engine Lead",
            desc: "Designs high-pressure staged combustion turbopumps and regenerative copper cooling channels for reusable orbital heavy-lift boosters.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹88L" },
            promotions: ["Propulsion Engineer", "Principal Rocket Engine Lead", "Chief Launch Propulsion Architect"]
          },
          {
            title: "Orbital Autonomous Docking Guidance Lead",
            desc: "Writes LiDAR optical navigation algorithms allowing autonomous resupply capsules to dock with space stations at 28,000 km/h.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["GNC Flight Dev", "Lead Orbital Navigation Architect", "Mission Guidance Director"]
          }
        ]
      },
      hypersonic: {
        name: "Hypersonic Aerodynamics & Thermal Protection",
        roles: [
          {
            title: "Mach 8+ Hypersonic Airframe Thermal Architect",
            desc: "Simulates 2500°C shockwave plasma heating across ultra-sharp carbon-silicon carbide hypersonic glide vehicle leading edges.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹86L" },
            promotions: ["Hypersonic Engineer", "Principal Aerothermodynamics Lead", "Director of Hypersonic R&D"]
          },
          {
            title: "Scramjet Supersonic Combustion Lead",
            desc: "Engineers supersonic airflow fuel injection struts maintaining stable flame combustion inside scramjet engines travelling at Mach 6.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Scramjet Specialist", "Senior Hypersonic Propulsion Lead", "Fellow Aerospace Propulsion Scientist"]
          }
        ]
      },
      satellites: {
        name: "Nano-Satellite & CubeSat Constellation Systems",
        roles: [
          {
            title: "Low Earth Orbit (LEO) Constellation Network Lead",
            desc: "Orchestrates inter-satellite optical laser routing links across 4000-satellite swarms providing global low-latency broadband.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Satellite Systems Dev", "Principal Orbital Network Architect", "Director of Satellite Operations"]
          },
          {
            title: "CubeSat Origami Solar Array Deployment Lead",
            desc: "Designs shape-memory spring actuators unfurling ultra-lightweight gallium arsenide solar sails from 10cm CubeSat chassis.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["CubeSat Dev", "Senior Space Hardware Lead", "Head of Satellite Payload Engineering"]
          }
        ]
      },
      space_robot: {
        name: "Orbital Robotics & Planetary Rovers",
        roles: [
          {
            title: "Mars Planetary Rover Autonomous Navigation Lead",
            desc: "Writes stereoscopic VSLAM hazard-avoidance algorithms steering robotic rovers across steep Martian rock canyons autonomously.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹86L" },
            promotions: ["Space Robotics Dev", "Principal Planetary Rover Architect", "Director of Planetary Surface Robotics"]
          },
          {
            title: "Space Station Autonomous Robotic Servicing Lead",
            desc: "Engineers 7-axis zero-gravity robotic manipulators capturing satellite wreckage and refuelling aging satellites in geostationary orbit.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["Space Automation Engineer", "Senior Orbital Servicing Architect", "Head of Orbital Robotics"]
          }
        ]
      },
      uav_drones: {
        name: "Autonomous VTOL & Combat Swarm Drones",
        roles: [
          {
            title: "AI Swarm Combat Drone Coordination Architect",
            desc: "Deploys decentralized mesh networking and collaborative target selection algorithms across swarms of 100 autonomous reconnaissance drones.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹85L" },
            promotions: ["Swarm Systems Dev", "Principal Defense Drone Lead", "VP of Autonomous Aerial Systems"]
          },
          {
            title: "Heavy-Lift eVTOL Flight Dynamics Chief Lead",
            desc: "Engineers transition flight control laws shifting 4-passenger electric air taxis seamlessly from vertical lift to high-speed wing cruise.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Flight Control Engineer", "Senior eVTOL Dynamics Lead", "Chief Flight Systems Architect"]
          }
        ]
      },
      space_mat: {
        name: "Space Composite & Radiation Shielding Materials",
        roles: [
          {
            title: "Cosmic Radiation Resistant Composite Hull Lead",
            desc: "Synthesizes hydrogen-rich polyethylene nanotube composites shielding deep-space astronauts from lethal galactic cosmic rays.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹74L" },
            promotions: ["Space Materials Scientist", "Principal Radiation Shielding Lead", "Director of Spacecraft Materials"]
          },
          {
            title: "Ultralight Carbon-Carbon Heat Shield Architect",
            desc: "Engineers ablative carbon-phenolic heat shields capable of surviving 3000°C atmospheric re-entry deceleration from lunar velocities.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["Thermal Protection Dev", "Lead Re-Entry Hull Architect", "Fellow Spacecraft Structural Lead"]
          }
        ]
      }
    }
  },
  metal: {
    subs: {
      superalloys: {
        name: "Extreme Environment Titanium & Nickel Superalloys",
        roles: [
          {
            title: "Single-Crystal Jet Turbine Alloy Chief Scientist",
            desc: "Grows single-crystal nickel-based superalloys eliminating grain boundaries so jet engine turbine blades survive spinning at 1100°C.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹38L - ₹75L" },
            promotions: ["Metallurgical Engineer", "Principal Superalloy Researcher", "Director of Aerospace Metallurgy"]
          },
          {
            title: "Cryogenic Rocket Tank Aluminum-Lithium Architect",
            desc: "Formulates ultra-lightweight weldable aluminum-lithium alloys retaining ductility when filled with liquid hydrogen at -253°C.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Cryogenic Alloy Specialist", "Senior Space Tank Lead", "Chief Structural Metallurgist"]
          }
        ]
      },
      semicon_mat: {
        name: "Sub-Nanometer Semiconductor & Gallium Nitride",
        roles: [
          {
            title: "Gallium Nitride (GaN) Wafer Crystal Growth Lead",
            desc: "Engineers metal-organic chemical vapor deposition (MOCVD) reactors growing defect-free GaN epitaxial layers for 5G power amplifiers.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹86L" },
            promotions: ["Semiconductor Materials Scientist", "Principal GaN Epitaxy Lead", "Director of Compound Semiconductors"]
          },
          {
            title: "Silicon Carbide (SiC) Power Substrate Metallurgist",
            desc: "Optimizes sublimation physical vapor transport to produce 200mm single-crystal SiC wafers powering EV traction inverters.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["SiC Wafer Engineer", "Lead Substrate Specialist", "Head of Power Silicon R&D"]
          }
        ]
      },
      nanomats: {
        name: "Carbon Nanotubes & Graphene Composite Systems",
        roles: [
          {
            title: "Graphene Supercapacitor Electrode Material Lead",
            desc: "Synthesizes 3D porous graphene aerogels yielding energy storage density 10x greater than activated carbon for rapid-charge batteries.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹72L" },
            promotions: ["Nanomaterials Scientist", "Principal Graphene Researcher", "Director of Nanotechnology R&D"]
          },
          {
            title: "Multi-Walled Carbon Nanotube Structural Architect",
            desc: "Spins continuous carbon nanotube yarn ribbons stronger than steel by weight for aerospace space-elevator tether prototypes.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹16L - ₹30L", expert: "₹34L - ₹68L" },
            promotions: ["Nanotube Synthesis Engineer", "Senior Advanced Fiber Lead", "Chief Nanoscale Structural Fellow"]
          }
        ]
      },
      corrosion: {
        name: "Advanced Corrosion Diagnostics & Surface Coatings",
        roles: [
          {
            title: "Plasma-Sprayed Thermal Barrier Coating Lead",
            desc: "Applies yttria-stabilized zirconia ceramic barrier coatings via robotic plasma spray protecting jet engines from thermal melting.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Surface Coating Dev", "Principal Thermal Barrier Lead", "Director of Surface Integrity"]
          },
          {
            title: "Deep-Sea Subsea Pipeline Anti-Corrosion Architect",
            desc: "Engineers cathodic impressed current protection and sacrificial zinc anode arrays stopping salt-water corrosion on 3000m deep pipelines.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹64L" },
            promotions: ["Corrosion Engineer", "Senior Offshore Integrity Lead", "Chief Subsea Materials Consultant"]
          }
        ]
      },
      smart_mats: {
        name: "Shape-Memory Alloys & Piezoelectric Materials",
        roles: [
          {
            title: "Nitinol Shape-Memory Aerospace Actuator Lead",
            desc: "Designs nickel-titanium wire bundles that contract when electrically heated to silently bend jet aircraft morphing wingtips.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹32L", expert: "₹36L - ₹72L" },
            promotions: ["Smart Materials Specialist", "Principal Morphing Structure Lead", "Director of Actuator Metallurgy"]
          },
          {
            title: "Lead Zirconate Titanate Piezo-Energy Harvester Lead",
            desc: "Synthesizes thin-film piezoelectric transducers harvesting ambient road traffic vibrations into clean electricity powering IoT sensors.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹65L" },
            promotions: ["Piezoelectric Scientist", "Senior Energy Harvesting Lead", "Head of Smart Functional Materials"]
          }
        ]
      },
      green_metal: {
        name: "Hydrogen Metallurgy & Zero-Carbon Steelmaking",
        roles: [
          {
            title: "Green Hydrogen Direct Reduced Iron (DRI) Lead",
            desc: "Replaces fossil coal blast furnaces with pure green hydrogen gas streams reducing iron ore into zero-carbon steel at 1000°C.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹17L - ₹33L", expert: "₹36L - ₹74L" },
            promotions: ["Green Metallurgy Dev", "Principal Hydrogen Steel Lead", "VP of Decarbonized Metallurgy"]
          },
          {
            title: "Rare-Earth Permanent Magnet Recycling Architect",
            desc: "Engineers hydrogen magnet-fragmentation processes recovering 99% pure neodymium and dysprosium from discarded EV motors.",
            salary: { fresher: "₹7L - ₹14L", mid: "₹15L - ₹28L", expert: "₹32L - ₹66L" },
            promotions: ["Recycling Process Engineer", "Senior Rare-Earth Recovery Lead", "Director of Sustainable Critical Metals"]
          }
        ]
      }
    }
  },
  mtech_cloud: {
    subs: {
      dist_consensus: {
        name: "Zero-Downtime Distributed Consensus Architecture",
        roles: [
          {
            title: "Distributed Raft/Paxos Consensus Protocol Fellow",
            desc: "Architects zero-data-loss geo-replicated consensus kernels handling split-brain network partitions across 50 global cloud regions.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹55L", expert: "₹65L - ₹125L+" },
            promotions: ["Distributed Systems Engineer", "Principal Consensus Architect", "Distinguished Cloud Fellow"]
          },
          {
            title: "Multi-Master Active-Active Database Replication Lead",
            desc: "Writes vector-clock conflict-free replicated data type (CRDT) algorithms enabling instant multi-master database writes globally.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹25L - ₹48L", expert: "₹55L - ₹110L" },
            promotions: ["Database Replication Engineer", "Principal Distributed Architect", "Head of Core Storage Engine"]
          }
        ]
      },
      serverless: {
        name: "Ultra-High Concurrency Serverless & Edge Compute",
        roles: [
          {
            title: "WebAssembly (Wasm) Serverless Edge Runtime Lead",
            desc: "Builds sub-5 millisecond cold-start WebAssembly sandboxed execution runtimes running on 300+ global CDN edge points-of-presence.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹25L - ₹48L", expert: "₹55L - ₹105L" },
            promotions: ["Edge Runtime Dev", "Principal Serverless Architect", "Director of Edge Compute"]
          },
          {
            title: "High-Throughput Event-Driven Serverless Scale Lead",
            desc: "Engineers auto-scaling serverless queues processing 50 million concurrent webhook triggers per minute during global shopping spikes.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹22L - ₹44L", expert: "₹50L - ₹95L" },
            promotions: ["Serverless Engineer", "Lead Event Architecture Lead", "VP of Cloud Platform"]
          }
        ]
      },
      cloud_mesh: {
        name: "Enterprise Service Mesh & Zero-Trust Orchestration",
        roles: [
          {
            title: "eBPF Kernel-Space Service Mesh Principal Lead",
            desc: "Applies extended Berkeley Packet Filters (eBPF) inside Linux kernels to encrypt and trace 100Gbps microservice traffic with zero overhead.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹26L - ₹50L", expert: "₹60L - ₹115L+" },
            promotions: ["Kernel Systems Engineer", "Principal Service Mesh Architect", "Distinguished Networking Fellow"]
          },
          {
            title: "Zero-Trust Service-to-Service mTLS Architect",
            desc: "Automates SPIFFE/SPIRE short-lived cryptographic identity attestation and mutual TLS encryption across 10,000 microservice workloads.",
            salary: { fresher: "₹10L - ₹19L", mid: "₹22L - ₹42L", expert: "₹48L - ₹92L" },
            promotions: ["Cloud Security Dev", "Senior Zero-Trust Mesh Lead", "Head of Cloud Infrastructure Security"]
          }
        ]
      },
      green_cloud: {
        name: "Sustainable Carbon-Aware Cloud Data Centers",
        roles: [
          {
            title: "Carbon-Aware Workload Orchestration Lead",
            desc: "Dynamically shifts AI compute training jobs across global data centers based on real-time solar and wind power grid carbon intensity.",
            salary: { fresher: "₹10L - ₹18L", mid: "₹20L - ₹40L", expert: "₹45L - ₹88L" },
            promotions: ["Green Cloud Dev", "Principal Sustainable Scheduler Lead", "Director of Green Cloud Strategy"]
          },
          {
            title: "Immersion-Cooled Supercomputer Thermal Lead",
            desc: "Engineers two-phase dielectric liquid immersion cooling tanks slasher AI data center Power Usage Effectiveness (PUE) down to 1.03.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹19L - ₹36L", expert: "₹42L - ₹82L" },
            promotions: ["Data Center Thermal Engineer", "Principal Immersion Cooling Architect", "VP of Data Center Engineering"]
          }
        ]
      },
      quantum_cloud: {
        name: "Quantum-Classical Hybrid Cloud Infrastructure",
        roles: [
          {
            title: "Cloud Quantum Co-Processing Scheduler Lead",
            desc: "Builds low-latency hybrid compilers dispatching quantum circuit variational routines to IBM Qiskit and AWS Braket quantum processing units.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹26L - ₹50L", expert: "₹58L - ₹115L+" },
            promotions: ["Quantum Cloud Dev", "Principal Hybrid Scheduler Lead", "Head of Cloud Quantum Computing"]
          },
          {
            title: "Distributed Quantum Key Distribution Network Lead",
            desc: "Deploys entangled photon optical links providing unhackable quantum cryptographic security between primary cloud data centers.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹22L - ₹44L", expert: "₹50L - ₹98L" },
            promotions: ["Quantum Network Engineer", "Senior QKD Communications Lead", "Chief Quantum Cryptography Scientist"]
          }
        ]
      },
      edge_ai: {
        name: "Fog & Edge AI Model Orchestration",
        roles: [
          {
            title: "Federated Learning Edge Orchestration Architect",
            desc: "Coordinates collaborative AI model training across 1 million smartphone edge devices while preserving raw user data privacy locally.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹24L - ₹45L", expert: "₹52L - ₹100L+" },
            promotions: ["Federated ML Dev", "Principal Edge Orchestrator", "Director of Distributed AI"]
          },
          {
            title: "Ultra-Low Latency Video Edge Analytics Architect",
            desc: "Architects 5G edge compute nodes running real-time multi-stream YOLOv9 object tracking for smart city security grids in under 8 milliseconds.",
            salary: { fresher: "₹9L - ₹18L", mid: "₹20L - ₹38L", expert: "₹44L - ₹86L" },
            promotions: ["Edge Video Dev", "Senior Edge Analytics Architect", "Head of Edge AI Infrastructure"]
          }
        ]
      }
    }
  },
  mtech_vlsi: {
    subs: {
      sub2nm: {
        name: "2nm Gate-All-Around (GAA) Silicon Architecture",
        roles: [
          {
            title: "Sub-2nm Nanosheet Transistor Device Architect",
            desc: "Simulates quantum tunneling leakage and electron mobility across stacked silicon nanosheet gate-all-around (GAA) transistor channels.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹52L", expert: "₹60L - ₹120L+" },
            promotions: ["Silicon Device Scientist", "Principal GAA Transistor Architect", "Fellow Semiconductor Device Scientist"]
          },
          {
            title: "Extreme Ultraviolet (EUV) Lithography Mask Lead",
            desc: "Engineers optical proximity correction algorithms compensating for diffraction anomalies on 13.5nm EUV silicon wafer photomasks.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹25L - ₹48L", expert: "₹55L - ₹105L" },
            promotions: ["Lithography Engineer", "Senior EUV Reticle Lead", "Director of Advanced Silicon Patterning"]
          }
        ]
      },
      quantum_soc: {
        name: "Cryogenic Quantum Control SoC Engineering",
        roles: [
          {
            title: "Cryogenic CMOS Quantum Controller Architect",
            desc: "Designs mixed-signal controller chips operating inside dilution refrigerators at 4 Kelvin to control 1000+ superconducting qubits.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹54L", expert: "₹62L - ₹125L+" },
            promotions: ["Cryogenic IC Dev", "Principal Quantum SoC Lead", "Head of Quantum Silicon Systems"]
          },
          {
            title: "Multi-Qubit Microwave Pulse Generation Lead",
            desc: "Engineers ultra-low phase noise direct digital synthesizers emitting exact nanosecond microwave pulses that manipulate qubit spin states.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹24L - ₹46L", expert: "₹52L - ₹100L" },
            promotions: ["Quantum RF Engineer", "Senior Microwave Hardware Lead", "Director of Quantum Signal Processing"]
          }
        ]
      },
      neuromorphic: {
        name: "Spiking Neural Network Silicon Accelerators",
        roles: [
          {
            title: "Neuromorphic Spiking Silicon AI Chief Lead",
            desc: "Architects asynchronous event-driven silicon cores where transistors fire discrete spikes just like biological brain neurons at microwatt power.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹26L - ₹50L", expert: "₹58L - ₹115L+" },
            promotions: ["Neuromorphic Chip Dev", "Principal Brain-Inspired Silicon Architect", "Distinguished Neuromorphic Fellow"]
          },
          {
            title: "In-Memory Computing Memristor Circuit Lead",
            desc: "Designs crossbar arrays of non-volatile memristors performing matrix-vector multiplication directly inside memory cells without bus latency.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹22L - ₹44L", expert: "₹50L - ₹98L" },
            promotions: ["In-Memory Circuit Dev", "Senior Processing-in-Memory Lead", "Head of Emerging AI Silicon"]
          }
        ]
      },
      analog_rf: {
        name: "Ultra-High Frequency Analog & Millimeter-Wave IC",
        roles: [
          {
            title: "60GHz+ Millimeter-Wave RFIC Front-End Designer",
            desc: "Architects silicon-germanium (SiGe) power amplifiers and low-noise mixers for 6G radar and satellite inter-orbital communication transceivers.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹25L - ₹48L", expert: "₹55L - ₹110L+" },
            promotions: ["RFIC Designer", "Principal mmWave Circuit Architect", "Fellow RF Integrated Circuit Fellow"]
          },
          {
            title: "Precision 16-Bit 10GS/s Mixed-Signal ADC Architect",
            desc: "Designs ultra-high speed analog-to-digital converters sampling 10 billion data points per second for radar and optical transceivers.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹24L - ₹46L", expert: "₹52L - ₹105L" },
            promotions: ["Mixed-Signal IC Dev", "Senior Data Converter Architect", "Director of Analog Silicon"]
          }
        ]
      },
      ic_3d: {
        name: "3D Heterogeneous Chiplet Packaging & Interconnects",
        roles: [
          {
            title: "3D Stacked TSV Chiplet Lead Interconnect Architect",
            desc: "Engineers high-density through-silicon vias (TSVs) and micro-bump bridges connecting distinct 3nm compute chiplets on silicon interposers.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹25L - ₹48L", expert: "₹55L - ₹108L+" },
            promotions: ["3D Packaging Dev", "Principal Chiplet Architect", "Head of Advanced Silicon Packaging"]
          },
          {
            title: "Thermal & Mechanical Silicon Interposer Lead",
            desc: "Simulates thermo-mechanical warping and mechanical stress dissipation across multi-chiplet stacked AI processor assemblies.",
            salary: { fresher: "₹10L - ₹19L", mid: "₹20L - ₹40L", expert: "₹45L - ₹90L" },
            promotions: ["Packaging Thermal Engineer", "Senior Interposer Reliability Lead", "Director of Semiconductor Mechanics"]
          }
        ]
      },
      fpga_accel: {
        name: "High-Frequency FPGA & Hardware Emulation",
        roles: [
          {
            title: "Sub-Microsecond FinTech FPGA Kernel Lead",
            desc: "Writes custom RTL pipelines on multi-FPGA PCIe cards executing options pricing models and automated trade execution in 300 nanoseconds.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹55L", expert: "₹65L - ₹130L+" },
            promotions: ["FPGA Engineer", "Principal Hardware Acceleration Lead", "Managing Director of FPGA Trading"]
          },
          {
            title: "Enterprise Multi-FPGA Silicon Emulation Architect",
            desc: "Partitions 50 billion transistor GPU netlists across clusters of 100 enterprise FPGAs to boot OS kernels months before silicon tapeout.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹22L - ₹44L", expert: "₹50L - ₹98L" },
            promotions: ["Emulation Dev", "Senior Emulation Platform Architect", "Fellow Hardware Verification Lead"]
          }
        ]
      }
    }
  },
  mca: {
    subs: {
      fullstack_ent: {
        name: "Enterprise Cloud-Native Full Stack Architecture",
        roles: [
          {
            title: "Principal Distributed Micro-Frontends Architect",
            desc: "Architects modular independent frontend deployments with module federation and SSR Node runtimes handling 50M+ global enterprise users.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹45L - ₹88L+" },
            promotions: ["Senior Full Stack Dev", "Principal Web Architecture Lead", "Fellow Enterprise Systems Architect"]
          },
          {
            title: "High-Concurrency Real-Time WebSockets Lead",
            desc: "Builds distributed Elixir/Node WebSocket pub/sub clusters synchronizing collaborative documents across millions of concurrent browser tabs.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["Real-Time Web Engineer", "Senior Collaboration Architecture Lead", "Head of Core Web Infrastructure"]
          }
        ]
      },
      web3_zk: {
        name: "Zero-Knowledge Rollups & Layer-2 Blockchain",
        roles: [
          {
            title: "zk-SNARK Cryptographic Layer-2 Rollup Architect",
            desc: "Constructs succinct non-interactive zero-knowledge proof circuits bundling 10,000 Ethereum transactions into a single verified state root.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹26L - ₹50L", expert: "₹60L - ₹120L+" },
            promotions: ["ZK Cryptographer", "Principal Rollup Protocol Architect", "Chief Blockchain Scientist"]
          },
          {
            title: "Audited DeFi Smart Contract Security Lead",
            desc: "Writes mathematical formal verification specifications ensuring zero re-entrancy or integer overflow exploits on billion-dollar liquidity pools.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹24L - ₹45L", expert: "₹52L - ₹100L" },
            promotions: ["Smart Contract Auditor", "Lead DeFi Security Architect", "Head of Smart Contract Defense"]
          }
        ]
      },
      mobile_os: {
        name: "Cross-Platform Mobile Architecture & OS Kernels",
        roles: [
          {
            title: "Principal Cross-Platform Flutter/React Native Lead",
            desc: "Engineers custom C++/Rust native rendering bridges achieving 120 FPS native UI fluidity across iOS, Android, and Web platforms.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹82L" },
            promotions: ["Mobile Lead Dev", "Principal Mobile Systems Architect", "VP of Mobile Experience"]
          },
          {
            title: "Android Open Source Project (AOSP) Kernel Architect",
            desc: "Modifies Linux HAL drivers and custom memory allocators inside custom AOSP operating systems for rugged enterprise hardware tablets.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹86L" },
            promotions: ["OS Kernel Engineer", "Senior Android Platform Architect", "Director of Operating System R&D"]
          }
        ]
      },
      ai_agents: {
        name: "Autonomous AI Agent Workflows & LangChain Systems",
        roles: [
          {
            title: "Multi-Agent Enterprise Orchestration Architect",
            desc: "Builds autonomous LangGraph and AutoGen agentic loops where specialized AI agents plan, write code, and query SQL databases collaboratively.",
            salary: { fresher: "₹10L - ₹19L", mid: "₹22L - ₹42L", expert: "₹48L - ₹95L+" },
            promotions: ["AI Agent Engineer", "Principal Autonomous Workflow Architect", "Head of Enterprise Agentic AI"]
          },
          {
            title: "High-Performance Vector Retrieval & RAG Lead",
            desc: "Architects hybrid BM25 + dense vector semantic retrieval engines with custom re-rankers querying 100M+ corporate documents in under 50ms.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹86L" },
            promotions: ["RAG Systems Engineer", "Lead Retrieval Architecture Lead", "Director of Enterprise AI Search"]
          }
        ]
      },
      game_meta: {
        name: "Spatial Computing & Multiplayer Metaverse Systems",
        roles: [
          {
            title: "Real-Time Multiplayer Deterministic Netcode Lead",
            desc: "Writes client-side prediction and server rollback synchronization code supporting 100-player synchronized physics battles with zero lag.",
            salary: { fresher: "₹9L - ₹17L", mid: "₹20L - ₹38L", expert: "₹44L - ₹88L" },
            promotions: ["Multiplayer Network Dev", "Principal Netcode Architect", "Technical Director of Multiplayer Systems"]
          },
          {
            title: "WebGL / WebGPU Spatial 3D Engine Architect",
            desc: "Builds custom WebGPU compute shaders rendering millions of volumetric lighting particles directly inside desktop web browsers.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹40L - ₹80L" },
            promotions: ["3D Web Engineer", "Senior Spatial Engine Lead", "Head of Web 3D Graphics"]
          }
        ]
      },
      sec_devops: {
        name: "DevSecOps & Enterprise Automated Security",
        roles: [
          {
            title: "Automated CI/CD Pipeline Security Lead",
            desc: "Embeds static code analysis (SAST), software composition analysis (SCA), and dynamic fuzzing directly into enterprise Git deployment pipelines.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹34L", expert: "₹40L - ₹78L" },
            promotions: ["DevSecOps Engineer", "Principal Security Automation Lead", "Head of Secure Software Supply Chain"]
          },
          {
            title: "Cloud Container Runtime Anomaly Architect",
            desc: "Deploys Falco eBPF runtime security sensors monitoring container syscalls to kill unauthorized process escalations in real-time.",
            salary: { fresher: "₹8L - ₹16L", mid: "₹18L - ₹35L", expert: "₹42L - ₹82L" },
            promotions: ["Container Security Dev", "Senior Cloud Defense Lead", "Director of Cloud Security Operations"]
          }
        ]
      }
    }
  },
  mba_tech: {
    subs: {
      ai_prod: {
        name: "Enterprise AI Product Management & Monetization",
        roles: [
          {
            title: "VP of Enterprise AI Product Strategy",
            desc: "Aligns 100+ generative AI engineering scientists with multi-million dollar B2B enterprise software go-to-market pricing and monetization roadmaps.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹55L", expert: "₹65L - ₹140L+" },
            promotions: ["Product Manager (AI)", "Principal Group Product Lead", "VP of AI Product Management", "Chief Product Officer (CPO)"]
          },
          {
            title: "Generative AI SaaS Growth & Unit Economics Director",
            desc: "Optimizes GPU inference token cost margins against recurring SaaS subscription tiers ensuring 80%+ gross margins across cloud AI products.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹24L - ₹48L", expert: "₹55L - ₹115L" },
            promotions: ["Growth Product Lead", "Senior Director of AI Unit Economics", "EVP of Product Strategy"]
          }
        ]
      },
      fintech_strat: {
        name: "Global FinTech Venture Scaling & Digital Banking",
        roles: [
          {
            title: "Chief Digital Banking Strategy Officer",
            desc: "Architects cross-border open banking APIs and embedded AI lending underwriting algorithms scaling digital neobanks to 10M+ accounts.",
            salary: { fresher: "₹14L - ₹25L", mid: "₹28L - ₹52L", expert: "₹62L - ₹130L+" },
            promotions: ["FinTech Product Lead", "VP of Digital Banking", "Chief Executive Officer (NeoBank)"]
          },
          {
            title: "Decentralized Finance (DeFi) Institutional Lead",
            desc: "Formulates institutional tokenization frameworks converting real-world Treasury bonds into on-chain yield-bearing financial instruments.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹26L - ₹50L", expert: "₹58L - ₹120L" },
            promotions: ["DeFi Strategy Lead", "Managing Director of Digital Assets", "Head of Institutional Crypto Strategy"]
          }
        ]
      },
      cloud_econ: {
        name: "Cloud FinOps & Enterprise Infrastructure Economics",
        roles: [
          {
            title: "Global Enterprise Cloud FinOps Director",
            desc: "Analyzes multi-million dollar AWS/GCP server bills, negotiating reserved spot instances and architectural refactoring to slash cloud spend by 35%.",
            salary: { fresher: "₹10L - ₹20L", mid: "₹24L - ₹46L", expert: "₹52L - ₹105L+" },
            promotions: ["Cloud FinOps Analyst", "Principal Cloud Economics Lead", "VP of Global Cloud Operations"]
          },
          {
            title: "Enterprise SaaS Vendor Ecosystem Negotiation Lead",
            desc: "Manages multi-year enterprise license agreements across Snowflake, Databricks, and OpenAI optimizing corporate IT cost efficiency.",
            salary: { fresher: "₹9L - ₹18L", mid: "₹20L - ₹40L", expert: "₹45L - ₹90L" },
            promotions: ["Vendor Strategy Specialist", "Senior IT Procurement Lead", "Chief Technology Economics Officer"]
          }
        ]
      },
      cyber_risk: {
        name: "Executive Cyber Risk & Corporate Governance Strategy",
        roles: [
          {
            title: "Chief Information Security Strategy Director",
            desc: "Translates complex ransomware and nation-state cyber threat matrices into boardroom risk models ensuring strict GDPR and SOC2 compliance.",
            salary: { fresher: "₹12L - ₹24L", mid: "₹26L - ₹50L", expert: "₹58L - ₹125L+" },
            promotions: ["Cyber Risk Consultant", "Principal Governance Lead", "Chief Information Security Officer (CISO)"]
          },
          {
            title: "Enterprise AI Ethics & Regulatory Compliance Lead",
            desc: "Establishes corporate AI governance guardrails preventing algorithmic copyright infringement, bias, and regulatory penalties under EU AI Act.",
            salary: { fresher: "₹10L - ₹19L", mid: "₹22L - ₹44L", expert: "₹50L - ₹98L" },
            promotions: ["AI Ethics Lead", "Senior Director of AI Compliance", "Chief AI Governance Officer"]
          }
        ]
      },
      corp_vent: {
        name: "Corporate Venture Capital & Deep Tech M&A Strategy",
        roles: [
          {
            title: "Principal Deep Tech M&A Investment Director",
            desc: "Evaluates technical IP defensibility and conducts deep due diligence on quantum computing and generative AI startups for $500M tech acquisitions.",
            salary: { fresher: "₹14L - ₹26L", mid: "₹28L - ₹55L", expert: "₹65L - ₹140L+" },
            promotions: ["Venture Associate", "Principal Investment Lead", "Managing Director of Corporate Venture Capital"]
          },
          {
            title: "Enterprise Tech Startup Incubation Scaling Lead",
            desc: "Partners early-stage AI startup acquisitions with Fortune 500 enterprise distribution channels scaling ARR from $1M to $50M in 24 months.",
            salary: { fresher: "₹12L - ₹22L", mid: "₹24L - ₹48L", expert: "₹55L - ₹115L" },
            promotions: ["Startup Growth Lead", "Senior Director of Venture Scaling", "VP of New Venture Incubation"]
          }
        ]
      },
      data_strat: {
        name: "Chief Data Officer (CDO) & Enterprise AI Strategy",
        roles: [
          {
            title: "VP of Enterprise Data & AI Governance Strategy",
            desc: "Constructs enterprise-wide data lakes and unified ontology schemas enabling thousands of employees to query clean corporate data securely.",
            salary: { fresher: "₹14L - ₹25L", mid: "₹28L - ₹52L", expert: "₹62L - ₹130L+" },
            promotions: ["Data Strategy Lead", "Principal Director of Data Strategy", "Chief Data Officer (CDO)"]
          },
          {
            title: "Global AI Transformation Change Management Director",
            desc: "Designs workforce upskilling roadmaps and AI co-pilot adoption programs transitioning 50,000 corporate employees into AI-augmented workflows.",
            salary: { fresher: "₹11L - ₹20L", mid: "₹24L - ₹46L", expert: "₹52L - ₹105L" },
            promotions: ["AI Adoption Consultant", "Senior Director of AI Transformation", "Chief AI Strategy Officer"]
          }
        ]
      }
    }
  }
};

export const branchCustomData: Record<string, {
  tools: Array<{ name: string; type: string; color: string }>;
  certs: Array<{ title: string; org: string; badge: string }>;
  checklist: Array<{ label: string }>;
  roadmap: Array<{ title: string; desc: string }>;
}> = {
  cse: {
    tools: [
      { name: 'Python / Rust / Go', type: 'Core Languages', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Docker & Kubernetes', type: 'Containerization', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'AWS / GCP Cloud Mesh', type: 'Cloud Infrastructure', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Redis & PostgreSQL', type: 'Distributed Storage', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Apache Kafka & Grpc', type: 'Event Streaming', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Terraform & CI/CD Pipelines', type: 'DevOps Automation', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'System Design & Microservices', type: 'Architecture', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'Git & Linux Internals', type: 'Foundation', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
    ],
    certs: [
      { title: 'AWS / Azure Solutions Architect Professional', org: 'Amazon Web Services / Microsoft', badge: 'High ROI' },
      { title: 'Certified Kubernetes Administrator (CKA)', org: 'Cloud Native Computing Foundation', badge: 'Must Have' },
      { title: 'Applied System Design & High Scalability Fellow', org: 'Stanford Online / Core Tech', badge: 'Elite Core' }
    ],
    checklist: [
      { label: 'Mastered core algorithms, recursion, dynamic programming & graph structures' },
      { label: 'Built & deployed 2+ distributed microservice portfolio projects on cloud' },
      { label: 'Configured automated CI/CD pipelines with Docker containers and Git workflows' },
      { label: 'Solved 25+ high-throughput System Design & concurrency trade-off case studies' },
      { label: 'Optimized GitHub portfolio, README docs, and LinkedIn ATS technical keywords' }
    ],
    roadmap: [
      { title: 'Data Structures & System Internals', desc: 'Master memory management, asynchronous concurrency, indexing, and core runtime engines.' },
      { title: 'Distributed Cloud Capstone Build', desc: 'Architect a geo-distributed microservice cluster containerized with Docker and Kubernetes.' },
      { title: 'System Design & Interview Preparation', desc: 'Conquer scalability bottlenecks, load balancing patterns, mock technical rounds & salary negotiation.' }
    ]
  },
  aids: {
    tools: [
      { name: 'PyTorch / TensorFlow 2.x', type: 'Deep Learning', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'HuggingFace & LangChain', type: 'LLM Ecosystem', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'CUDA & Triton Inference', type: 'GPU Acceleration', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Milvus / Pinecone / Qdrant', type: 'Vector Databases', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Apache Spark & MLflow', type: 'MLOps Pipeline', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Ray & vLLM Cluster', type: 'Distributed Scaling', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'Python & NumPy / Pandas', type: 'Data Wrangling', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'Weights & Biases (WandB)', type: 'Experiment Tracking', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
    ],
    certs: [
      { title: 'AWS Certified Machine Learning - Specialty', org: 'Amazon Web Services', badge: 'High ROI' },
      { title: 'DeepLearning.AI Generative AI Professional', org: 'Stanford / DeepLearning.AI', badge: 'Must Have' },
      { title: 'TensorFlow Applied Deep Neural Fellow', org: 'Google Cloud Academy', badge: 'AI Pioneer' }
    ],
    checklist: [
      { label: 'Mastered linear algebra, probability, backpropagation & transformer architectures' },
      { label: 'Fine-tuned & deployed an LLM (Llama/Mistral) with custom RAG vector database' },
      { label: 'Automated end-to-end training and inference evaluation pipeline with MLflow' },
      { label: 'Completed 20+ real-world ML system design & inference latency optimization cases' },
      { label: 'Published AI research experiments or portfolio repository with live demo links' }
    ],
    roadmap: [
      { title: 'Deep Neural Mathematics & Attention', desc: 'Thorough grasp of self-attention mechanisms, loss optimization, and vector math.' },
      { title: 'Generative AI RAG & Fine-Tuning Build', desc: 'Build an enterprise RAG copilot with LoRA fine-tuning and vector indexing.' },
      { title: 'MLOps System Design & Model Scaling', desc: 'Optimize GPU memory throughput, quantization (GGUF/AWQ), and inference latency.' }
    ]
  },
  it: {
    tools: [
      { name: 'Multi-Cloud AWS / Azure / GCP', type: 'Cloud Architecture', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Terraform & Ansible', type: 'Infrastructure as Code', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'C++ / Rust Core Engine', type: 'Low-Latency FinTech', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Zero-Trust Security Mesh', type: 'Cyber Defense', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'Apache Kafka & RabbitMQ', type: 'Message Broker', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Prometheus & Grafana', type: 'Live Observability', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Linux Kernel & BPF', type: 'Systems Core', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'PostgreSQL & Redis Enterprise', type: 'Fast Caching', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
    ],
    certs: [
      { title: 'HashiCorp Certified: Terraform Associate', org: 'HashiCorp Infrastructure', badge: 'High ROI' },
      { title: 'CISSP - Certified Information Systems Security Pro', org: 'ISC2 Cybersecurity', badge: 'Gold Standard' },
      { title: 'Google Cloud Professional Cloud Architect', org: 'Google Cloud Platform', badge: 'Top Pay' }
    ],
    checklist: [
      { label: 'Configured automated multi-region Terraform cloud infrastructure grids' },
      { label: 'Built ultra-low latency WebSocket or messaging pipeline processing live events' },
      { label: 'Implemented enterprise IAM policies and zero-trust firewall penetration rules' },
      { label: 'Solved 20+ enterprise cloud migration & disaster recovery architecture cases' },
      { label: 'Highlighted high-availability cloud & security credentials on resume' }
    ],
    roadmap: [
      { title: 'Hybrid Cloud & Network Protocols', desc: 'Master TCP/IP internals, TLS encryption grids, and multi-tenant cloud security zones.' },
      { title: 'High-Throughput FinTech Core Build', desc: 'Develop a resilient messaging backend capable of handling millions of concurrent events.' },
      { title: 'Cloud Cost FinOps & Enterprise Reliability', desc: 'Conduct disaster recovery audits, zero-downtime rolling updates, and security hardened reviews.' }
    ]
  },
  ece: {
    tools: [
      { name: 'Cadence Virtuoso & Synopsys', type: 'EDA IC Design', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Verilog / VHDL / SystemVerilog', type: 'RTL Hardware', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'UVM & Formal Verification', type: 'SoC Verification', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Xilinx Vivado & Quartus', type: 'FPGA Synthesis', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'ARM Cortex & RISC-V RTL', type: 'Microarchitecture', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'MATLAB & 5G DSP Toolbox', type: 'Signal Processing', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Embedded C / C++ RTOS', type: 'Firmware Core', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'Calibre DRC / LVS', type: 'Physical Signoff', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' }
    ],
    certs: [
      { title: 'ARM Certified SoC Design Specialist', org: 'ARM Holdings Semiconductor', badge: 'High ROI' },
      { title: 'Synopsys Custom VLSI RTL & Verification Pro', org: 'Synopsys University', badge: 'Must Have' },
      { title: 'Xilinx / AMD FPGA System Verification Fellow', org: 'AMD Adaptable Hardware', badge: 'Silicon Core' }
    ],
    checklist: [
      { label: 'Mastered digital logic design, CMOS timing analysis, and state machine RTL synthesis' },
      { label: 'Synthesised & simulated custom Verilog/SystemVerilog design on FPGA hardware' },
      { label: 'Executed UVM testbenches achieving 100% functional coverage on custom blocks' },
      { label: 'Completed 15+ sub-nanometer clock tree synthesis & setup/hold timing violation cases' },
      { label: 'Showcased RTL GitHub testbenches and chip tapeout project documentation' }
    ],
    roadmap: [
      { title: 'Digital Logic & Sub-Nanometer Physics', desc: 'Grasp parasitics, FinFET / GAA transistor characteristics, and RTL timing closure.' },
      { title: 'Custom ASIC / FPGA Core Capstone', desc: 'Design and simulate a pipelined RISC-V processor or high-speed DSP block.' },
      { title: 'Physical Design Tapeout & Verification', desc: 'Run DRC/LVS signoff checks, power mesh layout, and interview technical silicon rounds.' }
    ]
  },
  eee: {
    tools: [
      { name: 'MATLAB & Simulink Power Grid', type: 'Grid Modeling', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'PSCAD & ETAP Power Systems', type: 'Load Flow Simulation', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Silicon-Carbide (SiC) Inverters', type: 'Power Electronics', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Siemens PLC & SCADA IoT', type: 'Grid Automation', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'Battery Management (BMS) C++', type: 'EV Powertrain', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'AutoCAD Electrical & EPLAN', type: 'Schematic Layout', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Embedded STM32 / CAN Bus', type: 'Vehicle Telemetry', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'ANSYS Maxwell 3D', type: 'Electromagnetic CFD', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
    ],
    certs: [
      { title: 'Certified Energy Manager (CEM)', org: 'Association of Energy Engineers', badge: 'High Pay' },
      { title: 'Siemens Certified Industrial Automation Specialist', org: 'Siemens Digital Industries', badge: 'Core IoT' },
      { title: 'IEEE EV Traction & Powertrain Architecture Pro', org: 'IEEE Standards Association', badge: 'Green Tech' }
    ],
    checklist: [
      { label: 'Mastered 3-phase harmonic distortion, reactive power compensation & inverter topology' },
      { label: 'Simulated EV battery thermal runaways or solar micro-grid synchronization relays' },
      { label: 'Programmed industrial ladder logic and SCADA HMI remote control interfaces' },
      { label: 'Completed 15+ high-voltage grid stability and short-circuit fault analysis cases' },
      { label: 'Highlighted power electronics and EV powertrain simulation project portfolio' }
    ],
    roadmap: [
      { title: 'High-Voltage Circuit Analysis & Control', desc: 'Study PWM switching losses, MOSFET/IGBT gate drivers, and grid synchronization.' },
      { title: 'EV Traction & Smart Grid Simulation', desc: 'Build an end-to-end Simulink model for rapid EV battery balancing and solar inverter control.' },
      { title: 'Grid Automation Signoff & Technical Review', desc: 'Verify fault tolerances, harmonic compliance standards, and technical core interview rounds.' }
    ]
  },
  mech: {
    tools: [
      { name: 'ANSYS Fluent & CFX CFD', type: 'Thermal Fluid Simulation', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'SolidWorks & CATIA V5/V6', type: 'Parametric CAD', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'ROS 2 (Robot Operating System)', type: 'Robotics Kinematics', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Python & OpenCV Automation', type: 'Mechatronic Vision', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'MATLAB Servo Dynamics', type: 'Control Systems', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'GD&T Precision ASME Y14.5', type: 'Geometric Tolerancing', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Abaqus FEA Stress Analysis', type: 'Structural Simulation', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'Siemens NX Additive Mfg', type: 'Advanced Manufacturing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
    ],
    certs: [
      { title: 'Certified SolidWorks Professional (CSWP)', org: 'Dassault Systèmes', badge: 'Must Have' },
      { title: 'ANSYS Certified CFD & Thermal Dynamics Fellow', org: 'ANSYS Simulation Academy', badge: 'High Pay' },
      { title: 'ROS 2 Industrial Robotics Developer Professional', org: 'Open Robotics Foundation', badge: 'Robotics Core' }
    ],
    checklist: [
      { label: 'Mastered thermodynamics, fluid turbulence equations, and finite element stress matrices' },
      { label: 'Designed 3D parametric multi-axis robotic arm assembly with motion simulation' },
      { label: 'Ran converged CFD thermal dissipation simulations for EV battery cooling plates' },
      { label: 'Completed 15+ aerospace propulsion vibration and fatigue failure analysis studies' },
      { label: 'Showcased CAD renders, CFD mesh convergence graphs, and FEA reports in portfolio' }
    ],
    roadmap: [
      { title: 'Continuum Mechanics & Thermal Physics', desc: 'Grasp Navier-Stokes turbulence, finite element stiffness matrices, and material elasticity.' },
      { title: 'Robotics Kinematics / CFD Simulation Build', desc: 'Simulate aerodynamic lift over a turbine or multi-axis robotic kinematics feedback loop.' },
      { title: 'Precision Tolerancing & Industry Signoff', desc: 'Review GD&T ASME standards, additive manufacturing limits, and core technical interviews.' }
    ]
  },
  civil: {
    tools: [
      { name: 'Autodesk Revit & BIM 360', type: '3D Building Twin', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'ArcGIS & GIS Cloud Engine', type: 'Spatial Urban Mapping', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'ETABS & SAP2000 Seismic', type: 'Structural Dynamics', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Primavera P6 & MS Project', type: 'Mega-Project Timeline', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'Python GIS Spatial Scripting', type: 'Geo-Data Analytics', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'STAAD.Pro Foundation FEA', type: 'Bridge Analysis', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'Civil 3D Highway Alignment', type: 'Infrastructure CAD', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'DroneDeploy LiDAR Mapping', type: 'Digital Surveying', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
    ],
    certs: [
      { title: 'Autodesk Certified Professional: Revit BIM Manager', org: 'Autodesk Infrastructure', badge: 'Must Have' },
      { title: 'Certified GIS Professional (GISP)', org: 'GIS Certification Institute', badge: 'Smart City' },
      { title: 'LEED Green Associate / Envision SP Sustainable Lead', org: 'U.S. Green Building Council', badge: 'High ROI' }
    ],
    checklist: [
      { label: 'Mastered structural load distribution, dynamic wind damping & soil shear matrices' },
      { label: 'Created Level of Development (LOD) 400 parametric Revit 3D digital twin model' },
      { label: 'Simulated earthquake ground acceleration damping for suspension bridges' },
      { label: 'Completed 15+ urban smart grid hydrology and traffic flow optimization cases' },
      { label: 'Compiled structural calculation sheets and GIS interactive maps in portfolio' }
    ],
    roadmap: [
      { title: 'Structural Dynamics & Soil Mechanics', desc: 'Understand seismic base isolation, foundation settlement, and reinforced concrete stress.' },
      { title: 'Urban Digital Twin & Seismic Simulation', desc: 'Construct a 3D BIM parametric skyscraper model with live solar and wind load simulation.' },
      { title: 'Mega-Project Scheduling & Safety Review', desc: 'Audit resource leveling in Primavera P6, environmental compliance, and structural defense.' }
    ]
  },
  chem: {
    tools: [
      { name: 'Aspen HYSYS & Aspen Plus', type: 'Process Flow Simulation', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'COMSOL Multiphysics Chem', type: 'Reaction Kinetics CFD', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Green Hydrogen Electrolyzers', type: 'Clean Energy Synthesis', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Python Chemometrics & ML', type: 'Catalyst Optimization', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'MATLAB Reactor Dynamics', type: 'Thermal Control Loops', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'HAZOP & PHA Safety Engine', type: 'Risk Audit Simulation', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'Polymer Synthesis Piping', type: 'Industrial Scaling', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'SCADA Chemical Automation', type: 'Plant Telemetry', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' }
    ],
    certs: [
      { title: 'AspenTech Certified Process Modeling Professional', org: 'Aspen Technology', badge: 'Must Have' },
      { title: 'Certified Green Hydrogen & Clean Ammonia Engineer', org: 'International Energy Institute', badge: 'High ROI' },
      { title: 'AIChE Certified Chemical Process Safety Specialist', org: 'American Institute of Chemical Eng', badge: 'Core Safety' }
    ],
    checklist: [
      { label: 'Mastered chemical thermodynamics, fugacity coefficients & reaction rate laws' },
      { label: 'Simulated continuous green hydrogen electrolysis plant convergence in Aspen HYSYS' },
      { label: 'Executed complete HAZOP risk assessment matrix for high-pressure distillation column' },
      { label: 'Completed 15+ industrial bioreactor heat transfer and catalytic efficiency cases' },
      { label: 'Showcased process flow diagrams (PFDs) and energy optimization charts in portfolio' }
    ],
    roadmap: [
      { title: 'Reaction Engineering & Phase Equilibria', desc: 'Master Gibbs free energy, catalytic diffusion rates, and multi-component distillation.' },
      { title: 'Continuous Green Synthesis Plant Simulation', desc: 'Build an end-to-end Aspen Plus simulation optimizing clean ammonia or hydrogen extraction.' },
      { title: 'Safety Audits & Industrial Scale Review', desc: 'Conduct overpressure relief sizing, environmental effluent audits, and technical interviews.' }
    ]
  },
  biotech: {
    tools: [
      { name: 'Biopython & Nextflow Pipeline', type: 'Genomic Sequencing', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'AlphaFold 2 & Rosetta 3D', type: 'Protein Folding AI', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Illumina CRISPR Analytics', type: 'Gene Editing Simulation', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'R / Bioconductor RNA-Seq', type: 'Bioinformatics Math', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'PyTorch Molecular Modeling', type: 'Drug Discovery GNN', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'PyMOL & ChemDraw 3D', type: 'Molecular Visualization', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Docker & AWS HealthOmics', type: 'Cloud Biocompute', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'GROMACS Molecular Dynamics', type: 'Biophysical Sim', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
    ],
    certs: [
      { title: 'Certified Bioinformatics & Computational Biology Pro', org: 'International Society for Comput Bio', badge: 'Must Have' },
      { title: 'Stanford Applied Genomic Data Scientist Specialist', org: 'Stanford University Online', badge: 'High ROI' },
      { title: 'AI in Drug Discovery & Molecular Modeling Fellow', org: 'DeepMind / Bio-AI Academy', badge: 'Elite Frontier' }
    ],
    checklist: [
      { label: 'Mastered DNA/RNA nucleotide alignments, BLAST algorithms & phylogenetic trees' },
      { label: 'Built automated Nextflow pipeline processing single-cell RNA sequencing datasets' },
      { label: 'Predicted targeted antibody binding affinities using graph neural networks / AlphaFold' },
      { label: 'Completed 15+ clinical biomarker statistical validation and CRISPR specificity cases' },
      { label: 'Published biocomputational Jupyter notebooks and protein structure plots on GitHub' }
    ],
    roadmap: [
      { title: 'Molecular Biology & Sequence Algorithms', desc: 'Understand Smith-Waterman alignment, Markov hidden models, and gene expression statistics.' },
      { title: 'AI Antibody Drug Discovery Simulation', desc: 'Deploy a deep learning pipeline simulating ligand-receptor binding affinity scores.' },
      { title: 'Clinical Validation & Biopharma Defense', desc: 'Review FDA biomarker compliance, reproducibility metrics, and technical biotech rounds.' }
    ]
  },
  aero: {
    tools: [
      { name: 'STK (Systems Tool Kit) Orbital', type: 'Trajectory Guidance', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'ANSYS CFX Hypersonic Aerodynamics', type: 'Supersonic CFD', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'C++ Flight Avionics RTOS', type: 'Real-Time Flight Core', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
      { name: 'ROS / PX4 Drone Autopilot', type: 'Autonomous Flight', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'MATLAB / Simulink Telemetry', type: 'Avionics Control', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Nastran Finite Element Aero', type: 'Airframe Stress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Python Rocket Propulsion Script', type: 'Combustion Modeling', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'Catia Spacecraft Structural CAD', type: 'Aerospace Layout', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
    ],
    certs: [
      { title: 'AIAA Certified Spacecraft Guidance & Propulsion Fellow', org: 'American Institute of Aeronautics', badge: 'Elite Core' },
      { title: 'ANSYS Certified Hypersonic Aerodynamics Modeler', org: 'ANSYS Aerospace Division', badge: 'High Pay' },
      { title: 'FAA / EASA Certified Avionics Systems Architect', org: 'Aviation Safety Standards', badge: 'Must Have' }
    ],
    checklist: [
      { label: 'Mastered orbital mechanics, Keplerian trajectories & rocket combustion thermodynamics' },
      { label: 'Simulated real-time orbital insertion correction burns with C++ guidance firmware' },
      { label: 'Ran hypersonic shock wave CFD analysis over reusable spacecraft re-entry heat shields' },
      { label: 'Completed 15+ avionics sensor fusion (Kalman filters) and telemetry redundancy cases' },
      { label: 'Showcased flight trajectory simulation plots and propulsion thrust curves in portfolio' }
    ],
    roadmap: [
      { title: 'Orbital Mechanics & Flight Dynamics', desc: 'Master atmospheric drag, attitude determination, gyroscope feedback, and rocket nozzles.' },
      { title: 'Spacecraft Guidance / Avionics Capstone', desc: 'Build an autonomous trajectory navigation filter or hypersonic turbine nozzle CFD model.' },
      { title: 'Mission Reliability & Flight Readiness Review', desc: 'Conduct fail-safe telemetry audits, vibration tolerance signoffs, and technical defense.' }
    ]
  },
  metal: {
    tools: [
      { name: 'Thermo-Calc & JMatPro Phase Sim', type: 'Alloy Thermodynamics', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'SEM / TEM Electron Microscopy', type: 'Nanoscale Characterization', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Python Materials Informatics', type: 'Alloy Discovery ML', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'LAMMPS Molecular Dynamics', type: 'Lattice Simulation', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'XRD Crystallography Analysis', type: 'Phase Diffraction', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Vacuum Plasma Sintering CAD', type: 'Superalloy Processing', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'Abaqus Fracture Mechanics', type: 'Creep & Fatigue Sim', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'Corrosion Electrochemical Lab', type: 'Extreme Stress Test', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' }
    ],
    certs: [
      { title: 'ASM International Certified Metallurgical Specialist', org: 'ASM Materials Society', badge: 'Gold Standard' },
      { title: 'Advanced Nanomaterials Characterization Fellow', org: 'Nanotechnology Research Institute', badge: 'High ROI' },
      { title: 'NACE Certified Corrosion & Superalloy Architect', org: 'Corrosion Engineers Society', badge: 'Must Have' }
    ],
    checklist: [
      { label: 'Mastered phase diagrams, dislocation kinetics, crystal lattices & heat treatment curves' },
      { label: 'Simulated high-temperature titanium-carbon superalloy precipitation in Thermo-Calc' },
      { label: 'Applied machine learning models to predict yield strength of multi-component alloys' },
      { label: 'Completed 15+ nuclear reactor or rocket nozzle thermal creep and fatigue failure cases' },
      { label: 'Compiled electron microscopy micrographs and alloy phase equilibrium reports' }
    ],
    roadmap: [
      { title: 'Crystallography & Thermodynamics of Alloys', desc: 'Understand grain boundaries, solute diffusion rates, and phase transformation kinetics.' },
      { title: 'Superalloy Synthesis & Simulation Build', desc: 'Model an ultra-high temperature composite for aerospace propulsion or reactor cladding.' },
      { title: 'Fracture Mechanics & Materials Signoff', desc: 'Audit non-destructive testing (NDT), high-temperature creep limits, and technical rounds.' }
    ]
  },
  mtech_cloud: {
    tools: [
      { name: 'Kubernetes Istio Service Mesh', type: 'Cloud Orchestration', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Paxos / Raft Distributed Consensus', type: 'Consensus Algorithms', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Rust High-Performance Edge Core', type: 'Zero-Copy Systems', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'gRPC & WebRTC Low-Latency Mesh', type: 'RPC Telemetry', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'OpenTelemetry & Prometheus Observability', type: 'Deep Distributed Tracing', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Ceph & MinIO Object Storage', type: 'Distributed Storage', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'eBPF Linux Kernel Tracing', type: 'High-Speed Networking', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'Terraform Enterprise Multi-Cloud', type: 'Global Automation', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' }
    ],
    certs: [
      { title: 'CKS - Certified Kubernetes Security Specialist', org: 'Cloud Native Computing Foundation', badge: 'Elite Masters' },
      { title: 'AWS / GCP Certified Distinguished Cloud Architect Fellow', org: 'Global Cloud Council', badge: 'Top Pay' },
      { title: 'Linux Foundation Distributed Systems Engineering Fellow', org: 'Linux Foundation Executive', badge: 'Executive Core' }
    ],
    checklist: [
      { label: 'Mastered CAP theorem trade-offs, vector clocks, Paxos consensus & Byzantine tolerance' },
      { label: 'Architected geo-replicated zero-downtime database cluster with Raft leader election' },
      { label: 'Configured eBPF kernel packet filtering and Istio zero-trust mTLS encryption grids' },
      { label: 'Completed 25+ petabyte-scale distributed caching and cross-region failover benchmarks' },
      { label: 'Showcased distributed architecture whitepapers and high-load load test metrics' }
    ],
    roadmap: [
      { title: 'Distributed Algorithms & Consensus Internals', desc: 'Deep dive into Raft leader elections, split-brain resolution, and vector clocks.' },
      { title: 'Geo-Replicated Serverless Edge Capstone', desc: 'Construct a multi-region distributed object store with sub-millisecond edge failover.' },
      { title: 'Fault Tolerance & Principal Systems Defense', desc: 'Audit chaos engineering resilience, network partitions, and principal architect reviews.' }
    ]
  },
  mtech_vlsi: {
    tools: [
      { name: 'Cadence Genus & Innovus P&R', type: 'Digital Place & Route', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Cryogenic Microwave Signal Core', type: 'Quantum Qubit Control', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Qiskit & OpenQASM Quantum Script', type: 'Quantum Algorithms', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'FinFET & 3nm GAA Transistor CAD', type: 'Sub-Nanometer Physics', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Calibre DRC / LVS Physical Signoff', type: 'Tapeout Verification', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'Synopsys PrimeTime STA Timing', type: 'Static Timing Signoff', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Advanced UVM & SystemVerilog Assertions', type: 'Formal SoC Test', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'Ansys RedHawk Power/Thermal Mesh', type: 'Silicon IR Drop Sim', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' }
    ],
    certs: [
      { title: 'IEEE Senior Fellow: Advanced 3nm VLSI & Quantum Architecture', org: 'IEEE Solid-State Circuits Society', badge: 'Elite Hardware' },
      { title: 'IBM Qiskit Quantum Hardware & Qubit Control Specialist', org: 'IBM Quantum Systems', badge: 'Quantum Core' },
      { title: 'TSMC / Synopsys Certified Advanced Packaging & Tapeout Pro', org: 'TSMC Semiconductor Academy', badge: 'Top Pay' }
    ],
    checklist: [
      { label: 'Mastered quantum entanglement control, sub-nanometer leakage & IR drop mitigation' },
      { label: 'Executed complete Place & Route (P&R) flow for a 3nm/5nm block achieving timing closure' },
      { label: 'Simulated cryogenic microwave control pulses for multi-qubit error correction arrays' },
      { label: 'Completed 20+ static timing analysis (STA) multi-corner clock skew closure cases' },
      { label: 'Published tapeout verification reports and quantum control algorithm benchmarks' }
    ],
    roadmap: [
      { title: 'Sub-Nanometer Physics & Cryogenic Electronics', desc: 'Understand quantum tunneling, gate-all-around (GAA) structures, and thermal noise limits.' },
      { title: 'Custom 3nm SoC / Quantum Controller Capstone', desc: 'Architect a verified multi-qubit error correction processor or sub-nanometer AI hardware accelerator.' },
      { title: 'Physical Signoff Tapeout & Principal Defense', desc: 'Run DRC/LVS physical verification, IR drop grids, and fellow silicon architect interviews.' }
    ]
  },
  mca: {
    tools: [
      { name: 'React 19 & Next.js 15 Full Stack', type: 'Web App Architecture', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'Solidity & Rust Web3 Contracts', type: 'Blockchain Core', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Zero-Knowledge (ZK) Rollup Circuits', type: 'Crypto Privacy Layer', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Node.js / NestJS Microservices', type: 'Scalable Backend Core', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'PostgreSQL & Prisma ORM Cluster', type: 'Relational Database', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Docker & Kubernetes Cloud Deploy', type: 'Container DevOps', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'GraphQL & WebSockets Live Engine', type: 'Real-Time API', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'TailwindCSS & Shadcn UI Design', type: 'Frontend Aesthetics', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' }
    ],
    certs: [
      { title: 'Certified Ethereum & Web3 Smart Contract Auditor Pro', org: 'Ethereum Foundation / OpenZeppelin', badge: 'High Pay' },
      { title: 'Full Stack Cloud Native Web Specialist Professional', org: 'Vercel / Next.js Ecosystem', badge: 'Must Have' },
      { title: 'AWS Certified Developer - Enterprise Full Stack Associate', org: 'Amazon Web Services', badge: 'High ROI' }
    ],
    checklist: [
      { label: 'Mastered asynchronous JavaScript, React server components & Solidity gas optimization' },
      { label: 'Built audited Web3 decentralized app (dApp) with zero-knowledge cryptographic proofs' },
      { label: 'Deployed high-availability NestJS microservices backed by Redis and PostgreSQL' },
      { label: 'Completed 20+ full stack security audits (OWASP Top 10, re-entrancy attacks)' },
      { label: 'Showcased live deployed full-stack SaaS apps with custom domain GitHub repos' }
    ],
    roadmap: [
      { title: 'Modern Full Stack & Cryptographic Architecture', desc: 'Master server-side rendering, WebSocket pools, Solidity EVM storage, and ZK proofs.' },
      { title: 'Enterprise Web3 SaaS Capstone Build', desc: 'Construct a full-stack SaaS marketplace integrating smart contracts and Stripe payment grids.' },
      { title: 'Security Auditing & Principal CTO Defense', desc: 'Audit smart contract vulnerabilities, database query indexes, and executive tech reviews.' }
    ]
  },
  mba_tech: {
    tools: [
      { name: 'Generative AI Roadmap & Strategy', type: 'AI Enterprise Vision', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { name: 'Jira Product Discovery & Aha!', type: 'Agile Product Roadmaps', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      { name: 'Mixpanel / Amplitude / Tableau BI', type: 'Product Unit Economics', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { name: 'Enterprise Cloud FinOps & Economics', type: 'Cloud Cost Optimization', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      { name: 'Go-To-Market SaaS Unit Economics', type: 'Monetization Scale', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      { name: 'OKRs & Cross-Functional Executive Leadership', type: 'C-Suite Alignment', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
      { name: 'HubSpot Enterprise CRM & Salesforce', type: 'Revenue Operations', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      { name: 'Corporate Venture & M&A Due Diligence', type: 'Strategic Scaling', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' }
    ],
    certs: [
      { title: 'Certified Scrum Product Owner (CSPO) / Pragmatic Leader', org: 'Scrum Alliance / Pragmatic Institute', badge: 'Must Have' },
      { title: 'Executive AI Strategy & Enterprise Leadership Fellow', org: 'Harvard / INSEAD Executive Academy', badge: 'C-Suite Fast Track' },
      { title: 'AWS Cloud Practitioner for Executive Leaders & FinOps', org: 'Amazon Web Services Executive', badge: 'High ROI' }
    ],
    checklist: [
      { label: 'Mastered SaaS metrics (CAC, LTV, Churn, ARR), AI monetization models & agile sprints' },
      { label: 'Formulated a multi-year enterprise AI roadmap increasing operational margins by 35%' },
      { label: 'Conducted user interview discovery synthesised into high-conversion product PRDs' },
      { label: 'Completed 20+ executive case studies solving product churn and pricing strategies' },
      { label: 'Showcased executive slide decks, product roadmaps, and go-to-market metrics' }
    ],
    roadmap: [
      { title: 'AI Unit Economics & Product Discovery', desc: 'Understand LLM token API costs, enterprise pricing elasticity, and customer acquisition funnels.' },
      { title: 'Enterprise AI Strategy Capstone Formulation', desc: 'Draft a comprehensive go-to-market strategy for scaling an AI copilot across 10,000 users.' },
    ]
  }
};

export function getRoleCustomData(role: any, branchId: string) {
  if (!role) return branchCustomData[branchId] || branchCustomData['cse'];
  
  const text = `${role.title || ''} ${role.subName || ''} ${role.desc || ''}`.toLowerCase();
  const base = branchCustomData[branchId] || branchCustomData['cse'];

  // 1. Cyber / Security / Defense
  if (text.includes('cyber') || text.includes('security') || text.includes('penetration') || text.includes('defense') || text.includes('zero-trust') || text.includes('soc')) {
    return {
      tools: [
        { name: 'Wireshark & Packet Analysis', type: 'Network Diagnostics', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
        { name: 'Kali Linux & Metasploit', type: 'Offensive Security', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { name: 'AWS GuardDuty & Sentinel', type: 'Cloud SIEM', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        { name: 'Zero-Trust IAM Policies', type: 'Identity Governance', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { name: 'CrowdStrike Falcon & EDR', type: 'Endpoint Defense', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        { name: 'Python Security Automation', type: 'DevSecOps Scripting', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
      ],
      certs: [
        { title: 'CISSP - Certified Information Systems Security Pro', org: 'ISC2 Cybersecurity', badge: 'Gold Standard' },
        { title: 'Offensive Security Certified Professional (OSCP)', org: 'OffSec Academy', badge: 'Elite Offensive' },
        { title: 'AWS Certified Security - Specialty', org: 'Amazon Web Services', badge: 'High Pay' }
      ],
      checklist: [
        { label: `Mastered network protocols (TCP/IP, DNS, TLS) and vulnerability assessment frameworks for ${role.title}` },
        { label: 'Built automated intrusion detection SIEM pipeline deploying active threat response rules' },
        { label: 'Executed end-to-end penetration test simulation and vulnerability triage report' },
        { label: 'Completed 20+ enterprise security audits, zero-trust IAM and cloud hardening cases' },
        { label: 'Highlighted CVE discoveries, CTF ranks, and security certifications on resume' }
      ],
      roadmap: [
        { title: `${role.title}: Core Security Architecture & Protocols`, desc: 'Master cryptography algorithms, TCP/IP network packets, firewall penetration rules, and vulnerability scanning.' },
        { title: 'Live SIEM Defense & Red/Blue Team Capstone Build', desc: 'Deploy a cloud zero-trust SIEM monitoring grid capable of detecting and mitigating active ransomware attacks.' },
        { title: 'Security Auditing, Compliance & Executive Defense', desc: 'Conquer ISO 27001 / SOC2 audits, incident triage simulations, technical board defense, and salary negotiation.' }
      ]
    };
  }

  // 2. AI / ML / Deep Learning / Data Science
  if (text.includes('ai') || text.includes('machine learning') || text.includes('deep learning') || text.includes('llm') || text.includes('neural') || text.includes('data science') || text.includes('computer vision')) {
    return {
      tools: [
        { name: 'PyTorch / TensorFlow 2.x', type: 'Deep Learning Core', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { name: 'HuggingFace & LangChain', type: 'LLM Ecosystem', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { name: 'CUDA & Triton Inference', type: 'GPU Acceleration', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        { name: 'Milvus / Pinecone Vector DB', type: 'Vector Retrieval', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { name: 'Apache Spark & MLflow', type: 'Distributed MLOps', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        { name: 'vLLM & Ray Scaling', type: 'Inference Clustering', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' }
      ],
      certs: [
        { title: 'AWS Certified Machine Learning - Specialty', org: 'Amazon Web Services', badge: 'High ROI' },
        { title: 'DeepLearning.AI Generative AI Professional', org: 'Stanford / DeepLearning.AI', badge: 'Must Have' },
        { title: 'Google Cloud Professional Machine Learning Engineer', org: 'Google Cloud Platform', badge: 'Top Pay' }
      ],
      checklist: [
        { label: `Mastered linear algebra, transformer attention math & neural backpropagation for ${role.title}` },
        { label: 'Fine-tuned an open-weights LLM (Llama/Mistral) with custom enterprise RAG vector indexing' },
        { label: 'Automated model evaluation metrics (BLEU/ROUGE/Latency) using MLflow tracking' },
        { label: 'Completed 20+ ML system design case studies addressing GPU memory bottlenecks' },
        { label: 'Showcased live deployed AI copilots and research notebooks on GitHub portfolio' }
      ],
      roadmap: [
        { title: `${role.title}: Neural Mathematics & Transformer Foundations`, desc: 'Deep dive into self-attention mechanisms, loss function optimization, backpropagation math, and vector embeddings.' },
        { title: 'Enterprise Generative AI & RAG Capstone Build', desc: 'Construct a production-ready RAG pipeline with LoRA adapter fine-tuning and high-speed vector retrieval.' },
        { title: 'MLOps Latency Optimization & Interview Mastery', desc: 'Optimize GPU model quantization (GGUF/AWQ), tackle real-world ML system design rounds & salary negotiation.' }
      ]
    };
  }

  // 3. Cloud / DevOps / SRE / Platform
  if (text.includes('cloud') || text.includes('devops') || text.includes('kubernetes') || text.includes('sre') || text.includes('infrastructure') || text.includes('platform')) {
    return {
      tools: [
        { name: 'Kubernetes & Docker Mesh', type: 'Container Orchestration', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { name: 'Terraform & Ansible IaC', type: 'Infrastructure as Code', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
        { name: 'AWS / Azure / GCP Hybrid', type: 'Multi-Cloud Architecture', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        { name: 'Prometheus & Grafana', type: 'Live Observability', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        { name: 'Apache Kafka & Grpc', type: 'Event Streaming', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
        { name: 'Go / Python / Bash Scripting', type: 'Automation Core', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
      ],
      certs: [
        { title: 'Certified Kubernetes Administrator (CKA)', org: 'Cloud Native Computing Foundation', badge: 'Must Have' },
        { title: 'AWS Certified Solutions Architect - Professional', org: 'Amazon Web Services', badge: 'High ROI' },
        { title: 'HashiCorp Certified: Terraform Professional', org: 'HashiCorp Infrastructure', badge: 'Top Pay' }
      ],
      checklist: [
        { label: `Mastered Linux kernel internals, networking namespaces & container runtimes for ${role.title}` },
        { label: 'Built multi-region automated Terraform infrastructure grids with zero-downtime rolling updates' },
        { label: 'Configured Prometheus alerts, Grafana telemetry dashboards, and chaos engineering resilience' },
        { label: 'Completed 20+ cloud disaster recovery and high-availability architecture benchmarks' },
        { label: 'Highlighted production uptime records and cloud certifications on resume' }
      ],
      roadmap: [
        { title: `${role.title}: Linux Kernels, Networking & IaC Core`, desc: 'Master eBPF packet tracing, Docker container isolation, TCP/IP subnets, and declarative Terraform syntax.' },
        { title: 'Multi-Region High-Availability Kubernetes Capstone', desc: 'Architect a geo-distributed Kubernetes service mesh with automated auto-scaling and failover recovery.' },
        { title: 'Chaos Engineering Audits & Cloud Architect Signoff', desc: 'Run disaster recovery simulations, evaluate AWS/GCP cloud billing efficiency, and ace technical design rounds.' }
      ]
    };
  }

  // 4. Web / Frontend / Full Stack / Mobile
  if (text.includes('frontend') || text.includes('full stack') || text.includes('react') || text.includes('web') || text.includes('mobile') || text.includes('ui/ux')) {
    return {
      tools: [
        { name: 'React 19 & Next.js 15', type: 'Full Stack Framework', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { name: 'TypeScript & Node.js Core', type: 'Runtime Engine', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { name: 'TailwindCSS & Shadcn UI', type: 'Design Aesthetics', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
        { name: 'PostgreSQL & Prisma ORM', type: 'Relational Data', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        { name: 'Redis Caching Layer', type: 'High-Speed Cache', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
        { name: 'GraphQL & WebSockets', type: 'Real-Time Telemetry', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
      ],
      certs: [
        { title: 'Vercel Certified Modern Web Specialist', org: 'Vercel / Next.js Ecosystem', badge: 'Must Have' },
        { title: 'AWS Certified Developer - Associate', org: 'Amazon Web Services', badge: 'High ROI' },
        { title: 'Meta Front-End & Full-Stack Architecture Fellow', org: 'Meta Engineering Academy', badge: 'Gold Standard' }
      ],
      checklist: [
        { label: `Mastered asynchronous concurrency, React server components & browser DOM rendering for ${role.title}` },
        { label: 'Deployed live production full-stack SaaS app with Stripe billing & OAuth authentication' },
        { label: 'Optimized Lighthouse performance score to 98+ with edge caching and dynamic image optimization' },
        { label: 'Completed 20+ frontend system design and real-time state synchronization interviews' },
        { label: 'Showcased interactive live URL demos and custom domain GitHub repositories' }
      ],
      roadmap: [
        { title: `${role.title}: Modern Architecture & Server Components`, desc: 'Deep dive into hydration, React server components, TypeScript generics, and PostgreSQL query tuning.' },
        { title: 'Full-Stack Edge SaaS Capstone Build', desc: 'Build and deploy a scalable SaaS platform with WebSockets real-time sync, Redis edge caching, and Auth0.' },
        { title: 'System Design Scaling & Technical Interview Rounds', desc: 'Master micro-frontend architectures, state management patterns, live coding rounds & offer negotiation.' }
      ]
    };
  }

  // Default fallback with Role Title injected!
  return {
    tools: base.tools,
    certs: base.certs,
    checklist: base.checklist.map((c: any) => ({
      label: c.label.includes('role') || c.label.includes('cases') ? c.label : `${c.label} tailored for ${role.title}`
    })),
    roadmap: base.roadmap.map((r: any, idx: number) => {
      const titles = [
        `${role.title}: Fundamentals & Theoretical Core`,
        `Advanced Capstone Simulation Build for ${role.title}`,
        `Industry Readiness & Interview Mastery: ${role.title}`
      ];
      return {
        title: titles[idx] || r.title,
        desc: r.desc
      };
    })
  };
}
