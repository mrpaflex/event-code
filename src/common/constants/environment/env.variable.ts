import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = {
  DB: {
    DATABASE: process.env.DATABASE_URL,
  },
  COOKIES: {
    KEY: process.env.COOKIE_KEY,
  },

  CONNECTION: {
    PORT: process.env.PORT,
  },

  SMTP: {
    SMTP_USER: process.env.SMTP_USER,
    AUTH_PASS: process.env.AUTH_PASS,
  },

  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRATION_TIME: process.env.JWT_EXPIRE_TIME,
  },

  THROTTLE: {
    TTL: process.env.TTL,
    LIMIT: process.env.LIMIT,
  },
  AWS: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
    Bucket: process.env.AWS_BUCKET_FOLDER_NAME,
    BucketName: process.env.AWS_BUCKET_NAME,
  },
};
