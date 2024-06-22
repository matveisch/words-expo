import Purchases from 'react-native-purchases';
import { useQuery } from '@tanstack/react-query';

async function getOfferings() {
  try {
    const { current: currentOfferings } = await Purchases.getOfferings();
    return currentOfferings;
  } catch (e) {
    throw e;
  }
}

const useOfferings = () =>
  useQuery({
    queryKey: ['offerings'],
    queryFn: () => getOfferings(),
  });

export default useOfferings;
