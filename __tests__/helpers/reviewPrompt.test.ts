import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { checkAndRequestReview } from '../../helpers/reviewPrompt';

// Explicitly type the mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

describe('checkAndRequestReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01'));
  });

  it('should request review if never requested before', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

    await checkAndRequestReview();

    expect(StoreReview.requestReview).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'LAST_REVIEW_REQUEST_DATE',
      expect.any(String)
    );
  });

  it('should not request review if last request was less than a month ago', async () => {
    const twoWeeksAgo = new Date('2022-12-18').getTime().toString();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(twoWeeksAgo);
    (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

    await checkAndRequestReview();

    expect(StoreReview.requestReview).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should request review if last request was more than a month ago', async () => {
    const sixWeeksAgo = new Date('2022-11-20').getTime().toString();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(sixWeeksAgo);
    (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

    await checkAndRequestReview();

    expect(StoreReview.requestReview).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'LAST_REVIEW_REQUEST_DATE',
      expect.any(String)
    );
  });

  it('should not request review if StoreReview is not available', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(false);

    await checkAndRequestReview();

    expect(StoreReview.requestReview).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should handle AsyncStorage errors', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('AsyncStorage error'));
    console.error = jest.fn();

    await checkAndRequestReview();

    expect(console.error).toHaveBeenCalledWith(
      'Error in checkAndRequestReview:',
      expect.any(Error)
    );
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
