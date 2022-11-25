import logger from '@note-dev-org/service-logger';
import mongoose from 'mongoose';

export const connectDb = async () => {
  let url = process.env.DB_URL;
  if (!url) {
    const err = new Error('No db url provided in .env');
    throw err;
  }
  url = url.replace('<password>', process.env.DB_PWD as string);
  const instance = await mongoose.connect(url);
  const con = instance.connection;
  logger.info(
    `Connected to DB: ${con.host}:${con.port}/${con.db?.databaseName}`,
    { at: 'db.connect' }
  );
  return con;
};
