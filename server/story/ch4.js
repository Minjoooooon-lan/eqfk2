export default {
  id: 'ch4',
  number: 4,
  title: 'The Opportunity',
  years: '2030',
  theme: 'Betting on yourself',
  art: 'opportunity',
  start: 'a',
  nodes: {
    a: {
      title: 'The Door That Opens',
      year: '2030',
      location: 'An email you read three times',
      art: 'opportunity',
      blocks: [
        {
          type: 'scene',
          text: '2030. You are good enough that opportunities start finding you. Not many — one real one, and it arrives on a Tuesday with an absurd deadline.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'Say yes to the thing that makes you slightly sick with nerves, and no to the thing that only flatters you. And whatever you choose, protect your sleep. Burnout is not a badge.',
        },
      ],
      variants: [
        {
          when: { flag: 'openSource' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Programme chair',
              role: 'conference organiser',
              text: 'Your open-source work has a following. We have a thirty-minute keynote slot in October. It is yours if you want it.',
            },
          ],
        },
        {
          when: { flag: 'sideIncome' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Investor',
              role: 'on a video call',
              text: 'You have paying customers and no burn rate. That is rarer than you think. If you go full-time, we would like to talk about a small cheque.',
            },
          ],
        },
        {
          when: { flag: 'bigCompany' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Director',
              role: 'two levels above you',
              text: 'We are starting a new group and I want you to run the technical side of it. It is a title bump, a lot more exposure, and considerably more politics.',
            },
          ],
        },
        {
          when: { flag: 'freelance' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Client',
              role: 'who pays on time',
              text: 'We want you embedded with our team for a year. Twice your current rate, less freedom, and a real seat at the table.',
            },
          ],
        },
        {
          when: { flag: 'earlyStartup' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Founder',
              role: 'your boss',
              text: 'We raised. There is a lead role in it for you, plus options. It also means the next year is going to be brutal.',
            },
          ],
        },
      ],
      choices: [
        {
          id: 'allin',
          label: 'Go all in on the opportunity',
          hint: 'Maximum upside, maximum exposure, no safety net. Your life narrows for a year.',
          tone: 'bold',
          effects: {
            stats: { mastery: 8, reputation: 9, network: 7, resilience: -4, resources: -3 },
            skills: { craft: 2, leadership: 2, communication: 1 },
            flags: { wentAllIn: true },
          },
          timeline: { year: '2030', label: 'Bet on the big opportunity', note: 'Everything else got quieter for a year.' },
          outcome: {
            title: 'A year with one priority',
            text: 'You say yes and cancel almost everything else. It works, mostly. You also miss two weddings and start sleeping badly in November.',
          },
          next: 'b',
        },
        {
          id: 'hybrid',
          label: 'Take it, but keep the rest of your life intact',
          hint: 'Slower growth, better endurance. You will not be the person who sacrificed everything.',
          tone: 'balanced',
          effects: {
            stats: { mastery: 5, reputation: 4, resilience: 6, impact: 4 },
            skills: { leadership: 1, systems: 2, communication: 1 },
            flags: { keptBalance: true },
          },
          timeline: { year: '2030', label: 'Took the opportunity on your own terms', note: 'Four days a week of ambition, three of life.' },
          outcome: {
            title: 'Four days of ambition',
            text: 'You negotiate scope instead of hours. The work moves slower than it could, and you are still functioning in December, which turns out to be a competitive advantage.',
          },
          next: 'b',
        },
        {
          id: 'decline',
          label: 'Decline and go deeper on your craft',
          hint: 'You trade visibility for mastery. Some doors close quietly.',
          tone: 'steady',
          effects: {
            stats: { mastery: 10, impact: 5, network: -4, reputation: -1 },
            skills: { craft: 3, systems: 2 },
            flags: { choseDepth: true },
          },
          timeline: { year: '2030', label: 'Chose depth over exposure', note: 'Said no to the visible thing.' },
          outcome: {
            title: 'The quiet, excellent year',
            text: 'You spend the year on work only a handful of people can evaluate. Your craft jumps. Your name stops coming up in rooms you are not in.',
          },
          next: 'b',
        },
      ],
    },

    b: {
      title: 'Designing the Life Around It',
      year: '2031',
      location: 'A spreadsheet at the kitchen table',
      art: 'budget',
      blocks: [
        {
          type: 'scene',
          text: '2031. The work is real now, and so is the cost of it. You have one hundred units of capacity a month — time, attention and money all competing for the same pool.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'Most people do not burn out from too much work. They burn out from too little recovery and no honest accounting. Allocate on purpose.',
        },
      ],
      minigame: {
        id: 'budget-2031',
        type: 'budget',
        title: 'One Hundred Units',
        skill: 'finance',
        brief: 'Spend 100 units across five areas. Anything at zero will quietly cost you later.',
        next: 'c',
        config: { total: 100, minimums: { health: 15, craft: 20, money: 10 } },
        grades: {
          S: {
            effects: {
              stats: { resilience: 9, resources: 6, mastery: 5, impact: 3 },
              skills: { finance: 3, systems: 1 },
              flags: { sustainableRhythm: true },
              achievements: [
                { id: 'designed-a-life', title: 'Designed a life, not just a career', blurb: 'Built a rhythm that could survive a decade.' },
              ],
            },
            outcome: {
              title: 'A rhythm you can hold',
              text: 'Nothing is starved. The year is not thrilling, but in December you still like the work and the people in your life still call you.',
            },
          },
          A: {
            effects: {
              stats: { resilience: 5, resources: 5, mastery: 4 },
              skills: { finance: 2 },
              flags: { sustainableRhythm: true },
            },
            outcome: {
              title: 'Mostly balanced',
              text: 'One area is thinner than you would like, but the overall shape holds. You notice the thin spot now rather than in a crisis.',
            },
          },
          B: {
            effects: {
              stats: { mastery: 4, resilience: -3, resources: 3 },
              skills: { craft: 1, finance: 1 },
              flags: { stretchedThin: true },
            },
            outcome: {
              title: 'Stretched, but standing',
              text: 'You over-allocate to work and under-allocate to recovery. It works for a year. You can feel the invoice arriving.',
            },
          },
          C: {
            effects: {
              stats: { resilience: -9, mastery: 3, impact: -4, resources: -2 },
              skills: { craft: 1 },
              flags: { burnoutRisk: true },
              achievements: [
                { id: 'ran-on-empty', title: 'Ran on empty', blurb: 'Learned the hard way that capacity is not infinite.' },
              ],
            },
            outcome: {
              title: 'The invoice arrives',
              text: 'By autumn you cannot read a paragraph without re-reading it twice. The work is still fine. You are not. Something has to change, and it will not be your ambition.',
            },
          },
        },
      },
    },

    c: {
      title: 'What It Costs',
      year: '2031',
      location: 'Late November',
      art: 'budget',
      blocks: [
        {
          type: 'scene',
          text: 'The year lands somewhere between triumph and exhaustion. You have a decision to make about the next one, and it is not really about work.',
        },
      ],
      variants: [
        {
          when: { flag: 'burnoutRisk' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Maya',
              role: 'friend since school',
              text: 'You cancelled three times. I am not annoyed, I am worried. When did you last do something that was not for a deadline?',
            },
          ],
        },
        {
          when: { flag: 'sustainableRhythm' },
          blocks: [
            {
              type: 'dialogue',
              speaker: '{{mentor.name}}',
              role: '{{mentor.role}}',
              text: 'You are still standing in December. That is not luck — that is design. Now decide what you want the next five years to compound into.',
            },
          ],
        },
      ],
      choices: [
        {
          id: 'recover',
          label: 'Cut back and rebuild your capacity',
          hint: 'Slower year. Better decade. Some people will read it as a lack of ambition.',
          effects: {
            stats: { resilience: 10, impact: 5, reputation: -2, mastery: 1 },
            skills: { communication: 1, impact: 1 },
            flags: { choseRecovery: true },
          },
          timeline: { year: '2031', label: 'Chose recovery', note: 'A deliberately smaller year.' },
          outcome: {
            title: 'A smaller, better year',
            text: 'You drop one commitment and protect two evenings a week. Nothing dramatic happens, which is exactly the point. By spring you are thinking clearly again.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'push',
          label: 'Push through — this window will not last',
          hint: 'You might convert the moment into a career. You might also break something.',
          effects: {
            stats: { reputation: 6, mastery: 6, resilience: -7, resources: 5 },
            skills: { craft: 2, leadership: 1 },
            flags: { pushedThrough: true },
          },
          timeline: { year: '2031', label: 'Pushed through the hard year', note: 'Traded recovery for momentum.' },
          outcome: {
            title: 'Momentum, and a warning light',
            text: 'The year delivers: a promotion, a visible win, a number you are proud of. Your body files a complaint in the form of a February where you cannot get out of bed before ten.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'redesign',
          label: 'Change the shape of the work itself',
          hint: 'Renegotiate your role so the intensity is sustainable. Requires leverage you may or may not have.',
          requires: { any: [{ stat: 'reputation', gte: 45 }, { flag: 'trustedWithHardThings' }] },
          effects: {
            stats: { resilience: 6, impact: 7, reputation: 4, mastery: 3 },
            skills: { leadership: 2, communication: 2 },
            flags: { redesignedRole: true },
            achievements: [
              { id: 'rewrote-the-job', title: 'Rewrote the job', blurb: 'Changed the shape of a role instead of enduring it.' },
            ],
          },
          timeline: { year: '2031', label: 'Redesigned the role', note: 'Same ambition, different shape.' },
          outcome: {
            title: 'You change the job, not yourself',
            text: 'You write a one-page proposal: what you will stop doing, what you will own, what success looks like. It is approved faster than expected, mostly because nobody else wanted those tasks.',
          },
          next: '__chapter_end__',
        },
      ],
    },
  },
};
