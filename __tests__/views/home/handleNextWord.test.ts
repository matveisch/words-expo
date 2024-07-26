import { handleNextWord, hasWordsToLearn } from '../../../views/home/StudyingView';
import { WordType } from '../../../types/WordType';

jest.mock('../../../views/home/StudyingView', () => ({
  ...jest.requireActual('../../../views/home/StudyingView'),
  hasWordsToLearn: jest.fn(),
}));

describe('handleNextWord', () => {
  const mockSetBeingChecked = jest.fn();
  const mockSetIsSuccess = jest.fn();
  const mockSetAnswer = jest.fn();
  const mockSetCurrentIndex = jest.fn();
  const mockSetSetIsDone = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset states and move to next word when there are more words to learn', () => {
    const words: WordType[] = [
      {
        id: 1,
        word: 'test1',
        meaning: 'meaning1',
        pronunciation: 'pron1',
        knowledgelevel: 1,
        deck: 1,
      },
      {
        id: 2,
        word: 'test2',
        meaning: 'meaning2',
        pronunciation: 'pron2',
        knowledgelevel: 1,
        deck: 1,
      },
    ];
    const currentIndex = 0;

    (hasWordsToLearn as jest.Mock).mockReturnValue(true);

    handleNextWord(
      words,
      currentIndex,
      mockSetBeingChecked,
      mockSetIsSuccess,
      mockSetAnswer,
      mockSetCurrentIndex,
      mockSetSetIsDone
    );

    expect(mockSetBeingChecked).toHaveBeenCalledWith(false);
    expect(mockSetIsSuccess).toHaveBeenCalledWith(false);
    expect(mockSetAnswer).toHaveBeenCalledWith('');
    expect(mockSetCurrentIndex).toHaveBeenCalledWith(1);
    expect(mockSetSetIsDone).not.toHaveBeenCalled();
  });

  it('should set isDone to true when there are no more words to learn', () => {
    const words: WordType[] = [
      {
        id: 1,
        word: 'test1',
        meaning: 'meaning1',
        pronunciation: 'pron1',
        knowledgelevel: 1,
        deck: 1,
      },
    ];
    const currentIndex = 0;

    (hasWordsToLearn as jest.Mock).mockReturnValue(false);

    handleNextWord(
      words,
      currentIndex,
      mockSetBeingChecked,
      mockSetIsSuccess,
      mockSetAnswer,
      mockSetCurrentIndex,
      mockSetSetIsDone
    );

    expect(mockSetBeingChecked).toHaveBeenCalledWith(false);
    expect(mockSetIsSuccess).toHaveBeenCalledWith(false);
    expect(mockSetAnswer).toHaveBeenCalledWith('');
    expect(mockSetCurrentIndex).not.toHaveBeenCalled();
    expect(mockSetSetIsDone).toHaveBeenCalledWith(true);
  });
});
