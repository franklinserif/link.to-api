export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  passportSecret: process.env.PASSPORT_SECRET || '1234567',
  env: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_USER_PASSWORD || '123456',
    name: process.env.DATABASE_NAME || 'test',
  },
});
