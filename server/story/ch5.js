export default {
  id: 'ch5',
  number: 5,
  title: 'The Reckoning',
  years: '2032',
  theme: 'What you are actually for',
  art: 'leadership',
  start: 'a',
  nodes: {
    a: {
      title: 'Choose Your Shape',
      year: '2032',
      location: 'A performance review that becomes a life review',
      art: 'leadership',
      blocks: [
        {
          type: 'scene',
          text: '2032. Six years in. You are respected, reasonably paid, and suddenly aware that the next promotion is a different job, not a bigger version of this one.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'There are three honest paths from here. Lead people. Become the person others cannot replace on the craft. Or build your own thing. None of them is the "real" career — but you cannot do all three well at once.',
        },
        {
          type: 'dialogue',
          speaker: 'Manager',
          role: 'your boss',
          text: 'I can offer you the team. Six people, a budget, and about forty percent of your week in meetings. Or I can fight for a senior craft role with no reports. Your call, and I need an answer this quarter.',
        },
      ],
      choices: [
        {
          id: 'lead',
          label: 'Take the team and learn to lead',
          hint: 'Your output becomes other people\'s output. Harder than it looks, and lonelier.',
          tone: 'bold',
          effects: {
            stats: { reputation: 8, network: 8, impact: 6, mastery: -2, resilience: 2 },
            skills: { leadership: 4, communication: 3 },
            flags: { becameManager: true },
          },
          timeline: { year: '2032', label: 'Became a manager', note: 'Six people, one budget, forty percent meetings.' },
          outcome: {
            title: 'Six people and a new kind of tired',
            text: 'Your first month is mostly listening. You discover that the hardest part is not deciding things, it is saying the same clear thing eleven times without becoming someone you would not work for.',
          },
          next: 'b',
        },
        {
          id: 'specialist',
          label: 'Fight for the senior craft role',
          hint: 'Deep work, high leverage, fewer people skills. You will need to defend your value in rooms that reward headcount.',
          tone: 'steady',
          effects: {
            stats: { mastery: 10, reputation: 5, network: 2, impact: 3 },
            skills: { craft: 4, systems: 3 },
            flags: { becameSpecialist: true },
          },
          timeline: { year: '2032', label: 'Chose the senior craft path', note: 'Depth over headcount.' },
          outcome: {
            title: 'The person they cannot replace',
            text: 'You get the title without the reports. It takes two quarters to prove the role is real, and you spend most of them writing things down so your knowledge is not a single point of failure.',
          },
          next: 'b',
        },
        {
          id: 'independent',
          label: 'Leave and build your own practice',
          hint: 'Total control, no safety net. Your income becomes a series of decisions you make alone.',
          tone: 'risky',
          effects: {
            stats: { resources: -4, network: 6, resilience: 7, impact: 5, reputation: 3 },
            skills: { finance: 3, communication: 2, leadership: 2 },
            flags: { wentIndependent: true },
          },
          timeline: { year: '2032', label: 'Went independent again, for good', note: 'Built a practice instead of a position.' },
          outcome: {
            title: 'Your own name, properly this time',
            text: 'You keep two clients and one anchor retainer. It is less stable and far more honest. You learn to price, to say no, and to read a contract properly.',
          },
          next: 'b',
        },
      ],
    },

    b: {
      title: 'The Conversation About Money',
      year: '2033',
      location: 'A room with a whiteboard and an agenda',
      art: 'negotiation',
      blocks: [
        {
          type: 'scene',
          text: 'The role is agreed. Now comes the part most people avoid: the number. You have one conversation to make the next five years of your life more expensive or more comfortable.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'Never name a number first if you can help it. Anchor high but plausible. And when they push, stay quiet — silence is a negotiating tool, not a failure.',
        },
      ],
      minigame: {
        id: 'negotiate-2033',
        type: 'negotiate',
        title: 'The Number',
        skill: 'communication',
        brief: 'Four rounds against a budget holder. Get the best package without breaking the relationship.',
        next: 'c',
        config: { target: 100, start: 78 },
        grades: {
          S: {
            effects: {
              stats: { resources: 10, reputation: 6, resilience: 3, network: 2 },
              skills: { communication: 3, finance: 3 },
              flags: { negotiatedWell: true },
              achievements: [
                { id: 'closed-the-gap', title: 'Closed the gap', blurb: 'Negotiated a package well above the opening offer without burning goodwill.' },
              ],
            },
            outcome: {
              title: 'Better than you asked for',
              text: 'You hold the silence and they improve the offer plus a review in six months. The relationship survives, which matters more than the number.',
            },
          },
          A: {
            effects: {
              stats: { resources: 7, reputation: 4, resilience: 2 },
              skills: { communication: 2, finance: 2 },
              flags: { negotiatedWell: true },
            },
            outcome: {
              title: 'A fair deal, agreed quickly',
              text: 'You land close to your target. Both sides leave slightly unsatisfied, which is usually the sign of a workable agreement.',
            },
          },
          B: {
            effects: {
              stats: { resources: 3, reputation: 2, resilience: 2 },
              skills: { finance: 1, communication: 1 },
            },
            outcome: {
              title: 'You leave money on the table',
              text: 'You accept the second offer too quickly. It is not a disaster, but you spend the next two years aware of the gap.',
            },
          },
          C: {
            effects: {
              stats: { resources: -4, reputation: -3, resilience: 4 },
              skills: { communication: 1 },
              flags: { negotiationMiss: true },
            },
            outcome: {
              title: 'The conversation goes sideways',
              text: 'You push once too often without evidence and the tone changes. You get the original number and a slightly cooler relationship. The lesson is expensive and useful.',
            },
          },
        },
      },
    },

    c: {
      title: 'Everything Outside Work',
      year: '2033',
      location: 'A hospital corridor, then a kitchen',
      art: 'life',
      blocks: [
        {
          type: 'scene',
          text: 'A parent gets ill in the spring. Nothing dramatic, just a slow reordering of priorities that makes the career question feel smaller and the life question feel larger.',
        },
        {
          type: 'dialogue',
          speaker: 'Maya',
          role: 'friend since school',
          text: 'You have spent seven years optimising for the next thing. What would you actually regret not doing? Not the career version. The real one.',
        },
      ],
      choices: [
        {
          id: 'move',
          label: 'Move closer to family and take the slower job',
          hint: 'Less status, more presence. Your career curve flattens for a while.',
          effects: {
            stats: { impact: 9, resilience: 7, resources: -4, reputation: -3, network: -2 },
            skills: { impact: 2, communication: 1 },
            flags: { choseFamily: true },
          },
          timeline: { year: '2033', label: 'Moved closer to family', note: 'Chose presence over promotion.' },
          outcome: {
            title: 'A smaller city and a fuller week',
            text: 'The job is less impressive and you are home for dinner. You take up something you have not done since school, and it turns out you are still good at it.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'support',
          label: 'Keep the career and pay for real support',
          hint: 'Money solves logistics, not guilt. It buys the capacity to keep going.',
          effects: {
            stats: { resources: -6, resilience: 4, mastery: 3, impact: -2 },
            skills: { finance: 2, leadership: 1 },
            flags: { boughtSupport: true },
          },
          timeline: { year: '2033', label: 'Bought back capacity', note: 'Paid for support instead of pretending to do everything.' },
          outcome: {
            title: 'Capacity, purchased honestly',
            text: 'You arrange care, cover and a cleaner, and stop pretending you can do all of it. The guilt does not vanish, but the logistics do.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'pause',
          label: 'Take three months out, properly',
          hint: 'A real pause. Your momentum stalls and your head clears.',
          effects: {
            stats: { resilience: 10, impact: 7, mastery: -2, resources: -5, reputation: -2 },
            skills: { impact: 2 },
            flags: { tookBreak: true },
            achievements: [
              { id: 'took-the-pause', title: 'Took the pause', blurb: 'Stopped on purpose, before something forced you to.' },
            ],
          },
          timeline: { year: '2033', label: 'Took three months out', note: 'Stopped on purpose.' },
          outcome: {
            title: 'Three months of quiet',
            text: 'The first two weeks are withdrawal. Then you read, walk and fix things with your hands. You come back with a clearer idea of what you are willing to trade.',
          },
          next: '__chapter_end__',
        },
      ],
    },
  },
};
