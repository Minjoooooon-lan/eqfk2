export default {
  id: 'ch3',
  number: 3,
  title: 'First Real Job',
  years: '2028',
  theme: 'Where you learn to work',
  art: 'office',
  start: 'a',
  nodes: {
    a: {
      title: 'Three Ways to Work',
      year: '2028',
      location: 'Three different buildings, one decision',
      art: 'office',
      blocks: [
        {
          type: 'scene',
          text: '2028. You have enough experience to be choosey, which mostly means three people want to hire you for three very different lives.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'The work matters less than the people you will copy. Go where the standards are higher than yours, and where somebody will actually tell you when you are wrong.',
        },
        {
          type: 'variant-note',
          text: '',
        },
      ],
      variants: [
        {
          when: { flag: 'goodJob' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Recruiter',
              role: 'on the phone',
              text: 'Your interview feedback was unusually strong. There is a team here that would give you real ownership from month one.',
            },
          ],
        },
        {
          when: { flag: 'weakJob' },
          blocks: [
            {
              type: 'dialogue',
              speaker: 'Maya',
              role: 'friend since school',
              text: 'You know that job you did not get? The person who did get it just quit. They are asking whether you are still interested.',
            },
          ],
        },
      ],
      choices: [
        {
          id: 'stable',
          label: 'Join the large, stable company',
          hint: 'Good pay, clear ladder, slow decisions. You will learn process and politics.',
          tone: 'steady',
          effects: {
            stats: { resources: 8, reputation: 5, mastery: 4, resilience: 2 },
            skills: { systems: 2, finance: 1 },
            flags: { bigCompany: true },
          },
          timeline: { year: '2028', label: 'Joined a large company', note: 'Stable, structured, and slow.' },
          outcome: {
            title: 'A ladder with visible rungs',
            text: 'You learn how decisions actually get made in a company of four thousand people. Half of it is nonsense. The other half is genuinely useful.',
          },
          next: 'b',
        },
        {
          id: 'startup',
          label: 'Join a twelve-person startup',
          hint: 'Broad scope, thin support. You will do three jobs and learn all of them.',
          tone: 'bold',
          effects: {
            stats: { mastery: 7, network: 5, resilience: 5, resources: -1 },
            skills: { product: 2, craft: 2, leadership: 1 },
            flags: { earlyStartup: true },
          },
          timeline: { year: '2028', label: 'Went to an early-stage startup', note: 'Three jobs, one title.' },
          outcome: {
            title: 'Three jobs, one title',
            text: 'You ship something every week because there is nobody else to do it. Your judgement improves fast, mostly by being wrong in public.',
          },
          next: 'b',
        },
        {
          id: 'freelance',
          label: 'Go independent and take contract work',
          hint: 'Freedom and variety. Also invoicing, dry spells and no one to learn from but yourself.',
          tone: 'risky',
          effects: {
            stats: { resources: 2, network: 7, resilience: 6, reputation: 2 },
            skills: { communication: 2, finance: 2 },
            flags: { freelance: true },
          },
          timeline: { year: '2028', label: 'Went independent', note: 'Clients, invoices, and dry spells.' },
          outcome: {
            title: 'Your own name on the invoice',
            text: 'Three clients in the first month, one that pays late, and a terrifying gap in August. You learn to sell, which almost nobody in a big company ever does.',
          },
          next: 'b',
        },
      ],
    },

    b: {
      title: 'It Breaks in Public',
      year: '2029',
      location: 'A war room at 11pm',
      art: 'crisis',
      blocks: [
        {
          type: 'scene',
          text: 'A year in, something you worked on fails where everyone can see it. The room fills with people who want to know how it happened, and everyone is looking at the newest person in it.',
        },
        {
          type: 'dialogue',
          speaker: 'Senior colleague',
          role: 'the calm one',
          text: 'Do not defend the work yet. Find the actual cause first. Then we decide what to say. Wrong explanations cost more than the outage.',
        },
      ],
      minigame: {
        id: 'diagnose-2029',
        type: 'diagnose',
        title: 'Find the Fault',
        skill: 'systems',
        brief: 'Three rounds. Click the line that actually explains the failure before the room loses patience.',
        next: 'c',
        grades: {
          S: {
            effects: {
              stats: { mastery: 8, reputation: 9, resilience: 4 },
              skills: { systems: 3, craft: 2 },
              flags: { crisisAce: true, trustedWithHardThings: true },
              achievements: [
                { id: 'found-the-fault', title: 'Found the fault', blurb: 'Diagnosed a public failure under pressure before anyone else.' },
              ],
            },
            outcome: {
              title: 'You find it in nine minutes',
              text: 'One assumption nobody had written down. You explain it without blame, and the room relaxes. From then on, you are the person people want in the incident channel.',
            },
          },
          A: {
            effects: {
              stats: { mastery: 5, reputation: 5, resilience: 3 },
              skills: { systems: 2, craft: 1 },
              flags: { trustedWithHardThings: true },
            },
            outcome: {
              title: 'Close enough, fast enough',
              text: 'You find a contributing cause and fix the immediate problem. The full explanation comes a week later, but the bleeding stopped while it mattered.',
            },
          },
          B: {
            effects: {
              stats: { mastery: 3, reputation: 1, resilience: 4 },
              skills: { systems: 1 },
              flags: { longIncident: true },
            },
            outcome: {
              title: 'Four hours and a headache',
              text: 'You chase two wrong theories before someone senior spots it. The outage lasts longer than it needed to, and you learn to check the boring assumption first.',
            },
          },
          C: {
            effects: {
              stats: { resilience: 6, reputation: -4, mastery: 2, impact: -2 },
              skills: { systems: 1, communication: 1 },
              flags: { roughIncident: true },
              achievements: [
                { id: 'survived-the-war-room', title: 'Survived the war room', blurb: 'Had a very bad night at work and kept going.' },
              ],
            },
            outcome: {
              title: 'You miss it, publicly',
              text: 'Your theory is wrong and confidently stated. Someone kinder takes over. Afterwards, the senior colleague sends you a message: "Everyone has this night. Learn the process, not the shame."',
            },
          },
        },
      },
    },

    c: {
      title: 'What You Say Next',
      year: '2029',
      location: 'The same room, the next morning',
      art: 'crisis',
      blocks: [
        {
          type: 'scene',
          text: 'The immediate fire is out. Now there is a review meeting, and how you behave in the next twenty minutes will follow you for years.',
        },
        {
          type: 'dialogue',
          speaker: 'Director',
          role: 'running the review',
          text: 'Before we talk about prevention: what is your read on this? We are not looking for a scapegoat. We are looking for someone who understands their own part in it.',
        },
      ],
      choices: [
        {
          id: 'own',
          label: 'Name your part clearly, no excuses',
          hint: 'Uncomfortable for ten minutes, trusted for years.',
          effects: {
            stats: { reputation: 9, mastery: 3, resilience: 4, impact: 3 },
            skills: { communication: 3, leadership: 2 },
            flags: { ownedMistake: true, trustedWithHardThings: true },
            achievements: [
              { id: 'owned-it', title: 'Owned it', blurb: 'Took responsibility in a room where it would have been easier not to.' },
            ],
          },
          timeline: { year: '2029', label: 'Owned a public failure', note: 'No excuses, just a clear account.' },
          outcome: {
            title: 'The room turns',
            text: 'You say exactly what you assumed, what you did not check, and what you would change. The director nods once. Two people message you afterwards to say they respected it.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'quietfix',
          label: 'Fix it quietly and say as little as possible',
          hint: 'Safe in the short term. The story gets written by other people.',
          effects: {
            stats: { mastery: 4, reputation: 1, resilience: 2 },
            skills: { craft: 2 },
            flags: { quietFix: true },
          },
          outcome: {
            title: 'The fix lands, the story does not',
            text: 'Your patch holds and the meeting ends in eight minutes. Later, someone else describes the incident in a way that leaves your part out entirely — including the fix.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'deflect',
          label: 'Point out the process failures that made it inevitable',
          hint: 'Technically true. It will not be heard the way you intend.',
          effects: {
            stats: { reputation: -3, mastery: 3, resilience: 3, network: -2 },
            skills: { systems: 2, communication: 1 },
            flags: { deflected: true },
          },
          outcome: {
            title: 'Right, and alone',
            text: 'You are correct about the missing review process. You are also the newest person saying it in a room of people who approved it. The note gets taken. The relationship gets harder.',
          },
          next: '__chapter_end__',
        },
      ],
    },
  },
};
