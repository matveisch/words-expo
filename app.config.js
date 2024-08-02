export default ({ config }) => ({
  expo: {
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    },
    ...config,
  },
});
