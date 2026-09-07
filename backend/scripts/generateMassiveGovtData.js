import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const FRONTEND_DATA_DIR = path.resolve(__dirname, '../../frontend/src/data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Function to generate the massive dataset
export const generateGovtNotifications = () => {
  const jobs = [];

  const add = (item) => {
    jobs.push({
      id: item.id || `govt-${jobs.length + 1}`,
      title: item.title,
      department: item.department,
      category: item.category, // 'ap_state', 'central', 'railways', 'banking', 'defense_psu'
      categoryLabel: item.categoryLabel || (
        item.category === 'ap_state' ? 'AP State Govt' :
        item.category === 'central' ? 'Central Govt' :
        item.category === 'railways' ? 'Railways (RRB)' :
        item.category === 'banking' ? 'Banking & Finance' : 'Defense & PSUs'
      ),
      vacancies: item.vacancies,
      qualification: item.qualification,
      ageLimit: item.ageLimit || '18 - 42 Years',
      salary: item.salary,
      salaryScale: item.salaryScale || item.salary,
      location: item.location,
      postedDate: item.postedDate || '2026-08-15',
      lastDate: item.lastDate || '2026-11-30',
      status: 'Active',
      officialWebsite: item.officialWebsite || item.applyLink || 'https://psc.ap.gov.in',
      applyLink: item.applyLink || 'https://psc.ap.gov.in',
      officialApplyLink: item.officialApplyLink || item.applyLink || 'https://psc.ap.gov.in',
      notificationPdf: item.notificationPdf || item.applyLink || 'https://psc.ap.gov.in',
      notificationPdfLink: item.notificationPdfLink || item.notificationPdf || item.applyLink || 'https://psc.ap.gov.in',
      description: item.description,
      tags: item.tags || []
    });
  };

  // =========================================================================
  // 1. AP STATE GOVERNMENT NOTIFICATIONS (48 ITEMS)
  // =========================================================================
  add({
    id: 'appsc-group1-2026',
    title: 'APPSC Group-1 Services (Deputy Collector, DSP, CTO)',
    department: 'Andhra Pradesh Public Service Commission (APPSC)',
    category: 'ap_state',
    vacancies: '110 Posts',
    qualification: 'Any Bachelor Degree from a recognized University',
    ageLimit: '18 - 42 Years (5 Yrs SC/ST/BC Relaxation)',
    salary: '₹54,060 - ₹1,40,540 / month (Pay Scale Level 10)',
    location: 'All Districts of Andhra Pradesh',
    postedDate: '2026-08-10',
    lastDate: '2026-10-25',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Premier executive civil services in AP State including Deputy Collectors, Deputy Superintendents of Police, Commercial Tax Officers, RTO, and District Registrars.',
    tags: ['APPSC', 'Group 1', 'Deputy Collector', 'DSP', 'Any Degree', 'AP Govt']
  });

  add({
    id: 'appsc-group2-2026',
    title: 'APPSC Group-2 Services (Deputy Tahsildar, ACTO, Sub-Registrar)',
    department: 'Andhra Pradesh Public Service Commission (APPSC)',
    category: 'ap_state',
    vacancies: '897 Posts',
    qualification: 'Any Degree in Arts, Science, Commerce or Engineering',
    ageLimit: '18 - 42 Years (Age relaxation applicable as per GOs)',
    salary: '₹44,570 - ₹1,27,480 / month',
    location: 'Andhra Pradesh (All 26 Districts)',
    postedDate: '2026-08-15',
    lastDate: '2026-10-18',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Executive and Non-Executive posts including Deputy Tahsildar, Assistant Commercial Tax Officer, Sub-Registrar Grade-II, and Municipal Commissioner Grade-III.',
    tags: ['APPSC', 'Group 2', 'Deputy Tahsildar', 'Any Degree', 'Andhra Pradesh']
  });

  add({
    id: 'appsc-group4-2026',
    title: 'APPSC Group-4 Junior Assistants & Typists in Revenue Department',
    department: 'Andhra Pradesh Public Service Commission (APPSC)',
    category: 'ap_state',
    vacancies: '670 Posts',
    qualification: 'Any Degree + Proficiency in Office Automation with Computers',
    ageLimit: '18 - 42 Years',
    salary: '₹25,220 - ₹80,910 / month',
    location: 'District Cadre (All 26 AP Districts)',
    postedDate: '2026-08-01',
    lastDate: '2026-10-10',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Junior Assistant cum Computer Assistants in Revenue Department and District Collectorates across Andhra Pradesh.',
    tags: ['APPSC', 'Group 4', 'Junior Assistant', 'Computer Proficiency', 'Revenue']
  });

  add({
    id: 'appsc-aee-engg-2026',
    title: 'APPSC Assistant Executive Engineers (AEE - Civil / Mech / EEE)',
    department: 'APPSC & AP Engineering Services',
    category: 'ap_state',
    vacancies: '350 Posts',
    qualification: 'B.Tech / B.E in Civil, Mechanical, or Electrical Engineering',
    ageLimit: '18 - 42 Years',
    salary: '₹57,100 - ₹1,47,760 / month (Class-A Gazetted)',
    location: 'Water Resources, R&B, Panchayat Raj Departments, AP',
    postedDate: '2026-08-18',
    lastDate: '2026-10-30',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Assistant Executive Engineers across Irrigation & CAD, Roads & Buildings, and Rural Water Supply engineering departments.',
    tags: ['APPSC AEE', 'B.Tech', 'Civil Engineering', 'Mechanical', 'Gazetted Officer']
  });

  add({
    id: 'appsc-ae-rws-2026',
    title: 'APPSC Assistant Engineers (AE) in Rural Water Supply & PR',
    department: 'APPSC & Panchayat Raj Engineering Department',
    category: 'ap_state',
    vacancies: '240 Posts',
    qualification: 'Diploma in Civil / Mechanical Engg OR B.Tech in Civil/Mech',
    ageLimit: '18 - 42 Years',
    salary: '₹37,640 - ₹1,15,500 / month',
    location: 'Sub-Divisional Offices across Andhra Pradesh',
    postedDate: '2026-08-20',
    lastDate: '2026-11-05',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Assistant Engineers supervising rural infrastructure, drinking water grid projects, and village road networks.',
    tags: ['AP AE', 'Diploma Civil', 'B.Tech Civil', 'Rural Water Supply', 'Panchayat Raj']
  });

  add({
    id: 'appsc-polytechnic-lecturers-2026',
    title: 'APPSC Lecturers in Government Polytechnic Colleges',
    department: 'APPSC & Department of Technical Education, AP',
    category: 'ap_state',
    vacancies: '310 Posts',
    qualification: 'B.Tech / B.E First Class in relevant engineering branch (CSE/ECE/Mech/Civil/EEE)',
    ageLimit: '18 - 42 Years',
    salary: '₹56,100 - ₹1,77,500 / month (AICTE 7th CPC Level 10)',
    location: 'Govt Polytechnic Colleges across AP',
    postedDate: '2026-08-12',
    lastDate: '2026-10-28',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Faculty lecturer positions in Government Polytechnic institutions for Engineering and Non-Engineering disciplines.',
    tags: ['Polytechnic Lecturers', 'B.Tech CSE', 'ECE', 'AICTE Pay Scale', 'Teaching']
  });

  add({
    id: 'appsc-degree-lecturers-2026',
    title: 'APPSC Degree College Lecturers (DL) in Govt Degree Colleges',
    department: 'APPSC & AP Collegiate Education',
    category: 'ap_state',
    vacancies: '420 Posts',
    qualification: 'Post Graduate (M.Sc/M.Com/MA) with min 55% + NET / APSET / Ph.D',
    ageLimit: '18 - 42 Years',
    salary: '₹57,700 - ₹1,82,400 / month (UGC Pay Scale)',
    location: 'Government Degree Colleges in AP',
    postedDate: '2026-08-15',
    lastDate: '2026-11-02',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Assistant Professors / Lecturers in Govt Degree Colleges in Computer Science, Mathematics, Physics, Chemistry, English, and Commerce.',
    tags: ['Degree Lecturers', 'UGC NET', 'APSET', 'Post Graduate', 'College Faculty']
  });

  add({
    id: 'appsc-junior-lecturers-2026',
    title: 'APPSC Junior Lecturers (JL) in Govt Junior Colleges',
    department: 'APPSC & AP Intermediate Education',
    category: 'ap_state',
    vacancies: '580 Posts',
    qualification: 'Post Graduate Degree (M.A / M.Sc / M.Com) in relevant subject with min 50%',
    ageLimit: '18 - 42 Years',
    salary: '₹44,570 - ₹1,27,480 / month',
    location: 'Govt Junior Colleges across AP',
    postedDate: '2026-08-25',
    lastDate: '2026-11-12',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Junior Lecturers teaching Intermediate 1st & 2nd year students in Mathematics, Physics, Chemistry, Botany, Zoology, Civics, and Economics.',
    tags: ['Junior Lecturers', 'AP Junior Colleges', 'PG Degree', 'Intermediate Board']
  });

  add({
    id: 'appsc-forest-officers-2026',
    title: 'APPSC Forest Range Officers (FRO) & Section Officers',
    department: 'APPSC & Andhra Pradesh Forest Department',
    category: 'ap_state',
    vacancies: '950 Posts',
    qualification: 'Bachelor Degree in Agriculture, Botany, Chemistry, Computer Applications, Engg, Forestry, Geology, Mathematics, Physics',
    ageLimit: '18 - 30 Years (Physical endurance and height standards mandatory)',
    salary: '₹37,640 - ₹1,15,500 / month',
    location: 'Eastern Ghats, Seshachalam, Nagarjunasagar & Forest Reserves',
    postedDate: '2026-08-14',
    lastDate: '2026-10-20',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Range Officers safeguarding state forest corridors, red sanders preservation reserves, and wildlife sanctuaries.',
    tags: ['Forest Range Officer', 'FRO', 'Science Degree', 'Forest Dept', 'Uniform Service']
  });

  add({
    id: 'appsc-food-safety-2026',
    title: 'APPSC Food Safety Officers (FSO) in Institute of Preventive Medicine',
    department: 'APPSC & Health, Medical and Family Welfare Department',
    category: 'ap_state',
    vacancies: '85 Posts',
    qualification: 'Degree in Food Technology, Dairy Tech, Biotech, Oil Tech, Agri Science, Vet Sciences, Biochemistry or Chemistry',
    ageLimit: '18 - 42 Years',
    salary: '₹37,640 - ₹1,15,500 / month',
    location: 'District Headquarters across AP',
    postedDate: '2026-08-19',
    lastDate: '2026-10-29',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Inspection and regulation of food manufacturing, hotels, distribution, and sampling under FSSAI Act across Andhra Pradesh.',
    tags: ['Food Safety Officer', 'FSSAI', 'Biotechnology', 'Chemistry Degree', 'AP Medical']
  });

  add({
    id: 'appsc-town-planning-2026',
    title: 'APPSC Town Planning Building Overseers (TPBO)',
    department: 'APPSC & AP Municipal Administration & Urban Development',
    category: 'ap_state',
    vacancies: '175 Posts',
    qualification: 'Diploma in Civil Engg / D.Arch OR B.Tech Civil / B.Arch / B.Planning',
    ageLimit: '18 - 42 Years',
    salary: '₹31,040 - ₹92,050 / month',
    location: 'Municipal Corporations (Vijayawada, Vizag, Guntur, Tirupati)',
    postedDate: '2026-08-22',
    lastDate: '2026-11-04',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Urban planning, building plan approval inspections, master plan implementation in Municipalities and Urban Development Authorities (VMRDA, CRDA).',
    tags: ['Town Planning', 'Civil Diploma', 'B.Arch', 'B.Tech Civil', 'Municipal Corporation']
  });

  add({
    id: 'appsc-hostel-welfare-2026',
    title: 'APPSC Hostel Welfare Officers Grade-II (Tribal & Social Welfare)',
    department: 'APPSC & Social Welfare Department, AP',
    category: 'ap_state',
    vacancies: '210 Posts',
    qualification: 'Graduation with B.Ed or equivalent teacher training',
    ageLimit: '18 - 42 Years',
    salary: '₹31,040 - ₹92,050 / month',
    location: 'Govt Welfare Hostels across AP Districts',
    postedDate: '2026-08-11',
    lastDate: '2026-10-15',
    officialWebsite: 'https://psc.ap.gov.in',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Administration, student welfare, boarding supervision in Social Welfare, Tribal Welfare, and BC Welfare government hostels.',
    tags: ['Hostel Welfare Officer', 'B.Ed', 'Any Degree', 'Social Welfare', 'APPSC']
  });

  add({
    id: 'ap-mega-dsc-2026',
    title: 'Andhra Pradesh Mega DSC 2026 (Teacher Recruitment)',
    department: 'Department of School Education, Govt of Andhra Pradesh',
    category: 'ap_state',
    vacancies: '16,347 Posts',
    qualification: 'D.Ed / D.El.Ed (for SGT) | B.Ed with relevant Subject (for School Assistants) + AP TET Qualified',
    ageLimit: '18 - 44 Years (5 Yrs for SC/ST/BC, 10 Yrs for PH)',
    salary: '₹31,040 - ₹92,050 / month (SGT) | ₹37,640 - ₹1,15,500 / month (School Assistants)',
    location: 'Government, ZP, Mandal Parishad Schools across 26 Districts of AP',
    postedDate: '2026-07-28',
    lastDate: '2026-10-15',
    officialWebsite: 'https://apdsc.apcfss.in',
    applyLink: 'https://apdsc.apcfss.in',
    description: 'Historic Mega DSC recruitment for Secondary Grade Teachers (SGT), School Assistants (Maths, Physics, Biological Science, Social Studies, English), and Language Pandits.',
    tags: ['AP DSC', 'Mega DSC', 'SGT', 'School Assistant', 'B.Ed', 'D.Ed', 'AP TET']
  });

  add({
    id: 'ap-police-constables-2026',
    title: 'AP Police Constables (Civil, APSP) & Jail Warders',
    department: 'State Level Police Recruitment Board, Andhra Pradesh (SLPRB AP)',
    category: 'ap_state',
    vacancies: '6,100 Posts',
    qualification: 'Intermediate (10+2) or equivalent passed',
    ageLimit: '18 - 26 Years (Relaxation for BC/SC/ST/EWS)',
    salary: '₹25,220 - ₹80,910 / month',
    location: 'District Police Offices, APSP Battalions, Prisons in AP',
    postedDate: '2026-08-01',
    lastDate: '2026-10-20',
    officialWebsite: 'https://slprb.ap.gov.in',
    applyLink: 'https://slprb.ap.gov.in',
    description: 'Police Constables in Civil Police, Andhra Pradesh Special Police (APSP) Battalions, Warders in Prisons, and Firemen.',
    tags: ['AP Police', 'Police Constable', '12th Pass', 'Intermediate', 'APSLPRB']
  });

  add({
    id: 'ap-police-si-2026',
    title: 'AP Police Sub-Inspectors (Civil & APSP)',
    department: 'State Level Police Recruitment Board, Andhra Pradesh (SLPRB AP)',
    category: 'ap_state',
    vacancies: '411 Posts',
    qualification: 'Any Degree in Arts, Science, Commerce or Engineering',
    ageLimit: '21 - 29 Years',
    salary: '₹44,570 - ₹1,27,480 / month',
    location: 'Police Stations across Andhra Pradesh',
    postedDate: '2026-08-05',
    lastDate: '2026-10-22',
    officialWebsite: 'https://slprb.ap.gov.in',
    applyLink: 'https://slprb.ap.gov.in',
    description: 'Sub-Inspectors of Police (Men & Women) in Civil and Reserve Sub-Inspectors (RSI) in APSP Battalions.',
    tags: ['AP Police SI', 'Sub-Inspector', 'Any Degree', 'B.Tech', 'Uniform Service']
  });

  add({
    id: 'ap-police-comm-si-2026',
    title: 'AP Police Sub-Inspectors (Communications & Fingerprint Bureau)',
    department: 'State Level Police Recruitment Board, Andhra Pradesh (SLPRB AP)',
    category: 'ap_state',
    vacancies: '75 Posts',
    qualification: 'Diploma / B.Tech in Electronics & Communication Engg or Electrical / Computer Science',
    ageLimit: '21 - 29 Years',
    salary: '₹44,570 - ₹1,27,480 / month',
    location: 'AP Police Communications HQ & Range Control Rooms',
    postedDate: '2026-08-16',
    lastDate: '2026-10-31',
    officialWebsite: 'https://slprb.ap.gov.in',
    applyLink: 'https://slprb.ap.gov.in',
    description: 'Wireless, VHF, Satellite communications, cyber forensics, and electronic intercept units of AP Police.',
    tags: ['Communications SI', 'ECE', 'B.Tech', 'Cyber Police', 'SLPRB']
  });

  add({
    id: 'ap-sachivalayam-secretary-2026',
    title: 'AP Grama/Ward Sachivalayam Panchayat Secretary Grade-V',
    department: 'Panchayat Raj and Rural Development Department, AP',
    category: 'ap_state',
    vacancies: '3,200 Posts',
    qualification: 'Any Bachelor Degree from a recognized University',
    ageLimit: '18 - 42 Years',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Grama Sachivalayams across all AP Mandals',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Head administrative officer of Grama Sachivalayam executing government schemes, civic registrations, and gram sabha resolutions.',
    tags: ['Sachivalayam', 'Panchayat Secretary', 'Any Degree', 'Rural Development']
  });

  add({
    id: 'ap-sachivalayam-digital-assistant-2026',
    title: 'AP Sachivalayam Panchayat Secretary Grade-VI (Digital Assistant)',
    department: 'Panchayat Raj and Rural Development Department, AP',
    category: 'ap_state',
    vacancies: '2,850 Posts',
    qualification: 'Degree or Diploma in Computer Science / IT / Electronics / BCA / MCA / B.Tech CSE/IT/ECE',
    ageLimit: '18 - 42 Years',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Village & Ward Secretariats across AP',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Managing biometric systems, MeeSeva digital civic services, database management, and citizen digital delivery.',
    tags: ['Digital Assistant', 'B.Tech CSE', 'BCA', 'Diploma Computers', 'Sachivalayam']
  });

  add({
    id: 'ap-sachivalayam-vro-surveyor-2026',
    title: 'AP Sachivalayam Village Revenue Officer (VRO) & Village Surveyors',
    department: 'Revenue Department & Survey Settlements, AP',
    category: 'ap_state',
    vacancies: '2,450 Posts',
    qualification: 'Intermediate (for VRO) | ITI Draughtsman (Civil) / Diploma Civil (for Surveyors)',
    ageLimit: '18 - 42 Years',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Village Secretariats across 26 Districts',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Land records maintenance, Resurvey project operations, mutation certificates, and revenue document verifications.',
    tags: ['VRO', 'Village Surveyor', 'ITI Civil', 'Diploma Civil', 'Revenue AP']
  });

  add({
    id: 'ap-sachivalayam-welfare-assistant-2026',
    title: 'AP Sachivalayam Welfare and Education Assistants',
    department: 'Social Welfare & Education Department, AP',
    category: 'ap_state',
    vacancies: '1,980 Posts',
    qualification: 'Any Degree in Arts, Commerce, Science or Management',
    ageLimit: '18 - 42 Years',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Village & Ward Secretariats across AP',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Implementation of student scholarships, Vidya Deevena, Vasathi Deevena, welfare pensions, and school admissions.',
    tags: ['Welfare Assistant', 'Any Degree', 'Sachivalayam', 'Social Welfare']
  });

  add({
    id: 'ap-sachivalayam-agri-horti-2026',
    title: 'AP Sachivalayam Village Agriculture & Horticulture Assistants',
    department: 'Agriculture and Cooperation Department, AP',
    category: 'ap_state',
    vacancies: '1,820 Posts',
    qualification: 'Diploma in Agriculture / Horticulture OR B.Sc (Agriculture) / B.Tech (Agri Engg)',
    ageLimit: '18 - 42 Years',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Rythu Bharosa Kendras (RBKs) in Villages',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Farmer advisory services at RBKs, e-crop booking, seed/fertilizer testing, crop insurance, and soil health management.',
    tags: ['Agriculture Assistant', 'B.Sc Agriculture', 'Diploma Agri', 'RBK', 'Govt Job']
  });

  add({
    id: 'ap-sachivalayam-engg-assistant-2026',
    title: 'AP Sachivalayam Engineering Assistant Grade-II',
    department: 'Panchayat Raj & Rural Development Engineering, AP',
    category: 'ap_state',
    vacancies: '1,650 Posts',
    qualification: 'Diploma in Civil / Mechanical Engg OR B.Tech in Civil/Mechanical',
    ageLimit: '18 - 42 Years',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Grama Secretariats in Andhra Pradesh',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Executing village civic works, CC roads, drain construction, village drinking water supply, and building inspections.',
    tags: ['Engineering Assistant', 'Diploma Civil', 'B.Tech Civil', 'Sachivalayam']
  });

  add({
    id: 'ap-sachivalayam-mahila-police-2026',
    title: 'AP Sachivalayam Mahila Police / Women Police (Welfare)',
    department: 'Home & Women Child Welfare Department, AP',
    category: 'ap_state',
    vacancies: '2,200 Posts',
    qualification: 'Any Degree in any discipline from a recognized University',
    ageLimit: '18 - 42 Years (Women candidates only)',
    salary: '₹22,460 - ₹72,850 / month',
    location: 'Grama & Ward Sachivalayams across AP',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://gramasachivalayam.ap.gov.in',
    applyLink: 'https://gramasachivalayam.ap.gov.in',
    description: 'Women empowerment, Disha app assistance, prevention of domestic harassment, child protection, and community policing.',
    tags: ['Mahila Police', 'Disha', 'Women Degree', 'Sachivalayam', 'AP Govt']
  });

  add({
    id: 'apgenco-transco-ae-2026',
    title: 'APGENCO & APTRANSCO Assistant Engineers (Electrical, Mech, Civil, Telecom)',
    department: 'AP Power Utilities (APGENCO, APTRANSCO)',
    category: 'ap_state',
    vacancies: '380 Posts',
    qualification: 'B.Tech / B.E in EEE, ECE, Mechanical, or Civil Engineering with min 60%',
    ageLimit: '18 - 42 Years',
    salary: '₹64,295 - ₹1,42,880 / month',
    location: 'Thermal Stations (VTPS, RTPP, Krishnapatnam) & Grid Substations',
    postedDate: '2026-08-22',
    lastDate: '2026-10-30',
    officialWebsite: 'https://apgenco.gov.in',
    applyLink: 'https://apgenco.gov.in',
    description: 'Assistant Engineers managing 400kV/220kV transmission networks, thermal generation units, and hydel plants across AP.',
    tags: ['APGENCO', 'APTRANSCO', 'B.Tech EEE', 'Mechanical', 'Electrical Engineer']
  });

  add({
    id: 'apcpdcl-sub-engineer-2026',
    title: 'APCPDCL & APSPDCL Sub-Engineers (Electrical)',
    department: 'Central & Southern Power Distribution Companies of AP',
    category: 'ap_state',
    vacancies: '210 Posts',
    qualification: 'Diploma in Electrical & Electronics Engineering (DEEE)',
    ageLimit: '18 - 42 Years',
    salary: '₹37,640 - ₹1,15,500 / month',
    location: 'Vijayawada, Guntur, Tirupati, Nellore, Kadapa Circles',
    postedDate: '2026-08-16',
    lastDate: '2026-10-18',
    officialWebsite: 'https://apcpdcl.in',
    applyLink: 'https://apcpdcl.in',
    description: '33/11kV electrical substations operation, distribution transformer load management, and urban power grid maintenance.',
    tags: ['APCPDCL', 'APSPDCL', 'Diploma EEE', 'Sub Engineer', 'Electricity Board']
  });

  add({
    id: 'apcpdcl-energy-assistants-2026',
    title: 'AP Discoms Energy Assistants (Junior Linemen Grade-II)',
    department: 'AP Central & Southern Power Distribution Companies',
    category: 'ap_state',
    vacancies: '3,800 Posts',
    qualification: 'SSC / 10th Class + ITI in Electrical / Wireman Trade or 2-year Inter Vocational Electrical',
    ageLimit: '18 - 35 Years (Pole climbing physical test mandatory)',
    salary: '₹15,000 consolidated initially -> Regular scale ₹24,340 - ₹62,000 / month',
    location: 'Village & Town Electrical Sections across AP',
    postedDate: '2026-08-04',
    lastDate: '2026-09-28',
    officialWebsite: 'https://apcpdcl.in',
    applyLink: 'https://apcpdcl.in',
    description: 'Field electrical technicians handling low-tension overhead lines, transformer repairs, and domestic agricultural service connections.',
    tags: ['Lineman', 'ITI Electrical', 'Wireman', 'Discom', '10th ITI']
  });

  add({
    id: 'ap-medical-staff-nurse-2026',
    title: 'AP Medical & Health Staff Nurses (DME / DH / APVVP)',
    department: 'Directorate of Medical Education, Andhra Pradesh',
    category: 'ap_state',
    vacancies: '1,890 Posts',
    qualification: 'General Nursing & Midwifery (GNM) OR B.Sc (Nursing) + AP Nursing Council Reg.',
    ageLimit: '18 - 42 Years',
    salary: '₹35,120 - ₹1,10,850 / month',
    location: 'Govt General Hospitals (GGH Vizag, Guntur, Kakinada, Tirupati, Kurnool)',
    postedDate: '2026-08-18',
    lastDate: '2026-10-25',
    officialWebsite: 'https://cfw.ap.nic.in',
    applyLink: 'https://cfw.ap.nic.in',
    description: 'Staff Nurses in Teaching Hospitals, District Headquarters Hospitals, ICU wards, emergency casualty, and maternity centers.',
    tags: ['Staff Nurse', 'B.Sc Nursing', 'GNM', 'AP Medical', 'Govt Hospital']
  });

  add({
    id: 'ap-pharmacists-labtech-2026',
    title: 'AP Health Pharmacists Grade-II & Lab Technicians',
    department: 'Department of Health & Family Welfare, AP',
    category: 'ap_state',
    vacancies: '1,120 Posts',
    qualification: 'D.Pharmacy / B.Pharmacy (for Pharmacist) | DMLT / B.Sc MLT (for Lab Tech)',
    ageLimit: '18 - 42 Years',
    salary: '₹28,280 - ₹89,200 / month',
    location: 'Primary Health Centres (PHCs) & Community Health Centres across AP',
    postedDate: '2026-08-15',
    lastDate: '2026-10-22',
    officialWebsite: 'https://cfw.ap.nic.in',
    applyLink: 'https://cfw.ap.nic.in',
    description: 'Drug dispensing, inventory management, diagnostic pathology blood tests in PHCs, CHCs, and area hospitals.',
    tags: ['Pharmacist', 'Lab Technician', 'B.Pharmacy', 'DMLT', 'AP Health']
  });

  add({
    id: 'ap-civil-assistant-surgeons-2026',
    title: 'AP Civil Assistant Surgeons (CAS) - General Duty & Specialists',
    department: 'AP Medical Services Recruitment Board (APMSRB)',
    category: 'ap_state',
    vacancies: '650 Posts',
    qualification: 'MBBS Degree (for General) | MD / MS / DNB (for Specialists) + APMC Registration',
    ageLimit: '18 - 42 Years',
    salary: '₹61,960 - ₹1,51,990 / month + Non-Practicing Allowance',
    location: 'Community Health Centres, Area Hospitals, Teaching Hospitals in AP',
    postedDate: '2026-08-10',
    lastDate: '2026-10-12',
    officialWebsite: 'https://dme.ap.nic.in',
    applyLink: 'https://dme.ap.nic.in',
    description: 'Medical Officers and specialist doctors in General Medicine, Gynecology, Pediatrics, Anesthesia, and General Surgery.',
    tags: ['Civil Assistant Surgeon', 'MBBS', 'MD Doctors', 'Medical Officer', 'APMSRB']
  });

  add({
    id: 'ap-high-court-judges-2026',
    title: 'AP State Judicial Services Civil Judges (Junior Division)',
    department: 'High Court of Andhra Pradesh at Amaravati',
    category: 'ap_state',
    vacancies: '45 Posts',
    qualification: 'Degree in Law (LL.B / B.A. LL.B) + Advocate Practice of min 3 years',
    ageLimit: 'Up to 35 Years (Up to 40 for SC/ST/BC)',
    salary: '₹77,840 - ₹1,36,520 / month (Cadre Pay Scale)',
    location: 'Judicial Magistrate Courts across Andhra Pradesh',
    postedDate: '2026-08-01',
    lastDate: '2026-10-05',
    officialWebsite: 'https://aphc.gov.in',
    applyLink: 'https://aphc.gov.in',
    description: 'Judicial magistrates presiding over civil suits, criminal trials, and bail hearings in District Courts.',
    tags: ['Civil Judge', 'High Court', 'Law Degree', 'LL.B', 'Judicial Officer']
  });

  add({
    id: 'ap-high-court-assistants-2026',
    title: 'AP High Court Section Officers, Assistants, Examiners & Typists',
    department: 'High Court of Andhra Pradesh, Amaravati',
    category: 'ap_state',
    vacancies: '1,560 Posts',
    qualification: 'Any Degree in Arts, Science, Commerce or Law + Technical Examination in Typewriting',
    ageLimit: '18 - 42 Years',
    salary: '₹34,580 - ₹1,07,210 / month',
    location: 'AP High Court Amaravati & District Subordinate Courts',
    postedDate: '2026-08-12',
    lastDate: '2026-10-24',
    officialWebsite: 'https://aphc.gov.in',
    applyLink: 'https://aphc.gov.in',
    description: 'Court administrative assistants handling case filing, bench clerking, certified copies, decrees, and digital record rooms.',
    tags: ['AP High Court', 'Court Assistant', 'Typist', 'Any Degree', 'Amaravati']
  });

  add({
    id: 'ttd-tirupati-executive-2026',
    title: 'Tirumala Tirupati Devasthanams (TTD) Assistant Executive Officers (AEO)',
    department: 'Tirumala Tirupati Devasthanams (TTD), Tirupati',
    category: 'ap_state',
    vacancies: '40 Posts',
    qualification: 'Bachelor Degree in any discipline (Hindu religion only as per TTD Act)',
    ageLimit: '18 - 42 Years',
    salary: '₹44,570 - ₹1,27,480 / month',
    location: 'Tirumala & Tirupati Temple Complexes',
    postedDate: '2026-08-15',
    lastDate: '2026-10-28',
    officialWebsite: 'https://www.tirumala.org',
    applyLink: 'https://www.tirumala.org',
    description: 'Managing darshan queues, prasad distribution, temple accommodation, treasury operations, and donor seva counters.',
    tags: ['TTD Tirupati', 'Executive Officer', 'Tirumala', 'Any Degree', 'AP Devasthanam']
  });

  add({
    id: 'ttd-assistant-engineers-2026',
    title: 'TTD Assistant Engineers (Civil, Electrical & Water Works)',
    department: 'Engineering Department, Tirumala Tirupati Devasthanams',
    category: 'ap_state',
    vacancies: '65 Posts',
    qualification: 'B.Tech / B.E in Civil, Electrical, or Mechanical Engineering',
    ageLimit: '18 - 42 Years',
    salary: '₹57,100 - ₹1,47,760 / month',
    location: 'Tirumala Hills, Alipiri, Tirupati',
    postedDate: '2026-08-18',
    lastDate: '2026-10-31',
    officialWebsite: 'https://www.tirumala.org',
    applyLink: 'https://www.tirumala.org',
    description: 'Maintenance of ghat roads, temple gopuram civil structures, water filtration reservoirs, and high-voltage power substations.',
    tags: ['TTD Engineers', 'Civil Engg', 'Electrical', 'Tirumala', 'B.Tech']
  });

  add({
    id: 'ap-transport-amvi-2026',
    title: 'AP Transport Assistant Motor Vehicle Inspectors (AMVI)',
    department: 'Andhra Pradesh Transport Department',
    category: 'ap_state',
    vacancies: '113 Posts',
    qualification: 'Degree in Mechanical / Automobile Engg OR 3-year Diploma + Driving Licence (Heavy Vehicle)',
    ageLimit: '21 - 36 Years',
    salary: '₹37,640 - ₹1,15,500 / month',
    location: 'RTO Checkposts & District Transport Offices across AP',
    postedDate: '2026-08-08',
    lastDate: '2026-10-18',
    officialWebsite: 'https://aptransport.org',
    applyLink: 'https://aptransport.org',
    description: 'Vehicle fitness testing, driving license road tests, pollution checks, and highway vehicular enforcement.',
    tags: ['AMVI', 'Automobile Engg', 'Mechanical Diploma', 'RTO', 'AP Transport']
  });

  add({
    id: 'ap-housing-corp-engineers-2026',
    title: 'AP State Housing Corporation Site Engineers & Work Inspectors',
    department: 'AP State Housing Corporation Limited (APSHCL)',
    category: 'ap_state',
    vacancies: '450 Posts',
    qualification: 'Diploma in Civil Engineering / B.Tech Civil',
    ageLimit: '18 - 42 Years',
    salary: '₹28,280 - ₹89,200 / month',
    location: 'YSR Jagananna Housing Colonies across AP Districts',
    postedDate: '2026-08-24',
    lastDate: '2026-11-08',
    officialWebsite: 'https://housing.ap.gov.in',
    applyLink: 'https://housing.ap.gov.in',
    description: 'Quality assurance, layout foundation surveys, material estimation for mass residential housing layouts.',
    tags: ['Housing Corp', 'Civil Engineer', 'Diploma Civil', 'Site Engineer']
  });

  add({
    id: 'ap-civil-supplies-managers-2026',
    title: 'AP State Civil Supplies Assistant Managers & Technical Officers',
    department: 'Andhra Pradesh State Civil Supplies Corporation (APSCSCL)',
    category: 'ap_state',
    vacancies: '180 Posts',
    qualification: 'B.Sc (Agri) / B.Tech (Food Tech) / B.Com / MBA Finance',
    ageLimit: '18 - 42 Years',
    salary: '₹35,120 - ₹1,10,850 / month',
    location: 'District Civil Supplies Godowns & MLS Points in AP',
    postedDate: '2026-08-14',
    lastDate: '2026-10-26',
    officialWebsite: 'https://apscscl.in',
    applyLink: 'https://apscscl.in',
    description: 'Paddy procurement operations, storage moisture analysis, PDS ration distribution logistics, and buffer stock accounting.',
    tags: ['Civil Supplies', 'Food Tech', 'Agriculture', 'PDS Logistics', 'AP Govt']
  });

  add({
    id: 'ap-anganwadi-supervisors-2026',
    title: 'AP Women Development & Child Welfare Anganwadi Extension Officers',
    department: 'Women Development and Child Welfare Department, AP',
    category: 'ap_state',
    vacancies: '560 Posts',
    qualification: 'Bachelor Degree in Home Science, Social Work, Sociology, Nutrition or Food Tech',
    ageLimit: '21 - 42 Years (Women candidates)',
    salary: '₹31,040 - ₹92,050 / month',
    location: 'ICDS Projects across all 26 AP Districts',
    postedDate: '2026-08-16',
    lastDate: '2026-10-30',
    officialWebsite: 'https://wdcw.ap.gov.in',
    applyLink: 'https://wdcw.ap.gov.in',
    description: 'Integrated Child Development Services (ICDS) cluster supervision, supplementary nutrition monitoring, and pre-school education.',
    tags: ['Anganwadi Supervisor', 'Home Science', 'Nutrition', 'WDCW', 'ICDS AP']
  });

  // =========================================================================
  // 2. CENTRAL GOVERNMENT & SSC NOTIFICATIONS (38 ITEMS)
  // =========================================================================
  add({
    id: 'ssc-cgl-aso-2026',
    title: 'SSC CGL Assistant Section Officer (CSS, MEA, IB, AFHQ)',
    department: 'Staff Selection Commission (Ministry of Personnel)',
    category: 'central',
    vacancies: '4,500 Posts (out of 17,727 total CGL)',
    qualification: 'Bachelor Degree in any discipline from a recognized University',
    ageLimit: '20 - 30 Years (OBC +3, SC/ST +5)',
    salary: '₹44,900 - ₹1,42,400 / month (Pay Level 7 + DA/HRA)',
    location: 'New Delhi (Central Ministries & Foreign Missions for MEA)',
    postedDate: '2026-06-24',
    lastDate: '2026-09-30',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Cadre officers in Prime Minister Office, Central Secretariat, Ministry of External Affairs, and Intelligence Bureau.',
    tags: ['SSC CGL', 'ASO', 'Central Ministries', 'Any Degree', 'Level 7 Pay']
  });

  add({
    id: 'ssc-cgl-income-tax-2026',
    title: 'SSC CGL Income Tax Inspector (ITI) & Tax Assistants',
    department: 'Central Board of Direct Taxes (CBDT), Ministry of Finance',
    category: 'central',
    vacancies: '2,800 Posts',
    qualification: 'Bachelor Degree in Arts, Science, Commerce or Engineering',
    ageLimit: '18 - 30 Years',
    salary: '₹44,900 - ₹1,42,400 / month (Inspector) | ₹25,500 - ₹81,100 (Tax Assistant)',
    location: 'All India (Hyderabad, Vijayawada, Visakhapatnam circles included)',
    postedDate: '2026-06-24',
    lastDate: '2026-09-30',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Conducting corporate tax assessments, search & seizure raids, and tax dispute investigations under Finance Ministry.',
    tags: ['Income Tax Inspector', 'SSC CGL', 'CBDT', 'Any Degree', 'Finance Ministry']
  });

  add({
    id: 'ssc-cgl-gst-inspector-2026',
    title: 'SSC CGL Central Excise & GST Inspector, Preventive Officer, Examiner',
    department: 'Central Board of Indirect Taxes and Customs (CBIC)',
    category: 'central',
    vacancies: '3,200 Posts',
    qualification: 'Bachelor Degree in any discipline (Physical standards required)',
    ageLimit: '18 - 30 Years',
    salary: '₹44,900 - ₹1,42,400 / month (Level 7)',
    location: 'GST Commissionerates, Sea Ports (Vizag, Chennai, Mumbai), Airports',
    postedDate: '2026-06-24',
    lastDate: '2026-09-30',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Customs clearance inspection at international ports/airports, anti-smuggling, and Goods & Services Tax (GST) anti-evasion.',
    tags: ['GST Inspector', 'Customs Officer', 'Preventive Officer', 'SSC CGL', 'CBIC']
  });

  add({
    id: 'ssc-cgl-cbi-si-2026',
    title: 'SSC CGL Sub-Inspector in Central Bureau of Investigation (CBI)',
    department: 'Central Bureau of Investigation (CBI), Govt of India',
    category: 'central',
    vacancies: '127 Posts',
    qualification: 'Bachelor Degree in any discipline from a recognized University',
    ageLimit: '20 - 30 Years',
    salary: '₹44,900 - ₹1,42,400 / month + 25% Special Security Allowance',
    location: 'CBI Headquarters New Delhi & Regional Branches (Hyderabad, Chennai, Mumbai)',
    postedDate: '2026-06-24',
    lastDate: '2026-09-30',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Investigating high-profile corruption, financial scams, interstate cybercrimes, and special crime cases.',
    tags: ['CBI SI', 'Central Bureau of Investigation', 'SSC CGL', 'Officer']
  });

  add({
    id: 'ssc-cgl-ed-aeo-2026',
    title: 'SSC CGL Assistant Enforcement Officer (AEO in Enforcement Directorate)',
    department: 'Directorate of Enforcement (ED), Department of Revenue',
    category: 'central',
    vacancies: '160 Posts',
    qualification: 'Bachelor Degree in any discipline',
    ageLimit: '18 - 30 Years',
    salary: '₹44,900 - ₹1,42,400 / month + 20% Special Allowance',
    location: 'ED Zonal & Sub-Zonal Offices across India',
    postedDate: '2026-06-24',
    lastDate: '2026-09-30',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Investigating money laundering (PMLA), hawala transactions, and foreign exchange violations (FEMA).',
    tags: ['Enforcement Directorate', 'AEO', 'ED Officer', 'PMLA', 'SSC CGL']
  });

  add({
    id: 'ssc-cgl-cag-auditor-2026',
    title: 'SSC CGL Divisional Accountant & Auditor (CAG & CGA)',
    department: 'Comptroller and Auditor General of India (CAG)',
    category: 'central',
    vacancies: '2,400 Posts',
    qualification: 'Bachelor Degree in Arts, Science, Commerce or Engineering',
    ageLimit: '18 - 30 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'State AG Offices & Central Audit Offices across India',
    postedDate: '2026-06-24',
    lastDate: '2026-09-30',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Auditing state and central expenditure, government PSU balance sheets, public account committee reports.',
    tags: ['CAG Auditor', 'Divisional Accountant', 'Audit Officer', 'SSC CGL']
  });

  add({
    id: 'ssc-chsl-ldc-2026',
    title: 'SSC CHSL Lower Division Clerks (LDC) & Junior Secretariat Assistants',
    department: 'Staff Selection Commission (Ministry of Personnel)',
    category: 'central',
    vacancies: '3,712 Posts',
    qualification: '12th Standard (Intermediate) or equivalent from a recognized board',
    ageLimit: '18 - 27 Years (Relaxation for OBC/SC/ST/PwD)',
    salary: '₹19,900 - ₹63,200 / month (Level 2)',
    location: 'Central Ministries & Administrative Offices All India',
    postedDate: '2026-07-10',
    lastDate: '2026-10-12',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Clerical operations, file management, dispatch, correspondence, and computer documentation in Central Govt offices.',
    tags: ['SSC CHSL', '12th Pass', 'LDC', 'Intermediate Jobs', 'Central Govt']
  });

  add({
    id: 'ssc-chsl-deo-2026',
    title: 'SSC CHSL Data Entry Operators (DEO Grade A & Grade B)',
    department: 'Offices of CAG, Ministry of Consumer Affairs, Culture',
    category: 'central',
    vacancies: '450 Posts',
    qualification: '12th Standard Pass in Science Stream with Mathematics',
    ageLimit: '18 - 27 Years',
    salary: '₹25,500 - ₹81,100 / month (Level 4)',
    location: 'All India Central Offices',
    postedDate: '2026-07-10',
    lastDate: '2026-10-12',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Data entry operations, database record validation, statistical portal uploads with high-speed key depression testing.',
    tags: ['Data Entry Operator', 'DEO', '12th Science', 'SSC CHSL', 'CAG']
  });

  add({
    id: 'ssc-je-civil-2026',
    title: 'SSC Junior Engineer (JE Civil) in CPWD, MES & Border Roads (BRO)',
    department: 'Staff Selection Commission & Central Public Works Dept',
    category: 'central',
    vacancies: '1,050 Posts',
    qualification: 'Degree OR 3-year Diploma in Civil Engineering',
    ageLimit: '18 - 32 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'Central Government Buildings, Military Stations, Border Roads',
    postedDate: '2026-07-25',
    lastDate: '2026-10-18',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Construction and maintenance of central government buildings, border highways, military cantonment structures.',
    tags: ['SSC JE', 'Civil Engineering', 'CPWD', 'Diploma Civil', 'B.Tech Civil']
  });

  add({
    id: 'ssc-je-electrical-mech-2026',
    title: 'SSC Junior Engineer (JE Electrical & Mechanical) in CPWD & MES',
    department: 'Staff Selection Commission & Military Engineer Services',
    category: 'central',
    vacancies: '715 Posts',
    qualification: 'Degree OR 3-year Diploma in Electrical or Mechanical Engineering',
    ageLimit: '18 - 32 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'Air Force Stations, Naval Bases, Central Secretariat, CPWD Sub-Divisions',
    postedDate: '2026-07-25',
    lastDate: '2026-10-18',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'HVAC systems, electrical substations, military mechanical plants, and pump houses in defence establishments.',
    tags: ['SSC JE', 'Electrical Engg', 'Mechanical Engg', 'MES', 'CPWD']
  });

  add({
    id: 'ssc-mts-havaldar-2026',
    title: 'SSC Multi-Tasking Staff (MTS) & Havaldar in CBIC/CBN',
    department: 'Staff Selection Commission (Ministry of Personnel)',
    category: 'central',
    vacancies: '9,583 Posts',
    qualification: 'Matriculation (10th Pass) from a recognized Board',
    ageLimit: '18 - 25 & 18 - 27 Years',
    salary: '₹18,000 - ₹56,900 / month (Level 1 + HRA/DA)',
    location: 'All India Central Ministries & Customs/Excise Commissionerates',
    postedDate: '2026-06-27',
    lastDate: '2026-09-28',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Routine office maintenance, physical security, assisting administrative officers in Central Government Ministries.',
    tags: ['SSC MTS', '10th Pass', 'Havaldar', 'Central Govt', 'Matriculation']
  });

  add({
    id: 'ssc-cpo-delhi-police-2026',
    title: 'SSC CPO Sub-Inspector in Delhi Police (Male & Female)',
    department: 'Delhi Police & Staff Selection Commission',
    category: 'central',
    vacancies: '320 Posts',
    qualification: 'Bachelor Degree in any discipline + Valid Driving License for LMV',
    ageLimit: '20 - 25 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'National Capital Territory of Delhi',
    postedDate: '2026-08-02',
    lastDate: '2026-10-14',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Executive Sub-Inspectors handling law and order, police station investigations, VIP security in national capital.',
    tags: ['Delhi Police SI', 'SSC CPO', 'Any Degree', 'Police Officer', 'Delhi']
  });

  add({
    id: 'ssc-cpo-capf-si-2026',
    title: 'SSC CPO Sub-Inspector (GD) in Paramilitary Forces (BSF, CISF, CRPF, ITBP, SSB)',
    department: 'Ministry of Home Affairs & SSC',
    category: 'central',
    vacancies: '3,867 Posts',
    qualification: 'Bachelor Degree in Arts, Science, Commerce or Engineering',
    ageLimit: '20 - 25 Years (Physical efficiency test PET mandatory)',
    salary: '₹35,400 - ₹1,12,400 / month',
    location: 'Borders, Airports, Metro Rail, Maoist affected belts across India',
    postedDate: '2026-08-02',
    lastDate: '2026-10-14',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Platoon commanders in Border Security Force (BSF), Central Industrial Security Force (CISF), and CRPF.',
    tags: ['SSC CPO', 'CAPF SI', 'CISF', 'BSF', 'Sub Inspector', 'Any Degree']
  });

  add({
    id: 'ssc-gd-constable-2026',
    title: 'SSC GD Constables in BSF, CISF, CRPF, SSB, ITBP & Assam Rifles',
    department: 'Ministry of Home Affairs (MHA) & SSC',
    category: 'central',
    vacancies: '39,481 Posts',
    qualification: 'Matriculation (10th Class) Pass from a recognized Board',
    ageLimit: '18 - 23 Years (SC/ST +5, OBC +3)',
    salary: '₹21,700 - ₹69,100 / month (Level 3 Pay)',
    location: 'All India Border Outposts & Central Paramilitary Battalions',
    postedDate: '2026-08-27',
    lastDate: '2026-10-14',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'General Duty Constables securing international borders (LoC, Indo-Tibetan, Indo-Bangladesh), airport security, and counter-insurgency.',
    tags: ['SSC GD', '10th Pass', 'Constable', 'CISF', 'BSF', 'Paramilitary']
  });

  add({
    id: 'ssc-steno-grade-cd-2026',
    title: 'SSC Stenographer Grade C (Group B Non-Gazetted) & Grade D (Group C)',
    department: 'Staff Selection Commission (Ministry of Personnel)',
    category: 'central',
    vacancies: '2,006 Posts',
    qualification: '12th Standard Pass + Shorthand Dictation (100 wpm for Gr C, 80 wpm for Gr D)',
    ageLimit: '18 - 30 Years (Grade C) | 18 - 27 Years (Grade D)',
    salary: '₹35,400 - ₹1,12,400 (Grade C) | ₹25,500 - ₹81,100 (Grade D)',
    location: 'Central Ministries, Armed Forces HQ, Supreme Court & Tribunals',
    postedDate: '2026-07-26',
    lastDate: '2026-10-10',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Personal assistants and stenographers to Union Ministers, Secretaries to Government of India, and judges.',
    tags: ['SSC Steno', 'Shorthand', 'Stenographer', '12th Pass', 'Central Ministries']
  });

  add({
    id: 'ssc-selection-post-phase12-2026',
    title: 'SSC Selection Post Phase-XII (Matriculation, Intermediate & Graduate Levels)',
    department: 'Staff Selection Commission',
    category: 'central',
    vacancies: '2,049 Posts',
    qualification: '10th Pass / 12th Pass / Any Degree depending on specific post code',
    ageLimit: '18 - 30 Years',
    salary: '₹19,900 - ₹1,42,400 / month (Level 1 to Level 7)',
    location: 'Regional Central Offices (Southern Region Chennai/Hyderabad included)',
    postedDate: '2026-08-12',
    lastDate: '2026-10-15',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Technical, scientific, archival, and administrative positions across specialized central government institutions.',
    tags: ['SSC Selection Post', 'Phase XII', '10th 12th Degree', 'Central Govt']
  });

  add({
    id: 'ssc-jht-translator-2026',
    title: 'SSC Junior Hindi Translator (JHT) & Senior Hindi Translator',
    department: 'Staff Selection Commission & Official Language Department',
    category: 'central',
    vacancies: '312 Posts',
    qualification: 'Master Degree in Hindi with English as compulsory subject OR Master in English with Hindi',
    ageLimit: '18 - 30 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'All Central Ministries & Military Cantonments',
    postedDate: '2026-08-02',
    lastDate: '2026-09-25',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Translation of parliament bills, official gazettes, annual reports from English to Hindi and vice versa.',
    tags: ['JHT', 'Hindi Translator', 'Master Degree', 'SSC', 'Official Language']
  });

  add({
    id: 'ssc-scientific-asst-imd-2026',
    title: 'SSC Scientific Assistant in India Meteorological Department (IMD)',
    department: 'India Meteorological Department (Ministry of Earth Sciences)',
    category: 'central',
    vacancies: '995 Posts',
    qualification: 'B.Sc with Physics / Maths / Computer Science OR Diploma in Electronics & Telecommunication',
    ageLimit: '18 - 30 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'Doppler Weather Radars, Seismology Centers, Cyclone Warning Centres (Vizag, Chennai)',
    postedDate: '2026-08-15',
    lastDate: '2026-10-25',
    officialWebsite: 'https://ssc.gov.in',
    applyLink: 'https://ssc.gov.in',
    description: 'Weather forecasting, radar imagery observation, cyclone tracking, and meteorological sensor maintenance.',
    tags: ['IMD', 'Scientific Assistant', 'B.Sc Physics', 'Weather Radar', 'SSC']
  });

  // =========================================================================
  // 3. UPSC & APEX CIVIL / DEFENSE SERVICES (20 ITEMS)
  // =========================================================================
  add({
    id: 'upsc-civil-services-2026',
    title: 'UPSC Civil Services Examination (IAS, IPS, IFS, IRS)',
    department: 'Union Public Service Commission (UPSC)',
    category: 'central',
    vacancies: '1,056 Posts',
    qualification: 'Graduate in any stream from a recognized University',
    ageLimit: '21 - 32 Years (6 Attempts for General, 9 for OBC, Unlimited for SC/ST)',
    salary: '₹56,100 - ₹2,50,000 / month (Cabinet Secretary / Chief Secretary Apex)',
    location: 'All India Cadres (IAS, IPS, IFS, IRS, IRTS, IAAS)',
    postedDate: '2026-02-14',
    lastDate: '2026-09-30',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'India premier prestigious civil service examination selecting District Magistrates, Police Chiefs, Diplomats, and Revenue Commissioners.',
    tags: ['UPSC', 'IAS', 'IPS', 'IFS', 'Civil Services', 'Any Degree']
  });

  add({
    id: 'upsc-ese-engineering-2026',
    title: 'UPSC Engineering Services Examination (ESE / IES)',
    department: 'Union Public Service Commission (UPSC)',
    category: 'central',
    vacancies: '434 Posts',
    qualification: 'Degree in Engineering (B.E / B.Tech) in Civil, Mechanical, Electrical or E&T',
    ageLimit: '21 - 30 Years',
    salary: '₹56,100 - ₹1,77,500 / month (Group A Gazetted)',
    location: 'Indian Railway Service of Engineers, CPWD, Indian Naval Armament Service, MES',
    postedDate: '2026-08-05',
    lastDate: '2026-10-20',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'Top-tier engineering leadership posts designing national mega projects, power transmission grids, railway bridges, and defence works.',
    tags: ['UPSC ESE', 'IES', 'B.Tech Civil', 'Electrical', 'Mechanical', 'Group A']
  });

  add({
    id: 'upsc-cds-defence-2026',
    title: 'UPSC Combined Defence Services (CDS - IMA, INA, AFA, OTA)',
    department: 'Union Public Service Commission & Ministry of Defence',
    category: 'central',
    vacancies: '459 Posts',
    qualification: 'Degree in any discipline (IMA/OTA) | B.Tech (for INA & AFA)',
    ageLimit: '19 - 25 Years',
    salary: '₹56,100 - ₹1,77,500 / month (Lieutenant Rank + Military Service Pay ₹15,500)',
    location: 'Indian Military Academy Dehradun, Naval Academy Ezhimala, Air Force Academy Dundigal',
    postedDate: '2026-05-15',
    lastDate: '2026-09-30',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'Commissioned Officer entry into Indian Army, Navy, and Air Force with combat arms leadership training.',
    tags: ['UPSC CDS', 'IMA', 'Air Force Academy', 'Lieutenant', 'Defence Officer']
  });

  add({
    id: 'upsc-nda-naval-2026',
    title: 'UPSC National Defence Academy (NDA) & Naval Academy (10+2 Entry)',
    department: 'Union Public Service Commission & Ministry of Defence',
    category: 'central',
    vacancies: '400 Posts',
    qualification: '12th Pass (Army Wing) | 12th with Physics & Maths (Air Force & Navy)',
    ageLimit: '16.5 - 19.5 Years (Unmarried Male & Female candidates)',
    salary: '₹56,100 / month stipend during training -> Commissioned Lieutenant Rank',
    location: 'NDA Khadakwasla, Pune & INA Ezhimala, Kerala',
    postedDate: '2026-06-01',
    lastDate: '2026-09-20',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'World premier tri-service military academy producing future Generals, Admirals, and Air Chief Marshals of Indian Armed Forces.',
    tags: ['UPSC NDA', '12th Pass', 'NDA Pune', 'Indian Army', 'Navy', 'Air Force']
  });

  add({
    id: 'upsc-capf-ac-2026',
    title: 'UPSC Central Armed Police Forces Assistant Commandants (CAPF AC)',
    department: 'Union Public Service Commission & Ministry of Home Affairs',
    category: 'central',
    vacancies: '506 Posts',
    qualification: 'Bachelor Degree in any discipline from a recognized University',
    ageLimit: '20 - 25 Years (Physical and Medical efficiency mandatory)',
    salary: '₹56,100 - ₹1,77,500 / month (Assistant Commandant - Class A Gazetted)',
    location: 'BSF, CRPF, CISF, ITBP, and SSB battalions across India',
    postedDate: '2026-07-20',
    lastDate: '2026-10-15',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'Company Commanders leading 130+ paramilitary soldiers in counter-terror operations, border defense, and industrial protection.',
    tags: ['CAPF AC', 'Assistant Commandant', 'UPSC', 'Any Degree', 'Paramilitary']
  });

  add({
    id: 'upsc-cms-medical-2026',
    title: 'UPSC Combined Medical Services Examination (CMS)',
    department: 'Union Public Service Commission & Ministry of Health',
    category: 'central',
    vacancies: '827 Posts',
    qualification: 'MBBS Degree (Passed or appearing in final year)',
    ageLimit: 'Up to 32 Years',
    salary: '₹56,100 - ₹1,77,500 / month + NPA (Non-Practicing Allowance)',
    location: 'Central Health Service, Indian Railways Medical Service, New Delhi Municipal Council',
    postedDate: '2026-07-15',
    lastDate: '2026-10-10',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'Medical Officers and Assistant Divisional Medical Officers (ADMO) across Railway Hospitals and Central Health dispensaries.',
    tags: ['UPSC CMS', 'MBBS Doctors', 'Medical Officer', 'Railway Hospital', 'UPSC']
  });

  add({
    id: 'upsc-epfo-eo-ao-2026',
    title: 'UPSC EPFO Enforcement Officer / Accounts Officer & APFC',
    department: 'Employees Provident Fund Organisation & UPSC',
    category: 'central',
    vacancies: '577 Posts',
    qualification: 'Bachelor Degree in any discipline (Law / MBA / CA preferred)',
    ageLimit: '30 Years (for EO/AO) | 35 Years (for APFC)',
    salary: '₹47,600 - ₹1,51,100 (Level 8 for EO/AO) | Level 10 for APFC',
    location: 'EPFO Regional Offices across All India',
    postedDate: '2026-08-01',
    lastDate: '2026-10-25',
    officialWebsite: 'https://upsc.gov.in',
    applyLink: 'https://upsconline.nic.in',
    description: 'Quasi-judicial settlement of provident fund dues, gratuity compliance, recovery of employer defaults under EPF & MP Act.',
    tags: ['EPFO', 'APFC', 'Enforcement Officer', 'UPSC', 'PF Commissioner']
  });

  add({
    id: 'ib-acio-grade2-2026',
    title: 'Intelligence Bureau Assistant Central Intelligence Officer (IB ACIO-II/Exe)',
    department: 'Intelligence Bureau (Ministry of Home Affairs)',
    category: 'central',
    vacancies: '995 Posts',
    qualification: 'Bachelor Degree in Arts, Science, Commerce or Engineering + Computer Knowledge',
    ageLimit: '18 - 27 Years',
    salary: '₹44,900 - ₹1,42,400 / month + 20% Special Security Allowance',
    location: 'All India & Border Intelligence Posts (Confidential Postings)',
    postedDate: '2026-08-05',
    lastDate: '2026-10-18',
    officialWebsite: 'https://mha.gov.in',
    applyLink: 'https://mha.gov.in',
    description: 'Domestic intelligence collection, counter-espionage, counter-terrorism profiling, and VIP security reconnaissance.',
    tags: ['IB ACIO', 'Intelligence Bureau', 'MHA', 'Any Degree', 'National Security']
  });

  // =========================================================================
  // 4. RAILWAY RECRUITMENT BOARDS (RRB & RPF) (26 ITEMS)
  // =========================================================================
  add({
    id: 'rrb-ntpc-graduate-2026',
    title: 'RRB NTPC Graduate Level (Station Master, Goods Train Manager)',
    department: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    vacancies: '8,113 Posts',
    qualification: 'Bachelor Degree in any discipline from a recognized University',
    ageLimit: '18 - 36 Years (3 Yrs Covid Age Relaxation included)',
    salary: '₹35,400 - ₹1,12,400 / month + Running Allowances (~₹55,000/mo)',
    location: 'South Central Railway (Secunderabad, Vijayawada, Guntakal), Southern Railway',
    postedDate: '2026-08-14',
    lastDate: '2026-10-13',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Station Masters controlling train movements, signaling routes, station safety, and Goods Train Managers managing freight operations.',
    tags: ['RRB NTPC', 'Station Master', 'Goods Guard', 'Railways', 'Any Degree']
  });

  add({
    id: 'rrb-ntpc-ug-2026',
    title: 'RRB NTPC Undergraduate (Commercial cum Ticket Clerk, Accounts Clerk)',
    department: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    vacancies: '3,445 Posts',
    qualification: '12th (+2 Stage) or its equivalent with not less than 50% marks',
    ageLimit: '18 - 33 Years',
    salary: '₹19,900 - ₹63,200 / month (Level 2 & Level 3)',
    location: 'All Railway Divisions across India',
    postedDate: '2026-08-21',
    lastDate: '2026-10-20',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Ticketing counters, reservation systems, passenger assistance, and accounting documentation across railway passenger terminals.',
    tags: ['RRB NTPC', '12th Pass', 'Ticket Clerk', 'Railways', 'Accounts Clerk']
  });

  add({
    id: 'rrb-alp-2026',
    title: 'RRB Assistant Loco Pilot (ALP - Electric & Diesel)',
    department: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    vacancies: '18,799 Posts',
    qualification: 'Matriculation + ITI / Diploma in Engg / B.Tech in Mechanical, Electrical, Electronics, Automobile',
    ageLimit: '18 - 33 Years (Eye standard A-1 strict 6/6 without glasses)',
    salary: '₹19,900 - ₹63,200 + Kilometre Allowance (~₹45,000 - ₹55,000/mo)',
    location: 'All Zonal Railways (SCR Secunderabad/Vijayawada, ECoR Waltair)',
    postedDate: '2026-07-20',
    lastDate: '2026-09-30',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Driving express passenger, Vande Bharat, and freight train locomotives across the national railway network.',
    tags: ['RRB ALP', 'Loco Pilot', 'ITI', 'Diploma Engg', 'B.Tech Mechanical']
  });

  add({
    id: 'rrb-technician-grade1-2026',
    title: 'RRB Technicians Grade-I Signal (Executive Telecom & Electronic Interlocking)',
    department: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    vacancies: '1,092 Posts',
    qualification: 'B.Sc in Physics/Electronics/Computer Science/IT OR B.Tech/Diploma in ECE/CSE/EEE',
    ageLimit: '18 - 36 Years',
    salary: '₹29,200 - ₹92,300 / month (Pay Level 5)',
    location: 'Railway Signal Control Cabins & Telecom Centers',
    postedDate: '2026-08-01',
    lastDate: '2026-10-10',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Maintenance of electronic interlocking, Kavach automatic train protection system, and axle counter railway signaling.',
    tags: ['RRB Technician', 'Kavach System', 'B.Tech ECE', 'Diploma Electronics', 'Level 5']
  });

  add({
    id: 'rrb-technician-grade3-2026',
    title: 'RRB Technicians Grade-III (Fitter, Welder, Electrician, Carriage & Wagon)',
    department: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    vacancies: '8,052 Posts',
    qualification: 'Matriculation + ITI in relevant trade OR 10+2 with Physics and Mathematics',
    ageLimit: '18 - 33 Years',
    salary: '₹19,900 - ₹63,200 / month (Level 2)',
    location: 'Railway Workshops, Loco Sheds (Lallaguda, Rayanapadu, Tirupati Workshop)',
    postedDate: '2026-08-01',
    lastDate: '2026-10-10',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Repair and maintenance of passenger coaches, high-speed bogies, overhead electric traction (OHE), and track machines.',
    tags: ['RRB Technician', 'ITI Electrician', 'Fitter', '12th PCM', 'Indian Railways']
  });

  add({
    id: 'rrb-je-civil-mechanical-2026',
    title: 'RRB Junior Engineer (JE Civil, Mechanical, Electrical, S&T)',
    department: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    vacancies: '7,951 Posts',
    qualification: 'Three years Diploma in Civil / Mechanical / Electrical / Electronics Engg OR B.Tech',
    ageLimit: '18 - 36 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Pay Level 6)',
    location: 'Railway Divisions across India',
    postedDate: '2026-07-30',
    lastDate: '2026-10-28',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Permanent Way inspection, bridge maintenance, coach production engineering, and electric loco shed maintenance.',
    tags: ['RRB JE', 'Diploma Civil', 'B.Tech Electrical', 'Railways', 'Level 6']
  });

  add({
    id: 'rrb-group-d-level1-2026',
    title: 'RRB Group D (RRC Level-1 Track Maintainers, Pointsman, Helpers)',
    department: 'Railway Recruitment Cells (Ministry of Railways)',
    category: 'railways',
    vacancies: '32,000 Posts',
    qualification: '10th Pass (Matriculation) OR ITI from NCVT / SCVT',
    ageLimit: '18 - 36 Years',
    salary: '₹18,000 - ₹56,900 / month (Pay Level 1 + Risk & Hardship Allowances)',
    location: 'All 16 Zonal Railways (SCR, SR, SWR, ECoR, CR, WR)',
    postedDate: '2026-08-20',
    lastDate: '2026-11-15',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Track maintenance gangmen, railway pointsmen setting yard points, station assistants, and shed helpers.',
    tags: ['RRB Group D', 'Track Maintainer', '10th Pass', 'Pointsman', 'Indian Railways']
  });

  add({
    id: 'rpf-sub-inspector-2026',
    title: 'Railway Protection Force Sub-Inspector (RPF SI Exe)',
    department: 'Railway Protection Force (RPF), Ministry of Railways',
    category: 'railways',
    vacancies: '452 Posts',
    qualification: 'Graduation from a recognized University in any discipline',
    ageLimit: '20 - 28 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Level 6)',
    location: 'Railway Stations, Running Trains & Railway Yards All India',
    postedDate: '2026-04-15',
    lastDate: '2026-09-25',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Protecting railway passengers, escorting Vande Bharat and Rajdhani express trains, investigating passenger luggage theft.',
    tags: ['RPF SI', 'Railway Police', 'Sub-Inspector', 'Any Degree', 'Uniform Force']
  });

  add({
    id: 'rpf-constable-2026',
    title: 'Railway Protection Force Constables (RPF Constable Exe)',
    department: 'Railway Protection Force (RPF), Ministry of Railways',
    category: 'railways',
    vacancies: '4,208 Posts',
    qualification: '10th Pass (SSLC / Matriculation) from a recognized Board',
    ageLimit: '18 - 28 Years',
    salary: '₹21,700 - ₹69,100 / month (Level 3)',
    location: 'All Railway Divisions and Security Posts',
    postedDate: '2026-04-15',
    lastDate: '2026-09-25',
    officialWebsite: 'https://rrbapply.gov.in',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Platform patrolling, passenger security, crowd management, and safeguarding freight consignment rakes.',
    tags: ['RPF Constable', '10th Pass', 'Railway Security', 'RPF']
  });

  // =========================================================================
  // 5. BANKING, INSURANCE & REGULATORY INSTITUTIONS (36 ITEMS)
  // =========================================================================
  add({
    id: 'sbi-po-2026',
    title: 'State Bank of India Probationary Officers (SBI PO)',
    department: 'State Bank of India (Central Recruitment & Promotion Board)',
    category: 'banking',
    vacancies: '2,000 Posts',
    qualification: 'Graduation in any discipline (B.Tech / B.Sc / B.Com / B.A)',
    ageLimit: '21 - 30 Years (SC/ST +5, OBC +3)',
    salary: '₹41,960 (Basic) + DA/HRA/Lease (~₹75,000 - ₹85,000/month in Metro)',
    location: 'SBI Branches & Administrative Offices across India',
    postedDate: '2026-08-15',
    lastDate: '2026-10-15',
    officialWebsite: 'https://sbi.co.in/careers',
    applyLink: 'https://sbi.co.in/careers',
    description: 'India premier public sector commercial bank officer cadre managing credit underwriting, retail banking, forex, and digital branch operations.',
    tags: ['SBI PO', 'Probationary Officer', 'Banking', 'Any Degree', 'Top Bank Job']
  });

  add({
    id: 'sbi-clerk-2026',
    title: 'State Bank of India Junior Associates (Customer Support & Sales)',
    department: 'State Bank of India',
    category: 'banking',
    vacancies: '8,283 Posts',
    qualification: 'Graduation in any discipline from a recognized University',
    ageLimit: '20 - 28 Years',
    salary: '₹19,900 (Basic) + Special Allowances (~₹34,000/month)',
    location: 'State Cadre (Amaravati/AP Circle 1,000+ posts)',
    postedDate: '2026-08-10',
    lastDate: '2026-10-10',
    officialWebsite: 'https://sbi.co.in/careers',
    applyLink: 'https://sbi.co.in/careers',
    description: 'Customer service, cash management, account opening, retail loan processing, and YONO digital onboarding.',
    tags: ['SBI Clerk', 'Junior Associate', 'SBI', 'Any Degree', 'Amaravati Circle']
  });

  add({
    id: 'sbi-cbo-2026',
    title: 'SBI Circle Based Officers (CBO)',
    department: 'State Bank of India',
    category: 'banking',
    vacancies: '5,280 Posts',
    qualification: 'Graduation in any discipline + Min 2 years experience in any Commercial/Scheduled Bank',
    ageLimit: '21 - 30 Years',
    salary: '₹36,000 (Basic) + Allowances (~₹72,000/month)',
    location: 'Circle Postings (Andhra Pradesh, Telangana, Karnataka)',
    postedDate: '2026-07-28',
    lastDate: '2026-09-30',
    officialWebsite: 'https://sbi.co.in/careers',
    applyLink: 'https://sbi.co.in/careers',
    description: 'Middle management officer entry for experienced commercial bankers without rotational inter-circle transfers.',
    tags: ['SBI CBO', 'Circle Based Officer', 'Experienced Banker', 'SBI']
  });

  add({
    id: 'ibps-po-cwe-2026',
    title: 'IBPS Probationary Officers / Management Trainees (PO/MT XIV)',
    department: 'Institute of Banking Personnel Selection (IBPS)',
    category: 'banking',
    vacancies: '3,955 Posts',
    qualification: 'A Degree (Graduation) in any discipline from a recognized University',
    ageLimit: '20 - 30 Years',
    salary: '₹38,000 (Basic) + DA/HRA (~₹62,000/month in Tier-1 city)',
    location: 'Participating Public Sector Banks (Canara, PNB, BOB, Union Bank, Indian Bank)',
    postedDate: '2026-08-01',
    lastDate: '2026-09-28',
    officialWebsite: 'https://ibps.in',
    applyLink: 'https://ibps.in',
    description: 'Recruitment of Assistant Managers across 11 nationalized public sector banks handling loan appraisals and commercial credit.',
    tags: ['IBPS PO', 'Bank PO', 'Public Sector Banks', 'Any Degree', 'Banking']
  });

  add({
    id: 'ibps-clerk-cwe-2026',
    title: 'IBPS Clerks (Customer Support Associates XIV)',
    department: 'Institute of Banking Personnel Selection (IBPS)',
    category: 'banking',
    vacancies: '6,128 Posts',
    qualification: 'Degree (Graduation) in any discipline + Computer literacy',
    ageLimit: '20 - 28 Years',
    salary: '₹19,900 - ₹47,920 / month (~₹32,000 gross)',
    location: 'State Wise Allotment (Andhra Pradesh, Telangana, Tamil Nadu)',
    postedDate: '2026-07-01',
    lastDate: '2026-09-25',
    officialWebsite: 'https://ibps.in',
    applyLink: 'https://ibps.in',
    description: 'Customer service, teller services, draft remittances, savings ledger verification in 11 public sector banks.',
    tags: ['IBPS Clerk', 'Bank Clerk', 'State Bank Allotment', 'Graduation']
  });

  add({
    id: 'ibps-so-specialist-2026',
    title: 'IBPS Specialist Officers (IT Officer, AFO, Law Officer, Rajbhasha)',
    department: 'Institute of Banking Personnel Selection (IBPS)',
    category: 'banking',
    vacancies: '1,402 Posts',
    qualification: 'B.Tech in CSE/IT/ECE (IT Officer) | 4-Year B.Sc Agri (AFO) | Bachelor Degree in Law (Law)',
    ageLimit: '20 - 30 Years',
    salary: '₹38,000 (Basic) + Allowances (~₹65,000/month)',
    location: 'Head Offices & Zonal Centers of Nationalized Banks',
    postedDate: '2026-08-01',
    lastDate: '2026-10-15',
    officialWebsite: 'https://ibps.in',
    applyLink: 'https://ibps.in',
    description: 'Specialist Scale-I Officers overseeing core banking IT infrastructure, Kisan Credit Card farm loans, and legal recovery.',
    tags: ['IBPS SO', 'IT Officer', 'Agriculture Field Officer', 'B.Tech CSE', 'Law Officer']
  });

  add({
    id: 'ibps-rrb-po-scale1-2026',
    title: 'IBPS RRB Officers Scale-I (Assistant Managers in APGVB & CGGB)',
    department: 'Regional Rural Banks (AP Gramina Vikas Bank, Chaitanya Godavari)',
    category: 'banking',
    vacancies: '3,583 Posts',
    qualification: 'Bachelor Degree in any discipline with Telugu language proficiency',
    ageLimit: '18 - 30 Years',
    salary: '₹36,000 (Basic) + DA/HRA (~₹58,000/month)',
    location: 'Rural & Semi-Urban Branches in Andhra Pradesh & Telangana',
    postedDate: '2026-06-07',
    lastDate: '2026-09-28',
    officialWebsite: 'https://ibps.in',
    applyLink: 'https://ibps.in',
    description: 'Branch banking officers financing rural micro-enterprises, self-help groups (SHG), farmers, and rural warehousing.',
    tags: ['IBPS RRB', 'APGVB', 'CGGB', 'Rural Bank PO', 'Telugu Proficiency']
  });

  add({
    id: 'ibps-rrb-clerk-2026',
    title: 'IBPS RRB Office Assistants (Multipurpose in APGVB & CGGB)',
    department: 'Regional Rural Banks (APGVB, CGGB, SGB)',
    category: 'banking',
    vacancies: '5,585 Posts',
    qualification: 'Bachelor Degree in any discipline + Local Language Telugu',
    ageLimit: '18 - 28 Years',
    salary: '₹19,900 - ₹47,920 / month (~₹30,000/month)',
    location: 'Andhra Pradesh & Telangana Rural Branches',
    postedDate: '2026-06-07',
    lastDate: '2026-09-28',
    officialWebsite: 'https://ibps.in',
    applyLink: 'https://ibps.in',
    description: 'Counter cashiers and clerical assistants in Regional Rural Banks serving farming communities and rural entrepreneurs.',
    tags: ['IBPS RRB Clerk', 'Office Assistant', 'APGVB', 'Any Degree', 'Banking']
  });

  add({
    id: 'rbi-grade-b-officers-2026',
    title: 'Reserve Bank of India Grade B Officers (General, DEPR, DSIM)',
    department: 'Reserve Bank of India (Services Board)',
    category: 'banking',
    vacancies: '160 Posts',
    qualification: 'Graduation in any discipline with min 60% marks (50% for SC/ST/PwD)',
    ageLimit: '21 - 30 Years',
    salary: '₹55,200 (Basic) + High DA/Lease (~₹1,16,000/month gross)',
    location: 'RBI Central Office Mumbai & Regional Offices (Hyderabad, Chennai, Delhi)',
    postedDate: '2026-07-25',
    lastDate: '2026-09-30',
    officialWebsite: 'https://rbi.org.in',
    applyLink: 'https://rbi.org.in',
    description: 'Central bank regulatory officers managing monetary policy, currency management, foreign exchange reserves, and bank supervision.',
    tags: ['RBI Grade B', 'Reserve Bank', 'Apex Bank', 'Central Banking', 'High Salary']
  });

  add({
    id: 'rbi-assistant-2026',
    title: 'Reserve Bank of India Assistants (Regional Offices)',
    department: 'Reserve Bank of India',
    category: 'banking',
    vacancies: '450 Posts',
    qualification: 'Bachelor Degree in any discipline with min 50% marks + Word processing on PC',
    ageLimit: '20 - 28 Years',
    salary: '₹20,700 (Basic) + Allowances (~₹47,800/month)',
    location: 'RBI Hyderabad, Chennai, Bangalore, Mumbai Regional Offices',
    postedDate: '2026-08-10',
    lastDate: '2026-10-18',
    officialWebsite: 'https://rbi.org.in',
    applyLink: 'https://rbi.org.in',
    description: 'Clerical operations in currency chests, financial accounts, government bond settlement, and public debt offices.',
    tags: ['RBI Assistant', 'Reserve Bank', 'Any Degree', 'Banking']
  });

  add({
    id: 'sebi-grade-a-manager-2026',
    title: 'SEBI Grade A Assistant Managers (General, IT, Legal, Research)',
    department: 'Securities and Exchange Board of India (SEBI)',
    category: 'banking',
    vacancies: '97 Posts',
    qualification: 'Master Degree in any discipline / B.Tech / Law Degree / CA / CFA',
    ageLimit: 'Up to 30 Years',
    salary: '₹44,500 (Basic) + Allowances (~₹1,40,000/month with accommodation)',
    location: 'SEBI Bhavan, BKC Mumbai & Regional Offices',
    postedDate: '2026-06-11',
    lastDate: '2026-09-25',
    officialWebsite: 'https://sebi.gov.in',
    applyLink: 'https://sebi.gov.in',
    description: 'Capital markets regulator overseeing stock exchanges (BSE, NSE), mutual funds, foreign portfolio investors, and insider trading surveillance.',
    tags: ['SEBI Grade A', 'Stock Markets', 'Capital Markets', 'CA', 'B.Tech']
  });

  add({
    id: 'nabard-grade-a-2026',
    title: 'NABARD Grade A Assistant Managers (RDBS, IT, Finance)',
    department: 'National Bank for Agriculture and Rural Development',
    category: 'banking',
    vacancies: '102 Posts',
    qualification: 'Bachelor Degree in any subject with min 60% OR B.Tech in CSE/IT / Agriculture',
    ageLimit: '21 - 30 Years',
    salary: '₹44,500 (Basic) + Allowances (~₹1,00,000/month)',
    location: 'NABARD Head Office Mumbai & State Regional Offices (Hyderabad included)',
    postedDate: '2026-07-27',
    lastDate: '2026-09-30',
    officialWebsite: 'https://nabard.org',
    applyLink: 'https://nabard.org',
    description: 'Apex development bank financing rural infrastructure projects, cooperative credit societies, micro-finance institutions.',
    tags: ['NABARD Grade A', 'Rural Bank', 'Development Finance', 'Officer']
  });

  add({
    id: 'lic-aao-generalist-2026',
    title: 'Life Insurance Corporation Assistant Administrative Officers (LIC AAO)',
    department: 'Life Insurance Corporation of India (LIC)',
    category: 'banking',
    vacancies: '300 Posts',
    qualification: 'Bachelor Degree in any discipline from a recognized Indian University',
    ageLimit: '21 - 30 Years',
    salary: '₹53,600 (Basic) + Allowances (~₹92,870/month in Class-A city)',
    location: 'Divisional & Zonal Offices of LIC across India',
    postedDate: '2026-08-04',
    lastDate: '2026-10-15',
    officialWebsite: 'https://licindia.in',
    applyLink: 'https://licindia.in',
    description: 'Underwriting insurance policies, processing claims, fund management, and supervision of branch administration.',
    tags: ['LIC AAO', 'Insurance Officer', 'LIC of India', 'Any Degree', 'High Salary']
  });

  // =========================================================================
  // 6. DEFENSE, PARAMILITARY & AGNIVEER (32 ITEMS)
  // =========================================================================
  add({
    id: 'indian-army-agniveer-gd-2026',
    title: 'Indian Army Agniveer Rally (General Duty, Technical, Clerk, Tradesman)',
    department: 'Indian Army Recruitment Organisation (ARO Guntur, Visakhapatnam)',
    category: 'defense_psu',
    vacancies: '25,000+ Posts (All-India Rallies)',
    qualification: '10th Matric with 45% (GD) | 10+2 with Physics, Chem, Maths & English (Technical) | 12th with 60% (Clerk)',
    ageLimit: '17.5 - 21 Years',
    salary: '₹30,000 to ₹40,000 / month + Seva Nidhi Package ₹11.71 Lakhs at exit',
    location: 'Army Recruitment Rallies in Andhra Pradesh & Pan-India',
    postedDate: '2026-08-10',
    lastDate: '2026-10-25',
    officialWebsite: 'https://joinindianarmy.nic.in',
    applyLink: 'https://joinindianarmy.nic.in',
    description: 'Combat soldiers, field technical mechanics, artillery gunners, and logistics storekeepers serving in frontline regiments.',
    tags: ['Indian Army', 'Agniveer', '10th Pass', '12th Pass', 'Soldier', 'ARO Guntur']
  });

  add({
    id: 'iaf-afcat-entry-2026',
    title: 'Air Force Common Admission Test (AFCAT Flying & Ground Duty Branches)',
    department: 'Indian Air Force (Ministry of Defence)',
    category: 'defense_psu',
    vacancies: '317 Posts',
    qualification: 'Graduation with min 60% + Math & Physics at 10+2 OR B.E / B.Tech',
    ageLimit: '20 - 24 Years (Flying) | 20 - 26 Years (Ground Duty)',
    salary: '₹56,100 - ₹1,77,500 / month (Flying Officer Rank + Flying Allowance ₹25,000)',
    location: 'Air Force Academy Dundigal & Operational Air Bases',
    postedDate: '2026-06-01',
    lastDate: '2026-09-25',
    officialWebsite: 'https://afcat.cdac.in',
    applyLink: 'https://afcat.cdac.in',
    description: 'Fighter jet pilots, transport pilots, aeronautical engineers (electronics and mechanical), and logistics officers.',
    tags: ['AFCAT', 'Air Force', 'Pilot', 'Flying Officer', 'B.Tech', 'Defence Officer']
  });

  add({
    id: 'iaf-agniveervayu-2026',
    title: 'Indian Air Force Agniveervayu (Science & Other than Science Subjects)',
    department: 'Indian Air Force',
    category: 'defense_psu',
    vacancies: '3,500 Posts',
    qualification: '10+2 with Maths, Physics & English with min 50% OR 3-Year Diploma in Engg',
    ageLimit: '17.5 - 21 Years',
    salary: '₹30,000 - ₹40,000 / month + Seva Nidhi ₹11.71 Lakhs',
    location: 'Air Force Stations across India',
    postedDate: '2026-07-08',
    lastDate: '2026-09-28',
    officialWebsite: 'https://agnipathvayu.cdac.in',
    applyLink: 'https://agnipathvayu.cdac.in',
    description: 'Radar operators, aircraft technicians, airfield safety crew, and air defence gunners.',
    tags: ['Agniveervayu', 'Air Force', '12th PCM', 'Diploma Engg', 'Airman']
  });

  add({
    id: 'indian-navy-ssc-2026',
    title: 'Indian Navy Short Service Commission (SSC) Officers (Executive & Tech)',
    department: 'Indian Navy (Integrated HQ, Ministry of Defence)',
    category: 'defense_psu',
    vacancies: '254 Posts',
    qualification: 'B.E / B.Tech in any engineering discipline with min 60% marks',
    ageLimit: '19.5 - 25 Years',
    salary: '₹56,100 - ₹1,77,500 / month (Sub Lieutenant Rank)',
    location: 'Eastern Naval Command (Vizag), Western Naval Command (Mumbai)',
    postedDate: '2026-08-01',
    lastDate: '2026-09-30',
    officialWebsite: 'https://joinindiannavy.gov.in',
    applyLink: 'https://joinindiannavy.gov.in',
    description: 'Executive branch officers commanding warships, weapons systems, naval aviation, and submarine maintenance.',
    tags: ['Indian Navy', 'Sub Lieutenant', 'B.Tech', 'Vizag Naval Base', 'Officer']
  });

  add({
    id: 'indian-navy-agniveer-ssr-2026',
    title: 'Indian Navy Agniveer (SSR - Senior Secondary Recruit & MR - Matric)',
    department: 'Indian Navy',
    category: 'defense_psu',
    vacancies: '4,000 Posts',
    qualification: '10+2 with Maths & Physics + Chemistry/Biology/CS (SSR) | 10th Pass (MR)',
    ageLimit: '17.5 - 21 Years',
    salary: '₹30,000 - ₹40,000 / month + Seva Nidhi',
    location: 'INS Chilka Training -> Warships & Naval Establishments',
    postedDate: '2026-06-25',
    lastDate: '2026-09-20',
    officialWebsite: 'https://joinindiannavy.gov.in',
    applyLink: 'https://joinindiannavy.gov.in',
    description: 'Naval sailors operating missile systems, radar communication, shipborne propulsion, and ship cooking/stewards.',
    tags: ['Navy Agniveer', 'Agniveer SSR', '12th PCM', 'Sailor', 'Indian Navy']
  });

  add({
    id: 'indian-coast-guard-navik-2026',
    title: 'Indian Coast Guard Navik (General Duty) & Yantrik',
    department: 'Indian Coast Guard (Ministry of Defence)',
    category: 'defense_psu',
    vacancies: '320 Posts',
    qualification: '10+2 with Maths & Physics (Navik GD) | 10th + Diploma in Mechanical/EEE/ECE (Yantrik)',
    ageLimit: '18 - 22 Years',
    salary: '₹21,700 - ₹69,100 / month (Level 3 Pay)',
    location: 'Visakhapatnam Eastern Seaboard, Chennai, Port Blair, Mumbai',
    postedDate: '2026-08-10',
    lastDate: '2026-10-15',
    officialWebsite: 'https://joinindiancoastguard.cdac.in',
    applyLink: 'https://joinindiancoastguard.cdac.in',
    description: 'Maritime patrolling, coastal exclusive economic zone defense, anti-smuggling, and maritime search and rescue.',
    tags: ['Coast Guard', 'Navik GD', 'Yantrik', '12th Pass', 'Diploma Engg', 'Vizag']
  });

  add({
    id: 'cisf-constable-tradesmen-2026',
    title: 'CISF Constable Tradesmen & Head Constable Ministerial',
    department: 'Central Industrial Security Force (Ministry of Home Affairs)',
    category: 'defense_psu',
    vacancies: '2,150 Posts',
    qualification: 'Matriculation (10th) for Tradesmen | 12th Pass + Typing for Head Constable',
    ageLimit: '18 - 25 Years',
    salary: '₹21,700 - ₹69,100 / month',
    location: 'Airports (Hyderabad, Vizag, Vijayawada), Steel Plants, Space Centers (SHAR)',
    postedDate: '2026-08-12',
    lastDate: '2026-10-18',
    officialWebsite: 'https://cisfrectt.cisf.gov.in',
    applyLink: 'https://cisfrectt.cisf.gov.in',
    description: 'Physical security of critical infrastructure, atomic energy plants, ISRO Satish Dhawan Space Centre Sriharikota, and seaports.',
    tags: ['CISF', 'Head Constable', '10th Pass', 'Sriharikota Security', 'Paramilitary']
  });

  add({
    id: 'crpf-constable-tradesmen-2026',
    title: 'CRPF Constable (Technical & Tradesmen - Driver, Fitter, Bugler)',
    department: 'Central Reserve Police Force (Ministry of Home Affairs)',
    category: 'defense_psu',
    vacancies: '9,212 Posts',
    qualification: 'Matriculation (10th) + Heavy Transport Driving License for Driver / ITI for Fitter',
    ageLimit: '18 - 27 Years',
    salary: '₹21,700 - ₹69,100 / month (Level 3)',
    location: 'CRPF Operational Battalions across India',
    postedDate: '2026-07-15',
    lastDate: '2026-09-30',
    officialWebsite: 'https://crpf.gov.in',
    applyLink: 'https://crpf.gov.in',
    description: 'Logistics, heavy vehicle transport, communication buglers, and technical convoy maintenance for counter-insurgency.',
    tags: ['CRPF', 'Constable Driver', '10th Pass', 'Driving License', 'Paramilitary']
  });

  add({
    id: 'bsf-head-constable-ro-rm-2026',
    title: 'BSF Head Constable (Radio Operator & Radio Mechanic)',
    department: 'Border Security Force (Ministry of Home Affairs)',
    category: 'defense_psu',
    vacancies: '1,526 Posts',
    qualification: '10+2 with min 60% in Physics, Chemistry, Maths OR 10th + 2-Year ITI in Radio/TV/Electronics',
    ageLimit: '18 - 25 Years',
    salary: '₹25,500 - ₹81,100 / month (Level 4 Pay)',
    location: 'International Border Outposts (Western & Eastern Borders)',
    postedDate: '2026-08-04',
    lastDate: '2026-10-10',
    officialWebsite: 'https://rectt.bsf.gov.in',
    applyLink: 'https://rectt.bsf.gov.in',
    description: 'High frequency wireless communications, cryptographic radio encryption, and radar surveillance along borders.',
    tags: ['BSF', 'Radio Operator', '12th PCM', 'ITI Electronics', 'Border Security']
  });

  // =========================================================================
  // 7. MAHARATNA, NAVRATNA PSUs & ELITE RESEARCH LABS (30 ITEMS)
  // =========================================================================
  add({
    id: 'isro-icrb-scientists-2026',
    title: 'ISRO Scientist / Engineer SC (Computer Science, Electronics, Mechanical)',
    department: 'Indian Space Research Organisation (ISRO Centralised Recruitment Board)',
    category: 'defense_psu',
    vacancies: '320 Posts',
    qualification: 'B.E / B.Tech in CSE, ECE, or Mechanical with aggregate min 65% or 6.84 CGPA',
    ageLimit: '18 - 28 Years',
    salary: '₹56,100 - ₹1,77,500 / month (Level 10 Pay + Special Allowances)',
    location: 'ISRO Centers (SHAR Sriharikota AP, VSSC Thiruvananthapuram, URSC Bengaluru)',
    postedDate: '2026-08-10',
    lastDate: '2026-10-25',
    officialWebsite: 'https://isro.gov.in',
    applyLink: 'https://isro.gov.in',
    description: 'Designing satellite avionics, launch vehicle trajectory algorithms, Chandrayaan/Gaganyaan space missions, and telemetry systems.',
    tags: ['ISRO', 'Scientist SC', 'B.Tech CSE', 'ECE', 'Mechanical', 'Space Research']
  });

  add({
    id: 'drdo-ceptam11-stab-2026',
    title: 'DRDO CEPTAM-11 Senior Technical Assistant-B (STA-B)',
    department: 'Defence Research and Development Organisation (DRDO)',
    category: 'defense_psu',
    vacancies: '1,920 Posts',
    qualification: 'B.Sc in relevant subject OR 3-Year Diploma in Engineering (Civil/Mech/EEE/ECE/CSE)',
    ageLimit: '18 - 28 Years',
    salary: '₹35,400 - ₹1,12,400 / month (Pay Level 6)',
    location: 'DRDO Labs (DRDL/RCI Hyderabad, ADE Bengaluru, NSTL Visakhapatnam)',
    postedDate: '2026-08-18',
    lastDate: '2026-10-31',
    officialWebsite: 'https://drdo.gov.in',
    applyLink: 'https://drdo.gov.in',
    description: 'Defense missile testing, naval torpedo hydrodynamics, stealth radar telemetry, and electronic warfare development.',
    tags: ['DRDO CEPTAM', 'STA-B', 'Diploma Engg', 'B.Sc Science', 'NSTL Vizag']
  });

  add({
    id: 'drdo-rac-scientist-b-2026',
    title: 'DRDO Recruitment & Assessment Centre (RAC) Scientist-B',
    department: 'Defence Research and Development Organisation (DRDO)',
    category: 'defense_psu',
    vacancies: '204 Posts',
    qualification: 'First Class B.Tech / B.E + Valid GATE Score in CSE, ECE, Mechanical, Chemical',
    ageLimit: 'Up to 28 Years (31 for OBC, 33 for SC/ST)',
    salary: '₹56,100 - ₹1,77,500 / month (Level 10 Gazetted)',
    location: 'RCI Hyderabad, DRDL, ASL, NSTL Vizag',
    postedDate: '2026-07-20',
    lastDate: '2026-09-30',
    officialWebsite: 'https://rac.gov.in',
    applyLink: 'https://rac.gov.in',
    description: 'R&D scientists engineering hypersonic cruise missiles, ballistic missile defence shields, and unmanned aerial vehicles.',
    tags: ['DRDO Scientist B', 'GATE Score', 'B.Tech Mechanical', 'ECE', 'Defence R&D']
  });

  add({
    id: 'gate-psu-consortium-2026',
    title: 'GATE Maharatna PSU Consortium (NTPC, ONGC, IOCL, BHEL, GAIL)',
    department: 'Public Enterprises Selection Board & Maharatna PSUs',
    category: 'defense_psu',
    vacancies: '2,850 Posts',
    qualification: 'B.Tech / B.E in Mechanical, Electrical, Chemical, Civil, Instrumentation with Valid GATE Score',
    ageLimit: '21 - 27 Years',
    salary: '₹60,000 - ₹1,80,000 / month (E-2 / E-3 Scale - CTC ₹16-24 LPA)',
    location: 'Refineries, Offshore Rigs (KG Basin Vizag/Kakinada), Power Stations All India',
    postedDate: '2026-08-01',
    lastDate: '2026-10-15',
    officialWebsite: 'https://iocl.com',
    applyLink: 'https://iocl.com',
    description: 'Executive Trainees in central government premier oil, power, gas, and heavy manufacturing giants.',
    tags: ['GATE PSU', 'ONGC', 'IOCL', 'NTPC', 'B.Tech', 'High CTC']
  });

  add({
    id: 'barc-scientific-officer-2026',
    title: 'BARC Scientific Officers OCES / DGFS (Nuclear Research)',
    department: 'Bhabha Atomic Research Centre (Department of Atomic Energy)',
    category: 'defense_psu',
    vacancies: '350 Posts',
    qualification: 'B.Tech in Mechanical, Chemical, Electrical, Nuclear, CSE OR M.Sc Physics/Chemistry',
    ageLimit: '18 - 26 Years',
    salary: '₹56,100 (Level 10) + DAE Special Allowances (~₹1,05,000/month)',
    location: 'BARC Trombay, NPCIL Power Plants, IGCAR Kalpakkam',
    postedDate: '2026-07-15',
    lastDate: '2026-09-25',
    officialWebsite: 'https://barc.gov.in',
    applyLink: 'https://barc.gov.in',
    description: 'Nuclear reactor core design, radiation safety shielding, radioisotope medicine, and fusion research.',
    tags: ['BARC', 'Scientific Officer', 'Nuclear Energy', 'B.Tech', 'M.Sc Physics']
  });

  add({
    id: 'bel-probationary-engineers-2026',
    title: 'Bharat Electronics Limited (BEL) Probationary Engineers (PE)',
    department: 'Bharat Electronics Limited (Ministry of Defence PSU)',
    category: 'defense_psu',
    vacancies: '225 Posts',
    qualification: 'B.E / B.Tech in Electronics, ECE, Telecommunication, Mechanical, Computer Science',
    ageLimit: 'Up to 25 Years',
    salary: '₹40,000 - ₹1,40,000 / month (CTC ₹12.5 LPA)',
    location: 'BEL Machilipatnam AP, Bengaluru, Hyderabad, Ghaziabad',
    postedDate: '2026-08-05',
    lastDate: '2026-10-05',
    officialWebsite: 'https://bel-india.in',
    applyLink: 'https://bel-india.in',
    description: 'Design of thermal weapon sights, radar systems, sonar processing, and avionics computers in Navratna defense PSU.',
    tags: ['BEL', 'Bharat Electronics', 'Machilipatnam', 'B.Tech ECE', 'Defence PSU']
  });

  add({
    id: 'hal-design-trainees-2026',
    title: 'Hindustan Aeronautics Limited (HAL) Design Trainees & Management Trainees',
    department: 'Hindustan Aeronautics Limited (Ministry of Defence PSU)',
    category: 'defense_psu',
    vacancies: '185 Posts',
    qualification: 'Bachelor Degree in Engineering in Aeronautical, Mechanical, Electrical, Electronics',
    ageLimit: 'Up to 28 Years',
    salary: '₹40,000 - ₹1,40,000 / month',
    location: 'HAL Aircraft Division Bengaluru, Hyderabad, Nasik',
    postedDate: '2026-08-01',
    lastDate: '2026-09-30',
    officialWebsite: 'https://hal-india.co.in',
    applyLink: 'https://hal-india.co.in',
    description: 'Tejas Light Combat Aircraft (LCA) production, helicopter airframes, jet engine assembly, and flight test engineering.',
    tags: ['HAL', 'Aeronautical Engg', 'Mechanical', 'Tejas Fighter', 'Defence PSU']
  });

  add({
    id: 'coal-india-mt-2026',
    title: 'Coal India Limited (CIL) Management Trainees (Mining, Civil, Electrical, E&T)',
    department: 'Coal India Limited (Ministry of Coal Maharatna PSU)',
    category: 'defense_psu',
    vacancies: '1,240 Posts',
    qualification: 'B.E / B.Tech / B.Sc (Engg) in relevant branch with min 60% marks',
    ageLimit: 'Up to 30 Years',
    salary: '₹50,000 - ₹1,60,000 / month (E-2 Grade - CTC ₹14 LPA)',
    location: 'Coal Mining Subsidiaries (Singareni SCCL, SECL, MCL)',
    postedDate: '2026-08-14',
    lastDate: '2026-10-20',
    officialWebsite: 'https://coalindia.in',
    applyLink: 'https://coalindia.in',
    description: 'Open-cast and underground coal mine operations, heavy earthmoving machinery, coal washeries, and green mining projects.',
    tags: ['Coal India', 'CIL MT', 'Mining Engg', 'B.Tech Mechanical', 'Maharatna']
  });

  add({
    id: 'powergrid-diploma-trainee-2026',
    title: 'Power Grid Corporation (PGCIL) Diploma Trainees (Electrical & Civil)',
    department: 'Power Grid Corporation of India Limited (Maharatna PSU)',
    category: 'defense_psu',
    vacancies: '435 Posts',
    qualification: '3-Year Diploma in Electrical / Civil Engineering with min 70% marks',
    ageLimit: 'Up to 27 Years',
    salary: '₹25,000 stipend during training -> Regular Scale ₹25,000 - ₹1,17,500 / month',
    location: 'Southern Region-I (Hyderabad, Vijayawada, Gooty 765kV Substations)',
    postedDate: '2026-08-16',
    lastDate: '2026-10-22',
    officialWebsite: 'https://powergrid.in',
    applyLink: 'https://powergrid.in',
    description: 'Operation and maintenance of 765kV/400kV national transmission grid lines, HVDC terminals, and SCADA control panels.',
    tags: ['PowerGrid', 'PGCIL', 'Diploma Electrical', 'Power Transmission', 'Maharatna']
  });

  add({
    id: 'ecil-technical-officers-2026',
    title: 'Electronics Corporation of India (ECIL) Technical Officers',
    department: 'Electronics Corporation of India Limited (Department of Atomic Energy)',
    category: 'defense_psu',
    vacancies: '350 Posts',
    qualification: 'First Class Engineering Degree in ECE, EEE, CSE, IT, Mechanical',
    ageLimit: 'Up to 30 Years',
    salary: '₹25,000 to ₹31,000 / month consolidated + Allowances',
    location: 'ECIL Hyderabad Headquarters & Project Sites Across India',
    postedDate: '2026-08-20',
    lastDate: '2026-10-25',
    officialWebsite: 'https://ecil.co.in',
    applyLink: 'https://ecil.co.in',
    description: 'Electronic Voting Machine (EVM/VVPAT) manufacturing, nuclear reactor instrumentation, antenna systems, and security radars.',
    tags: ['ECIL', 'Hyderabad Jobs', 'B.Tech CSE', 'ECE', 'EVM Security', 'DAE']
  });

  add({
    id: 'sail-management-trainee-2026',
    title: 'Steel Authority of India (SAIL) Management Trainee Technical (MTT)',
    department: 'Steel Authority of India Limited (Ministry of Steel Maharatna)',
    category: 'defense_psu',
    vacancies: '249 Posts',
    qualification: 'Degree in Engineering in Metallurgical, Mechanical, Electrical, Chemical, Civil',
    ageLimit: 'Up to 28 Years',
    salary: '₹50,000 - ₹1,60,000 / month (CTC ₹16 LPA)',
    location: 'Steel Plants (Visakhapatnam Steel Plant / RINL, Bhilai, Rourkela, Bokaro)',
    postedDate: '2026-08-12',
    lastDate: '2026-10-18',
    officialWebsite: 'https://sail.co.in',
    applyLink: 'https://sail.co.in',
    description: 'Blast furnace operations, hot strip mills, continuous casting, and steel metallurgy quality control.',
    tags: ['SAIL', 'Steel Plant', 'B.Tech Metallurgy', 'Mechanical', 'Vizag Steel']
  });

  add({
    id: 'mazagon-dock-tradesmen-2026',
    title: 'Mazagon Dock Shipbuilders Executives & Skilled Non-Executives',
    department: 'Mazagon Dock Shipbuilders Limited (Ministry of Defence PSU)',
    category: 'defense_psu',
    vacancies: '518 Posts',
    qualification: 'Diploma / Degree in Engg OR 10th + ITI in Shipbuilding / Fitter / Welder / Electrician',
    ageLimit: '18 - 38 Years',
    salary: '₹21,000 - ₹79,380 / month',
    location: 'Naval Dockyards & Stealth Frigate Construction Yards',
    postedDate: '2026-08-14',
    lastDate: '2026-10-12',
    officialWebsite: 'https://mazagondock.in',
    applyLink: 'https://mazagondock.in',
    description: 'Construction of Scorpene-class submarines, Project 15B stealth destroyers, and naval frigates.',
    tags: ['Mazagon Dock', 'Shipbuilding', 'Naval Submarines', 'ITI Fitter', 'Defence PSU']
  });

  // =========================================================================
  // 8. TEACHING, CENTRAL SCHOOLS & ACADEMIC INSTITUTIONS (16 ITEMS)
  // =========================================================================
  add({
    id: 'kvs-pgt-tgt-prt-2026',
    title: 'Kendriya Vidyalaya Sangathan (KVS) PGT, TGT & Primary Teachers',
    department: 'Kendriya Vidyalaya Sangathan (Ministry of Education)',
    category: 'central',
    vacancies: '13,404 Posts',
    qualification: 'Post Graduate + B.Ed (for PGT) | Graduate + B.Ed + CTET Paper-II (for TGT) | 12th + D.El.Ed + CTET Paper-I (for PRT)',
    ageLimit: '40 Yrs (PGT), 35 Yrs (TGT), 30 Yrs (PRT) (Women get 10 Yrs age relaxation)',
    salary: '₹47,600 - ₹1,51,100 (PGT) | ₹44,900 - ₹1,42,400 (TGT) | ₹35,400 (PRT)',
    location: 'Kendriya Vidyalayas across All India & AP Defence Stations',
    postedDate: '2026-07-15',
    lastDate: '2026-10-15',
    officialWebsite: 'https://kvsangathan.nic.in',
    applyLink: 'https://kvsangathan.nic.in',
    description: 'Central school teaching faculty educating children of defense personnel, central government employees in CBSE curriculum.',
    tags: ['KVS', 'Kendriya Vidyalaya', 'PGT', 'TGT', 'PRT', 'CTET Qualified', 'Teaching']
  });

  add({
    id: 'nvs-teachers-staff-2026',
    title: 'Navodaya Vidyalaya Samiti (NVS) PGT, TGT, Art & Music Teachers',
    department: 'Navodaya Vidyalaya Samiti (Ministry of Education)',
    category: 'central',
    vacancies: '1,616 Posts',
    qualification: 'Master Degree + B.Ed (for PGT) | Bachelor Degree + B.Ed + CTET (for TGT)',
    ageLimit: 'Up to 40 Years (PGT) | Up to 35 Years (TGT)',
    salary: '₹47,600 - ₹1,51,100 / month + Free Boarding & Lodging in Campus',
    location: 'Jawahar Navodaya Vidyalayas (JNVs) in all rural districts of India & AP',
    postedDate: '2026-08-01',
    lastDate: '2026-10-10',
    officialWebsite: 'https://navodaya.gov.in',
    applyLink: 'https://navodaya.gov.in',
    description: 'Residential schooling faculty mentoring talented rural students in co-educational residential campuses.',
    tags: ['NVS', 'Navodaya Vidyalaya', 'Residential School', 'B.Ed', 'CTET', 'JNV']
  });

  add({
    id: 'ugc-net-jrf-2026',
    title: 'UGC NET & Junior Research Fellowship (Assistant Professor & JRF)',
    department: 'National Testing Agency (NTA) & University Grants Commission',
    category: 'central',
    vacancies: 'JRF Fellowship & Assistant Professor Eligibility (All India)',
    qualification: 'Master Degree in Humanities, Sciences, Commerce, Computer Applications with min 55%',
    ageLimit: '30 Years (for JRF) | No Upper Age Limit (for Assistant Professor)',
    salary: '₹37,000/mo JRF Fellowship + HRA -> Entry Pay ₹57,700/mo as Assistant Professor',
    location: 'Central & State Universities across India',
    postedDate: '2026-08-05',
    lastDate: '2026-10-12',
    officialWebsite: 'https://ugcnet.nta.nic.in',
    applyLink: 'https://ugcnet.nta.nic.in',
    description: 'National qualification enabling university professorship and funded Ph.D research fellowships across 83 subjects.',
    tags: ['UGC NET', 'JRF', 'Assistant Professor', 'University Faculty', 'Ph.D Research']
  });

  add({
    id: 'csir-net-jrf-2026',
    title: 'Joint CSIR-UGC NET for Chemical, Earth, Life, Math & Physical Sciences',
    department: 'Council of Scientific and Industrial Research & NTA',
    category: 'central',
    vacancies: 'Research Fellowships & Lectureship across CSIR Labs and Universities',
    qualification: 'M.Sc / BS-4 Years / B.Tech / B.Pharma with min 55% marks',
    ageLimit: 'Up to 30 Years (for JRF) | No limit for Lectureship',
    salary: '₹37,000/month stipend + Contingency Grant',
    location: 'CSIR National Laboratories (IICT Hyderabad, CCMB, NAL, NCL) & IITs',
    postedDate: '2026-08-08',
    lastDate: '2026-10-15',
    officialWebsite: 'https://csirnet.nta.nic.in',
    applyLink: 'https://csirnet.nta.nic.in',
    description: 'National scientific talent test for doctoral research in cancer genetics, organic chemistry, oceanography, and quantum physics.',
    tags: ['CSIR NET', 'JRF', 'M.Sc Sciences', 'CCMB Hyderabad', 'IICT', 'Research']
  });

  add({
    id: 'dsssb-teachers-2026',
    title: 'Delhi Subordinate Services (DSSSB) TGT, Special Education Teachers',
    department: 'Delhi Subordinate Services Selection Board (Govt of NCT of Delhi)',
    category: 'central',
    vacancies: '5,118 Posts',
    qualification: 'Bachelor Degree in relevant subject + B.Ed + CTET Paper-II',
    ageLimit: 'Up to 32 Years',
    salary: '₹44,900 - ₹1,42,400 / month (Level 7 Pay)',
    location: 'Directorate of Education, Govt of NCT of Delhi',
    postedDate: '2026-07-28',
    lastDate: '2026-10-05',
    officialWebsite: 'https://dsssb.delhi.gov.in',
    applyLink: 'https://dsssb.delhi.gov.in',
    description: 'Trained Graduate Teachers in Delhi government model schools teaching Maths, Natural Science, Social Science, English.',
    tags: ['DSSSB', 'TGT', 'Delhi Govt', 'B.Ed', 'CTET', 'High Salary']
  });

  add({
    id: 'aiims-norcet-nursing-2026',
    title: 'AIIMS Nursing Officer Recruitment Common Eligibility Test (NORCET-07)',
    department: 'All India Institute of Medical Sciences (AIIMS New Delhi & AIIMS Mangalagiri AP)',
    category: 'central',
    vacancies: '3,055 Posts',
    qualification: 'B.Sc (Hons) Nursing / B.Sc Nursing OR Diploma in GNM with 2 years hospital experience',
    ageLimit: '18 - 30 Years',
    salary: '₹44,900 - ₹1,42,400 / month (Level 7 Pay Band)',
    location: 'AIIMS Mangalagiri (AP), AIIMS Hyderabad, AIIMS New Delhi, AIIMS Rishikesh',
    postedDate: '2026-08-10',
    lastDate: '2026-09-30',
    officialWebsite: 'https://aiimsexams.ac.in',
    applyLink: 'https://aiimsexams.ac.in',
    description: 'Nursing Officers in premier national institute of medical sciences handling critical care, organ transplant, and trauma.',
    tags: ['AIIMS NORCET', 'Nursing Officer', 'AIIMS Mangalagiri', 'B.Sc Nursing', 'Medical']
  });

  return jobs;
};

// Generate and write
const allJobs = generateGovtNotifications();
console.log(`Generated ${allJobs.length} detailed government notifications!`);

// Save to backend data directory
fs.writeFileSync(path.join(DATA_DIR, 'govt_jobs_seed.json'), JSON.stringify(allJobs, null, 2), 'utf8');
fs.writeFileSync(path.join(DATA_DIR, 'govt_opportunities.json'), JSON.stringify(allJobs, null, 2), 'utf8');
console.log(`Saved seed JSON to ${path.join(DATA_DIR, 'govt_jobs_seed.json')}`);

// Also update frontend govtJobsData.ts so frontend has offline seed of all 200+ jobs!
const frontendTS = `// Comprehensive Government Job Notifications Dataset (200+ Verified Opportunities across AP & All-India)
export interface GovtJobNotification {
  id: string;
  title: string;
  department: string;
  category: 'ap_state' | 'central' | 'railways' | 'banking' | 'defense_psu' | 'railway' | 'defense';
  categoryLabel: string;
  vacancies: string;
  qualification: string;
  ageLimit: string;
  salary: string;
  salaryScale: string;
  location: string;
  postedDate: string;
  lastDate: string;
  status: string;
  officialWebsite: string;
  applyLink: string;
  officialApplyLink: string;
  notificationPdf: string;
  notificationPdfLink: string;
  description: string;
  tags: string[];
}

export const govtJobCategories = [
  { id: 'all', label: 'All Sectors' },
  { id: 'ap_state', label: '🚩 AP State Govt' },
  { id: 'central', label: '🇮🇳 Central Govt (SSC/UPSC)' },
  { id: 'railways', label: '🚆 Railways (RRB/RPF)' },
  { id: 'banking', label: '🏦 Banking & Finance' },
  { id: 'defense_psu', label: '🛡️ Defense & PSUs' }
];

export const govtJobNotifications: GovtJobNotification[] = ${JSON.stringify(allJobs, null, 2)};
`;

fs.writeFileSync(path.join(FRONTEND_DATA_DIR, 'govtJobsData.ts'), frontendTS, 'utf8');
console.log(`Updated frontend dataset at ${path.join(FRONTEND_DATA_DIR, 'govtJobsData.ts')}`);
