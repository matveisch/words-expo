import { getKnowledgeLevel, hasWordsToLearn, wordCheck } from '../../../views/home/StudyingView';
import { WordType } from '../../../types/WordType';

describe('getKnowledgeLevel', () => {
  test('should increase the level by 1 when the answer is correct and current level is less than 4', () => {
    expect(getKnowledgeLevel(1, true)).toBe(2);
    expect(getKnowledgeLevel(2, true)).toBe(3);
    expect(getKnowledgeLevel(3, true)).toBe(4);
  });

  test('should not increase the level beyond 4 even if the answer is correct', () => {
    expect(getKnowledgeLevel(4, true)).toBe(4);
  });

  test('should decrease the level by 1 when the answer is incorrect and current level is greater than 1', () => {
    expect(getKnowledgeLevel(2, false)).toBe(1);
    expect(getKnowledgeLevel(3, false)).toBe(2);
    expect(getKnowledgeLevel(4, false)).toBe(3);
  });

  test('should not decrease the level below 1 even if the answer is incorrect', () => {
    expect(getKnowledgeLevel(1, false)).toBe(1);
  });
});

describe('wordCheck', () => {
  it('should return true for exact match', () => {
    const word: WordType = {
      id: 1,
      word: 'apple',
      meaning: 'a fruit',
      pronunciation: '',
      knowledgelevel: 1,
      deck: 1,
    };
    const answer = 'apple';
    expect(wordCheck(word, answer)).toBe(true);
  });

  it('should return true for case-insensitive match', () => {
    const word: WordType = {
      id: 1,
      word: 'Apple',
      meaning: 'a fruit',
      pronunciation: '',
      knowledgelevel: 1,
      deck: 1,
    };
    const answer = 'aPpLe';
    expect(wordCheck(word, answer)).toBe(true);
  });

  it('should return true for match with leading/trailing spaces', () => {
    const word: WordType = {
      id: 1,
      word: 'banana',
      meaning: 'a fruit',
      pronunciation: '',
      knowledgelevel: 1,
      deck: 1,
    };
    const answer = '  banana  ';
    expect(wordCheck(word, answer)).toBe(true);
  });

  it('should return false for incorrect answer', () => {
    const word: WordType = {
      id: 1,
      word: 'cherry',
      meaning: 'a fruit',
      pronunciation: '',
      knowledgelevel: 1,
      deck: 1,
    };
    const answer = 'apple';
    expect(wordCheck(word, answer)).toBe(false);
  });

  it('should return false for partial match', () => {
    const word: WordType = {
      id: 1,
      word: 'grape',
      meaning: 'a fruit',
      pronunciation: '',
      knowledgelevel: 1,
      deck: 1,
    };
    const answer = 'grap';
    expect(wordCheck(word, answer)).toBe(false);
  });

  it('should return false for empty answer', () => {
    const word: WordType = {
      id: 1,
      word: 'kiwi',
      meaning: 'a fruit',
      pronunciation: '',
      knowledgelevel: 1,
      deck: 1,
    };
    const answer = '';
    expect(wordCheck(word, answer)).toBe(false);
  });
});

describe('hasWordsToLearn', () => {
  it('should return true when there are more words to learn', () => {
    // Arrange
    const words: WordType[] = [
      {
        id: 1,
        word: 'word1',
        meaning: 'meaning1',
        pronunciation: 'pron1',
        knowledgelevel: 1,
        deck: 1,
      },
      {
        id: 2,
        word: 'word2',
        meaning: 'meaning2',
        pronunciation: 'pron2',
        knowledgelevel: 2,
        deck: 1,
      },
      {
        id: 3,
        word: 'word3',
        meaning: 'meaning3',
        pronunciation: 'pron3',
        knowledgelevel: 3,
        deck: 1,
      },
    ];
    const currentIndex = 1;

    // Act
    const result = hasWordsToLearn(words, currentIndex);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when all words have been learned', () => {
    // Arrange
    const words: WordType[] = [
      {
        id: 1,
        word: 'word1',
        meaning: 'meaning1',
        pronunciation: 'pron1',
        knowledgelevel: 1,
        deck: 1,
      },
      {
        id: 2,
        word: 'word2',
        meaning: 'meaning2',
        pronunciation: 'pron2',
        knowledgelevel: 2,
        deck: 1,
      },
      {
        id: 3,
        word: 'word3',
        meaning: 'meaning3',
        pronunciation: 'pron3',
        knowledgelevel: 3,
        deck: 1,
      },
    ];
    const currentIndex = 2;

    // Act
    const result = hasWordsToLearn(words, currentIndex);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false when words array is empty', () => {
    // Arrange
    const words: WordType[] = [];
    const currentIndex = 0;

    // Act
    const result = hasWordsToLearn(words, currentIndex);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false when words is undefined', () => {
    // Arrange
    const words = undefined;
    const currentIndex = 0;

    // Act
    const result = hasWordsToLearn(words, currentIndex);

    // Assert
    expect(result).toBe(false);
  });
});
