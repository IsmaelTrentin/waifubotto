import { ButtonInteractionHandler, CommandInteractionHandler } from './@types';
import { Client, GatewayIntentBits } from 'discord.js';

import { connectDb } from './services/db';
import dotenv from 'dotenv';
import { handleButtonEvent } from './events/handle.button';
import { handleCommandEvent } from './events/handle.command';
import logger from '@note-dev-org/service-logger';
import numeral from 'numeral';
import { readInteractionHandlers } from './read.interaction.handler';
import { registerCommands } from './register.commands';
import { startJobs } from './start.jobs';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  logger.info('Running in production mode');
} else {
  logger.info('Running in development mode');
}

if (process.env.CLIENT_ID == undefined) {
  logger.error('FATAL: no discord client id provided in .env (CLIENT_ID)');
  process.exit(1);
}
if (process.env.TOKEN == undefined) {
  logger.error('FATAL: no discord token provided in .env (TOKEN)');
  process.exit(1);
}

const main = async () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  const commands = await readInteractionHandlers<CommandInteractionHandler>(
    'commands'
  );
  const buttonHandlers =
    await readInteractionHandlers<ButtonInteractionHandler>('buttons');

  try {
    await connectDb();
  } catch (error) {
    logger.error((error as Error).toString(), { at: 'a' });
    process.exit(1);
  }

  // test dev branch
  // startJobs();

  client.on('ready', async () => {
    logger.info(`Logged in as ${client?.user?.tag}!`);
    await registerCommands([...commands.values()].map(v => v.data));
  });

  client.on('interactionCreate', async interaction => {
    await handleCommandEvent(interaction, commands);
  });

  client.on('interactionCreate', async interaction => {
    await handleButtonEvent(interaction, buttonHandlers);
  });

  client.on('error', error => {
    logger.error('' + error, { at: 'client' });
  });

  await client.login(process.env.TOKEN).catch(err => logger.error(err));

  setInterval(() => {
    const { rss, heapTotal } = process.memoryUsage();
    console.log(
      'rss',
      numeral(rss).format('0.000 ib'),
      'heapTotal',
      numeral(heapTotal).format('0.000 ib')
    );
  }, 5000);
};

main().catch(err => logger.error(err));
