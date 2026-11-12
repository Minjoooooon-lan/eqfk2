/**
 * Career catalog.
 *
 * Each career supplies the vocabulary the story uses through tokens like
 * {{craft}}, {{entryRole}} or {{artifact}}, so one authored story reads
 * naturally for every profession.
 */
export const CAREERS = [
  {
    id: 'software-engineer',
    label: 'Software Engineer',
    monogram: 'SE',
    accent: '#4ea1ff',
    tagline: 'Build the systems everything else runs on.',
    blurb:
      'You like making things that work, and you are stubborn about details nobody else notices. Software rewards that stubbornness.',
    entryRole: 'junior developer',
    craft: 'writing code',
    artifact: 'a feature real people depend on',
    team: 'a five-person product squad',
    tool: 'a code editor and a deploy pipeline',
    field: 'software',
    focus: ['craft', 'systems'],
    mentor: { name: 'Priya Raman', role: 'staff engineer' },
    demand2036:
      'AI writes more of the boilerplate, so the value shifts to judgement: system design, reliability, and knowing what not to build.',
  },
  {
    id: 'product-designer',
    label: 'Product Designer',
    monogram: 'PD',
    accent: '#ff8a5c',
    tagline: 'Turn messy human needs into something usable.',
    blurb:
      'You notice when a screen makes someone feel stupid. That instinct is the job — the rest is craft you can learn.',
    entryRole: 'junior product designer',
    craft: 'shaping interfaces',
    artifact: 'an interface someone uses without a manual',
    team: 'a product trio with an engineer and a researcher',
    tool: 'a design file and a clickable prototype',
    field: 'design',
    focus: ['craft', 'product'],
    mentor: { name: 'Jonah Weiss', role: 'design director' },
    demand2036:
      'Generated screens are cheap, so taste and research become the differentiator. Designers who can defend a decision with evidence win the room.',
  },
  {
    id: 'data-scientist',
    label: 'Data & AI Scientist',
    monogram: 'DA',
    accent: '#8b7cff',
    tagline: 'Find the signal before anyone else does.',
    blurb:
      'You ask questions other people avoid because the answer might be inconvenient. That is exactly the job description.',
    entryRole: 'junior data analyst',
    craft: 'modelling messy data',
    artifact: 'a model that changes a real decision',
    team: 'a research pod inside a bigger org',
    tool: 'a notebook, a warehouse and too many half-finished queries',
    field: 'data',
    focus: ['craft', 'systems'],
    mentor: { name: 'Dr. Ade Salami', role: 'principal research scientist' },
    demand2036:
      'Models are commoditised; evaluation, data quality and knowing which question matters are not. Expect to be judged on decisions, not notebooks.',
  },
  {
    id: 'doctor',
    label: 'Doctor (Medicine)',
    monogram: 'MD',
    accent: '#38d39f',
    tagline: 'Long training, high stakes, real people.',
    blurb:
      'You want your work to matter to a specific person on a specific day. Medicine asks for a decade of patience in exchange.',
    entryRole: 'junior doctor',
    craft: 'clinical reasoning',
    artifact: 'a treatment plan that fits one real patient',
    team: 'a ward team on a twelve-hour shift',
    tool: 'a stethoscope, a chart and a bleep that never stops',
    field: 'health',
    focus: ['craft', 'resilience'],
    mentor: { name: 'Dr. Lena Ortiz', role: 'consultant physician' },
    demand2036:
      'Diagnostic AI becomes a colleague, not a replacement. The scarce skill is judgement under uncertainty, plus explaining it to a frightened person.',
  },
  {
    id: 'entrepreneur',
    label: 'Founder / Entrepreneur',
    monogram: 'FX',
    accent: '#ffd166',
    tagline: 'Own the whole problem, including the risk.',
    blurb:
      'You would rather be wrong in public than bored in private. Founding is a fast, unforgiving way to learn what you actually believe.',
    entryRole: 'solo founder',
    craft: 'building a venture',
    artifact: 'a product with users who would miss it',
    team: 'two co-founders and a lot of contractors',
    tool: 'a landing page, a spreadsheet and pure nerve',
    field: 'business',
    focus: ['product', 'network'],
    mentor: { name: 'Ravi Menon', role: 'second-time founder' },
    demand2036:
      'Small teams reach global markets faster than ever, which makes distribution and trust the bottleneck. Most funding conversations now start with retention data.',
  },
  {
    id: 'teacher',
    label: 'Teacher / Educator',
    monogram: 'TE',
    accent: '#5eead4',
    tagline: 'Change the odds for thirty people at a time.',
    blurb:
      'You remember the teacher who saw you. You want to be that for someone else, and you are willing to do the unglamorous work behind it.',
    entryRole: 'newly qualified teacher',
    craft: 'teaching',
    artifact: 'a unit your students still quote years later',
    team: 'a department of six and one very tired head of year',
    tool: 'a lesson plan, a whiteboard and thirty opinions',
    field: 'education',
    focus: ['communication', 'leadership'],
    mentor: { name: 'Ms. Adaeze Bello', role: 'head of department' },
    demand2036:
      'Tutoring bots handle practice; humans handle motivation, belonging and the messy pastoral work. Hybrid teaching roles are where the interesting jobs are.',
  },
  {
    id: 'climate-engineer',
    label: 'Climate & Energy Engineer',
    monogram: 'CE',
    accent: '#7ee787',
    tagline: 'Engineer the part of the future that has to work.',
    blurb:
      'You like numbers that show up on a bill and in an atmosphere. Climate work is slow, physical and quietly urgent.',
    entryRole: 'junior energy engineer',
    craft: 'engineering systems',
    artifact: 'a retrofit that cuts real emissions',
    team: 'a project team split between an office and a site',
    tool: 'a thermal model and a clipboard',
    field: 'climate',
    focus: ['craft', 'impact'],
    mentor: { name: 'Dr. Ines Haddad', role: 'grid systems lead' },
    demand2036:
      'Grid flexibility and industrial heat are the hard problems now. Permits and politics still decide more projects than physics does.',
  },
  {
    id: 'finance-analyst',
    label: 'Finance & Investing',
    monogram: 'FI',
    accent: '#f78fb3',
    tagline: 'Decide where the money and the risk should go.',
    blurb:
      'You are comfortable being the person who asks what this costs. Numbers are how you argue; judgement is how you get believed.',
    entryRole: 'junior analyst',
    craft: 'financial analysis',
    artifact: 'an investment memo people act on',
    team: 'a deal team of four',
    tool: 'three spreadsheets that disagree with each other',
    field: 'finance',
    focus: ['finance', 'systems'],
    mentor: { name: 'Marcus Cole', role: 'portfolio manager' },
    demand2036:
      'Cheap analysis means the job moves up the stack: allocation, risk narratives and explaining your own model to a sceptical room.',
  },
  {
    id: 'writer-media',
    label: 'Writer / Media Producer',
    monogram: 'WM',
    accent: '#ffa1c4',
    tagline: 'Make people care about something for ten minutes.',
    blurb:
      'You collect sentences and situations and turn them into something other people feel. Distribution is the hard part now.',
    entryRole: 'junior producer',
    craft: 'storytelling',
    artifact: 'a story people share without being asked',
    team: 'a small editorial team with a brutal deadline',
    tool: 'a script, a rough cut and a publishing schedule',
    field: 'media',
    focus: ['communication', 'network'],
    mentor: { name: 'Elias Ward', role: 'executive producer' },
    demand2036:
      'Synthetic content floods every feed, so trusted voice and original reporting get scarcer and more valuable. Owning an audience beats renting one.',
  },
];

export const CAREER_MAP = Object.fromEntries(CAREERS.map((c) => [c.id, c]));

export function getCareer(id) {
  return CAREER_MAP[id] || null;
}

export function listCareers() {
  return CAREERS.map(({ mentor, ...rest }) => ({ ...rest, mentorName: mentor.name, mentorRole: mentor.role }));
}
