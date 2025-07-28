export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtSaltRound: process.env.JWT_SALT_ROUND ?? 12,
});
