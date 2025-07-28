export default () => ({
  mongoUri: process.env.MONGODB_URI,
  postgresUrl: process.env.DATABASE_URL,
});
