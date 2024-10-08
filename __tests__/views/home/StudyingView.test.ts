import { Keyboard } from 'react-native';

jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock('../../../views/home/StudyingView', () => {
  const originalModule = jest.requireActual('../../../views/home/StudyingView');
  return {
    ...originalModule,
  };
});

import { UseMutateAsyncFunction } from '@tanstack/react-query';
import {
  getKnowledgeLevel,
  handleAnswer,
  hasWordsToLearn,
  wordCheck,
} from '../../../views/home/StudyingView';
import { WordType } from '../../../types/WordType';
import { WordToUpdate } from '../../../hooks/useUpdateWord';

jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  StyleSheet: {
    create: jest.fn(),
  },
  Keyboard: {
    dismiss: jest.fn(),
  },
}));

const flushPromises = () =>
  new Promise((resolve) => (setImmediate ? setImmediate(resolve) : setTimeout(resolve, 0)));

describe('handleAnswer', () => {
  const mockMutateAsync: jest.MockedFunction<
    UseMutateAsyncFunction<WordType, Error, WordToUpdate, unknown>
  > = jest.fn().mockImplementation((updates) =>
    Promise.resolve({
      ...updates,
      word: 'test',
      meaning: 'a trial',
      pronunciation: 'test',
      deck: 1,
    } as WordType)
  );
  const mockSetBeingChecked = jest.fn();
  const mockSetIsSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle correct answer with auto-check on', async () => {
    const words: WordType[] = [
      {
        id: 1,
        word: 'test',
        meaning: 'a trial',
        pronunciation: 'test',
        knowledgelevel: 2,
        deck: 1,
        parent_deck: 1,
      },
    ];

    await handleAnswer(
      words,
      true,
      0,
      'test',
      mockMutateAsync,
      mockSetBeingChecked,
      mockSetIsSuccess
    );

    await flushPromises();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(mockMutateAsync).toHaveBeenCalledWith({ id: 1, knowledgelevel: 3 });
    expect(mockSetBeingChecked).toHaveBeenCalledWith(true);
    expect(mockSetIsSuccess).toHaveBeenCalledWith(true);
  });

  it('should handle incorrect answer with auto-check on', async () => {
    const words: WordType[] = [
      {
        id: 1,
        word: 'test',
        meaning: 'a trial',
        pronunciation: 'test',
        knowledgelevel: 2,
        deck: 1,
        parent_deck: 1,
      },
    ];

    await handleAnswer(
      words,
      true,
      0,
      'wrong',
      mockMutateAsync,
      mockSetBeingChecked,
      mockSetIsSuccess
    );

    await flushPromises();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(mockMutateAsync).toHaveBeenCalledWith({ id: 1, knowledgelevel: 1 });
    expect(mockSetBeingChecked).toHaveBeenCalledWith(true);
    expect(mockSetIsSuccess).toHaveBeenCalledWith(false);
  });

  it('should not check answer when auto-check is off', async () => {
    const words: WordType[] = [
      {
        id: 1,
        word: 'test',
        meaning: 'a trial',
        pronunciation: 'test',
        knowledgelevel: 2,
        deck: 1,
        parent_deck: 1,
      },
    ];

    await handleAnswer(
      words,
      false,
      0,
      'test',
      mockMutateAsync,
      mockSetBeingChecked,
      mockSetIsSuccess
    );

    await flushPromises();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockSetBeingChecked).toHaveBeenCalledWith(true);
    expect(mockSetIsSuccess).not.toHaveBeenCalled();
  });
});

describe('getKnowledgeLevel', () => {
  test('should increase the level by 1 when the answer is correct and current level is less than 8', () => {
    expect(getKnowledgeLevel(1, true)).toBe(2);
    expect(getKnowledgeLevel(4, true)).toBe(5);
    expect(getKnowledgeLevel(7, true)).toBe(8);
  });

  test('should not increase the level beyond 8 even if the answer is correct', () => {
    expect(getKnowledgeLevel(8, true)).toBe(8);
  });

  test('should decrease the level by 1 when the answer is incorrect and current level is greater than 1', () => {
    expect(getKnowledgeLevel(3, false)).toBe(2);
    expect(getKnowledgeLevel(6, false)).toBe(5);
    expect(getKnowledgeLevel(8, false)).toBe(7);
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
      parent_deck: 1,
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
      parent_deck: 1,
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
      parent_deck: 1,
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
      parent_deck: 1,
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
      parent_deck: 1,
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
      parent_deck: 1,
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
        parent_deck: 1,
      },
      {
        id: 2,
        word: 'word2',
        meaning: 'meaning2',
        pronunciation: 'pron2',
        knowledgelevel: 2,
        deck: 1,
        parent_deck: 1,
      },
      {
        id: 3,
        word: 'word3',
        meaning: 'meaning3',
        pronunciation: 'pron3',
        knowledgelevel: 3,
        deck: 1,
        parent_deck: 1,
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
        parent_deck: 1,
      },
      {
        id: 2,
        word: 'word2',
        meaning: 'meaning2',
        pronunciation: 'pron2',
        knowledgelevel: 2,
        deck: 1,
        parent_deck: 1,
      },
      {
        id: 3,
        word: 'word3',
        meaning: 'meaning3',
        pronunciation: 'pron3',
        knowledgelevel: 3,
        deck: 1,
        parent_deck: 1,
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
