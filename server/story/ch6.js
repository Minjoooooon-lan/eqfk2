export default {
  id: 'ch6',
  number: 6,
  title: 'Ten Years',
  years: '2035–2036',
  theme: 'What you build next',
  art: 'future',
  start: 'a',
  nodes: {
    a: {
      title: 'Launch Week',
      year: '2035',
      location: 'A room with four screens and bad coffee',
      art: 'future',
      blocks: [
        {
          type: 'scene',
          text: '2035. Ten years of choices have compounded into this: a launch that matters, a team that trusts you, and four things going wrong at once on the worst possible day.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'You will not fix everything today. Triage is a skill: pick what is loud, what is expensive, and what is actually yours. Then tell people the truth about the order.',
        },
        {
          type: 'dialogue',
          speaker: 'Teammate',
          role: 'two years in, looking at you',
          text: 'Everything is on fire. What do we do first?',
        },
      ],
      minigame: {
        id: 'launch-2035',
        type: 'crisis',
        title: 'Four Fires',
        skill: 'leadership',
        brief: 'Four incidents, one shift. Choose the right response for each before the clock runs out.',
        next: 'b',
        grades: {
          S: {
            effects: {
              stats: { reputation: 10, impact: 8, resilience: 4, network: 4 },
              skills: { leadership: 4, systems: 2, communication: 2 },
              flags: { launchedStrong: true },
              achievements: [
                { id: 'held-the-line', title: 'Held the line', blurb: 'Ran a launch week like someone who had done this before.' },
              ],
            },
            outcome: {
              title: 'You look like the calmest person in the room',
              text: 'You triage in the right order, say what you do not know, and let two people be heroes. The launch lands slightly late and completely intact.',
            },
          },
          A: {
            effects: {
              stats: { reputation: 6, impact: 5, resilience: 3, mastery: 2 },
              skills: { leadership: 2, systems: 2 },
              flags: { launchedStrong: true },
            },
            outcome: {
              title: 'Scruffy, but shipped',
              text: 'One incident takes longer than it should. Nobody outside the team notices, and the post-mortem writes itself.',
            },
          },
          B: {
            effects: {
              stats: { reputation: 1, impact: 1, resilience: 4, mastery: 2 },
              skills: { leadership: 1, systems: 1 },
              flags: { rockyLaunch: true },
            },
            outcome: {
              title: 'A long week and a real launch',
              text: 'You chase the loudest problem instead of the most expensive one. It costs a day and a client, and the team learns something you will not repeat.',
            },
          },
          C: {
            effects: {
              stats: { reputation: -6, impact: -5, resilience: 6, network: -3 },
              skills: { leadership: 1, communication: 1 },
              flags: { roughLaunch: true },
              achievements: [
                { id: 'the-hard-launch', title: 'The hard launch', blurb: 'Had a launch go badly and stayed accountable for it.' },
              ],
            },
            outcome: {
              title: 'It goes badly, in public',
              text: 'You freeze on the first decision and the team fills the silence with guesses. Afterwards you write the most honest post-mortem of your career, and it becomes required reading.',
            },
          },
        },
      },
    },

    b: {
      title: 'What the Next Ten Years Are For',
      year: '2036',
      location: 'A rooftop, in the good weather',
      art: 'future',
      blocks: [
        {
          type: 'scene',
          text: '2036. Ten years since a term you almost wasted. You are not finished — nobody is — but you know what you are good at and what it costs you.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'People think careers are decided by big moves. They are decided by what you keep doing on ordinary Tuesdays. So: what will you keep doing?',
        },
        {
          type: 'dialogue',
          speaker: 'Maya',
          role: 'friend since school',
          text: 'There is a version of you in ten more years. What does that person need you to start now?',
        },
      ],
      choices: [
        {
          id: 'build',
          label: 'Build something of your own, properly',
          hint: 'You have the skills and the network. What you do not have is certainty.',
          tone: 'bold',
          effects: {
            stats: { impact: 8, mastery: 4, resources: -3, resilience: 4 },
            skills: { product: 2, leadership: 2, finance: 1 },
            flags: { endingBuilder: true },
          },
          timeline: { year: '2036', label: 'Decided to build your own thing', note: 'Not a side project this time.' },
          outcome: {
            title: 'A named thing with your fingerprints on it',
            text: 'You sketch the next five years on a napkin, and this time you know which parts are fantasy and which parts are Tuesday.',
          },
          next: 'c',
        },
        {
          id: 'multiply',
          label: 'Make other people good at this',
          hint: 'Teaching and sponsoring others. Your impact stops being your own output.',
          tone: 'steady',
          effects: {
            stats: { impact: 9, reputation: 6, network: 5, mastery: 1 },
            skills: { leadership: 3, communication: 3 },
            flags: { endingMultiplier: true },
          },
          timeline: { year: '2036', label: 'Committed to developing others', note: 'Impact through other people.' },
          outcome: {
            title: 'The people you backed',
            text: 'You make a list of five people to sponsor this year. Two of them will end up better than you, which is the entire point.',
          },
          next: 'c',
        },
        {
          id: 'deepen',
          label: 'Go deeper into the hardest problem in the field',
          hint: 'Less visible, more durable. You choose the work over the title.',
          tone: 'quiet',
          effects: {
            stats: { mastery: 10, impact: 5, reputation: 3, network: -2 },
            skills: { craft: 3, systems: 3 },
            flags: { endingSpecialist: true },
          },
          timeline: { year: '2036', label: 'Chose the hardest problem', note: 'Depth over visibility, again.' },
          outcome: {
            title: 'The problem nobody else wants',
            text: 'You pick the question that will take a decade, and for the first time that feels like an advantage rather than a delay.',
          },
          next: 'c',
        },
      ],
    },

    c: {
      title: '2036',
      year: '2036',
      location: 'Here',
      art: 'future',
      blocks: [
        {
          type: 'scene',
          text: 'You are thirty, or thereabouts, in a life built out of a hundred ordinary decisions. None of this is a prediction. It is one honest possibility, played forward from choices that were actually yours.',
        },
        {
          type: 'beat',
          text: 'Your 2036 report is ready.',
        },
      ],
      choices: [
        {
          id: 'finish',
          label: 'See my 2036 report',
          hint: 'Your career journey, decisions, skills, achievements and what to develop next.',
          tone: 'primary',
          effects: {},
          next: '__chapter_end__',
        },
      ],
    },
  },
};
