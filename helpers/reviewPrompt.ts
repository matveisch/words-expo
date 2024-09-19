import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const REVIEW_KEY = 'LAST_REVIEW_REQUEST_DATE';
const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export async function checkAndRequestReview() {
  try {
    const lastReviewRequestDate = await AsyncStorage.getItem(REVIEW_KEY);
    const now = Date.now();

    if (!lastReviewRequestDate || now - parseInt(lastReviewRequestDate, 10) >= ONE_MONTH) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
        await AsyncStorage.setItem(REVIEW_KEY, now.toString());
      }
    }
  } catch (error) {
    console.error('Error in checkAndRequestReview:', error);
  }
}
