import { User } from '../models/user';
import cron from 'node-cron';
import logger from '@note-dev-org/service-logger';

export const resetDaily = () => {
  logger.info('Started resetDaily', { at: 'cron-jobs.resetDaily' });

  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        const result = await User.updateMany(
          { claimedDaily: true },
          { claimedDaily: false }
        );
        logger.info(
          `Update done. ${result.matchedCount} matched, ${result.modifiedCount} modified`
        );
      } catch (error) {
        logger.error('Error encountered:', { at: 'cron-jobs.resetDaily' });
        console.error(error);
      }
    },
    {
      scheduled: true,
      timezone: 'Europe/Zurich',
    }
  );
};
