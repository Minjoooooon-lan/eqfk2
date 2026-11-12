export default {
  id: 'ch1',
  number: 1,
  title: 'The Starting Line',
  years: '2026',
  theme: 'First commitments',
  art: 'start',
  start: 'a',
  nodes: {
    a: {
      title: 'The Starting Line',
      year: '2026',
      location: 'Your hometown',
      art: 'start',
      blocks: [
        {
          type: 'scene',
          text: 'It is September 2026. You are nineteen, sharing a flat with two people who never wash up, and every family dinner ends with the same question: so what are you actually going to do?',
        },
        {
          type: 'dialogue',
          speaker: 'Maya',
          role: 'friend since school',
          text: 'Three things landed this week. A paid internship at Northwind. My cousin needs a third body for his startup. And you could stop talking and build the thing you keep sketching on napkins.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'You get one term before a choice turns into a habit. Pick whatever teaches you the most per month — not the one that looks best on a form. And finish something, even something small.',
        },
        {
          type: 'beat',
          text: 'You have four days before one of these doors closes.',
        },
      ],
      choices: [
        {
          id: 'internship',
          label: 'Take the paid internship at Northwind',
          hint: 'Stable money, real deadlines, unglamorous tickets. Nobody will be impressed, but you will learn how work actually works.',
          tone: 'steady',
          effects: {
            stats: { resources: 9, mastery: 5, reputation: 4, network: 3 },
            skills: { craft: 2, systems: 1 },
            flags: { earlyInternship: true },
          },
          timeline: { year: '2026', label: 'Signed with Northwind', note: 'A badge, a desk, and a ticket queue older than you are.' },
          outcome: {
            title: 'A badge and a desk',
            text: 'Your first week is 40 hours of reading documentation nobody updated. By Friday you have closed two tickets and learned that being useful beats being impressive.',
          },
          next: 'b_intern',
        },
        {
          id: 'startup',
          label: "Join your friend's scrappy startup",
          hint: 'Equity worth nothing yet. Learning worth a lot. No salary guarantee and absolutely no process.',
          tone: 'risky',
          effects: {
            stats: { network: 8, resilience: 7, mastery: 3, resources: -5 },
            skills: { product: 3, communication: 2 },
            flags: { startupSeed: true },
          },
          timeline: { year: '2026', label: 'Joined a three-person startup', note: 'Equity on a napkin and a Slack channel called #ship-it.' },
          outcome: {
            title: 'Three laptops and a borrowed room',
            text: 'There is no onboarding, so you invent your own. You learn more in six weeks than in a year of lectures, and you sleep badly the entire time.',
          },
          next: 'b_startup',
        },
        {
          id: 'project',
          label: 'Spend the term building your own project',
          hint: 'No salary, no manager, total ownership. You will find out whether you can motivate yourself.',
          tone: 'bold',
          effects: {
            stats: { mastery: 9, impact: 5, resources: -6, network: -2 },
            skills: { craft: 3, systems: 2 },
            flags: { deepProject: true },
          },
          timeline: { year: '2026', label: 'Went independent', note: 'Nights and weekends on something completely your own.' },
          outcome: {
            title: 'Nights and weekends',
            text: 'No one asks for progress updates, which is both the freedom and the trap. You ship v0.1 at 2am and stare at it like it might bite.',
          },
          next: 'b_project',
        },
      ],
    },

    b_intern: {
      title: 'The Ticket Queue',
      year: '2026',
      location: 'Northwind, floor 4',
      art: 'office',
      blocks: [
        { type: 'scene', text: 'Northwind gives you a laptop, a badge, and a mentor who answers exactly one question per day.' },
        {
          type: 'dialogue',
          speaker: 'Team lead',
          role: 'your manager',
          text: 'Nobody expects brilliance in month one. We expect the queue to move. If you finish early, ask for the project nobody wants.',
        },
      ],
      choices: [
        {
          id: 'grind',
          label: 'Grind the queue and become the reliable one',
          hint: 'Slow, invisible, and it compounds. People start trusting you with things that matter.',
          effects: {
            stats: { reputation: 7, resilience: 4, mastery: 4 },
            skills: { craft: 2, systems: 1 },
            flags: { reliableOperator: true },
          },
          outcome: {
            title: 'The person who closes things',
            text: 'By March your name is the one people write next to "this will actually get done". It is not glamorous. It is leverage.',
          },
          next: 'close',
        },
        {
          id: 'unwanted',
          label: 'Ask for the project nobody wants',
          hint: 'High risk, high visibility. If it fails, it fails loudly with your name on it.',
          effects: {
            stats: { mastery: 6, reputation: 3, resilience: 5, resources: 2 },
            skills: { systems: 3, craft: 1 },
            flags: { askedForMore: true },
          },
          outcome: {
            title: 'The migration nobody volunteered for',
            text: 'Three weeks of thankless work and one very boring presentation. Two people in that room remember your name afterwards, and one of them is a director.',
          },
          next: 'close',
        },
        {
          id: 'automate',
          label: 'Automate your own job in the first month',
          hint: 'You will look brilliant or reckless, depending on how much you test it.',
          effects: {
            stats: { mastery: 7, resources: 3, reputation: 2 },
            skills: { craft: 3, systems: 2 },
            flags: { automator: true },
          },
          outcome: {
            title: 'Six hours back',
            text: 'Your script removes most of the queue. Your manager is delighted for a week, then mildly alarmed that only you understand it.',
          },
          next: 'close',
        },
      ],
    },

    b_startup: {
      title: 'Ship-It Week',
      year: '2026',
      location: 'A borrowed room above a laundrette',
      art: 'startup',
      blocks: [
        { type: 'scene', text: 'The startup is three laptops, one whiteboard, and a Slack channel called #ship-it that has 400 messages and zero customers.' },
        {
          type: 'dialogue',
          speaker: 'Dara',
          role: 'co-founder, your friend',
          text: 'We launch in three weeks or we run out of money. I know it is not ready. Nothing is ever ready. What do you want to do?',
        },
      ],
      choices: [
        {
          id: 'ship',
          label: 'Ship in three weeks, whatever breaks',
          hint: 'Real users, real feedback, real embarrassment. Momentum is the only currency you have.',
          effects: {
            stats: { network: 6, resilience: 6, reputation: -2, mastery: 3 },
            skills: { product: 3, communication: 2 },
            flags: { shippedFast: true },
          },
          outcome: {
            title: 'Forty users and one outage',
            text: 'The launch is messy and the site goes down for two hours. But eleven people sign up twice, which means the thing you made is not nothing.',
          },
          next: 'close',
        },
        {
          id: 'polish',
          label: 'Push back and ask for three more months',
          hint: 'You will lose the runway argument and possibly a co-founder, but the work will be solid.',
          effects: {
            stats: { mastery: 7, reputation: 4, network: -3, resilience: 2 },
            skills: { craft: 2, systems: 2 },
            flags: { polished: true },
          },
          outcome: {
            title: 'Slower, and better built',
            text: 'Dara is furious for a week, then agrees you were right about one thing: the thing does not fall over anymore. You launch late to a smaller, kinder audience.',
          },
          next: 'close',
        },
        {
          id: 'customers',
          label: 'Own every customer conversation yourself',
          hint: 'The product gets less polish and the roadmap gets much better.',
          effects: {
            stats: { network: 8, impact: 4, mastery: 2 },
            skills: { communication: 3, product: 2 },
            flags: { talkedToUsers: true },
          },
          outcome: {
            title: 'Twelve calls, one pattern',
            text: 'By the sixth call you can predict what people will complain about. By the twelfth you have deleted half the roadmap and nobody misses it.',
          },
          next: 'close',
        },
      ],
    },

    b_project: {
      title: 'The Thing You Keep Sketching',
      year: '2026',
      location: 'Your room, 1am',
      art: 'desk',
      blocks: [
        { type: 'scene', text: 'You build at night. The project is genuinely yours: {{artifact}}, no committee, no deadline, nobody to blame.' },
        {
          type: 'dialogue',
          speaker: 'Maya',
          role: 'friend since school',
          text: 'It is good. It is also invisible. Nobody will ever know it exists unless you decide to show someone.',
        },
      ],
      choices: [
        {
          id: 'open',
          label: 'Open-source it and write publicly about it',
          hint: 'You will get feedback, some of it unkind, and a small audience that compounds.',
          effects: {
            stats: { network: 7, reputation: 5, mastery: 4, resilience: 2 },
            skills: { communication: 3, craft: 2 },
            flags: { openSource: true },
          },
          outcome: {
            title: 'Two hundred stars and a stranger in Berlin',
            text: 'Someone files a bug you cannot reproduce, then sends a fix. It is the first time a stranger has cared about your work, and it changes how you build.',
          },
          next: 'close',
        },
        {
          id: 'private',
          label: 'Keep it private and go deeper',
          hint: 'No audience, no noise. The craft gets sharp and nobody validates it.',
          effects: {
            stats: { mastery: 9, impact: 4, network: -2 },
            skills: { systems: 3, craft: 2 },
            flags: { deepCraft: true },
          },
          outcome: {
            title: 'Quietly very good',
            text: 'You rewrite it three times. The third version is something you would be proud to explain line by line — and only three people have ever seen it.',
          },
          next: 'close',
        },
        {
          id: 'sell',
          label: 'Try to turn it into a paid product',
          hint: 'The fastest way to learn what people will actually pay for.',
          effects: {
            stats: { resources: 6, mastery: 3, resilience: 4, reputation: 2 },
            skills: { product: 3, finance: 2 },
            flags: { sideIncome: true },
          },
          outcome: {
            title: 'Your first £40 from a stranger',
            text: 'Nine people say they would pay. One actually does. That single payment teaches you more about value than any course.',
          },
          next: 'close',
        },
      ],
    },

    close: {
      title: 'End of 2026',
      year: '2026',
      location: 'December',
      art: 'close',
      blocks: [
        {
          type: 'scene',
          text: 'December. You are not where you thought you would be, and you know more than you did in September. Ten years is a long time. It starts with what you do next.',
        },
      ],
      choices: [
        {
          id: 'continue',
          label: 'Step into 2027',
          hint: 'The learning gets serious now.',
          effects: {},
          next: '__chapter_end__',
        },
      ],
    },
  },
};
