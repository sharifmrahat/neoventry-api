export default () => ({
  appName: process.env.APP_NAME || 'Neoventry API',
  environment: process.env.ENVIRONMENT || 'development',
  hostUrl: process.env.HOST_URL || 'http://localhost',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
});
