export default {
  expo: {
    name: 'wordem',
    slug: 'wordem',
    version: '1.1.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.matveisch.wordem',
      usesAppleSignIn: true,
      runtimeVersion: {
        policy: 'appVersion',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.matveisch.wordem',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-secure-store',
      'expo-apple-authentication',
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: 'com.googleusercontent.apps.103397523372-funlghn7h0g24gab9mhou0avk878l25e',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'f46155aa-2c56-4159-b470-47c5150db2ac',
      },
    },
    updates: {
      url: 'https://u.expo.dev/f46155aa-2c56-4159-b470-47c5150db2ac',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};
