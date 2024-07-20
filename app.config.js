export default ({ config }) => ({
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
  },
  ...config,
});
