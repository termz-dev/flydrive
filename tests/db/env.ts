process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.APP_ENCRYPTION_KEY ??= Buffer.alloc(32, 7).toString("base64");
