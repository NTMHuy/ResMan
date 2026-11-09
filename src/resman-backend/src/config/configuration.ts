export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',

  port: Number(process.env.PORT || 3000),

  apiPrefix: process.env.API_PREFIX || 'api/v1',

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',

    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  logLevel: process.env.LOG_LEVEL || 'info',
});