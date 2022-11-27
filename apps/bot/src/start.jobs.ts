import logger from '@note-dev-org/service-logger';
import { resetDaily } from './cronjobs/reset.daily';

export const startJobs = () => {
  logger.info('Starting cron jobs...', { at: 'cron-jobs' });
  resetDaily();
  logger.info('All jobs started', { at: 'cron-jobs' });
};
