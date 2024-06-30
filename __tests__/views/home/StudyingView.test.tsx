import { wordCheck } from '../../../views/home/StudyingView';
import { WordType } from '../../../types/WordType';

test('checks word correctness', () => {
  const word: WordType = {
    word: 'Hello',
    meaning: 'Привет',
    knowledgelevel: 1,
    pronunciation: 'хеллоу',
    deck: 1,
    id: 1,
  };

  expect(wordCheck(word, 'heLlo')).toBe(true);
});
