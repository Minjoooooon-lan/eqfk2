import ch1 from './ch1.js';
import ch2 from './ch2.js';
import ch3 from './ch3.js';
import ch4 from './ch4.js';
import ch5 from './ch5.js';
import ch6 from './ch6.js';

export const CHAPTERS = [ch1, ch2, ch3, ch4, ch5, ch6];

export function validateStory() {
  const problems = [];
  CHAPTERS.forEach((chapter, index) => {
    if (chapter.number !== index + 1) problems.push(`${chapter.id}: number mismatch`);
    if (!chapter.nodes[chapter.start]) problems.push(`${chapter.id}: missing start node ${chapter.start}`);
    for (const [key, node] of Object.entries(chapter.nodes)) {
      if (node.minigame) {
        const game = node.minigame;
        if (!game.next && !game.grades) problems.push(`${chapter.id}/${key}: minigame has no next`);
        for (const grade of ['S', 'A', 'B', 'C']) {
          const branch = game.grades?.[grade];
          if (!branch) problems.push(`${chapter.id}/${key}: minigame missing grade ${grade}`);
          else if (branch.next && !chapter.nodes[branch.next]) {
            problems.push(`${chapter.id}/${key}: grade ${grade} points to unknown node ${branch.next}`);
          }
        }
      }
      const choices = node.choices || [];
      if (!choices.length && !node.minigame) problems.push(`${chapter.id}/${key}: no choices and no minigame`);
      for (const choice of choices) {
        if (!choice.next) problems.push(`${chapter.id}/${key}/${choice.id}: missing next`);
        else if (choice.next !== '__chapter_end__' && !chapter.nodes[choice.next]) {
          problems.push(`${chapter.id}/${key}/${choice.id}: unknown next node ${choice.next}`);
        }
      }
    }
  });
  return problems;
}
