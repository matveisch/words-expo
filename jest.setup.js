jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('@supabase/supabase-js', () => require('./__mocks__/supabaseMock'));
