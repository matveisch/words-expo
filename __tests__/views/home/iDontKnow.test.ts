import { WordType } from '../../../types/WordType';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { WordToUpdate } from '../../../hooks/useUpdateWord';
import { iDontKnow } from '../../../views/home/StudyingView';

describe('iDontKnow', () => {
  // Mock functions
  const mockSetBeingChecked = jest.fn();
  const mockSetIsSuccess = jest.fn();
  it('should update knowledge level to 1 and set appropriate states', async () => {
    // Mock functions
    const mockMutateAsync: jest.MockedFunction<
      UseMutateAsyncFunction<WordType, Error, WordToUpdate, unknown>
    > = jest.fn().mockResolvedValue({} as WordType);

    // Mock data
    const mockWords: WordType[] = [
      {
        id: 1,
        word: 'test',
        meaning: 'a trial',
        pronunciation: 'test',
        knowledgelevel: 3,
        deck: 1,
      },
    ];
    const currentIndex = 0;

    // Call the function
    await iDontKnow(
      mockSetBeingChecked,
      mockWords,
      currentIndex,
      mockSetIsSuccess,
      mockMutateAsync
    );

    // Assert that mutateAsync was called with the correct parameters
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: 1,
      knowledgelevel: 1,
    });

    // Assert that setBeingChecked and setIsSuccess were called with correct values
    expect(mockSetBeingChecked).toHaveBeenCalledWith(true);
    expect(mockSetIsSuccess).toHaveBeenCalledWith(false);
  });
});
