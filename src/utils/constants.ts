// src/config/jwt.config.ts
export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'superSecretKey123!',
  expiresIn: '1d',
};
