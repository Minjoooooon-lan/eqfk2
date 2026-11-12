export default {
  id: 'ch2',
  number: 2,
  title: 'Foundations',
  years: '2027',
  theme: 'Getting genuinely good',
  art: 'study',
  start: 'a',
  nodes: {
    a: {
      title: 'How You Actually Learn',
      year: '2027',
      location: 'A kitchen table with too many tabs open',
      art: 'study',
      blocks: [
        {
          type: 'scene',
          text: '2027. Enthusiasm is no longer enough. You have watched people two years ahead of you move faster, and you need a route rather than a mood.',
        },
        {
          type: 'dialogue',
          speaker: '{{mentor.name}}',
          role: '{{mentor.role}}',
          text: 'Everyone in {{field}} gets good the same way: a lot of deliberate practice with feedback. The argument is only about where the feedback comes from.',
        },
      ],
      choices: [
        {
          id: 'credential',
          label: 'Finish the formal qualification, no shortcuts',
          hint: 'Structure, credibility, and a lot of debt or lost income. It opens doors that stay shut otherwise.',
          effects: {
            stats: { mastery: 9, reputation: 6, resources: -6, resilience: 4 },
            skills: { craft: 2, systems: 2 },
            flags: { credentialed: true },
          },
          timeline: { year: '2027', label: 'Committed to the full qualification', note: 'Slow, respected, expensive.' },
          outcome: {
            title: 'Two years of structure',
            text: 'The material is drier than you expected and the credential does real work in rooms you are not in yet. You graduate with a network as well as a certificate.',
          },
          next: 'b',
        },
        {
          id: 'bootcamp',
          label: 'Intensive bootcamp plus a public portfolio',
          hint: 'Fast and applied. You will have gaps in theory that show up under pressure.',
          effects: {
            stats: { mastery: 7, network: 5, resources: -3, reputation: 3 },
            skills: { craft: 3, communication: 1 },
            flags: { bootcamp: true },
          },
          timeline: { year: '2027', label: 'Six months, one portfolio', note: 'Learning by shipping in public.' },
          outcome: {
            title: 'Six months of pressure',
            text: 'You build four things badly, then one thing well. The portfolio does more for you than the certificate would have, and you can feel exactly which fundamentals you skipped.',
          },
          next: 'b',
        },
        {
          id: 'nights',
          label: 'Work full-time and study at night',
          hint: 'The hardest option. Money keeps coming in; sleep does not.',
          effects: {
            stats: { resilience: 9, resources: 6, mastery: 4, network: -2 },
            skills: { craft: 1, systems: 1, communication: 1 },
            flags: { nightStudy: true },
          },
          timeline: { year: '2027', label: 'Studying around a full-time job', note: 'Two hours a night, six days a week.' },
          outcome: {
            title: 'Two hours a night',
            text: 'You learn in fragments and get very good at protecting small blocks of time. By the end of the year you can hold a conversation with people who studied full-time.',
          },
          next: 'b',
        },
      ],
    },

    b: {
      title: 'The First Real Interview',
      year: '2027',
      location: 'A glass room with bad chairs',
      art: 'interview',
      blocks: [
        {
          type: 'scene',
          text: 'One interview matters more than the rest: a {{entryRole}} role on {{team}}. You have done the preparation you could fit around everything else.',
        },
        {
          type: 'dialogue',
          speaker: 'Interviewer',
          role: 'hiring manager',
          text: 'We have thirty minutes. First convince me you can do the job. Then convince me you are not a risk.',
        },
      ],
      minigame: {
        id: 'interview-2027',
        type: 'interview',
        title: 'Thirty Minutes',
        skill: 'communication',
        brief: 'Five questions, thirty seconds each. Pick the strongest answer — clarity and evidence beat confidence.',
        next: 'c',
        grades: {
          S: {
            effects: {
              stats: { reputation: 9, network: 5, resources: 7, mastery: 3 },
              skills: { communication: 3, craft: 1 },
              flags: { strongStart: true, goodJob: true },
              achievements: [
                { id: 'offer-in-hand', title: 'Offer in hand', blurb: 'Interviewed so well the panel argued about who got to hire you.' },
              ],
            },
            outcome: {
              title: 'They fight for you',
              text: 'You leave and the recruiter calls within two hours. The panel liked that you named what you did not know and then showed how you would find out.',
            },
          },
          A: {
            effects: {
              stats: { reputation: 5, network: 3, resources: 5 },
              skills: { communication: 2, craft: 1 },
              flags: { goodJob: true },
            },
            outcome: {
              title: 'A solid yes',
              text: 'Not flawless, but they can picture you in the team. The offer arrives on Thursday with a standard package.',
            },
          },
          B: {
            effects: {
              stats: { reputation: 1, resources: 3, resilience: 3 },
              skills: { communication: 1 },
              flags: { okJob: true },
            },
            outcome: {
              title: 'Good enough for now',
              text: 'You answer the technical questions well and the behavioural ones thinly. They offer you the role, with a note that you should work on how you explain your thinking.',
            },
          },
          C: {
            effects: {
              stats: { resilience: 7, reputation: -3, resources: -2, mastery: 2 },
              skills: { communication: 2 },
              flags: { weakJob: true },
              achievements: [
                { id: 'rejected-and-still-here', title: 'Rejected, and still here', blurb: 'Bombed an interview, asked for feedback, and got better.' },
              ],
            },
            outcome: {
              title: 'A no, and a useful one',
              text: 'They pass, but the hiring manager spends ten minutes telling you exactly why. You write it down. It stings less than not knowing.',
            },
          },
        },
      },
    },

    c: {
      title: 'The Offer',
      year: '2027',
      location: 'A cafe with unreliable wifi',
      art: 'offer',
      blocks: [
        {
          type: 'scene',
          text: 'The email is short and the number at the bottom is smaller than you hoped. You read it four times before you notice your hands are cold.',
        },
        {
          type: 'dialogue',
          speaker: 'Maya',
          role: 'friend since school',
          text: 'Whatever you decide, decide it on purpose. People drift into jobs and then complain for three years that nobody asked them what they wanted.',
        },
      ],
      choices: [
        {
          id: 'accept',
          label: 'Accept immediately — you need the money',
          hint: 'Certainty now. You give up the chance to find out what you are worth.',
          effects: {
            stats: { resources: 7, resilience: 2, reputation: 2 },
            skills: { finance: 1 },
            flags: { acceptedFast: true },
          },
          timeline: { year: '2027', label: 'Started the first real job', note: 'Signed the same afternoon.' },
          outcome: {
            title: 'Signed the same afternoon',
            text: 'Relief, then a small quiet question you file away: was that number negotiable? You will find out at the next one.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'negotiate',
          label: 'Negotiate once, politely, with evidence',
          hint: 'One respectful counter usually works. It also teaches you that the number was never fixed.',
          effects: {
            stats: { resources: 6, reputation: 4, network: 3, resilience: 3 },
            skills: { communication: 2, finance: 2 },
            flags: { negotiatedEarly: true },
            achievements: [
              { id: 'asked-for-more', title: 'Asked for more', blurb: 'Negotiated a first offer with evidence instead of apologies.' },
            ],
          },
          timeline: { year: '2027', label: 'Negotiated the first offer', note: 'Six percent more, and a much clearer idea of your value.' },
          outcome: {
            title: 'Six percent and a lesson',
            text: 'You ask for one specific number with two reasons. They come back with six percent more and a start date. The conversation took eleven minutes.',
          },
          next: '__chapter_end__',
        },
        {
          id: 'holdout',
          label: 'Decline and keep interviewing',
          hint: 'You might get something better. You might burn three months and your savings.',
          effects: {
            stats: { resilience: 5, resources: -6, network: 3, reputation: 1 },
            skills: { communication: 1, finance: 1 },
            flags: { heldOut: true },
          },
          timeline: { year: '2027', label: 'Turned down the first offer', note: 'Held out for a better fit.' },
          outcome: {
            title: 'Three months of uncertainty',
            text: 'Two rejections later, a smaller team offers you more scope and less money. You take it, and the extra scope turns out to be the better trade.',
          },
          next: '__chapter_end__',
        },
      ],
    },
  },
};
